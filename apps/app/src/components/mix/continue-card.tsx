"use client";

import { usePlayer } from "@/components/player/audio-engine";
import type { Mix } from "@/lib/mix";
import { minutesLeft } from "@/lib/progress";
import type { Progress } from "@/lib/storage";
import { useCanPlay } from "@/lib/use-can-play";
import { Artwork } from "./artwork";

// A "Continue listening" chip that resumes the mix where it was left.
export function ContinueCard({ mix, progress }: { mix: Mix; progress: Progress }) {
  const { play } = usePlayer();
  const playable = useCanPlay(mix.number);
  const left = minutesLeft(progress);
  const fraction = progress.duration ? Math.min(progress.position / progress.duration, 1) : 0;
  return (
    <button
      type="button"
      onClick={() => play(mix)}
      disabled={!playable}
      className="flex w-[48vw] max-w-[240px] shrink-0 snap-start snap-always items-center gap-2.5 rounded-xl bg-fill/70 p-1.5 text-left active:scale-[0.98] disabled:opacity-40"
    >
      <Artwork mix={mix} className="size-11 shrink-0 text-xs" />
      <span className="flex h-11 min-w-0 flex-1 flex-col justify-between py-0.5">
        <span className="truncate text-[13px] leading-4 font-semibold">{mix.title}</span>
        <span className="block h-[3px] w-full max-w-20 overflow-hidden rounded-full bg-separator">
          <span className="block h-full bg-fg" style={{ width: `${fraction * 100}%` }} />
        </span>
        <span className="truncate text-[12px] leading-4 text-muted">
          {left != null ? `${left} min left` : "\u00a0"}
        </span>
      </span>
    </button>
  );
}
