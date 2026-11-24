// LeftPanelで使うデータ型
type Item = {
  color: string;
  image: string;
};

// 親(Home)から受け取るProps
type LeftPanelProps = {
  // 全スライド情報
  items: Item[];

  // 現在表示中のindex
  current: number;

  // 次に表示するindex
  next: number | null;

  // アニメーション中かどうか
  animating: boolean;

  // スクロール方向
  direction: "up" | "down";
};

export default function LeftPanel({
  items,
  current,
  next,
  animating,
  direction,
}: LeftPanelProps) {
  return (
    <div
      // 左側パネル
      className="absolute top-0 left-0 h-full w-[40vw] overflow-hidden"
      style={{
        // 台形っぽい形状
        clipPath:
          "polygon(50% 0%, 100% 0%, 70% 100%, 50% 100%, 0% 100%, 0% 0%)",
      }}
    >
      {/* デバッグ表示 */}
      AAAAAA
      {/* 現在表示中の背景 */}
      <div
        className="absolute inset-0"
        style={{
          backgroundColor: items[current].color,
        }}
      />
      {/* 次の背景 */}
      {next !== null && (
        <div
          className="
            absolute inset-0
            transition-transform duration-700
          "
          style={{
            // 次の色
            backgroundColor: items[next].color,

            // アニメ中
            // → 現在位置まで移動
            transform: animating
              ? "translateY(0%)"
              : direction === "down"
                ? // 下スクロール時
                  // 上から侵入
                  "translateY(-100%)"
                : // 上スクロール時
                  // 下から侵入
                  "translateY(100%)",
          }}
        />
      )}
    </div>
  );
}
