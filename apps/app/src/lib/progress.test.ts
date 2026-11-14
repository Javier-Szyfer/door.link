import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { Mix } from "./mix.ts";
import { continueListening, isFinished, minutesLeft } from "./progress.ts";
import type { Progress } from "./storage.ts";

const mix = (number: string): Mix => ({
  number,
  title: number,
  description: "",
  publishedAt: "",
  audioUrl: "",
  artworkUrl: null,
  durationSeconds: 2712,
});

const progress = (position: number, updatedAt: number, finished = false): Progress => ({
  position,
  duration: 2712,
  updatedAt,
  finished,
});

describe("isFinished", () => {
  it("is true within the last minute", () => assert.equal(isFinished(2700, 2712), true));
  it("is false mid-mix", () => assert.equal(isFinished(100, 2712), false));
  it("is false with unknown duration", () => assert.equal(isFinished(5000, null), false));
});

describe("minutesLeft", () => {
  it("rounds up the remaining minutes", () =>
    assert.equal(minutesLeft(progress(2712 - 125, 0)), 3));
  it("never goes below zero", () => assert.equal(minutesLeft(progress(3000, 0)), 0));
  it("is null with unknown duration", () =>
    assert.equal(minutesLeft({ ...progress(10, 0), duration: null }), null));
});

describe("continueListening", () => {
  const mixes = ["1", "2", "3", "4"].map(mix);

  it("keeps started, unfinished mixes, most recent first", () => {
    const result = continueListening(mixes, {
      "1": progress(100, 1),
      "2": progress(200, 3),
      "3": progress(2705, 5, true),
      "4": progress(10, 9),
    });
    assert.deepEqual(
      result.map((m) => m.number),
      ["2", "1"],
    );
  });

  it("ignores progress for mixes not in the list", () =>
    assert.deepEqual(continueListening(mixes, { "99": progress(100, 1) }), []));

  it("caps the list at 10", () => {
    const many = Array.from({ length: 15 }, (_, i) => mix(String(i)));
    const map = Object.fromEntries(many.map((m, i) => [m.number, progress(100, i)]));
    assert.equal(continueListening(many, map).length, 10);
  });
});
