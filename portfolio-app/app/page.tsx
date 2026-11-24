"use client";

import { useCallback, useEffect, useState } from "react";

// 画面左側：背景色の台形パネル＋「my portfolio」のタイトル
import LeftPanel from "./components/LeftPanel";

// 画面右側：スライドごとのイラスト（画像）を表示するパネル
import RightPanel from "./components/RightPanel";

// ページ遷移のアニメーション（上からスライドして下りてくる／上へ戻っていく）
import PageTransition from "./components/PageTransition";

/**
 * スライドの表示データ
 * - color : 左パネルの背景色（右端の丸いトグルの色にも使う）
 * - image : 右パネルに表示する画像のパス（public/ からの相対パス）
 *
 * 画像は public/portfolioImg/ に「portfolio-番号.拡張子」の名前で置いている。
 * 増やす時は同じ名前の付け方で画像を置き、ここに1行足す（トグルの丸も自動で増える）。
 * ※ 仮の sample 画像は public/samples/ に残してある（例："/samples/sample1.svg"）
 */
const items = [
  { color: "#fbcfe8", image: "/portfolioImg/portfolio-01.png" },
  { color: "#bfdbfe", image: "/portfolioImg/portfolio-02.png" },
  { color: "#bbf7d0", image: "/portfolioImg/portfolio-03.jpg" },
  { color: "#fde68a", image: "/portfolioImg/portfolio-04.jpg" },
  { color: "#d8b4fe", image: "/portfolioImg/portfolio-05.jpg" },
  { color: "#fed7aa", image: "/portfolioImg/portfolio-06.jpg" },
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
   *  3. 1.3 秒後（一番長い transition = 右パネルの画像が濃くなる 1.2 秒＋余裕）に
   *     「次」を「現在」に確定して後片付け
   *     ※ これより早く確定すると、画像が濃くなりきる前にパッと切り替わってしまう
   *
   * 向き（direction）：
   *  - down … 左の色は上から下りてくる／右の画像は下から上がってくる
   *  - up   … その逆（左の色は下から上がる／右の画像は上から下りる）
   *  - 省略時（トグルから呼ばれた時）は番号で決める：
   *    今より下の丸（番号が大きい）なら down、上の丸（番号が小さい）なら up
   *
   * @param index     行き先のスライド番号
   * @param direction 向き。ホイールの時は明示する（最後→最初へのループでも down にしたいため）
   *
   * useCallback … viewCurrentIndex か isAnimating が変わった時だけ関数を作り直す。
   * 下のホイールの useEffect がこの関数を使っているので、
   * 毎回作り直すとリスナーの付け外しが毎レンダリング起きてしまう（ESLint もそれを警告していた）。
   */
  const handleChange = useCallback(
    (index: number, direction?: "up" | "down") => {
      // すでに表示中のスライド、またはアニメーション中なら何もしない
      if (index === viewCurrentIndex || isAnimating) return;

      // 向きを決めて左右パネルへ伝える
      setMouseWheelDirection(
        direction ?? (index > viewCurrentIndex ? "down" : "up"),
      );

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
      }, 1300);
    },
    [viewCurrentIndex, isAnimating],
  );

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
        handleChange(
          (viewCurrentIndex - 1 + items.length) % items.length,
          "up",
        );
      }
    };

    window.addEventListener("wheel", handleWheel);

    // コンポーネントが消える時／依存値が変わる時に古いリスナーを外す
    return () => {
      window.removeEventListener("wheel", handleWheel);
    };
    // 中で使っている値・関数はすべて依存配列に入れる（入れ忘れると古い値のまま動いてしまう）
  }, [viewCurrentIndex, isAnimating, handleChange]);

  return (
    // PageTransition … 自己紹介・スキルのページへ移る時／戻ってくる時のアニメーション用の包み
    <PageTransition>
      {/*
      画面全体を1枚の固定ステージとして使う（スクロールバーは出さない）
      h-dvh … スマホのアドレスバーの出し入れを考慮した「実際に見えている高さ」
      bg-background … 背景色をつけておく。ページ遷移のアニメーション中、
                      透明だと重なっている別のページが透けて見えてしまうため
    */}
      <main className="relative h-dvh overflow-hidden bg-background">
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

        pointer-events-none … この枠は画面全体を覆っているため、そのままだと
        下にある左パネルのリンクがクリックできなくなる。クリックを素通りさせて下に届ける。
        （クリックが必要なトグルだけ、RightPanel の中で pointer-events-auto に戻している）
      */}
        <div className="pointer-events-none absolute inset-0 z-20">
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
    </PageTransition>
  );
}
