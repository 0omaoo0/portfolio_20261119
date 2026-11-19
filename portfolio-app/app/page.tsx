"use client";

import { useEffect, useState } from "react";
import LeftPanel from "./components/LeftPanel";
import RightPanel from "./components/RightPanel";

const items = [
  { color: "#fbcfe8", image: "🐶" },
  { color: "#bfdbfe", image: "🐱" },
  { color: "#bbf7d0", image: "🐼" },
  { color: "#fde68a", image: "🦊" },
  { color: "#d8b4fe", image: "🐯" },
];

export default function Home() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState<"up" | "down">("down");
  const [next, setNext] = useState<number | null>(null);
  const [animating, setAnimating] = useState(false);

  const handleChange = (index: number) => {
    if (index === current || animating) return;

    setNext(index);

    requestAnimationFrame(() => {
      setAnimating(true);
    });

    setTimeout(() => {
      setCurrent(index);
      setNext(null);
      setAnimating(false);
    }, 800);
  };

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (animating) return;

      if (e.deltaY > 0) {
        setDirection("down");

        handleChange((current + 1) % items.length);
      } else {
        setDirection("up");

        handleChange((current - 1 + items.length) % items.length);
      }
    };

    window.addEventListener("wheel", handleWheel);

    return () => window.removeEventListener("wheel", handleWheel);
  }, [current, animating]);
  return (
    <main className="relative h-screen overflow-hidden">
      <div className="absolute inset-0 z-10">
        <LeftPanel
          items={items}
          current={current}
          next={next}
          animating={animating}
          direction={direction}
        />
      </div>

      <div className="absolute inset-0 z-20">
        <RightPanel
          items={items}
          current={current}
          next={next}
          animating={animating}
          direction={direction}
        />
      </div>

      <div className="fixed bottom-10 left-1/2 absolute -translate-x-1/2 gap-3 z-20 flex">
        {items.map((_, index) => (
          <button
            key={index}
            onClick={() => handleChange(index)}
            className={`
              h-4 w-4 rounded-full border
              ${current === index ? "bg-green-500" : "bg-white"}
            `}
          />
        ))}
      </div>
    </main>
  );
}
