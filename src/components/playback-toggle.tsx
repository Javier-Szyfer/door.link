"use client";

import { useAudio } from "@/contexts/audio-context";
import { type KeyboardEvent, useCallback } from "react";

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
      className={`cursor-pointer flex text-[18px]  font-bold w-[30px] h-[20px] leading-none items-center justify-center tracking-tighter 
         ${
           isContinuousPlayback
             ? "text-white bg-[#1500ff] dark:text-[#f1f1f1] dark:bg-[#202020]"
             : "text-[#414141] bg-transparent dark:border-[#84858C] dark:text-[#84858C]"
         }`}
    >
      <span className="-mt-1">∞</span>
    </button>
  );
};
