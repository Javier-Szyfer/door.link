"use client";

import { CircleArrowDown, CircleCheck, Square } from "lucide-react";
import type { Mix } from "@/lib/mix";
import { useDownloads } from "@/lib/use-downloads";
import { useLibrary } from "@/lib/use-library";
import { ProgressRing } from "./progress-ring";

// Download, progress-and-cancel, or a static downloaded mark for a mix.
export function DownloadButton({ mix }: { mix: Mix }) {
  const { downloads } = useLibrary();
  const { active, start, cancel } = useDownloads();
  const fraction = active[mix.number];
  const layout = "flex size-11 items-center justify-center";

  if (fraction !== undefined) {
    return (
      <button
        type="button"
        className={`${layout} active:scale-95`}
        onClick={() => cancel(mix.number)}
        aria-label="Cancel download"
      >
        <span className="relative flex items-center justify-center">
          <ProgressRing fraction={fraction} />
          <Square size={8} fill="currentColor" className="absolute" />
        </span>
      </button>
    );
  }

  if (downloads[mix.number]) {
    return (
      <span className={layout} role="img" aria-label="Downloaded">
        <CircleCheck size={24} />
      </span>
    );
  }

  return (
    <button
      type="button"
      className={`${layout} active:scale-95`}
      onClick={() => start(mix)}
      aria-label="Download"
    >
      <CircleArrowDown size={24} />
    </button>
  );
}
