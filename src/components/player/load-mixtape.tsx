"use client";

import { useEffect } from "react";
import { useAudio } from "@/contexts/audio-context";
import type { Database } from "@/types/database.types";

// Queues the page's mixtape in the global player, which the root layout renders.
export const LoadMixtape = ({
  mixtape,
}: {
  mixtape: Database["public"]["Tables"]["mixtapes"]["Row"];
}) => {
  const { isReady, currentMixtape, setAudioSrc } = useAudio();

  // biome-ignore lint/correctness/useExhaustiveDependencies: load once per page; re-running when playback moves to another track would yank it back to this one
  useEffect(() => {
    if (!isReady || currentMixtape?.id === mixtape.id.toString()) return;

    setAudioSrc(
      mixtape.audio_uri,
      {
        number: mixtape.number,
        title: mixtape.title,
        id: mixtape.id.toString(),
        artwork_uri: mixtape.artwork_uri,
      },
      undefined,
      false,
    );
  }, [isReady, mixtape.id]);

  return null;
};
