import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { REFRESH_AFTER_MS, shouldRefresh } from "./refresh.ts";

describe("shouldRefresh", () => {
  it("refreshes when the list has never loaded", () =>
    assert.equal(shouldRefresh(null, 1000), true));
  it("skips a refresh right after the last one", () =>
    assert.equal(shouldRefresh(1000, 1000 + REFRESH_AFTER_MS - 1), false));
  it("refreshes once enough time has passed", () =>
    assert.equal(shouldRefresh(1000, 1000 + REFRESH_AFTER_MS), true));
});
