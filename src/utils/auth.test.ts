import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  createSessionToken,
  getSessionSigningKey,
  hashPassword,
  verifyPassword,
  verifySessionToken,
} from "./auth.ts";

const SECRET = "test-secret";
const NOW = 1_800_000_000_000;

describe("verifyPassword", () => {
  it("accepts the password that was hashed", async () => {
    const hash = await hashPassword("correct horse battery staple");
    assert.equal(await verifyPassword("correct horse battery staple", hash), true);
  });

  it("rejects a different password", async () => {
    const hash = await hashPassword("correct horse battery staple");
    assert.equal(await verifyPassword("correct horse battery stapler", hash), false);
  });

  it("salts each hash", async () => {
    assert.notEqual(await hashPassword("same"), await hashPassword("same"));
  });

  it("rejects everyone when no hash is configured or it is malformed", async () => {
    assert.equal(await verifyPassword("anything", undefined), false);
    assert.equal(await verifyPassword("anything", ""), false);
    assert.equal(await verifyPassword("anything", "not-a-hash"), false);
  });

  it("rejects an empty password", async () => {
    assert.equal(await verifyPassword("", await hashPassword("")), false);
  });
});

describe("verifySessionToken", () => {
  it("accepts a fresh token signed with the same secret", () => {
    assert.equal(verifySessionToken(createSessionToken(SECRET, NOW), SECRET, NOW + 1000), true);
  });

  it("rejects an expired token", () => {
    const token = createSessionToken(SECRET, NOW, 60);
    assert.equal(verifySessionToken(token, SECRET, NOW + 61_000), false);
  });

  it("rejects a token signed with another secret", () => {
    assert.equal(verifySessionToken(createSessionToken("other", NOW), SECRET, NOW), false);
  });

  it("rejects a token whose expiry was tampered with", () => {
    const [, signature] = createSessionToken(SECRET, NOW, 60).split(".");
    assert.equal(verifySessionToken(`${NOW + 10 ** 12}.${signature}`, SECRET, NOW), false);
  });

  it("rejects missing tokens, missing secrets and malformed tokens", () => {
    const token = createSessionToken(SECRET, NOW);
    assert.equal(verifySessionToken(undefined, SECRET, NOW), false);
    assert.equal(verifySessionToken(token, undefined, NOW), false);
    assert.equal(verifySessionToken(token, "", NOW), false);
    assert.equal(verifySessionToken("garbage", SECRET, NOW), false);
    assert.equal(verifySessionToken(`${token}.extra`, SECRET, NOW), false);
  });
});

describe("getSessionSigningKey", () => {
  it("changes when the password hash or the secret changes", () => {
    const key = getSessionSigningKey("secret", "salt:hash");
    assert.equal(key, getSessionSigningKey("secret", "salt:hash"));
    assert.notEqual(key, getSessionSigningKey("secret", "salt:other"));
    assert.notEqual(key, getSessionSigningKey("other", "salt:hash"));
  });

  it("is undefined when either input is missing", () => {
    assert.equal(getSessionSigningKey(undefined, "salt:hash"), undefined);
    assert.equal(getSessionSigningKey("secret", ""), undefined);
  });
});
