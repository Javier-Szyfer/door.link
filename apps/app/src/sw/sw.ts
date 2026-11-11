/// <reference lib="webworker" />
import { CACHES } from "./caches";
import { rangeResponse } from "./range";
import { serveFromDownloads } from "./route";

declare const self: ServiceWorkerGlobalScope;

const SHELL_URL = "/";
const KEEP = new Set<string>(Object.values(CACHES));

let downloaded: Set<string> | null = null;

// Reloads the set of downloaded audio and artwork URLs.
const loadDownloaded = async () => {
  const lists = await Promise.all(
    [CACHES.audio, CACHES.art].map(async (name) => (await caches.open(name)).keys()),
  );
  downloaded = new Set(lists.flat().map((request) => request.url));
};

loadDownloaded().catch(() => {});

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHES.shell)
      .then((cache) => cache.add(SHELL_URL))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((key) => !KEEP.has(key)).map((key) => caches.delete(key))),
      )
      .then(() => self.clients.claim()),
  );
});

// Caches the scripts and styles the page already loaded before the worker took over.
self.addEventListener("message", (event) => {
  if (event.data?.type === "downloads-changed") {
    event.waitUntil(loadDownloaded().catch(() => {}));
    return;
  }
  if (event.data?.type !== "cache-assets" || !Array.isArray(event.data.urls)) return;
  const urls = (event.data.urls as string[]).filter((url) => {
    const { origin, pathname } = new URL(url);
    return origin === self.location.origin && isShellAsset(pathname);
  });
  event.waitUntil(
    caches
      .open(CACHES.shell)
      .then((cache) => cache.addAll(urls))
      .catch(() => {}),
  );
});

const isShellAsset = (pathname: string) =>
  pathname.startsWith("/_next/static/") ||
  pathname.startsWith("/icons/") ||
  pathname === "/manifest.webmanifest" ||
  pathname === "/favicon.ico";

const networkFirstShell = async (request: Request) => {
  const cache = await caches.open(CACHES.shell);
  try {
    const response = await fetch(request);
    if (response.ok) await cache.put(SHELL_URL, response.clone());
    return response;
  } catch {
    return (await cache.match(SHELL_URL)) ?? Response.error();
  }
};

const cacheFirst = async (request: Request) => {
  const cache = await caches.open(CACHES.shell);
  const cached = await cache.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  if (response.ok) await cache.put(request, response.clone());
  return response;
};

const fromDownloads = async (request: Request): Promise<Response | null> => {
  const audio = await (await caches.open(CACHES.audio)).match(request.url);
  if (audio) {
    const type = audio.headers.get("Content-Type") ?? "audio/mpeg";
    return rangeResponse(await audio.blob(), request.headers.get("Range"), type);
  }
  return (await (await caches.open(CACHES.art)).match(request.url)) ?? null;
};

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;
  const url = new URL(request.url);

  if (request.mode === "navigate" && url.origin === self.location.origin) {
    event.respondWith(networkFirstShell(request));
    return;
  }
  if (url.origin === self.location.origin) {
    if (isShellAsset(url.pathname)) event.respondWith(cacheFirst(request));
    return;
  }
  if (!serveFromDownloads(request.url, downloaded)) return;
  event.respondWith(fromDownloads(request).then((cached) => cached ?? fetch(request)));
});
