import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

// Every export of a "use server" file is a POST endpoint any client can call, so
// each one has to authorize for itself. This guards the class of bug where a new
// action is added and the check is left to the page that happens to call it.
const source = readFileSync(new URL("./mixtapes.ts", import.meta.url), "utf8");

const actions = [...source.matchAll(/^export const (\w+) = async[\s\S]*?^};$/gm)];

describe("mixtape server actions", () => {
  it("is a file of server actions", () => {
    assert.match(source, /^"use server";/);
    assert.ok(actions.length >= 5, `expected to find the actions, found ${actions.length}`);
  });

  for (const [body, name] of actions) {
    it(`${name} authorizes the caller`, () => {
      assert.ok(body.includes("await getAdminClient()"), `${name} does not call getAdminClient`);
    });
  }
});
