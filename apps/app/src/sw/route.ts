import { MEDIA_ORIGIN } from "./caches.ts";

// Whether the worker should answer a request from downloads; null means the list is still loading.
export function serveFromDownloads(url: string, downloaded: Set<string> | null): boolean {
  if (new URL(url).origin !== MEDIA_ORIGIN) return false;
  return downloaded === null || downloaded.has(url);
}
