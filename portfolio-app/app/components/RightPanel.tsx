"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

// 右端に縦に並ぶ丸いトグル
import SlideToggle from "./SlideToggle";

// 1スライド分のデータ（page.tsx の items と同じ形）
type Item = {
  color: string; // 左パネルの背景色（右パネルでは使わない）
  image: string; // 表示する画像のパス
};

// 親（page.tsx の Home）から受け取る値
type RightPanelProps = {
  // 全スライドのデータ
  items: Item[];

  // いま表示中のスライド番号
  viewCurrentIndex: number;

  // 切り替え先のスライド番号（切り替え中以外は null）
  next: number | null;

  // 切り替えアニメーション中かどうか
  isAnimating: boolean;

  // 直前のスクロール方向（次の画像を上下どちらから入れるかに使う）
  mouseWheelDirection: "up" | "down";

  // トグルの丸が押された時に呼ぶ切り替え処理（押された丸の番号を渡す）
  onToggleChange: (index: number) => void;
};

/**
 * スライド画像を1枚表示する部品
 * 表示中・切り替え先の両方で同じ見た目にするため共通化している。
 * next/image の fill は「親要素いっぱいに広がる」指定なので、
 * 親（relative ＋ aspect-square ＋ 幅）で表示サイズを決めている。
 * 大きさは「画面の高さの 60%」と「画面幅の 55%」の小さい方。
 * 縦長のスマホでも横長の PC でもパネルからはみ出さない。
 */
function SlideImage({ src }: { src: string }) {
  return (
    <div className="relative aspect-square w-[min(60dvh,55vw)]">
      <Image
        src={src}
        alt="" // 仮のサンプル画像なので説明文なし（本番画像にしたら内容を書く）
        fill
        sizes="55vw"
        className="object-contain" // 縦横比を保ったまま枠内に収める
        draggable={false}
      />
    </div>
  );
}

/**
 * 画面右側のパネル
 * - 画面右側 75% の幅で、画像を中央に表示する
 * - マウスを動かすと、画像がマウスと逆方向に少しずれる（奥行きを感じさせる演出）
 * - スライドが切り替わると、新しい画像が上 or 下からスライドしてくる
 */
export default function RightPanel({
  items,
  viewCurrentIndex,
  next,
  isAnimating,
  mouseWheelDirection,
  onToggleChange,
}: RightPanelProps) {
  /*
    マウス追従用のレイヤー。表示中と切り替え先の画像を「両方まとめて」包んでいる。
    以前は表示中の画像だけをずらしていたため、マウスを乗せたまま切り替えると
    「ずれた画像」と「ずれていない次の画像」が入れ替わって位置が飛んでいた。
    まとめてずらすことで、切り替えの前後で位置が変わらないようにしている。

    位置は state ではなく ref で直接書き換える。
    （state だとマウスが動くたびに再レンダリングされて重くなるため）
  */
  const parallaxRef = useRef<HTMLDivElement>(null);

  /*
    マウスの動きは「このパネルの上」ではなく「画面全体」で拾う。
    パネルの上だけで拾うと、下のトグルなどパネル外の要素にマウスが乗った瞬間に
    「パネルから出た」扱いになり、画像が中央へ戻ってガクッと動いてしまうため。
  */
  useEffect(() => {
    const layer = parallaxRef.current;
    if (!layer) return;

    // マウスが動いた時：画像をマウスと逆方向に最大 ±25px ずらす
    const handlePointerMove = (e: PointerEvent) => {
      // タッチ操作では動かさない（指で触った位置に画像が飛んでしまうため）
      if (e.pointerType !== "mouse") return;

      // マウス位置を「画面中央 = 0、端 = ±0.5」の値に変換
      const x = e.clientX / window.innerWidth - 0.5;
      const y = e.clientY / window.innerHeight - 0.5;

      // マイナスを掛けて逆方向に動かす（×50 で最大 ±25px）
      layer.style.transform = `translate(${-x * 50}px, ${-y * 50}px)`;
    };

    // マウスがブラウザの外に出た時：元の位置へ戻す
    const handleMouseLeave = () => {
      layer.style.transform = "translate(0px, 0px)";
    };

    window.addEventListener("pointermove", handlePointerMove);
    document.documentElement.addEventListener("mouseleave", handleMouseLeave);

    // コンポーネントが消える時にリスナーを外す
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      document.documentElement.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  // 画像レイヤー共通のクラス（パネルいっぱいに広げて、画像を中央に置く）
  const layerClass = "absolute inset-0 flex items-center justify-center";

  return (
    <div
      // 画面右端から幅 75vw のパネル（左パネルと少し重なる）
      // はみ出た部分（画面外で待機中の画像）は隠す
      className="absolute top-0 right-0 h-full w-[75vw] overflow-hidden"
    >
      {/* マウス追従レイヤー。transition（0.3秒）でなめらかに追従させる */}
      <div
        ref={parallaxRef}
        className="absolute inset-0 transition-transform duration-300 ease-out"
      >
        {/* 表示中の画像 */}
        <div className={layerClass}>
          <SlideImage src={items[viewCurrentIndex].image} />
        </div>

        {/*
          切り替え先の画像（切り替え中だけ表示）
          左パネルの背景とは逆向きに動かして、交差するような動きにしている
          - 下スクロール：下の画面外で待機 → 上へスライドして入ってくる
          - 上スクロール：上の画面外で待機 → 下へスライドして入ってくる
        */}
        {next !== null && items[next] && (
          <div
            className={`${layerClass} transition-transform duration-700`}
            style={{
              transform: isAnimating
                ? "translateY(0%)" // アニメーション中：定位置へ移動
                : mouseWheelDirection === "down"
                  ? "translateY(100%)" // 下スクロール時：下の画面外で待機
                  : "translateY(-100%)", // 上スクロール時：上の画面外で待機
            }}
          >
            <SlideImage src={items[next].image} />
          </div>
        )}
      </div>

      {/*
        スライド切り替えのトグル（パネルの右端・上下中央）
        マウス追従レイヤーの外に置いているので、マウスを動かしてもトグルは動かない

        強調する丸は「切り替え先（next）があればそれ、なければ表示中のもの」。
        表示中の番号（viewCurrentIndex）はアニメーションが終わる 0.8 秒後にしか変わらないため、
        それだけを見ると、押してから丸が切り替わるまでに遅れが出てしまう。
      */}
      <div className="absolute top-1/2 right-2 -translate-y-1/2 sm:right-4 md:right-6">
        <SlideToggle
          items={items}
          activeIndex={next ?? viewCurrentIndex}
          onChange={onToggleChange}
        />
      </div>
    </div>
  );
}
