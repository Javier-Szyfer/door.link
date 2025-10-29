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

      className={`cursor-pointer flex text-[18px] font-bold w-[30px] h-[20px] leading-none items-center justify-center tracking-tighter  ${isContinuousPlayback
        ? "text-white bg-[#0000ff] dark:text-[#f1f1f1] dark:bg-[#202020] border-2 border-transparent"

        : "text-[#0000ff] bg-[#fff] border-2 border-[#0000ff] dark:bg-transparent dark:border-[#84858C] dark:text-[#84858C]"
        }`}
    >
 <span className="-mt-1">∞</span>
    </button>
  );
};
