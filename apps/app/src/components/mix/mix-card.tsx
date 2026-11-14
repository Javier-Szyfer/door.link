"use client";

import { usePlayer } from "@/components/player/audio-engine";
import type { Mix } from "@/lib/mix";
import { useCanPlay } from "@/lib/use-can-play";
import { Artwork } from "./artwork";
import { MixMeta } from "./mix-meta";
import { SaveButton } from "./save-button";

// A grid tile that plays the mix on tap.
export function MixCard({ mix }: { mix: Mix }) {
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
        <Artwork mix={mix} className="aspect-square w-full text-2xl" />
      </button>
      <div className="flex items-start gap-1 pt-2">
        <button type="button" onClick={() => play(mix)} className="min-w-0 flex-1 text-left">
          <p className="truncate text-[13px] font-bold">{mix.title}</p>
          <MixMeta mix={mix} />
        </button>
        <SaveButton number={mix.number} size={18} />
      </div>
    </div>
  );
}
