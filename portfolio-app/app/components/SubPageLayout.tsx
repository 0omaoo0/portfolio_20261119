import Link from "next/link";

// タイトル用フォント（Google Sans）。トップページと同じものを使う
import { titleFont } from "../fonts";

// ページ遷移のアニメーション（上からスライドして下りてくる／上へ戻っていく）
import PageTransition from "./PageTransition";

type SubPageLayoutProps = {
  // 左パネルに大きく表示するページ名（例："about"）
  title: string;

  // 左パネルの背景色（トップページのスライドの色に合わせる）
  color: string;

  // 右側に表示するページの中身
  children: React.ReactNode;
};

/**
 * 自己紹介・スキルなど、トップ以外のページの共通レイアウト
 * トップページと同じデザインにそろえている。
 * - 左：斜めにカットした台形の色パネル＋ページ名（Google Sans）＋トップへ戻るリンク
 * - 右：ページの中身（長い時は右側だけスクロールする）
 *
 * ページ全体を画面の高さ（h-dvh）に固定し、右側の中身だけをスクロールさせている。
 * （ページ遷移のアニメーションで、ページ全体を1枚の画像としてきれいに動かすため）
 */
export default function SubPageLayout({
  title,
  color,
  children,
}: SubPageLayoutProps) {
  return (
    <PageTransition>
      {/*
        bg-background … 背景色をつけておく。ページ遷移のアニメーション中、
                        透明だと重なっている別のページが透けて見えてしまうため
      */}
      <main className="relative h-dvh overflow-hidden bg-background">
        {/*
          左パネル（トップページの LeftPanel と同じ形）
          clip-path で右辺を斜めに切り落とし、台形にする
          polygon の各点は (横, 縦)：左上 → 右上 → 下辺の 70% の位置 → 左下 の順につないだ形
        */}
        <div
          className="absolute top-0 left-0 h-full w-[40vw]"
          style={{
            backgroundColor: color,
            clipPath: "polygon(0% 0%, 100% 0%, 70% 100%, 0% 100%)",
          }}
        >
          {/* 文字のエリア。余白はトップページの LeftPanel と同じ */}
          <div className="flex flex-col gap-4 p-4 pt-5 sm:p-8 md:p-12">
            {/*
              ページ名
              スマホは画面幅の 7%（7vw）にして、狭い左パネルからはみ出さないようにしている
            */}
            <h1
              className={`
                ${titleFont.className}
                text-[7vw] leading-tight font-semibold tracking-tight text-neutral-800
                sm:text-5xl md:text-6xl
              `}
            >
              {title}
            </h1>

            {/*
              トップページへ戻るリンク（トップのリンクと同じ破線の下線＋ホバーで浮き上がる）
              transitionTypes={["nav-back"]} … 「戻る」遷移だと伝える。
              globals.css の設定で、このページが上へスライドして戻っていく
            */}
            <Link
              href="/"
              transitionTypes={["nav-back"]}
              className="w-fit text-sm text-neutral-800 underline decoration-dashed underline-offset-4 transition-all duration-200 hover:-translate-y-1 hover:text-shadow-lg sm:text-base"
            >
              ← Back to top
            </Link>
          </div>
        </div>

        {/*
          右側の中身。左パネルの幅（40vw）だけ左をあけて、重ならないようにする
          overflow-y-auto … 中身が長い時は、この右側の部分だけスクロールする
        */}
        <div className="absolute inset-y-0 right-0 left-[40vw] overflow-y-auto px-4 py-10 text-neutral-800 sm:px-8 md:px-16 md:py-24">
          {children}
        </div>
      </main>
    </PageTransition>
  );
}
