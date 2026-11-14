"use client";

import { type PointerEvent, useRef, useState } from "react";
import { formatTime } from "@/lib/format-time";

type ScrubberProps = { position: number; duration: number; onSeek: (seconds: number) => void };

// A draggable progress bar that seeks when released, with elapsed and remaining time.
export function Scrubber({ position, duration, onSeek }: ScrubberProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState<number | null>(null);
  const shown = dragging ?? position;
  const fraction = duration > 0 ? Math.min(shown / duration, 1) : 0;

  const valueAt = (event: PointerEvent) => {
    const rect = trackRef.current?.getBoundingClientRect();
    if (!rect || duration <= 0) return 0;
    return Math.min(Math.max((event.clientX - rect.left) / rect.width, 0), 1) * duration;
  };

  return (
    <div className="no-select">
      <div
        ref={trackRef}
        role="slider"
        tabIndex={0}
        aria-label="Position"
        aria-valuemin={0}
        aria-valuemax={Math.round(duration)}
        aria-valuenow={Math.round(shown)}
        aria-valuetext={formatTime(shown)}
        className="group flex h-8 touch-none items-center"
        onPointerDown={(event) => {
          event.currentTarget.setPointerCapture(event.pointerId);
          setDragging(valueAt(event));
        }}
        onPointerMove={(event) => {
          if (dragging != null) setDragging(valueAt(event));
        }}
        onPointerUp={(event) => {
          if (dragging == null) return;
          onSeek(valueAt(event));
          setDragging(null);
        }}
        onPointerCancel={() => setDragging(null)}
        onKeyDown={(event) => {
          if (event.key === "ArrowRight") onSeek(position + 15);
          if (event.key === "ArrowLeft") onSeek(position - 15);
        }}
      >
        <div
          className={`relative w-full overflow-hidden rounded-full bg-fill transition-[height] duration-150 ${
            dragging != null ? "h-3" : "h-1.5"
          }`}
        >
          <div
            className="absolute inset-y-0 left-0 bg-fg"
            style={{ width: `${fraction * 100}%` }}
          />
        </div>
      </div>
      <div className="flex justify-between text-xs font-medium tabular-nums text-muted">
        <span>{formatTime(shown)}</span>
        <span>-{formatTime(Math.max(duration - shown, 0))}</span>
      </div>
    </div>
  );
}
