"use client";

import { useAudio } from "@/contexts/AudioContext";
import { useCallback, type KeyboardEvent } from "react";

export const PlaybackModeToggle = () => {
  const { isContinuousPlayback, setContinuousPlayback } = useAudio();

  const handleToggle = useCallback(() => {
    setContinuousPlayback((prev) => !prev);
  }, [setContinuousPlayback]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLButtonElement>) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        setContinuousPlayback((prev) => !prev);
      }
    },
    [setContinuousPlayback],
  );

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isContinuousPlayback}
      onClick={handleToggle}
      onKeyDown={handleKeyDown}
      className="group flex items-center gap-[6px] bg-[#1f1f1f] px-[6px] py-[4px] text-[10px] uppercase tracking-[0.18em] text-[#dcdcdc] transition-colors  dark:bg-[#111] dark:text-[#f6f6f6] "
    >
      <span className="pointer-events-none">CP</span>
      <span
        aria-hidden
        className={`pointer-events-none flex h-[18px] w-[32px] items-center justify-center border border-[#2b2b2b] bg-[#161616] px-[4px] text-[10px] tracking-[0.12em] text-white transition-colors dark:border-[#f1f1f1] ${
          isContinuousPlayback
            ? "text-white"
            : "text-[#84858C]"
        }`}
      >
        {isContinuousPlayback ? "ON" : "OFF"}
      </span>
    </button>
  );
};
