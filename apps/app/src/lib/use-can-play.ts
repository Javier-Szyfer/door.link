"use client";

import { isPlayable } from "./queue";
import { useLibrary } from "./use-library";
import { useOnline } from "./use-online";

// Whether a mix can play right now.
export function useCanPlay(number: string) {
  const { downloads } = useLibrary();
  return isPlayable(number, useOnline(), downloads);
}
