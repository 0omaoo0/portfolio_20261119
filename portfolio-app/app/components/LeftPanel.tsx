type Item = {
  color: string;
  image: string;
};

type LeftPanelProps = {
  items: Item[];
  current: number;
  next: number | null;
  animating: boolean;
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
      className="absolute top-0 left-0 h-full w-[40vw] overflow-hidden"
      style={{
        clipPath:
          "polygon(50% 0%, 100% 0%, 70% 100%, 50% 100%, 0% 100%, 0% 0%)",
      }}
    >
      <div
        className="absolute inset-0"
        style={{
          backgroundColor: items[current].color,
        }}
      />

      {next !== null && (
        <div
          className="
      absolute inset-0
      transition-transform duration-700
    "
          style={{
            backgroundColor: items[next].color,
            transform: animating
              ? "translateY(0%)"
              : direction === "down"
                ? "translateY(-100%)"
                : "translateY(100%)",
          }}
        />
      )}
    </div>
  );
}
