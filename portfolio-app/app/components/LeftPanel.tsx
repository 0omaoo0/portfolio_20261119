import Link from "next/link";

// タイトル用フォント（Google Sans）。自己紹介・スキルのページと共通なので app/fonts.ts で定義している
import { titleFont } from "../fonts";

// 1スライド分のデータ（page.tsx の items と同じ形）
type Item = {
  color: string; // 左パネルの背景色
  image: string; // 右パネルの画像パス（左パネルでは使わない）
};

// 親（page.tsx の Home）から受け取る値
type LeftPanelProps = {
  // 全スライドのデータ
  items: Item[];

  // いま表示中のスライド番号
  viewCurrentIndex: number;

  // 切り替え先のスライド番号（切り替え中以外は null）
  next: number | null;

  // 切り替えアニメーション中かどうか
  isAnimating: boolean;

  // 直前のスクロール方向（次の背景を上下どちらから入れるかに使う）
  mouseWheelDirection: "up" | "down";
};

/**
 * 画面左側のパネル
 * - 右辺が斜めにカットされた台形の色ブロックを表示する
 * - スライドが切り替わると、新しい色が上 or 下からスライドして重なる
 * - 色の上には「my portfolio」のタイトルを常に表示する（スライドが変わっても動かない）
 */
export default function LeftPanel({
  items,
  viewCurrentIndex,
  next,
  isAnimating,
  mouseWheelDirection,
}: LeftPanelProps) {
  return (
    <div
      // 画面左端から幅 40vw のパネル（画面幅に合わせて伸び縮みする）
      // overflow-hidden で、画面外で待機中の背景をはみ出させない
      className="absolute top-0 left-0 h-full w-[40vw] overflow-hidden"
      style={{
        // clip-path で右辺を斜めに切り落とし、台形にする
        // polygon の各点は (横, 縦)：左上 → 右上 → 下辺の 70% の位置 → 左下 の順につないだ形
        clipPath: "polygon(0% 0%, 100% 0%, 70% 100%, 0% 100%)",
      }}
    >
      {/* 表示中スライドの背景色（一番下のレイヤー） */}
      <div
        className="absolute inset-0"
        style={{
          backgroundColor: items[viewCurrentIndex].color,
        }}
      />

      {/*
        切り替え先スライドの背景色（切り替え中だけ表示）
        1. 最初は画面外（下スクロールなら上側 / 上スクロールなら下側）に置かれる
        2. isAnimating が true になると translateY(0%) に変わり、
           transition（0.7秒）で画面内へスライドしてきて今の色を覆う
      */}
      {next !== null && (
        <div
          className="absolute inset-0 transition-transform duration-700"
          style={{
            backgroundColor: items[next].color,
            transform: isAnimating
              ? "translateY(0%)" // アニメーション中：定位置へ移動
              : mouseWheelDirection === "down"
                ? "translateY(-100%)" // 下スクロール時：上の画面外で待機
                : "translateY(100%)", // 上スクロール時：下の画面外で待機
          }}
        />
      )}

      {/*
        文字のエリア（タイトル・肩書きなど）
        中身は absolute を使わず、上から普通に並べるだけ。文字を足したい時はこの中に書けばよい。

        relative を付けているのは「背景色のレイヤーより手前に出す」ため。
        背景色のレイヤーは absolute なので、relative も absolute も付いていない普通の要素は
        背景の「下」に描かれて見えなくなってしまう。
        （relative は位置を動かさないので、レイアウトは普通に並べた時と同じ）

        余白（p）は画面幅が狭いほど小さくする（スマホ → sm: 640px 以上 → md: 768px 以上）
      */}
      <div className="relative flex flex-col gap-2 p-4 pt-5 select-none sm:p-8 md:p-12">
        {/*
          タイトル「my portfolio」
          スマホだけは文字サイズを画面幅の 7%（7vw）にしている。
          左パネルは画面幅の 40% しかないので、固定サイズだと「portfolio」がはみ出すため、
          画面幅に比例させて、どのスマホでもパネル内に収まるようにしている。
        */}
        <h1
          className={`
            ${titleFont.className}
            text-[7vw] leading-tight tracking-tight text-neutral-800
            sm:text-5xl md:text-6xl
          `}
        >
          my
          <br />
          <span className="font-semibold">portfolio</span>
        </h1>

        {/* 肩書き */}
        <p className="text-sm text-neutral-600">
          frontend engineer / web developer
        </p>

        {/*
          各ページへのリンク
          - underline decoration-dashed … 文字の下に破線を引く
          - underline-offset-4 … 破線を文字から少し離して読みやすくする
          - w-fit … リンクの幅を文字の長さに合わせる（横いっぱいに広がって押せる範囲が伸びないように）
          - マウスを乗せると、少し浮き上がって（-translate-y-1）下に影が落ちる（text-shadow-lg）
            ので、立体的に見えて押せることが分かりやすい
          - transitionTypes={["nav-forward"]} … 「奥のページへ進む」遷移だと伝える。
            globals.css の設定で、次のページが上からスライドして下りてくる
        */}
        {/*
          文字の大きさは「my portfolio」の2段階下
          - スマホ：4.5vw（タイトルの 7vw と同じく画面幅に比例させて、はみ出さないようにする）
          - sm（640px 以上）：text-3xl（タイトルは text-5xl）
          - md（768px 以上）：text-4xl（タイトルは text-6xl）
        */}
        <nav className="mt-4 flex flex-col gap-6 text-[4.5vw] text-neutral-800 sm:mt-6 sm:text-3xl md:text-4xl">
          <Link
            href="/about"
            transitionTypes={["nav-forward"]}
            className="w-fit underline decoration-dashed underline-offset-4 transition-all duration-200 hover:-translate-y-1 hover:text-shadow-lg"
          >
            About me
          </Link>
          <Link
            href="/skills"
            transitionTypes={["nav-forward"]}
            className="w-fit underline decoration-dashed underline-offset-4 transition-all duration-200 hover:-translate-y-1 hover:text-shadow-lg"
          >
            Skills
          </Link>
          <Link
            href="/contact"
            transitionTypes={["nav-forward"]}
            className="w-fit underline decoration-dashed underline-offset-4 transition-all duration-200 hover:-translate-y-1 hover:text-shadow-lg"
          >
            Contact
          </Link>
        </nav>
      </div>
    </div>
  );
}
