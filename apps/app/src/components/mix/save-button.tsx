"use client";

import { Star } from "lucide-react";
import { useLibrary } from "@/lib/use-library";

// A star that saves or unsaves a mix.
export function SaveButton({ number, size = 26 }: { number: string; size?: number }) {
  const { saved, toggleSaved } = useLibrary();
  const isSaved = saved.has(number);
  return (
    <button
      type="button"
      aria-label={isSaved ? "Remove from saved" : "Save"}
      aria-pressed={isSaved}
      onClick={(event) => {
        event.stopPropagation();
        toggleSaved(number);
      }}
      className="flex size-11 shrink-0 items-center justify-center text-muted active:scale-90"
    >
      <Star
        size={size}
        strokeWidth={1.5}
        fill={isSaved ? "currentColor" : "none"}
        className={isSaved ? "text-fg" : ""}
      />
    </button>
  );
}
