import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { isInterruption, RESUME_WINDOW_MS, shouldResume } from "./interruption.ts";

describe("isInterruption", () => {
  const pause = { byListener: false, ended: false, hidden: true };
  it("counts a pause nobody asked for while the app is away", () =>
    assert.equal(isInterruption(pause), true));
  it("ignores the listener's own pause", () =>
    assert.equal(isInterruption({ ...pause, byListener: true }), false));
  it("ignores the end of a mix", () =>
    assert.equal(isInterruption({ ...pause, ended: true }), false));
  it("ignores a pause with the app on screen", () =>
    assert.equal(isInterruption({ ...pause, hidden: false }), false));
});

describe("shouldResume", () => {
  it("resumes soon after an interruption", () => assert.equal(shouldResume(1000, 2000), true));
  it("resumes right at the end of the window", () =>
    assert.equal(shouldResume(0, RESUME_WINDOW_MS), true));
  it("stays paused once the window has passed", () =>
    assert.equal(shouldResume(0, RESUME_WINDOW_MS + 1), false));
  it("stays paused with no interruption", () => assert.equal(shouldResume(null, 2000), false));
});
