import { Google_Sans } from "next/font/google";

/**
 * タイトル用フォント（Google Fonts の Google Sans）
 * next/font を使うとビルド時にフォントがダウンロードされ、自分のサイトから配信される。
 * （表示時に Google へリクエストが飛ばない＆読み込み時のガタつきが起きない）
 * 万一読み込めなかった時は、Apple 端末のシステムフォント（SF Pro）などで代用する。
 * ※ next/font の呼び出しはコンポーネントの外（ファイルの一番上の階層）に書く決まり。
 */
const titleFont = Google_Sans({
  subsets: ["latin"],
  weight: ["400", "600"],
  fallback: ["-apple-system", "BlinkMacSystemFont", "Helvetica Neue", "sans-serif"],
});

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
        タイトル「my portfolio」
        背景色より後に書くことで、背景が切り替わっても常に一番上に表示される
        画面幅が狭いほど文字と余白を小さくする（スマホ → sm: 640px 以上 → md: 768px 以上）
      */}
      <h1
        className={`
          ${titleFont.className}
          absolute top-5 left-4
          text-xl leading-tight tracking-tight text-neutral-800
          select-none
          sm:top-8 sm:left-8 sm:text-3xl
          md:top-12 md:left-12 md:text-4xl
        `}
      >
        my
        <br />
        <span className="font-semibold">portfolio</span>
      </h1>
    </div>
  );
}
