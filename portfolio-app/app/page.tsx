"use client";

import { useEffect, useState } from "react";

// 画面左側：背景色の台形パネル＋「my portfolio」のタイトル
import LeftPanel from "./components/LeftPanel";

// 画面右側：スライドごとのイラスト（画像）を表示するパネル
import RightPanel from "./components/RightPanel";

/**
 * スライドの表示データ
 * - color : 左パネルの背景色（下の丸いトグルの色にも使う）
 * - image : 右パネルに表示する画像のパス（public/ からの相対パス）
 *
 * ※ 今は仮の sample 画像。本番の画像ができたら public/ に置いてパスを差し替える。
 */
const items = [
  { color: "#fbcfe8", image: "/samples/sample1.svg" },
  { color: "#bfdbfe", image: "/samples/sample2.svg" },
  { color: "#bbf7d0", image: "/samples/sample3.svg" },
  { color: "#fde68a", image: "/samples/sample4.svg" },
  { color: "#d8b4fe", image: "/samples/sample5.svg" },
];

export default function Home() {
  // いま画面に表示されているスライドの番号（items の index）
  const [viewCurrentIndex, setViewCurrentIndex] = useState(0);

  // 切り替えの向き（ホイールの向き、またはトグルで押した丸が上か下か）。
  // 次のスライドを「上から入れるか／下から入れるか」を決めるために左右パネルへ渡す。
  const [mouseWheelDirection, setMouseWheelDirection] = useState<"up" | "down">(
    "down",
  );

  // 切り替え先のスライド番号。
  // 切り替えアニメーション中だけ値が入り、それ以外は null（＝次のスライドは描画しない）。
  const [next, setNext] = useState<number | null>(null);

  // 切り替えアニメーションの最中かどうか。
  // true の間は連続スクロールやボタン連打を受け付けないようにする。
  const [isAnimating, setIsAnimating] = useState(false);

  /**
   * 指定したスライドへ切り替える処理
   *
   * 流れ：
   *  1. setNext で「次のスライド」を画面外（上 or 下）に配置した状態で描画
   *  2. 2フレーム待ってから isAnimating=true にし、CSS transition で画面内へスライドさせる
   *     （「画面外に置いた状態」が一度描画されてからでないと、transition が効かずに一瞬で切り替わるため）
   *  3. 0.8 秒後（transition の 0.7 秒＋余裕）に「次」を「現在」に確定して後片付け
   *
   * 向き（direction）：
   *  - down … 左の色は上から下りてくる／右の画像は下から上がってくる
   *  - up   … その逆（左の色は下から上がる／右の画像は上から下りる）
   *  - 省略時（トグルから呼ばれた時）は番号で決める：
   *    今より下の丸（番号が大きい）なら down、上の丸（番号が小さい）なら up
   *
   * @param index     行き先のスライド番号
   * @param direction 向き。ホイールの時は明示する（最後→最初へのループでも down にしたいため）
   */
  const handleChange = (index: number, direction?: "up" | "down") => {
    // すでに表示中のスライド、またはアニメーション中なら何もしない
    if (index === viewCurrentIndex || isAnimating) return;

    // 向きを決めて左右パネルへ伝える
    setMouseWheelDirection(direction ?? (index > viewCurrentIndex ? "down" : "up"));

    // 1. 次のスライドを画面外に配置
    setNext(index);

    // 2. 2フレーム待ってからアニメーション開始
    //    1フレームだけだと、ホイール操作の時に React が setNext と setIsAnimating を
    //    まとめて1回で描画してしまうことがあり、アニメーションせずにパッと切り替わる
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setIsAnimating(true);
      });
    });

    // 3. アニメーション完了後、表示中のスライドを更新して状態をリセット
    setTimeout(() => {
      setViewCurrentIndex(index);
      setNext(null);
      setIsAnimating(false);
    }, 800);
  };

  /**
   * マウスホイールでスライドを前後に切り替える
   * - 下スクロール：次のスライドへ（最後まで行ったら最初に戻る）
   * - 上スクロール：前のスライドへ（最初より前に行ったら最後に戻る）
   */
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      // アニメーション中のスクロールは無視（1回のスクロールで何枚も進まないように）
      if (isAnimating) return;

      // deltaY > 0 なら下方向へのスクロール
      if (e.deltaY > 0) {
        // % items.length で末尾の次を先頭にループさせる
        handleChange((viewCurrentIndex + 1) % items.length, "down");
      } else {
        // + items.length してから % することで、0 の前が末尾になる（負の数を防ぐ）
        handleChange((viewCurrentIndex - 1 + items.length) % items.length, "up");
      }
    };

    window.addEventListener("wheel", handleWheel);

    // コンポーネントが消える時／依存値が変わる時に古いリスナーを外す
    return () => {
      window.removeEventListener("wheel", handleWheel);
    };
  }, [viewCurrentIndex, isAnimating]);

  return (
    // 画面全体を1枚の固定ステージとして使う（スクロールバーは出さない）
    // h-dvh … スマホのアドレスバーの出し入れを考慮した「実際に見えている高さ」
    <main className="relative h-dvh overflow-hidden">
      {/* 左パネル（背景色＋タイトル）。右パネルより奥に置く */}
      <div className="absolute inset-0 z-10">
        <LeftPanel
          items={items}
          viewCurrentIndex={viewCurrentIndex}
          next={next}
          isAnimating={isAnimating}
          mouseWheelDirection={mouseWheelDirection}
        />
      </div>

      {/*
        右パネル（イラスト画像＋右端のトグル）。左パネルに重なるので手前に置く
        onToggleChange … トグルの丸が押された時に呼ぶ切り替え処理
      */}
      <div className="absolute inset-0 z-20">
        <RightPanel
          items={items}
          viewCurrentIndex={viewCurrentIndex}
          next={next}
          isAnimating={isAnimating}
          mouseWheelDirection={mouseWheelDirection}
          onToggleChange={(index) => handleChange(index)}
        />
      </div>
    </main>
  );
}
