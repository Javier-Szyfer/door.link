import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { HAS_RESUME_KEY, startupLayoutScript } from "./startup-layout.ts";

// Runs the script against a fake page and returns what it marked on the document.
const run = (stored: Record<string, string>, storage = true) => {
  const dataset: Record<string, string> = {};
  const localStorage = storage
    ? { getItem: (key: string) => stored[key] ?? null }
    : {
        getItem: () => {
          throw new Error("blocked");
        },
      };
  new Function("document", "localStorage", startupLayoutScript)(
    { documentElement: { dataset } },
    localStorage,
  );
  return dataset;
};

describe("startupLayoutScript", () => {
  it("marks a stored list view", () => assert.equal(run({ "door:view": "list" }).view, "list"));
  it("leaves the grid unmarked", () => assert.equal(run({}).view, undefined));
  it("marks a pending continue listening row", () =>
    assert.equal(run({ [HAS_RESUME_KEY]: "1" }).resume, "1"));
  it("leaves no row unmarked", () => assert.equal(run({}).resume, undefined));
  it("survives blocked storage", () => assert.deepEqual(run({}, false), {}));
});
