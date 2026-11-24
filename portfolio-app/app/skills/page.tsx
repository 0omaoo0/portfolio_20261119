import type { Metadata } from "next";

// トップ以外のページの共通レイアウト（左に色パネル、右に中身）
import SubPageLayout from "../components/SubPageLayout";

// ブラウザのタブに表示されるページ名
export const metadata: Metadata = {
  title: "スキル | my portfolio",
};

/**
 * スキルの一覧データ
 * - category : 分類名
 * - items    : その分類のスキル名
 * 項目を足すとページにもそのまま増える（分類を足したい時は { category, items } を1つ追加する）。
 */
const skillGroups = [
  {
    category: "Frontend",
    items: [
      "HTML / CSS",
      "JavaScript",
      "TypeScript",
      "React",
      "Next.js",
      "Vue.js",
      "Nuxt.js",
      "Tailwind CSS",
    ],
  },
  {
    category: "Backend",
    items: ["Ruby on Rails"],
  },
  {
    category: "Scripting",
    items: ["Shell Script", "PowerShell"],
  },
  {
    category: "OS",
    items: ["Windows", "macOS"],
  },
  {
    category: "AI",
    items: ["Gemini", "Claude"],
  },
  {
    category: "Tools",
    items: ["Git / GitHub", "VS Code", "Figma"],
  },
];

/**
 * スキルページ（/skills）
 */
export default function SkillsPage() {
  return (
    <SubPageLayout title="skills" color="#bfdbfe">
      <div className="flex max-w-xl flex-col gap-10">
        {/* 分類ごとに見出し＋スキル名のタグを並べる */}
        {skillGroups.map((group) => (
          <section key={group.category} className="flex flex-col gap-3">
            <h2 className="text-lg font-semibold sm:text-xl">{group.category}</h2>

            {/*
              スキル名のタグ
              flex-wrap で、横に入りきらない分は自動で次の行に折り返す
              枠線はリンクと同じ破線にしてデザインをそろえている
            */}
            <ul className="flex flex-wrap gap-2">
              {group.items.map((item) => (
                <li
                  key={item}
                  className="rounded-full border border-dashed border-neutral-400 px-3 py-1 text-xs sm:text-sm"
                >
                  {item}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </SubPageLayout>
  );
}
