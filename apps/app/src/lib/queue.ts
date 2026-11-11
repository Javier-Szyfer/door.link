import type { Mix } from "./mix.ts";

// Whether a mix can play right now: always online, only when downloaded offline.
export const isPlayable = (number: string, online: boolean, downloads: Record<string, unknown>) =>
  online || Boolean(downloads[number]);

// The next older mix that can play now, or null.
export function nextPlayable(
  mixes: Mix[],
  currentNumber: string | undefined,
  online: boolean,
  downloads: Record<string, unknown>,
): Mix | null {
  const index = mixes.findIndex((mix) => mix.number === currentNumber);
  return mixes.slice(index + 1).find((mix) => isPlayable(mix.number, online, downloads)) ?? null;
}

// The next newer mix that can play now, or null.
export function previousPlayable(
  mixes: Mix[],
  currentNumber: string | undefined,
  online: boolean,
  downloads: Record<string, unknown>,
): Mix | null {
  const index = mixes.findIndex((mix) => mix.number === currentNumber);
  if (index <= 0) return null;
  return (
    mixes
      .slice(0, index)
      .reverse()
      .find((mix) => isPlayable(mix.number, online, downloads)) ?? null
  );
}
