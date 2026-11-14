import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { Mix } from "./mix.ts";
import { isPlayable, nextPlayable, previousPlayable } from "./queue.ts";

const mix = (number: string): Mix => ({
  number,
  title: number,
  description: "",
  publishedAt: "",
  audioUrl: "",
  artworkUrl: null,
  durationSeconds: null,
});
const mixes = ["5", "4", "3", "2"].map(mix);

describe("nextPlayable", () => {
  it("online, plays the next older mix", () =>
    assert.equal(nextPlayable(mixes, "5", true, {})?.number, "4"));
  it("offline, skips to the next downloaded mix", () =>
    assert.equal(nextPlayable(mixes, "5", false, { "3": true })?.number, "3"));
  it("offline with nothing downloaded after, stops", () =>
    assert.equal(nextPlayable(mixes, "4", false, { "5": true }), null));
  it("at the oldest mix, stops", () => assert.equal(nextPlayable(mixes, "2", true, {}), null));
});

describe("isPlayable", () => {
  it("is true online", () => assert.equal(isPlayable("4", true, {}), true));
  it("offline needs a download", () => {
    assert.equal(isPlayable("4", false, {}), false);
    assert.equal(isPlayable("4", false, { "4": true }), true);
  });
});

describe("previousPlayable", () => {
  it("online, plays the next newer mix", () =>
    assert.equal(previousPlayable(mixes, "3", true, {})?.number, "4"));
  it("offline, skips to the previous downloaded mix", () =>
    assert.equal(previousPlayable(mixes, "2", false, { "5": true })?.number, "5"));
  it("at the newest mix, stops", () => assert.equal(previousPlayable(mixes, "5", true, {}), null));
});
