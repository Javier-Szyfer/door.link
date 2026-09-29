import { afterEach, describe, expect, it } from "bun:test";
import { isAdmin } from "./auth";

const ADMIN = "11111111-1111-1111-1111-111111111111";
const OTHER = "22222222-2222-2222-2222-222222222222";

describe("isAdmin", () => {
  afterEach(() => {
    process.env.ADMIN_UUIDS = undefined;
  });

  it("accepts a uuid present in ADMIN_UUIDS", () => {
    process.env.ADMIN_UUIDS = ADMIN;
    expect(isAdmin(ADMIN)).toBe(true);
  });

  it("accepts any uuid from a comma-separated list, ignoring surrounding spaces", () => {
    process.env.ADMIN_UUIDS = `${OTHER}, ${ADMIN}`;
    expect(isAdmin(ADMIN)).toBe(true);
    expect(isAdmin(OTHER)).toBe(true);
  });

  it("rejects a uuid that is not listed", () => {
    process.env.ADMIN_UUIDS = ADMIN;
    expect(isAdmin(OTHER)).toBe(false);
  });

  it("rejects everyone when ADMIN_UUIDS is unset", () => {
    process.env.ADMIN_UUIDS = undefined;
    expect(isAdmin(ADMIN)).toBe(false);
  });

  // Callers pass `user?.id ?? ""` for signed-out visitors. An empty or
  // whitespace-only ADMIN_UUIDS must never let that empty id through.
  it("rejects the empty uuid used as a fallback for signed-out callers", () => {
    process.env.ADMIN_UUIDS = ADMIN;
    expect(isAdmin("")).toBe(false);
  });

  it("rejects the empty uuid when ADMIN_UUIDS is empty or whitespace", () => {
    process.env.ADMIN_UUIDS = "";
    expect(isAdmin("")).toBe(false);

    process.env.ADMIN_UUIDS = " , ";
    expect(isAdmin("")).toBe(false);
  });
});
