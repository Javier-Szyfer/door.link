"use client";

import { useEffect } from "react";
import { toTrack, useAudio } from "@/contexts/audio-context";
import type { Database } from "@/types/database.types";

// Queues the page's mixtape in the global player, which the root layout renders.
export const LoadMixtape = ({
  mixtape,
}: {
  mixtape: Database["public"]["Tables"]["mixtapes"]["Row"];
}) => {
  const { isReady, currentTrack, loadTrack } = useAudio();

  // biome-ignore lint/correctness/useExhaustiveDependencies: load once per page; re-running when playback moves to another track would yank it back to this one
  useEffect(() => {
    if (!isReady || currentTrack?.id === mixtape.id) return;
    loadTrack(toTrack(mixtape));
  }, [isReady, mixtape.id]);

  return null;
};
