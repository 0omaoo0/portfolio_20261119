"use client";

import { useRef } from "react";

type Item = {
  color: string;
  image: string;
};

type RightPanelProps = {
  items: Item[];
  current: number;
  next: number | null;
  animating: boolean;
  direction: "up" | "down";
};

export default function RightPanel({
  items,
  current,
  next,
  animating,
  direction,
}: RightPanelProps) {
  const imageRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current) return;

    const rect = e.currentTarget.getBoundingClientRect();

    const x = (e.clientX - rect.left - rect.width / 2) / rect.width;

    const y = (e.clientY - rect.top - rect.height / 2) / rect.height;

    imageRef.current.style.transform = `translate(
      ${-x * 30}px,
      ${-y * 30}px
    )`;
  };

  const handleMouseLeave = () => {
    if (!imageRef.current) return;

    imageRef.current.style.transform = "translate(0px, 0px)";
  };

  return (
    <div
      className="absolute top-0 right-0 h-screen w-[75vw] overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div
        ref={imageRef}
        className="absolute inset-0 flex items-center justify-center text-9xl transition-transform duration-300 ease-out"
      >
        {items[current].image}
      </div>

      {next !== null && items[next] && (
        <div
          className="
            absolute inset-0
            flex items-center justify-center
            text-9xl
            transition-transform duration-700
          "
          style={{
            transform: animating
              ? "translateY(0%)"
              : direction === "down"
                ? "translateY(100%)"
                : "translateY(-100%)",
          }}
        >
          {items[next].image}
        </div>
      )}
    </div>
  );
}
