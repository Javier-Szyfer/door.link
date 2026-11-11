"use client";

import { formatMinutes } from "@/lib/format-time";
import type { Mix } from "@/lib/mix";
import { useLibrary } from "@/lib/use-library";
import { DownloadMark } from "./download-mark";

// "213 · 45 min" plus the download state.
export function MixMeta({ mix, showDownload = true }: { mix: Mix; showDownload?: boolean }) {
  const { progress } = useLibrary();
  const seconds = mix.durationSeconds ?? progress[mix.number]?.duration ?? null;
  return (
    <p className="flex items-center gap-1 text-[13px] text-muted">
      <span>{mix.number}</span>
      {seconds != null && <span>· {formatMinutes(seconds)}</span>}
      {showDownload && <DownloadMark number={mix.number} />}
    </p>
  );
}
