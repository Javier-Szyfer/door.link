"use client";

import { ArrowDown, Ellipsis, Pause, Play, Share, Square, Star, Trash2 } from "lucide-react";
import { type ReactNode, useRef, useState } from "react";
import { usePlayer } from "@/components/player/audio-engine";
import { PopoverMenu } from "@/components/shell/popover-menu";
import type { Mix } from "@/lib/mix";
import { mixUrl } from "@/lib/share";
import { useDownloads } from "@/lib/use-downloads";
import { useLibrary } from "@/lib/use-library";
import { useNotice } from "@/lib/use-notice";

type Item = { label: string; icon: ReactNode; onSelect: () => void; destructive?: boolean };

// A "…" button that opens play/pause, favorite, download and share actions for a mix.
export function MixMenu({ mix }: { mix: Mix }) {
  const { current, isPlaying, play, toggle: playPause } = usePlayer();
  const { saved, toggleSaved, downloads } = useLibrary();
  const { active, start, cancel, remove } = useDownloads();
  const { notify } = useNotice();
  const [open, setOpen] = useState(false);
  const [upward, setUpward] = useState(false);
  const button = useRef<HTMLButtonElement>(null);

  const isSaved = saved.has(mix.number);
  const downloading = active[mix.number] !== undefined;
  const downloaded = Boolean(downloads[mix.number]);
  // This mix is the one loaded in the player: the item pauses or resumes it
  // instead of starting it over.
  const loaded = current?.number === mix.number;
  const playing = loaded && isPlaying;

  const download = () => {
    notify(`Downloading ${mix.title}`);
    start(mix);
  };

  const share = () => {
    const url = mixUrl(mix.number);
    if (navigator.share) navigator.share({ title: mix.title, url }).catch(() => {});
    else navigator.clipboard?.writeText(url).catch(() => {});
  };

  const items: Item[] = [
    playing
      ? { label: "Pause", icon: <Pause size={20} />, onSelect: playPause }
      : {
          label: "Play",
          icon: <Play size={20} />,
          onSelect: () => (loaded ? playPause() : play(mix)),
        },
    {
      label: isSaved ? "Remove Favorite" : "Favorite",
      icon: <Star size={20} fill={isSaved ? "currentColor" : "none"} />,
      onSelect: () => toggleSaved(mix.number),
    },
    downloading
      ? { label: "Cancel Download", icon: <Square size={18} />, onSelect: () => cancel(mix.number) }
      : downloaded
        ? {
            label: "Remove Download",
            icon: <Trash2 size={20} />,
            onSelect: () => void remove(mix),
            destructive: true,
          }
        : { label: "Download", icon: <ArrowDown size={20} />, onSelect: download },
    { label: "Share", icon: <Share size={20} />, onSelect: share },
  ];

  const toggle = () => {
    const rect = button.current?.getBoundingClientRect();
    setUpward(Boolean(rect && rect.bottom > window.innerHeight * 0.55));
    setOpen((value) => !value);
  };

  return (
    <div className="relative">
      <button
        ref={button}
        type="button"
        aria-label="More"
        aria-expanded={open}
        onClick={toggle}
        className="flex size-11 items-center justify-center text-muted active:scale-90"
      >
        <Ellipsis size={22} />
      </button>
      <PopoverMenu open={open} onClose={() => setOpen(false)} upward={upward} className="w-60 py-1">
        {items.map((item) => (
          <button
            key={item.label}
            type="button"
            role="menuitem"
            onClick={() => {
              setOpen(false);
              item.onSelect();
            }}
            className={`flex w-full items-center gap-3 px-4 py-2.5 text-left text-[15px] active:bg-fill ${
              item.destructive ? "text-red-500" : ""
            }`}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </PopoverMenu>
    </div>
  );
}
