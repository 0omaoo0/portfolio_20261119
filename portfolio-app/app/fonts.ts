import { Google_Sans } from "next/font/google";

/**
 * タイトル用フォント（Google Fonts の Google Sans）
 * トップページの LeftPanel と、自己紹介・スキルのページで共通して使う。
 * 同じフォントを各ファイルで読み込むと重複してしまうので、ここで1回だけ読み込んで使い回す。
 *
 * next/font を使うとビルド時にフォントがダウンロードされ、自分のサイトから配信される。
 * （表示時に Google へリクエストが飛ばない＆読み込み時のガタつきが起きない）
 * 万一読み込めなかった時は、Apple 端末のシステムフォント（SF Pro）などで代用する。
 * ※ next/font の呼び出しはコンポーネントの外（ファイルの一番上の階層）に書く決まり。
 */
export const titleFont = Google_Sans({
  subsets: ["latin"],
  weight: ["400", "600"],
  fallback: [
    "-apple-system",
    "BlinkMacSystemFont",
    "Helvetica Neue",
    "sans-serif",
  ],
});
