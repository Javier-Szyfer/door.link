import type { Mix } from "./mix.ts";
import type { Progress } from "./storage.ts";

// The mix to show in the player when the app opens: the stored one, else the most recently played.
export function pickLastPlayed(
  mixes: Mix[],
  lastNumber: string | null,
  progress: Record<string, Progress>,
): Mix | null {
  const stored = mixes.find((mix) => mix.number === lastNumber);
  if (stored) return stored;
  const played = mixes.filter((mix) => progress[mix.number]);
  if (!played.length) return null;
  return played.reduce((latest, mix) =>
    progress[mix.number].updatedAt > progress[latest.number].updatedAt ? mix : latest,
  );
}
