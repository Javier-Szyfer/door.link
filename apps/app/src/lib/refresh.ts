export const REFRESH_AFTER_MS = 60_000;

// Whether the mix list is old enough to fetch again when the app comes back.
export const shouldRefresh = (lastLoadedAt: number | null, now: number) =>
  lastLoadedAt === null || now - lastLoadedAt >= REFRESH_AFTER_MS;
