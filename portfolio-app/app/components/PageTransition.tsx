import { ViewTransition } from "react";

/**
 * ページ遷移のアニメーションをつけるための包み（トップ・自己紹介・スキルの各ページで使う）
 *
 * React の <ViewTransition> は、ページが切り替わる瞬間に
 * 「前のページの画像」と「次のページの画像」をブラウザに撮らせて、その2枚をアニメーションさせる仕組み。
 * どう動かすかは、リンクに付けた transitionTypes（遷移の種類）ごとに CSS のクラス名で指定する。
 * 実際の動き（キーフレーム）は globals.css に書いている。
 *
 * 遷移の種類と動き：
 *  - nav-forward（トップ → 自己紹介・スキル）
 *      次のページ（enter）：上からスライドして下りてくる … page-drop-in
 *      前のページ（exit） ：その場にとどまる（下りてくるページに覆われる） … page-stay
 *  - nav-back（自己紹介・スキル → トップ）
 *      前のページ（exit） ：上へスライドして戻っていく … page-lift-out
 *      次のページ（enter）：その場にとどまる（下から現れる） … page-stay
 *  - default（ブラウザの戻るボタンなど、種類がない遷移）
 *      アニメーションなし（none）
 *
 * ※ Chrome / Edge / Safari / Firefox の新しいバージョンで動く。対応していないブラウザでは、
 *    アニメーションなしで普通にページが切り替わる（壊れはしない）。
 */
export default function PageTransition({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ViewTransition
      // このページが「新しく表示される側」の時の動き
      enter={{
        "nav-forward": "page-drop-in",
        "nav-back": "page-stay",
        default: "none",
      }}
      // このページが「消える側」の時の動き
      exit={{
        "nav-forward": "page-stay",
        "nav-back": "page-lift-out",
        default: "none",
      }}
      // ページ遷移以外（スライドの切り替えなど）では動かさない
      default="none"
    >
      {children}
    </ViewTransition>
  );
}
