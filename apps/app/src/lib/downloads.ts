import { CACHES } from "../sw/caches.ts";
import type { Mix } from "./mix.ts";
import { type DownloadRecord, removeDownload, setDownload } from "./storage.ts";

export type DownloadDeps = {
  fetch: typeof fetch;
  caches: CacheStorage;
  setDownload: (record: DownloadRecord) => Promise<void>;
  removeDownload: (number: string) => Promise<void>;
};

const defaultDeps = (): DownloadDeps => ({
  fetch: (...args) => fetch(...args),
  caches,
  setDownload,
  removeDownload,
});

const clearCaches = async (mix: Mix, deps: DownloadDeps) => {
  const audio = await deps.caches.open(CACHES.audio);
  await audio.delete(mix.audioUrl);
  if (mix.artworkUrl) await (await deps.caches.open(CACHES.art)).delete(mix.artworkUrl);
};

// Passes a body through unchanged while reporting the fraction received.
const withProgress = (response: Response, onProgress: (fraction: number) => void) => {
  const total = Number(response.headers.get("Content-Length")) || 0;
  const counter = { received: 0, percent: 0 };
  const body = response.body?.pipeThrough(
    new TransformStream<Uint8Array, Uint8Array>({
      transform(chunk, controller) {
        counter.received += chunk.byteLength;
        const percent = total ? Math.min(Math.floor((counter.received / total) * 100), 100) : 0;
        if (percent > counter.percent) {
          counter.percent = percent;
          onProgress(percent / 100);
        }
        controller.enqueue(chunk);
      },
    }),
  );
  return { body: body ?? null, total, counter };
};

// Saves a cover; one that can't be saved doesn't undo the download unless it was cancelled.
const saveArtwork = async (url: string, signal: AbortSignal, deps: DownloadDeps) => {
  try {
    const art = await deps.fetch(url, { signal, mode: "cors" });
    if (art.ok) await (await deps.caches.open(CACHES.art)).put(url, art);
  } catch (error) {
    signal.throwIfAborted();
    console.error(error);
  }
};

// Saves a mix's audio and cover for offline use; if the audio fails nothing is kept.
export async function downloadMix(
  mix: Mix,
  onProgress: (fraction: number) => void,
  signal: AbortSignal,
  deps: DownloadDeps = defaultDeps(),
): Promise<void> {
  try {
    signal.throwIfAborted();
    const response = await deps.fetch(mix.audioUrl, { signal, mode: "cors" });
    if (!response.ok) throw new Error(`Download failed: ${response.status}`);
    const type = response.headers.get("Content-Type") ?? "audio/mpeg";
    const { body, total, counter } = withProgress(response, onProgress);
    const headers: Record<string, string> = { "Content-Type": type };
    if (total) headers["Content-Length"] = String(total);
    const audio = await deps.caches.open(CACHES.audio);
    await audio.put(mix.audioUrl, new Response(body, { headers }));
    signal.throwIfAborted();
    if (counter.percent < 100) onProgress(1);

    if (mix.artworkUrl) await saveArtwork(mix.artworkUrl, signal, deps);

    await deps.setDownload({
      number: mix.number,
      bytes: counter.received,
      downloadedAt: Date.now(),
    });
  } catch (error) {
    await clearCaches(mix, deps).catch(() => {});
    throw error;
  }
}

// Removes a downloaded mix from the device.
export async function deleteDownload(mix: Mix, deps: DownloadDeps = defaultDeps()) {
  await clearCaches(mix, deps);
  await deps.removeDownload(mix.number);
}
