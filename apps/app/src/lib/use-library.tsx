"use client";

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { Mix } from "./mix";
import {
  type DownloadRecord,
  getDownloads,
  getProgressMap,
  getSaved,
  type Progress,
  setProgress,
  toggleSavedNumber,
} from "./storage";
import { useMixes } from "./use-mixes";

type Library = {
  mixes: Mix[];
  stale: boolean;
  loading: boolean;
  libraryLoaded: boolean;
  refresh: () => Promise<void>;
  saved: Set<string>;
  toggleSaved: (number: string) => void;
  progress: Record<string, Progress>;
  saveProgress: (number: string, progress: Progress) => void;
  downloads: Record<string, DownloadRecord>;
  refreshDownloads: () => Promise<void>;
};

const LibraryContext = createContext<Library | null>(null);

// Holds the mix list and the listener's saved mixes, progress and downloads.
export function LibraryProvider({ children }: { children: ReactNode }) {
  const { mixes, stale, loading, refresh } = useMixes();
  const [saved, setSavedState] = useState<Set<string>>(new Set());
  const [progress, setProgressState] = useState<Record<string, Progress>>({});
  const [downloads, setDownloads] = useState<Record<string, DownloadRecord>>({});
  const [libraryLoaded, setLibraryLoaded] = useState(false);

  const refreshDownloads = useCallback(async () => {
    setDownloads(await getDownloads().catch(() => ({})));
  }, []);

  useEffect(() => {
    Promise.allSettled([
      getSaved().then((numbers) => setSavedState(new Set(numbers))),
      getProgressMap().then(setProgressState),
      refreshDownloads(),
    ]).then(() => setLibraryLoaded(true));
  }, [refreshDownloads]);

  const toggleSaved = useCallback((number: string) => {
    setSavedState((current) => {
      const next = new Set(current);
      if (next.has(number)) next.delete(number);
      else next.add(number);
      return next;
    });
    toggleSavedNumber(number).catch((error) => console.error(error));
  }, []);

  const saveProgress = useCallback((number: string, value: Progress) => {
    setProgressState((current) => ({ ...current, [number]: value }));
    setProgress(number, value).catch((error) => console.error(error));
  }, []);

  const value = useMemo(
    () => ({
      mixes,
      stale,
      loading,
      libraryLoaded,
      refresh,
      saved,
      toggleSaved,
      progress,
      saveProgress,
      downloads,
      refreshDownloads,
    }),
    [
      mixes,
      stale,
      loading,
      libraryLoaded,
      refresh,
      saved,
      toggleSaved,
      progress,
      saveProgress,
      downloads,
      refreshDownloads,
    ],
  );

  return <LibraryContext.Provider value={value}>{children}</LibraryContext.Provider>;
}

export function useLibrary() {
  const library = useContext(LibraryContext);
  if (!library) throw new Error("useLibrary must be used inside LibraryProvider");
  return library;
}
