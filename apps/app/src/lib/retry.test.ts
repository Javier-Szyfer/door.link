import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { retryWithDelays } from "./retry.ts";

const noWait = async () => {};

describe("retryWithDelays", () => {
  it("stops at the first success", async () => {
    let attempts = 0;
    const done = await retryWithDelays(async () => ++attempts === 2, [1, 2, 3], noWait);
    assert.equal(done, true);
    assert.equal(attempts, 2);
  });

  it("gives up when the delays run out", async () => {
    let attempts = 0;
    const done = await retryWithDelays(
      async () => {
        attempts++;
        return false;
      },
      [1, 2],
      noWait,
    );
    assert.equal(done, false);
    assert.equal(attempts, 3);
  });

  it("waits each delay in order", async () => {
    const waited: number[] = [];
    await retryWithDelays(
      async () => false,
      [5, 7],
      async (ms) => {
        waited.push(ms);
      },
    );
    assert.deepEqual(waited, [5, 7]);
  });
});
