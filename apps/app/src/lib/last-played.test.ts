import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { pickLastPlayed } from "./last-played.ts";
import type { Mix } from "./mix.ts";

const mix = (number: string): Mix => ({
  number,
  title: number,
  description: "",
  publishedAt: "",
  audioUrl: "",
  artworkUrl: null,
  durationSeconds: 100,
});
const mixes = ["3", "2", "1"].map(mix);
const p = (updatedAt: number, finished = false) => ({
  position: 50,
  duration: 100,
  updatedAt,
  finished,
});

describe("pickLastPlayed", () => {
  it("picks the stored last mix", () => assert.equal(pickLastPlayed(mixes, "2", {})?.number, "2"));
  it("falls back to the most recently played mix", () =>
    assert.equal(pickLastPlayed(mixes, null, { "1": p(5), "3": p(2) })?.number, "1"));
  it("ignores a stored number that is no longer in the list", () =>
    assert.equal(pickLastPlayed(mixes, "99", { "3": p(1) })?.number, "3"));
  it("returns null when nothing was played", () =>
    assert.equal(pickLastPlayed(mixes, null, {}), null));
});
