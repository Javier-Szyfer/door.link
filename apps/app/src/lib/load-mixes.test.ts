import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { loadMixes } from "./load-mixes.ts";
import type { Mix } from "./mix.ts";

const mix = (number: string): Mix => ({
  number,
  title: `Mix ${number}`,
  description: "",
  publishedAt: "",
  audioUrl: `https://m/${number}.mp3`,
  artworkUrl: null,
  durationSeconds: null,
});

const memoryCache = (initial: Mix[] | null) => {
  const state = { value: initial, writes: 0 };
  return {
    state,
    cache: {
      get: async () => state.value,
      set: async (mixes: Mix[]) => {
        state.value = mixes;
        state.writes++;
      },
    },
  };
};

describe("loadMixes", () => {
  it("returns fresh mixes and caches them", async () => {
    const { state, cache } = memoryCache([mix("1")]);
    const result = await loadMixes(async () => [mix("2"), mix("1")], cache);
    assert.deepEqual(
      result.mixes.map((m) => m.number),
      ["2", "1"],
    );
    assert.equal(result.stale, false);
    assert.equal(state.writes, 1);
  });

  it("falls back to the cached list when the network fails", async () => {
    const { cache } = memoryCache([mix("1")]);
    const result = await loadMixes(async () => {
      throw new TypeError("Load failed");
    }, cache);
    assert.deepEqual(
      result.mixes.map((m) => m.number),
      ["1"],
    );
    assert.equal(result.stale, true);
  });

  it("returns an empty stale list when both fail", async () => {
    const result = await loadMixes(
      async () => {
        throw new TypeError("Load failed");
      },
      {
        get: async () => {
          throw new Error("no idb");
        },
        set: async () => {},
      },
    );
    assert.deepEqual(result, { mixes: [], stale: true });
  });

  it("still returns fresh mixes when caching them fails", async () => {
    const result = await loadMixes(async () => [mix("2")], {
      get: async () => null,
      set: async () => {
        throw new Error("quota");
      },
    });
    assert.equal(result.mixes.length, 1);
    assert.equal(result.stale, false);
  });
});
