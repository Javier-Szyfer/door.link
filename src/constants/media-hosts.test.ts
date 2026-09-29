import assert from "node:assert/strict";
import { beforeEach, describe, it } from "node:test";
import { isAllowedMediaUrl } from "./media-hosts.ts";

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
