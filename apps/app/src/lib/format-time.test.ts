import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { formatMinutes, formatTime } from "./format-time.ts";

describe("formatTime", () => {
  it("pads seconds", () => assert.equal(formatTime(5), "0:05"));
  it("formats minutes", () => assert.equal(formatTime(2712), "45:12"));
  it("formats hours", () => assert.equal(formatTime(3723), "1:02:03"));
  it("floors fractions", () => assert.equal(formatTime(59.9), "0:59"));
  it("treats NaN and negatives as zero", () => {
    assert.equal(formatTime(Number.NaN), "0:00");
    assert.equal(formatTime(-3), "0:00");
  });
});

describe("formatMinutes", () => {
  it("rounds to whole minutes", () => {
    assert.equal(formatMinutes(2712), "45 min");
    assert.equal(formatMinutes(2730), "46 min");
  });
});
