import assert from "node:assert/strict";
import { beforeEach, describe, it } from "node:test";
import { getDownloadUrl, isAllowedMediaUrl } from "./media-hosts.ts";

const SUPABASE_URL = "https://project-ref.supabase.co";
const LEGACY_HOST = "radio-strapi-bucket.s3.sa-east-1.amazonaws.com";

describe("isAllowedMediaUrl", () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = SUPABASE_URL;
  });

  it("accepts audio served from Supabase Storage", () => {
    assert.equal(isAllowedMediaUrl(`${SUPABASE_URL}/storage/v1/object/public/media/mix.mp3`), true);
  });

  it("accepts audio served from the legacy S3 bucket", () => {
    assert.equal(isAllowedMediaUrl(`https://${LEGACY_HOST}/mix.mp3`), true);
  });

  it("rejects arbitrary external hosts", () => {
    assert.equal(isAllowedMediaUrl("https://example.com/mix.mp3"), false);
  });

  it("rejects cloud metadata and private network addresses", () => {
    assert.equal(isAllowedMediaUrl("https://169.254.169.254/latest/meta-data/"), false);
    assert.equal(isAllowedMediaUrl("https://10.0.0.1/internal"), false);
    assert.equal(isAllowedMediaUrl("https://[::1]/internal"), false);
    assert.equal(isAllowedMediaUrl("http://localhost/mix.mp3"), false);
  });

  it("rejects non-https schemes even on an allowed host", () => {
    assert.equal(isAllowedMediaUrl(`http://${LEGACY_HOST}/mix.mp3`), false);
    assert.equal(isAllowedMediaUrl("file:///etc/passwd"), false);
  });

  it("rejects a host that merely embeds an allowed one", () => {
    assert.equal(isAllowedMediaUrl(`https://${LEGACY_HOST}.evil.com/mix.mp3`), false);
    assert.equal(isAllowedMediaUrl("https://evil.com/?x=project-ref.supabase.co"), false);
  });

  it("rejects malformed input", () => {
    assert.equal(isAllowedMediaUrl("not a url"), false);
    assert.equal(isAllowedMediaUrl(""), false);
  });
});

describe("getDownloadUrl", () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = SUPABASE_URL;
  });

  it("points Supabase-hosted audio straight at the CDN", () => {
    const url = new URL(
      getDownloadUrl(`${SUPABASE_URL}/storage/v1/object/public/media/audio/m.mp3`, "208 - T.mp3"),
    );
    assert.equal(url.origin, SUPABASE_URL);
    assert.equal(url.searchParams.get("download"), "208 - T.mp3");
  });

  it("preserves an existing query on the Supabase url", () => {
    const url = new URL(getDownloadUrl(`${SUPABASE_URL}/storage/v1/object/public/a.mp3?t=1`, "a"));
    assert.equal(url.searchParams.get("t"), "1");
  });

  it("routes legacy S3 audio through the proxy, which S3 cannot replace", () => {
    const legacy = `https://${LEGACY_HOST}/Door_151.mp3`;
    const url = getDownloadUrl(legacy, "151 - T.mp3");
    assert.ok(url.startsWith("/api/download?"));
    const params = new URLSearchParams(url.split("?")[1]);
    assert.equal(params.get("url"), legacy);
    assert.equal(params.get("filename"), "151 - T.mp3");
  });

  it("routes anything unrecognised through the proxy, which validates it", () => {
    assert.ok(getDownloadUrl("https://evil.com/x.mp3", "x.mp3").startsWith("/api/download?"));
  });
});
