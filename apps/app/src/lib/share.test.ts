import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { mixUrl } from "./share.ts";

describe("mixUrl", () => {
  it("links to the mix page on door.link", () => {
    assert.equal(mixUrl("214"), "https://door.link/mixtapes/214");
  });
});
