import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { PULL_THRESHOLD_PX, pullProgress } from "./pull.ts";

describe("pullProgress", () => {
  it("is zero while scrolled into the content", () =>
    assert.deepEqual(pullProgress(120), { fraction: 0, armed: false }));
  it("grows with the overscroll at the top", () =>
    assert.deepEqual(pullProgress(-PULL_THRESHOLD_PX / 2), { fraction: 0.5, armed: false }));
  it("arms at the threshold and caps the fraction", () => {
    assert.deepEqual(pullProgress(-PULL_THRESHOLD_PX), { fraction: 1, armed: true });
    assert.deepEqual(pullProgress(-PULL_THRESHOLD_PX * 2), { fraction: 1, armed: true });
  });
});
