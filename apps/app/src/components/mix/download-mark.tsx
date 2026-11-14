"use client";

import { CircleArrowDown } from "lucide-react";
import { useDownloads } from "@/lib/use-downloads";
import { useLibrary } from "@/lib/use-library";
import { ProgressRing } from "./progress-ring";

// A small ring while a mix downloads, then a mark once it's on the device.
export function DownloadMark({ number }: { number: string }) {
  const { downloads } = useLibrary();
  const { active } = useDownloads();
  const fraction = active[number];

  if (fraction !== undefined) {
    return (
      <span
        role="img"
        aria-label={`Downloading, ${Math.round(fraction * 100)}%`}
        className="ml-0.5 inline-flex text-fg"
      >
        <ProgressRing fraction={fraction} size={14} />
      </span>
    );
  }
  if (!downloads[number]) return null;
  return (
    <CircleArrowDown
      size={14}
      fill="currentColor"
      stroke="var(--bg)"
      aria-label="Downloaded"
      className="ml-0.5"
    />
  );
}
