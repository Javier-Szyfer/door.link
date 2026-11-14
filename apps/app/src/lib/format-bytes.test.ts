import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { formatBytes } from "./format-bytes.ts";

describe("formatBytes", () => {
  it("formats megabytes", () => assert.equal(formatBytes(96014007), "96 MB"));
  it("formats gigabytes", () => assert.equal(formatBytes(1_200_000_000), "1.2 GB"));
  it("formats zero", () => assert.equal(formatBytes(0), "0 MB"));
});
