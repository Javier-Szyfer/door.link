import type { Mix } from "./mix.ts";

type MixCache = { get(): Promise<Mix[] | null>; set(mixes: Mix[]): Promise<void> };

// Loads fresh mixes and caches them, falling back to the cached list when offline.
export async function loadMixes(
  fetchFresh: () => Promise<Mix[]>,
  cache: MixCache,
): Promise<{ mixes: Mix[]; stale: boolean }> {
  try {
    const mixes = await fetchFresh();
    await cache.set(mixes).catch((error) => console.error(error));
    return { mixes, stale: false };
  } catch {
    const cached = await cache.get().catch(() => null);
    return { mixes: cached ?? [], stale: true };
  }
}
