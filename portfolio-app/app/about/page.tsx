import type { Metadata } from "next";
import Image from "next/image";

// トップ以外のページの共通レイアウト（左に色パネル、右に中身）
import SubPageLayout from "../components/SubPageLayout";

// ブラウザのタブに表示されるページ名
export const metadata: Metadata = {
  title: "About | my portfolio",
};

/*
 * ページの並び順：仕事に関係ないこと → だんだん仕事に関係あること
 *   名前 → 写真 → Profile → Personality → Career → What I do → What's next
 * 下にあるデータ（配列）も、この並び順に合わせて書いている。
 */

/**
 * 自画像（本人の写真）
 * - src      : 画像のパス（public/portfolioImg/self-portrait-番号.jpg）
 * - alt      : 画像の説明（読み上げソフトや、画像が表示できない時に使われる）
 * - position : 正方形に切り抜く時に、どこを中心に残すか（顔が切れないように調整している）
 */
const selfPortraits = [
  {
    src: "/portfolioImg/self-portrait-01.jpg",
    alt: "ゾウの前でポーズをとる杉森",
    position: "50% 50%",
  },
  {
    src: "/portfolioImg/self-portrait-02.jpg",
    alt: "カピバラとヤギの横で笑顔の杉森",
    position: "70% 60%",
  },
  {
    src: "/portfolioImg/self-portrait-03.jpg",
    alt: "猫を抱える杉森",
    position: "50% 20%",
  },
];

// プロフィール（ラベルと内容のペアで表示する）
const profile = [
  { label: "出身", value: "富山県" },
  { label: "経歴", value: "高専を卒業後、仙台で2年過ごし、現在は埼玉在住" },
  { label: "趣味", value: "ランニング、歌、イラスト制作、料理" },
  { label: "最近", value: "プログラミングを人に教えること" },
];

// 人柄・強み（箇条書きで表示する）
const strengths = [
  "コツコツと続けることが得意です。",
  "人と話すことが好きで、チームの中でもコミュニケーションを大切にしています。",
  "チームでは率先して動き、イニシアチブを取ることが多いです。一方で、上に立つ人がいる場面ではその人を立ててサポートに回ります。",
  "自分に厳しく、妥協せずに取り組むタイプです。",
];

/**
 * 経歴のデータ（上から古い順）
 * - label : 何社目か
 * - field : 分野
 * - works : やってきたこと（箇条書きで表示する）
 * 会社や仕事が増えたら、ここに足すとページにもそのまま増える。
 */
const careers = [
  {
    label: "1社目",
    field: "Web・デジタルマーケティング",
    works: [
      "アジャイル開発によるネイティブアプリの開発",
      "Webサイトの制作",
      "マークアップリーダーとして、コーディング品質の管理",
      "後輩の育成",
    ],
  },
  {
    label: "2社目",
    field: "SES（システム開発・業務系）",
    works: [
      "図書館の予約システムの開発",
      "物流会社向け、フォークリフト用パレットのリース管理システムの開発",
      "船舶用レーダーの UI 実装",
    ],
  },
  {
    label: "3社目",
    field: "自社サービス開発",
    works: [
      "サイネージシステムの UI フルリニューアル（ワイヤーフレーム作成から実装まで担当）",
      "開発したプロダクトを展示会で紹介し、営業も担当",
      "AI を活用したミラー型デバイスや、タブレット向けアプリの開発",
    ],
  },
];

// これまで担当してきた領域（スキルページと同じ破線のタグで表示する）
const roles = [
  "フロントエンド",
  "バックエンド",
  "スクリプト開発",
  "マークアップ",
  "ワイヤーフレーム作成",
  "営業",
];

// 見出しの共通スタイル
const headingClass = "text-lg font-semibold sm:text-xl";

/**
 * 自己紹介ページ（/about）
 */
