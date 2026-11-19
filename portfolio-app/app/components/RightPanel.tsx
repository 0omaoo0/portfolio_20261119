"use client";

import { useState } from "react";

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
  const [mousePosition, setMousePosition] = useState({
    x: 0,
    y: 0,
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();

    const x = (e.clientX - rect.left - rect.width / 2) / rect.width;

    const y = (e.clientY - rect.top - rect.height / 2) / rect.height;

    setMousePosition({ x, y });
  };

  return (
    <div
      className="absolute top-0 right-0 h-screen w-[75vw] overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      <div
        className="absolute inset-0 flex items-center justify-center text-9xl transition-transform duration-200 ease-out"
        style={{
          transform: `translate(
            ${-mousePosition.x * 30}px,
            ${-mousePosition.y * 30}px
          )`,
        }}
      >
        {items[current].image}
      </div>

      {next !== null && (
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
