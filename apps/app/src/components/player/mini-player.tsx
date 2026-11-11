"use client";

import { FastForward, Pause, Play } from "lucide-react";
import { motion } from "motion/react";
import { Artwork } from "@/components/mix/artwork";
import { useChrome } from "@/components/shell/use-chrome";
import { usePlayer } from "./audio-engine";
import { Marquee } from "./marquee";

// The now-playing capsule: cover, scrolling title and description, play and (when wide) next.
export function MiniPlayer({
  compact = false,
  fadeIn = false,
}: {
  compact?: boolean;
  fadeIn?: boolean;
}) {
  const { current, isPlaying, toggle, next } = usePlayer();
  const { setPlayerOpen } = useChrome();
  if (!current) return null;
  const line = current.description ? `${current.title} — ${current.description}` : current.title;

  return (
    <motion.div
      layoutId="mini-player"
      initial={fadeIn ? { opacity: 0 } : false}
      animate={{ opacity: 1 }}
      className="glass flex h-[56px] min-w-0 flex-1 items-center gap-3 rounded-full pr-2 pl-3 shadow-glass"
      drag="y"
      dragConstraints={{ top: 0, bottom: 0 }}
      dragElastic={0.2}
      onDragEnd={(_, info) => {
        if (info.offset.y < -30) setPlayerOpen(true);
      }}
      transition={{ type: "spring", stiffness: 500, damping: 40 }}
    >
      <button
        type="button"
        onClick={() => setPlayerOpen(true)}
        className="flex min-w-0 flex-1 items-center gap-3 text-left"
        aria-label={`Open player for ${current.title}`}
      >
        <Artwork mix={current} className="size-8 shrink-0 rounded-lg text-[8px]" />
        <Marquee text={line} className="text-[15px] font-medium" />
      </button>
      <button
        type="button"
        aria-label={isPlaying ? "Pause" : "Play"}
        onClick={toggle}
        className="flex size-11 shrink-0 items-center justify-center active:scale-90"
      >
        {isPlaying ? (
          <Pause size={24} fill="currentColor" strokeWidth={0} />
        ) : (
          <Play size={24} fill="currentColor" strokeWidth={0} />
        )}
      </button>
      {!compact && (
        <button
          type="button"
          aria-label="Next mix"
          onClick={next}
          className="flex size-11 shrink-0 items-center justify-center active:scale-90"
        >
          <FastForward size={28} fill="currentColor" strokeWidth={0} />
        </button>
      )}
    </motion.div>
  );
}
