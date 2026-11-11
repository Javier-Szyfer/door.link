import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { CACHES } from "../sw/caches.ts";
import { type DownloadDeps, deleteDownload, downloadMix } from "./downloads.ts";
import type { Mix } from "./mix.ts";
import type { DownloadRecord } from "./storage.ts";

const mix: Mix = {
  number: "214",
  title: "now more than ever",
  description: "",
  publishedAt: "",
  audioUrl: "https://media.example/214.mp3",
  artworkUrl: "https://media.example/214.jpg",
  durationSeconds: 2712,
};

const fakeCaches = (failPutFor?: string) => {
  const stores = new Map<string, Map<string, Response>>();
  const open = async (name: string) => {
    if (!stores.has(name)) stores.set(name, new Map());
    const store = stores.get(name) as Map<string, Response>;
    return {
      put: async (url: string, response: Response) => {
        if (url === failPutFor) throw new DOMException("full", "QuotaExceededError");
        const body = await response.arrayBuffer();
        store.set(url, new Response(body, { headers: response.headers }));
      },
      delete: async (url: string) => store.delete(url),
      match: async (url: string) => store.get(url),
    };
  };
  const has = (name: string, url: string) => stores.get(name)?.has(url) ?? false;
  return { caches: { open } as unknown as CacheStorage, has };
};

const audioBody = (chunks: number, failAfter?: number) =>
  new ReadableStream<Uint8Array>({
    start(controller) {
      for (let i = 0; i < chunks; i++) {
        if (failAfter === i) {
          controller.error(new TypeError("network lost"));
          return;
        }
        controller.enqueue(new Uint8Array(250));
      }
      controller.close();
    },
  });

const setup = (options: { failAfter?: number; failPutFor?: string } = {}) => {
  const { caches, has } = fakeCaches(options.failPutFor);
  const records: DownloadRecord[] = [];
  const removed: string[] = [];
  const deps: DownloadDeps = {
    caches,
    fetch: (async (url: string) =>
      url === mix.audioUrl
        ? new Response(audioBody(4, options.failAfter), {
            headers: { "Content-Length": "1000", "Content-Type": "audio/mpeg" },
          })
        : new Response(new Uint8Array(10), {
            headers: { "Content-Type": "image/jpeg" },
          })) as typeof fetch,
    setDownload: async (record) => {
      records.push(record);
    },
    removeDownload: async (number) => {
      removed.push(number);
    },
  };
  return { deps, has, records, removed };
};

