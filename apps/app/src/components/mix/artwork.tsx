"use client";

import { useEffect, useState } from "react";
import type { Mix } from "@/lib/mix";
import { useOnline } from "@/lib/use-online";

type ArtworkProps = { mix: Mix; className?: string };

// A mix cover that fades in, or a neutral tile when it has none or it can't load; retries online.
export function Artwork({ mix, className = "" }: ArtworkProps) {
  const online = useOnline();
  const [failedUrl, setFailedUrl] = useState<string | null>(null);
  const [loadedUrl, setLoadedUrl] = useState<string | null>(null);

  useEffect(() => {
    if (online) setFailedUrl(null);
  }, [online]);

  if (!mix.artworkUrl || mix.artworkUrl === failedUrl) {
    return (
      <div
        className={`flex items-center justify-center bg-fill font-bold text-muted ${className}`}
        aria-hidden="true"
      >
        {mix.number}
      </div>
    );
  }
  return (
    <span className={`block overflow-hidden bg-fill ${className}`}>
      <img
        src={mix.artworkUrl}
        alt=""
        draggable={false}
        loading="lazy"
        decoding="async"
        onLoad={() => setLoadedUrl(mix.artworkUrl)}
        onError={() => setFailedUrl(mix.artworkUrl)}
        className={`size-full object-cover transition-opacity duration-300 motion-reduce:transition-none ${
          loadedUrl === mix.artworkUrl ? "opacity-100" : "opacity-0"
        }`}
      />
    </span>
  );
}