export default function AboutPage() {
  return (
    <SubPageLayout title="about" color="#fbcfe8">
      <div className="flex max-w-xl flex-col gap-12">
        {/* 名前（英語・日本語）と肩書き */}
        <section className="flex flex-col gap-1">
          <p className="text-2xl font-semibold sm:text-3xl">Mao Sugimori</p>
          <p className="text-base text-neutral-600 sm:text-lg">杉森 磨褒</p>
          <p className="mt-2 text-sm text-neutral-600">
            frontend engineer / web developer
          </p>
        </section>

        {/*
          自画像
          - スマホ：縦に1枚ずつ並べる / sm（640px 以上）：横に3枚並べる
          - aspect-square … 正方形の枠にする
          - object-cover … 枠いっぱいに広げ、はみ出た部分は切り抜く
          - objectPosition … 切り抜く時に残す位置（顔が真ん中に来るように画像ごとに指定）
        */}
        <section className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {selfPortraits.map((photo) => (
            <div
              key={photo.src}
              className="relative aspect-square overflow-hidden rounded-xl"
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                sizes="(min-width: 640px) 200px, 60vw"
                className="object-cover"
                style={{ objectPosition: photo.position }}
              />
            </div>
          ))}
        </section>

        {/* プロフィール（ラベルと内容のペア） */}
        <section className="flex flex-col gap-4">
          <h2 className={headingClass}>Profile</h2>
          <dl className="flex flex-col gap-4 text-sm sm:text-base">
            {profile.map((item) => (
              <div key={item.label}>
                <dt className="text-neutral-500">{item.label}</dt>
                <dd>{item.value}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* 人柄・強み */}
        <section className="flex flex-col gap-4">
          <h2 className={headingClass}>Personality</h2>
          <ul className="flex list-disc flex-col gap-2 pl-5 text-sm leading-relaxed sm:text-base">
            {strengths.map((strength) => (
              <li key={strength}>{strength}</li>
            ))}
          </ul>
        </section>

        {/*
          経歴
          最初に全体のまとめを書き、その下に各社を時系列（上から古い順）で並べる
          左に破線の縦線を引いて、時間の流れが分かるようにしている
        */}
        <section className="flex flex-col gap-4">
          <h2 className={headingClass}>Career</h2>
          <p className="text-sm leading-relaxed sm:text-base">
            高専を卒業後、これまで3社で
            Web・デジタルマーケティング、業務系のシステム開発、自社プロダクトの開発に携わってきました。
            フロントエンド・バックエンドの開発からマークアップ、ワイヤーフレーム作成、
            展示会での営業まで、企画から届けるところまで幅広く経験しています。
          </p>
          <ol className="mt-2 flex flex-col gap-8 border-l border-dashed border-neutral-400 pl-5">
            {careers.map((career) => (
              <li key={career.label} className="flex flex-col gap-2">
                <div>
                  <p className="text-xs text-neutral-500">{career.label}</p>
                  <p className="font-semibold">{career.field}</p>
                </div>
                {/* やってきたことの箇条書き（list-disc で先頭に点をつける） */}
                <ul className="flex list-disc flex-col gap-1 pl-5 text-sm leading-relaxed text-neutral-700">
                  {career.works.map((work) => (
                    <li key={work}>{work}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        </section>

        {/* 担当してきた領域（スキルページと同じ破線のタグ） */}
        <section className="flex flex-col gap-4">
          <h2 className={headingClass}>What I do</h2>
          <ul className="flex flex-wrap gap-2">
            {roles.map((role) => (
              <li
                key={role}
                className="rounded-full border border-dashed border-neutral-400 px-3 py-1 text-xs sm:text-sm"
              >
                {role}
              </li>
            ))}
          </ul>
        </section>

        {/* これからの目標 */}
        <section className="flex flex-col gap-4">
          <h2 className={headingClass}>What&apos;s next</h2>
          <p className="text-sm leading-relaxed sm:text-base">
            直近の職場では、エンジニアを一人で担当してきました。
            その中で、技術に関する知見がまだまだ足りないと感じています。
            これからはチーム開発の中で、周りの人の長所を吸収しながら、飛躍的に成長していきたいと考えています。
          </p>
          <p className="text-sm leading-relaxed sm:text-base">
            また、AI はまだ十分に使いこなせていないと感じています。
            業務の中でも積極的に AI を取り入れ、開発のスピードと質を高めていきたいです。
          </p>
        </section>
      </div>
    </SubPageLayout>
  );
}
