"use client";

import { useRef } from "react";

// スライドデータ型
type Item = {
  color: string;
  image: string;
};

// 親(Home)から受け取るProps
type RightPanelProps = {
  // 全スライド情報
  items: Item[];

  // 現在表示中のindex
  current: number;

  // 次に表示するindex
  next: number | null;

  // アニメーション中かどうか
  animating: boolean;

  // スクロール方向
  direction: "up" | "down";
};

export default function RightPanel({
  items,
  current,
  next,
  animating,
  direction,
}: RightPanelProps) {
  // 現在表示中のイラスト要素
  const imageRef = useRef<HTMLDivElement>(null);

  // マウス移動時
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    // ref取得失敗時は終了
    if (!imageRef.current) return;

    // パネルの位置情報取得
    const rect = e.currentTarget.getBoundingClientRect();

    // 中央を0として正規化
    const x = (e.clientX - rect.left - rect.width / 2) / rect.width;

    const y = (e.clientY - rect.top - rect.height / 2) / rect.height;

    // マウスと逆方向に移動
    imageRef.current.style.transform = `
      translate(
        ${-x * 50}px,
        ${-y * 50}px
      )
    `;
  };

  // パネルからマウスが離れた時
  const handleMouseLeave = () => {
    if (!imageRef.current) return;

    // 元の位置へ戻す
    imageRef.current.style.transform = "translate(0px, 0px)";
  };

  return (
    <div
      // 右側パネル
      className="absolute top-0 right-0 h-screen w-[75vw] overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* 現在表示中のイラスト */}
      <div
        ref={imageRef}
        className="
          absolute inset-0
          flex items-center justify-center
          text-9xl
          transition-transform duration-300 ease-out
        "
      >
        {items[current].image}
      </div>

      {/* 次のイラスト */}
      {next !== null && items[next] && (
        <div
          className="
            absolute inset-0
            flex items-center justify-center
            text-9xl
            transition-transform duration-700
          "
          style={{
            // directionに応じて上下から侵入
            transform: animating
              ? "translateY(0%)"
              : direction === "down"
                ? "translateY(100%)"
                : "translateY(-100%)",
          }}
        >
          {items[next].image}
        </div>
      )}
    </div>
  );
}
