import type { Metadata } from "next";

// トップ以外のページの共通レイアウト（左に色パネル、右に中身）
import SubPageLayout from "../components/SubPageLayout";

// ブラウザのタブに表示されるページ名
export const metadata: Metadata = {
  title: "Contact | my portfolio",
};

// 連絡先のメールアドレス（変える時はここだけ書き換えればよい）
const EMAIL = "h1kirua1o@gmail.com";

/**
 * お問い合わせページ（/contact）
 */
export default function ContactPage() {
  return (
    <SubPageLayout title="contact" color="#bbf7d0">
      <section className="flex max-w-xl flex-col gap-8">
        {/* 案内文 */}
        <p className="text-sm leading-relaxed sm:text-base">
          お仕事のご相談・ご質問などは、下記のメールアドレスまでお気軽にご連絡ください。
        </p>

        {/* メールアドレス */}
        <div className="flex flex-col gap-2">
          <p className="text-sm text-neutral-500">Email</p>

          {/*
            mailto: のリンク … クリックすると、メールアプリが宛先入りで開く
            見た目は他のリンクと同じ（破線の下線＋ホバーで浮き上がる）
            break-all … 画面が狭い時、長いアドレスを途中で折り返してはみ出さないようにする
          */}
          <a
            href={`mailto:${EMAIL}`}
            className="w-fit text-lg break-all underline decoration-dashed underline-offset-4 transition-all duration-200 hover:-translate-y-1 hover:text-shadow-lg sm:text-2xl"
          >
            {EMAIL}
          </a>
        </div>
      </section>
    </SubPageLayout>
  );
}
