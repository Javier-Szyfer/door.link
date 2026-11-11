import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { homeReady, parseHomeView } from "./home-view.ts";

describe("parseHomeView", () => {
  it("reads a stored list view", () => assert.equal(parseHomeView("list"), "list"));
  it("falls back to the grid", () => {
    assert.equal(parseHomeView(null), "grid");
    assert.equal(parseHomeView("tiles"), "grid");
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
