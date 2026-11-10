"use client";

import { useAudio } from "@/contexts/audio-context";
import { cn } from "@/lib/utils";

export const PlaybackModeToggle = () => {
  const { isContinuousPlayback, setContinuousPlayback } = useAudio();

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isContinuousPlayback}
      aria-label="Continuous playback"
      onClick={() => setContinuousPlayback((enabled) => !enabled)}
      className={cn(
        "flex h-[20px] w-[30px] cursor-pointer items-center justify-center text-[18px] font-bold leading-none tracking-tighter",
        isContinuousPlayback
          ? "bg-[#1500ff] text-white dark:bg-[#202020] dark:text-[#f1f1f1]"
          : "bg-transparent text-[#414141] dark:border-[#84858C] dark:text-[#84858C]",
      )}
    >
      <span className="-mt-1">∞</span>
    </button>
  );
};
