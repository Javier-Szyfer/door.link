"use client";

import type { ReactNode } from "react";
import { usePlayer } from "@/components/player/audio-engine";
import type { Mix } from "@/lib/mix";
import { useCanPlay } from "@/lib/use-can-play";
import { Artwork } from "./artwork";
import { MixMeta } from "./mix-meta";

type MixRowProps = {
  mix: Mix;
  trailing?: ReactNode;
  divider?: boolean;
  showDownload?: boolean;
};

// A list row that plays the mix on tap; trailing content goes on the right.
export function MixRow({ mix, trailing, divider = false, showDownload = true }: MixRowProps) {
  const { play } = usePlayer();
  const dimmed = !useCanPlay(mix.number);
  return (
    <div className={`flex items-center gap-3 pl-4 ${dimmed ? "opacity-40" : ""}`}>
      <button
        type="button"
        onClick={() => play(mix)}
        aria-label={`Play ${mix.title}`}
        className="shrink-0 active:opacity-60"
      >
        <Artwork mix={mix} className="size-12 text-xs" />
      </button>
      <div
        className={`flex min-w-0 flex-1 items-center gap-1 py-2.5 pr-2 ${
          divider ? "border-b border-separator" : ""
        }`}
      >
        <button
          type="button"
          onClick={() => play(mix)}
          className="min-w-0 flex-1 text-left active:opacity-60"
        >
          <span className="block truncate text-[15px]">{mix.title}</span>
          <MixMeta mix={mix} showDownload={showDownload} />
        </button>
        {trailing}
      </div>
    </div>
  );
}
