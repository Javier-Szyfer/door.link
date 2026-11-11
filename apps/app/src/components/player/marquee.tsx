"use client";

import { useLayoutEffect, useRef, useState } from "react";

const SPEED_PX_PER_S = 30;
const GAP_PX = 48;

// One line of text that scrolls sideways when it doesn't fit.
export function Marquee({ text, className = "" }: { text: string; className?: string }) {
  const boxRef = useRef<HTMLSpanElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const [distance, setDistance] = useState(0);

  useLayoutEffect(() => {
    const box = boxRef.current;
    const inner = textRef.current;
    if (!box || !inner) return;
    const measure = () => {
      const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const overflow = !still && inner.scrollWidth > box.clientWidth + 1;
      setDistance(overflow ? inner.scrollWidth + GAP_PX : 0);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(box);
    observer.observe(inner);
    return () => observer.disconnect();
  }, []);

  return (
    <span
      ref={boxRef}
      className={`block min-w-0 overflow-hidden whitespace-nowrap ${className}`}
      style={
        distance
          ? {
              maskImage:
                "linear-gradient(to right, transparent, black 12px, black calc(100% - 16px), transparent)",
              WebkitMaskImage:
                "linear-gradient(to right, transparent, black 12px, black calc(100% - 16px), transparent)",
            }
          : undefined
      }
    >
      <span
        className="inline-flex"
        style={
          distance
            ? {
                animation: `marquee ${distance / SPEED_PX_PER_S}s linear 1.5s infinite`,
                ["--marquee-distance" as string]: `-${distance}px`,
                gap: GAP_PX,
              }
            : undefined
        }
      >
        <span ref={textRef}>{text}</span>
        {distance > 0 && <span aria-hidden="true">{text}</span>}
      </span>
    </span>
  );
}
