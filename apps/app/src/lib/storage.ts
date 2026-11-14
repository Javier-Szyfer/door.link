import { get, set, update } from "idb-keyval";
import type { Mix } from "./mix.ts";

export type Progress = {
  position: number;
  duration: number | null;
  updatedAt: number;
  finished: boolean;
};

export type DownloadRecord = { number: string; bytes: number; downloadedAt: number };

const KEYS = {
  mixes: "door:mixes",
  saved: "door:saved",
  progress: "door:progress",
  downloads: "door:downloads",
} as const;

export const getCachedMixes = async () => (await get<Mix[]>(KEYS.mixes)) ?? null;
export const setCachedMixes = (mixes: Mix[]) => set(KEYS.mixes, mixes);

export const getSaved = async () => (await get<string[]>(KEYS.saved)) ?? [];
export const toggleSavedNumber = (number: string) =>
  update<string[]>(KEYS.saved, (numbers = []) =>
    numbers.includes(number) ? numbers.filter((saved) => saved !== number) : [...numbers, number],
  );

export const getProgressMap = async () =>
  (await get<Record<string, Progress>>(KEYS.progress)) ?? {};

export const setProgress = (number: string, progress: Progress) =>
  update<Record<string, Progress>>(KEYS.progress, (map) => ({ ...map, [number]: progress }));

export const getDownloads = async () =>
  (await get<Record<string, DownloadRecord>>(KEYS.downloads)) ?? {};

export const setDownload = (record: DownloadRecord) =>
  update<Record<string, DownloadRecord>>(KEYS.downloads, (map) => ({
    ...map,
    [record.number]: record,
  }));

export const removeDownload = (number: string) =>
  update<Record<string, DownloadRecord>>(KEYS.downloads, (map = {}) => {
    const { [number]: _removed, ...rest } = map;
    return rest;
  });

const LAST_PLAYED_KEY = "door:last-played";

export const getLastPlayed = async () => (await get<string>(LAST_PLAYED_KEY)) ?? null;
export const setLastPlayed = (number: string) => set(LAST_PLAYED_KEY, number);
