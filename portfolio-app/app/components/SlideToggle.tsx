// 1スライド分のデータ（page.tsx の items と同じ形）
type Item = {
  color: string; // 左パネルの背景色（丸の色に使う）
  image: string; // 右パネルの画像パス（トグルでは使わない）
};

// 親（RightPanel）から受け取る値
type SlideToggleProps = {
  // 全スライドのデータ
  items: Item[];

  // 強調表示する丸の番号
  activeIndex: number;

  // 丸が押された時に呼ばれる（押された丸の番号を渡す）
  onChange: (index: number) => void;
};

/**
 * スライド切り替え用の丸いトグル（縦に並ぶ）
 * - 丸の色 = そのスライドの左パネルの背景色
 * - 表示中のスライドの丸は、少し大きくして濃い枠をつける
 * - 丸を押すとそのスライドへジャンプする
 *   今より下の丸を押すと下スクロールと同じ動き、上の丸なら上スクロールと同じ動きになる
 * - 置く場所（右端の中央など）は、使う側（RightPanel）で className を付けて決める
 */
export default function SlideToggle({
  items,
  activeIndex,
  onChange,
}: SlideToggleProps) {
  return (
    <nav aria-label="スライド切り替え" className="flex flex-col gap-1">
      {items.map((item, index) => {
        const isActive = index === activeIndex;

        return (
          <button
            key={index}
            type="button"
            onClick={() => onChange(index)}
            aria-label={`スライド ${index + 1} へ移動`}
            aria-current={isActive ? "true" : undefined}
            // 見た目の丸は小さいが、スマホで押しやすいよう p-2 で押せる範囲を広げている
            className="p-2"
          >
            <span
              className={`
                block h-3.5 w-3.5 rounded-full border border-neutral-800/30
                transition-transform duration-200
                ${isActive ? "scale-125 ring-2 ring-neutral-800 ring-offset-2" : ""}
              `}
              style={{ backgroundColor: item.color }}
            />
          </button>
        );
      })}
    </nav>
  );
}
