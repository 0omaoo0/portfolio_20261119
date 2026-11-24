"use client";

import { useEffect, useState } from "react";

// 左パネル
import LeftPanel from "./components/LeftPanel";

// 右パネル
import RightPanel from "./components/RightPanel";

// 表示データ
const items = [
  { color: "#fbcfe8", image: "AAAAAA" },
  { color: "#bfdbfe", image: "🐱" },
  { color: "#bbf7d0", image: "🐼" },
  { color: "#fde68a", image: "🦊" },
  { color: "#d8b4fe", image: "🐯" },
];

export default function Home() {
  // 現在表示中のindex
  const [current, setCurrent] = useState(0);

  // スクロール方向
  const [direction, setDirection] = useState<"up" | "down">("down");

  // 次に表示するindex
  const [next, setNext] = useState<number | null>(null);

  // アニメーション中かどうか
  const [animating, setAnimating] = useState(false);

  // 切り替え処理
  const handleChange = (index: number) => {
    // 同じ要素 or アニメ中なら無視
    if (index === current || animating) return;

    // 次の要素をセット
    setNext(index);

    // アニメーション開始
    requestAnimationFrame(() => {
      setAnimating(true);
    });

    // アニメーション終了
    setTimeout(() => {
      setCurrent(index);
      setNext(null);
      setAnimating(false);
    }, 800);
  };

  // ホイール切り替え
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      // アニメ中なら無視
      if (animating) return;

      // 下スクロール
      if (e.deltaY > 0) {
        setDirection("down");

        handleChange((current + 1) % items.length);
      }
      // 上スクロール
      else {
        setDirection("up");

        handleChange((current - 1 + items.length) % items.length);
      }
    };

    window.addEventListener("wheel", handleWheel);

    return () => {
      window.removeEventListener("wheel", handleWheel);
    };
  }, [current, animating]);

  return (
    <main className="relative h-screen overflow-hidden">
      {/* 左背景 */}
      <div className="absolute inset-0 z-10">
        <LeftPanel
          items={items}
          current={current}
          next={next}
          animating={animating}
          direction={direction}
        />
      </div>

      {/* 右イラスト */}
      <div className="absolute inset-0 z-20">
        <RightPanel
          items={items}
          current={current}
          next={next}
          animating={animating}
          direction={direction}
        />
      </div>

      {/* デバッグ用トグル */}
      <div className="fixed bottom-10 left-1/2 z-20 flex -translate-x-1/2 gap-3">
        {items.map((_, index) => (
          <button
            key={index}
            onClick={() => handleChange(index)}
            className={`
              h-4 w-4 rounded-full border
              ${current === index ? "bg-green-500" : "bg-white"}
            `}
          />
        ))}
      </div>
    </main>
  );
}
