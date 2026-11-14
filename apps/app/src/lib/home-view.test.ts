import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { homeReady, parseHomeView } from "./home-view.ts";

describe("parseHomeView", () => {
  it("reads a stored grid view", () => assert.equal(parseHomeView("grid"), "grid"));
  it("falls back to the list", () => {
    assert.equal(parseHomeView(null), "list");
    assert.equal(parseHomeView("tiles"), "list");
  });
});

describe("homeReady", () => {
  it("waits for the listener's progress before showing mixes", () => {
    assert.equal(homeReady({ libraryLoaded: false, loading: false, mixCount: 10 }), false);
  });
  it("shows cached mixes while the fresh list loads", () => {
    assert.equal(homeReady({ libraryLoaded: true, loading: true, mixCount: 10 }), true);
  });
  it("waits while there is nothing to show yet", () => {
    assert.equal(homeReady({ libraryLoaded: true, loading: true, mixCount: 0 }), false);
  });
  it("is ready once loading ends, even with no mixes", () => {
    assert.equal(homeReady({ libraryLoaded: true, loading: false, mixCount: 0 }), true);
  });
});
