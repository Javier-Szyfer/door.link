import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { parseDurationSeconds } from "./duration.ts";

describe("parseDurationSeconds", () => {
  it("reads minutes:seconds", () => assert.equal(parseDurationSeconds("45:12"), 2712));
  it("reads hours:minutes:seconds", () => assert.equal(parseDurationSeconds("1:02:03"), 3723));
  it("reads '45 min'", () => assert.equal(parseDurationSeconds("45 min"), 2700));
  it("reads a bare number as minutes", () => assert.equal(parseDurationSeconds("45"), 2700));
  it("returns null for empty", () => assert.equal(parseDurationSeconds(""), null));
  it("returns null for garbage", () => assert.equal(parseDurationSeconds("abc"), null));
});
