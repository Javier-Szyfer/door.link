"use client";

//Components
import { Description } from "./description";
import { ToggleThemeIcon } from "./toggle-theme";
import { useAudio } from "@/contexts/AudioContext";
import { useCallback, type KeyboardEvent } from "react";

export const Header = () => {
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
    <div className="flex flex-col px-4 text-[#414141] dark:text-[#f1f1f1]">
      <div className="flex items-center justify-between gap-4 pt-6 lg:pt-12">
        <h1 className="font-medium">[ door ]</h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-xs">
            <span>Continuous playback</span>
            <button
              type="button"
              role="switch"
              aria-checked={isContinuousPlayback}
              onClick={handleToggle}
              onKeyDown={handleKeyDown}
              className={`relative inline-flex h-5 w-9 items-center rounded-full border border-stone-300 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 dark:border-stone-700 ${
                isContinuousPlayback
                  ? "bg-[#414141] text-white focus-visible:ring-[#414141]"
                  : "bg-stone-200 text-[#414141] focus-visible:ring-stone-300 dark:bg-stone-800 dark:text-[#f1f1f1]"
              }`}
            >
              <span
                className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform dark:bg-[#f1f1f1] ${
                  isContinuousPlayback ? "translate-x-[18px]" : "translate-x-[2px]"
                }`}
              />
            </button>
          </div>
          <ToggleThemeIcon />
        </div>
      </div>
      <Description />
    </div>
  );
};