describe("downloadMix", () => {
  it("stores audio and artwork, reports progress and records the size", async () => {
    const { deps, has, records } = setup();
    const fractions: number[] = [];
    await downloadMix(mix, (f) => fractions.push(f), new AbortController().signal, deps);
    assert.ok(has(CACHES.audio, mix.audioUrl));
    assert.ok(has(CACHES.art, mix.artworkUrl as string));
    assert.equal(records[0].number, "214");
    assert.equal(records[0].bytes, 1000);
    assert.equal(fractions.at(-1), 1);
  });

  it("reports progress at most once per percent", async () => {
    const { deps } = setup();
    const size = 5000;
    deps.fetch = (async (url: string) => {
      if (url !== mix.audioUrl) return new Response(new Uint8Array(10));
      const body = new ReadableStream<Uint8Array>({
        start(controller) {
          for (let i = 0; i < size; i++) controller.enqueue(new Uint8Array(1));
          controller.close();
        },
      });
      return new Response(body, { headers: { "Content-Length": String(size) } });
    }) as typeof fetch;
    const fractions: number[] = [];
    await downloadMix(mix, (f) => fractions.push(f), new AbortController().signal, deps);
    assert.ok(fractions.length <= 101, `reported ${fractions.length} times`);
    assert.equal(new Set(fractions).size, fractions.length);
    assert.equal(fractions.at(-1), 1);
  });

  it("leaves nothing behind when the connection drops mid-way", async () => {
    const { deps, has, records } = setup({ failAfter: 2 });
    await assert.rejects(downloadMix(mix, () => {}, new AbortController().signal, deps));
    assert.equal(has(CACHES.audio, mix.audioUrl), false);
    assert.equal(has(CACHES.art, mix.artworkUrl as string), false);
    assert.equal(records.length, 0);
  });

  it("leaves nothing behind when cancelled", async () => {
    const { deps, has, records } = setup();
    const controller = new AbortController();
    controller.abort();
    await assert.rejects(downloadMix(mix, () => {}, controller.signal, deps));
    assert.equal(has(CACHES.audio, mix.audioUrl), false);
    assert.equal(records.length, 0);
  });

  it("cleans up and rethrows when storage is full", async () => {
    const { deps, has, records } = setup({ failPutFor: mix.audioUrl });
    await assert.rejects(
      downloadMix(mix, () => {}, new AbortController().signal, deps),
      (error: Error) => error.name === "QuotaExceededError",
    );
    assert.equal(has(CACHES.audio, mix.audioUrl), false);
    assert.equal(records.length, 0);
  });

  it("keeps the audio when the cover can't be fetched", async () => {
    const { deps, has, records } = setup();
    const fetchAudio = deps.fetch;
    deps.fetch = (async (url: string, init?: RequestInit) => {
      if (url === mix.artworkUrl) throw new TypeError("blocked");
      return fetchAudio(url, init);
    }) as typeof fetch;
    await downloadMix(mix, () => {}, new AbortController().signal, deps);
    assert.ok(has(CACHES.audio, mix.audioUrl));
    assert.equal(records[0].bytes, 1000);
  });

  it("keeps the audio when the cover answers with an error", async () => {
    const { deps, has, records } = setup();
    const fetchAudio = deps.fetch;
    deps.fetch = (async (url: string, init?: RequestInit) =>
      url === mix.artworkUrl
        ? new Response("no", { status: 404 })
        : fetchAudio(url, init)) as typeof fetch;
    await downloadMix(mix, () => {}, new AbortController().signal, deps);
    assert.ok(has(CACHES.audio, mix.audioUrl));
    assert.equal(has(CACHES.art, mix.artworkUrl as string), false);
    assert.equal(records.length, 1);
  });

  it("keeps the audio when the cover doesn't fit", async () => {
    const { deps, has, records } = setup({ failPutFor: mix.artworkUrl as string });
    await downloadMix(mix, () => {}, new AbortController().signal, deps);
    assert.ok(has(CACHES.audio, mix.audioUrl));
    assert.equal(records.length, 1);
  });

  it("leaves nothing behind when cancelled while fetching the cover", async () => {
    const { deps, has, records } = setup();
    const controller = new AbortController();
    const fetchAudio = deps.fetch;
    deps.fetch = (async (url: string, init?: RequestInit) => {
      if (url !== mix.artworkUrl) return fetchAudio(url, init);
      controller.abort();
      throw new DOMException("cancelled", "AbortError");
    }) as typeof fetch;
    await assert.rejects(downloadMix(mix, () => {}, controller.signal, deps));
    assert.equal(has(CACHES.audio, mix.audioUrl), false);
    assert.equal(records.length, 0);
  });

  it("fails on a non-ok response", async () => {
    const { deps, records } = setup();
    deps.fetch = (async () => new Response("no", { status: 403 })) as typeof fetch;
    await assert.rejects(downloadMix(mix, () => {}, new AbortController().signal, deps));
    assert.equal(records.length, 0);
  });
});

describe("downloadMix memory", () => {
  it("hands the cache the network stream instead of reading it all first", async () => {
    const { deps } = setup();
    let pulled = 0;
    deps.fetch = (async (url: string) => {
      if (url !== mix.audioUrl) return new Response(new Uint8Array(10));
      let sent = 0;
      const body = new ReadableStream<Uint8Array>({
        pull(controller) {
          if (sent === 4) return controller.close();
          sent++;
          pulled += 250;
          controller.enqueue(new Uint8Array(250));
        },
      });
      return new Response(body, { headers: { "Content-Length": "1000" } });
    }) as typeof fetch;
    let pulledAtPut = -1;
    const open = deps.caches.open.bind(deps.caches);
    deps.caches = {
      open: async (name: string) => {
        const cache = await open(name);
        return {
          ...cache,
          put: async (url: string, response: Response) => {
            if (url === mix.audioUrl) pulledAtPut = pulled;
            return cache.put(url, response);
          },
        };
      },
    } as unknown as CacheStorage;
    await downloadMix(mix, () => {}, new AbortController().signal, deps);
    assert.ok(pulledAtPut < 1000, `read ${pulledAtPut} bytes before caching`);
  });
});

describe("deleteDownload", () => {
  it("removes both cache entries and the record", async () => {
    const { deps, has, removed } = setup();
    await downloadMix(mix, () => {}, new AbortController().signal, deps);
    await deleteDownload(mix, deps);
    assert.equal(has(CACHES.audio, mix.audioUrl), false);
    assert.equal(has(CACHES.art, mix.artworkUrl as string), false);
    assert.deepEqual(removed, ["214"]);
  });
});
