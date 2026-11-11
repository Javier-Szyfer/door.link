import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { nextMinimized } from "./chrome-scroll.ts";

describe("nextMinimized", () => {
  it("compacts when scrolling down past the top", () =>
    assert.equal(nextMinimized(false, 100, 140), true));
  it("ignores tiny movements", () => assert.equal(nextMinimized(false, 100, 103), false));
  it("stays compact when scrolling up mid-list", () =>
    assert.equal(nextMinimized(true, 400, 300), true));
  it("expands back at the top", () => assert.equal(nextMinimized(true, 40, 10), false));
  it("does not compact near the top", () => assert.equal(nextMinimized(false, 10, 40), false));
});
