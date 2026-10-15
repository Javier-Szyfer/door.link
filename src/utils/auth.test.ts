import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";
import { isAdmin } from "./auth.ts";

const ADMIN = "11111111-1111-1111-1111-111111111111";
const OTHER = "22222222-2222-2222-2222-222222222222";

describe("isAdmin", () => {
  afterEach(() => {
    delete process.env.ADMIN_UUIDS;
  });

  it("accepts a uuid present in ADMIN_UUIDS", () => {
    process.env.ADMIN_UUIDS = ADMIN;
    assert.equal(isAdmin(ADMIN), true);
  });

  it("accepts any uuid from a comma-separated list, ignoring surrounding spaces", () => {
    process.env.ADMIN_UUIDS = `${OTHER}, ${ADMIN}`;
    assert.equal(isAdmin(ADMIN), true);
    assert.equal(isAdmin(OTHER), true);
  });

  it("rejects a uuid that is not listed", () => {
    process.env.ADMIN_UUIDS = ADMIN;
    assert.equal(isAdmin(OTHER), false);
  });

  it("rejects everyone when ADMIN_UUIDS is unset", () => {
    delete process.env.ADMIN_UUIDS;
    assert.equal(isAdmin(ADMIN), false);
  });

  // Callers pass `user?.id ?? ""` for signed-out visitors. An empty or
  // whitespace-only ADMIN_UUIDS must never let that empty id through.
  it("rejects the empty uuid used as a fallback for signed-out callers", () => {
    process.env.ADMIN_UUIDS = ADMIN;
    assert.equal(isAdmin(""), false);
  });

  it("rejects the empty uuid when ADMIN_UUIDS is empty or whitespace", () => {
    process.env.ADMIN_UUIDS = "";
    assert.equal(isAdmin(""), false);

    process.env.ADMIN_UUIDS = " , ";
    assert.equal(isAdmin(""), false);
  });
});
