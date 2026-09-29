import { beforeEach, describe, expect, it } from "bun:test";
import { isAllowedMediaUrl } from "./media-hosts";

const SUPABASE_URL = "https://project-ref.supabase.co";
const LEGACY_HOST = "radio-strapi-bucket.s3.sa-east-1.amazonaws.com";

describe("isAllowedMediaUrl", () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = SUPABASE_URL;
  });

  it("accepts audio served from Supabase Storage", () => {
    expect(isAllowedMediaUrl(`${SUPABASE_URL}/storage/v1/object/public/media/audio/mix.mp3`)).toBe(
      true,
    );
  });

  it("accepts audio served from the legacy S3 bucket", () => {
    expect(isAllowedMediaUrl(`https://${LEGACY_HOST}/mix.mp3`)).toBe(true);
  });

  it("rejects arbitrary external hosts", () => {
    expect(isAllowedMediaUrl("https://example.com/mix.mp3")).toBe(false);
  });

  it("rejects cloud metadata and private network addresses", () => {
    expect(isAllowedMediaUrl("https://169.254.169.254/latest/meta-data/")).toBe(false);
    expect(isAllowedMediaUrl("https://10.0.0.1/internal")).toBe(false);
    expect(isAllowedMediaUrl("https://[::1]/internal")).toBe(false);
    expect(isAllowedMediaUrl("http://localhost/mix.mp3")).toBe(false);
  });

  it("rejects non-https schemes even on an allowed host", () => {
    expect(isAllowedMediaUrl(`http://${LEGACY_HOST}/mix.mp3`)).toBe(false);
    expect(isAllowedMediaUrl("file:///etc/passwd")).toBe(false);
  });

  it("rejects a host that merely embeds an allowed one", () => {
    expect(isAllowedMediaUrl(`https://${LEGACY_HOST}.evil.com/mix.mp3`)).toBe(false);
    expect(isAllowedMediaUrl("https://evil.com/?x=project-ref.supabase.co")).toBe(false);
  });

  it("rejects malformed input", () => {
    expect(isAllowedMediaUrl("not a url")).toBe(false);
    expect(isAllowedMediaUrl("")).toBe(false);
  });
});
