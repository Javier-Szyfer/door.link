"use client";

import { FastForward, Info, Pause, Play, Rewind, Volume, Volume2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Drawer } from "vaul";
import { AirPlayAudio } from "@/components/icons/airplay-audio";
import { Artwork } from "@/components/mix/artwork";
import { DownloadButton } from "@/components/mix/download-button";
import { SaveButton } from "@/components/mix/save-button";
import { Notice } from "@/components/shell/notice";
import { useChrome } from "@/components/shell/use-chrome";
import { parseFeaturing } from "@/lib/featuring";
import { formatBytes } from "@/lib/format-bytes";
import { formatMinutes } from "@/lib/format-time";
import type { Mix } from "@/lib/mix";
import { useLibrary } from "@/lib/use-library";
import { usePlayer, usePlayerTime } from "./audio-engine";
import { Scrubber } from "./scrubber";

// Description, featured artists and details of the playing mix.
function MixInfo({ mix }: { mix: Mix }) {
  const { downloads } = useLibrary();
  const artists = parseFeaturing(mix.description);
  const download = downloads[mix.number];
  const details = [
    mix.publishedAt &&
      new Date(mix.publishedAt).toLocaleDateString(undefined, {
        dateStyle: "long",
        timeZone: "UTC",
      }),
    mix.durationSeconds && formatMinutes(mix.durationSeconds),
    download && `${formatBytes(download.bytes)} downloaded`,
  ].filter(Boolean);

  return (
    <div className="no-scrollbar h-full overflow-y-auto pt-2">
      {mix.description && <p className="text-[15px] leading-snug">{mix.description}</p>}
      {artists.length > 0 && (
        <>
          <p className="pt-5 pb-2 text-[13px] font-semibold text-muted">Featuring</p>
          <div className="flex flex-wrap gap-2">
            {artists.map((artist) => (
              <span key={artist} className="rounded-full bg-white/15 px-3 py-1.5 text-[13px]">
                {artist}
              </span>
            ))}
          </div>
        </>
      )}
      {details.length > 0 && <p className="pt-5 text-[12px] text-muted">{details.join(" · ")}</p>}
    </div>
  );
}

// The full player sheet, dismissed by swiping down.
export function FullPlayer() {
  const {
    current,
    isPlaying,
    isBuffering,
    toggle,
    seekTo,
    next,
    previous,
    airplayAvailable,
    showAirPlay,
    canSetVolume,
    volume,
    setVolume,
  } = usePlayer();
  const { position, duration } = usePlayerTime();
  const { playerOpen, setPlayerOpen } = useChrome();
  const [infoFor, setInfoFor] = useState<string | null>(null);
  useEffect(() => {
    if (!playerOpen) setInfoFor(null);
  }, [playerOpen]);
  if (!current) return null;
  const showInfo = infoFor === current.number;

  return (
    <Drawer.Root open={playerOpen} onOpenChange={setPlayerOpen} noBodyStyles>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-40 bg-black/40" />
        <Drawer.Content className="fixed inset-x-0 bottom-0 z-50 flex h-[calc(100lvh-var(--safe-top)-8px)] flex-col rounded-t-[28px] bg-bg px-7 pb-[calc(var(--safe-bottom)+16px)] outline-none">
          <Drawer.Handle className="mt-2 !w-10 !bg-white/30" />
          <Drawer.Title className="sr-only">Now playing</Drawer.Title>
          <div className="pointer-events-none absolute inset-x-0 top-6 z-10">
            <Notice inSheet />
          </div>

          <div className="relative mt-6 min-h-0 flex-1">
            <div
              aria-hidden={showInfo}
              className={`absolute inset-0 flex items-center transition-opacity duration-300 ${
                showInfo ? "pointer-events-none opacity-0" : "opacity-100"
              }`}
            >
              <Artwork
                mix={current}
                className={`aspect-square w-full rounded-xl text-5xl shadow-artwork transition-transform duration-500 ${
                  isPlaying ? "scale-100" : "scale-[0.86]"
                }`}
              />
            </div>
            {showInfo && (
              <div className="absolute inset-0">
                <MixInfo mix={current} />
              </div>
            )}
          </div>

          <div className="flex items-start gap-3 pt-6">
            <div className="min-w-0 flex-1">
              <p className="truncate text-[18px] leading-tight font-bold">{current.title}</p>
              <p className="truncate text-[18px] leading-tight text-muted">door {current.number}</p>
            </div>
            <SaveButton number={current.number} size={20} />
          </div>

          <div className="pt-4">
            <Scrubber position={position} duration={duration} onSeek={seekTo} />
          </div>

          <div className="flex items-center justify-around py-6">
            <button
              type="button"
              aria-label="Previous mix"
              onClick={previous}
              className="flex size-16 items-center justify-center active:scale-90"
            >
              <Rewind size={40} fill="currentColor" strokeWidth={0} />
            </button>
            <button
              type="button"
              aria-label={isPlaying ? "Pause" : "Play"}
              onClick={toggle}
              className={`flex size-20 items-center justify-center active:scale-90 ${
                isBuffering ? "animate-pulse" : ""
              }`}
            >
              {isPlaying ? (
                <Pause size={52} fill="currentColor" strokeWidth={0} />
              ) : (
                <Play size={52} fill="currentColor" strokeWidth={0} />
              )}
            </button>
            <button
              type="button"
              aria-label="Next mix"
              onClick={next}
              className="flex size-16 items-center justify-center active:scale-90"
            >
              <FastForward size={40} fill="currentColor" strokeWidth={0} />
            </button>
          </div>

          {canSetVolume && (
            <div className="flex items-center gap-3 pb-6 text-muted">
              <Volume size={16} />
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={volume}
                onChange={(event) => setVolume(Number(event.target.value))}
                aria-label="Volume"
                className="h-1.5 flex-1 accent-fg"
              />
              <Volume2 size={18} />
            </div>
          )}

          <div className="flex items-center justify-around text-muted">
            <DownloadButton mix={current} />
            {airplayAvailable && (
              <button
                type="button"
                aria-label="AirPlay"
                onClick={showAirPlay}
                className="flex size-11 items-center justify-center active:scale-90"
              >
                <AirPlayAudio size={26} />
              </button>
            )}
            <button
              type="button"
              aria-label={showInfo ? "Show cover" : "Show details"}
              aria-pressed={showInfo}
              onClick={() => setInfoFor(showInfo ? null : current.number)}
              className={`flex size-11 items-center justify-center active:scale-90 ${
                showInfo ? "text-fg" : ""
              }`}
            >
              <Info size={26} />
            </button>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
