import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { parseRange, rangeResponse } from "./range.ts";

describe("parseRange", () => {
  it("open-ended", () => assert.deepEqual(parseRange("bytes=0-", 1000), { start: 0, end: 999 }));
  it("closed", () => assert.deepEqual(parseRange("bytes=100-199", 1000), { start: 100, end: 199 }));
  it("suffix", () => assert.deepEqual(parseRange("bytes=-100", 1000), { start: 900, end: 999 }));
  it("clamps the end", () =>
    assert.deepEqual(parseRange("bytes=900-5000", 1000), { start: 900, end: 999 }));
  it("start past the end is unsatisfiable", () =>
    assert.equal(parseRange("bytes=1000-", 1000), "unsatisfiable"));
  it("other units are ignored", () => assert.equal(parseRange("items=0-1", 1000), null));
  it("garbage is ignored", () => assert.equal(parseRange("bytes=abc", 1000), null));
});

describe("rangeResponse", () => {
  const blob = new Blob([new Uint8Array(1000)]);

  it("returns the whole file without a range", async () => {
    const response = rangeResponse(blob, null, "audio/mpeg");
    assert.equal(response.status, 200);
    assert.equal(response.headers.get("Accept-Ranges"), "bytes");
    assert.equal(response.headers.get("Content-Length"), "1000");
    assert.equal(response.headers.get("Content-Type"), "audio/mpeg");
  });

  it("returns 206 with the slice", async () => {
    const response = rangeResponse(blob, "bytes=100-199", "audio/mpeg");
    assert.equal(response.status, 206);
    assert.equal(response.headers.get("Content-Range"), "bytes 100-199/1000");
    assert.equal(response.headers.get("Content-Length"), "100");
    assert.equal((await response.arrayBuffer()).byteLength, 100);
  });

  it("returns 416 when unsatisfiable", () => {
    const response = rangeResponse(blob, "bytes=5000-", "audio/mpeg");
    assert.equal(response.status, 416);
    assert.equal(response.headers.get("Content-Range"), "bytes */1000");
  });
});
