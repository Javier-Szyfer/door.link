"use client";

import { usePlayer } from "@/components/player/audio-engine";
import type { Mix } from "@/lib/mix";
import { useCanPlay } from "@/lib/use-can-play";
import { Artwork } from "./artwork";
import { MixMeta } from "./mix-meta";
import { SaveButton } from "./save-button";

// A mix tile that plays on tap: large for the newest mix, compact for the grid.
export function MixCard({ mix, large = false }: { mix: Mix; large?: boolean }) {
  const { play } = usePlayer();
  const dimmed = !useCanPlay(mix.number);
  return (
    <div className={`min-w-0 transition-opacity ${dimmed ? "opacity-40" : ""}`}>
      <button
        type="button"
        onClick={() => play(mix)}
        className="block w-full transition-transform duration-150 active:scale-[0.97]"
        aria-label={`Play ${mix.title}`}
      >
        <Artwork
          mix={mix}
          className={`aspect-square w-full ${large ? "rounded-xl text-4xl" : "rounded-lg text-2xl"}`}
        />
      </button>
      <div className="flex items-start gap-1 pt-2">
        <button type="button" onClick={() => play(mix)} className="min-w-0 flex-1 text-left">
          <p className={`truncate font-bold ${large ? "text-[18px] leading-snug" : "text-[13px]"}`}>
            {mix.title}
          </p>
          <MixMeta mix={mix} />
        </button>
        <SaveButton number={mix.number} size={large ? 22 : 18} />
      </div>
    </div>
  );
}
