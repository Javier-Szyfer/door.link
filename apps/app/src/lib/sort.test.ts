import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { Mix } from "./mix.ts";
import { parseSortOrder, sortMixes } from "./sort.ts";

const mix = (number: string): Mix => ({
  number,
  title: number,
  description: "",
  publishedAt: "",
  audioUrl: "",
  artworkUrl: null,
  durationSeconds: null,
});

const mixes = ["9", "100", "10"].map(mix);
const numbers = (result: Mix[]) => result.map((m) => m.number);

describe("sortMixes", () => {
  it("orders newest first numerically", () =>
    assert.deepEqual(numbers(sortMixes(mixes, "newest", {})), ["100", "10", "9"]));
  it("orders oldest first numerically", () =>
    assert.deepEqual(numbers(sortMixes(mixes, "oldest", {})), ["9", "10", "100"]));
  it("puts mixes without progress first, newest first within each group", () => {
    const progress = { "100": { position: 50, duration: 100, updatedAt: 1, finished: false } };
    assert.deepEqual(numbers(sortMixes(mixes, "unplayed", progress)), ["10", "9", "100"]);
  });
  it("does not mutate the input", () => {
    sortMixes(mixes, "oldest", {});
    assert.deepEqual(numbers(mixes), ["9", "100", "10"]);
  });
});

it("parseSortOrder keeps known orders and falls back to newest", () => {
  assert.equal(parseSortOrder("oldest"), "oldest");
  assert.equal(parseSortOrder("unplayed"), "unplayed");
  assert.equal(parseSortOrder("newest"), "newest");
  assert.equal(parseSortOrder("nonsense"), "newest");
  assert.equal(parseSortOrder(null), "newest");
});
