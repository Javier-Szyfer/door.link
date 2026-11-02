import { createHash, createHmac, randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

const scryptAsync = promisify(scrypt) as (
  password: string,
  salt: Buffer,
  keylen: number,
) => Promise<Buffer>;

const KEY_LENGTH = 64;
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;

const safeEqual = (a: Buffer, b: Buffer) => a.length === b.length && timingSafeEqual(a, b);

// Hashes a password as "salt:hash", both hex.
export const hashPassword = async (password: string) => {
  const salt = randomBytes(16);
  const hash = await scryptAsync(password, salt, KEY_LENGTH);
  return `${salt.toString("hex")}:${hash.toString("hex")}`;
};

// Checks a password against a hash made by hashPassword.
export const verifyPassword = async (password: string, stored: string | undefined) => {
  const [saltHex, hashHex] = stored?.split(":") ?? [];
  if (!password || !saltHex || !hashHex) return false;

  const expected = Buffer.from(hashHex, "hex");
  const actual = await scryptAsync(password, Buffer.from(saltHex, "hex"), expected.length);
  return safeEqual(actual, expected);
};

// Key that signs session tokens; changing either input invalidates every existing token.
export const getSessionSigningKey = (
  sessionSecret: string | undefined,
  passwordHash: string | undefined,
) => {
  if (!sessionSecret || !passwordHash) return undefined;
  return createHash("sha256").update(sessionSecret).update("\0").update(passwordHash).digest("hex");
};

const sign = (payload: string, secret: string) =>
  createHmac("sha256", secret).update(payload).digest("base64url");

// Creates a session token "expiresAt.signature" valid until `now + maxAge`.
export const createSessionToken = (
  secret: string,
  now = Date.now(),
  maxAgeSeconds = SESSION_MAX_AGE_SECONDS,
) => {
  const expiresAt = String(now + maxAgeSeconds * 1000);
  return `${expiresAt}.${sign(expiresAt, secret)}`;
};

// Checks a session token's signature and expiry.
export const verifySessionToken = (
  token: string | undefined,
  secret: string | undefined,
  now = Date.now(),
) => {
  if (!token || !secret) return false;

  const [expiresAt, signature, ...rest] = token.split(".");
  if (!expiresAt || !signature || rest.length > 0) return false;
  if (!safeEqual(Buffer.from(signature), Buffer.from(sign(expiresAt, secret)))) return false;

  return Number(expiresAt) > now;
};
