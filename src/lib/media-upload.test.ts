import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  buildDownloadDisposition,
  buildMediaKey,
  findUnusedMediaUrls,
  isAllowedContentType,
  mediaKeyFromUrl,
} from "./media-upload.ts";

describe("buildMediaKey", () => {
  it("puts audio and artwork in their folders with a timestamp", () => {
    assert.equal(buildMediaKey("audio", "door 208.mp3", 123), "audio/123-door-208.mp3");
    assert.equal(buildMediaKey("artwork", "cover.jpg", 123), "images/123-cover.jpg");
  });

  it("strips characters that are unsafe in a URL path", () => {
    assert.equal(buildMediaKey("audio", "../ñandú?#mix.mp3", 1), "audio/1-..-nandu-mix.mp3");
  });

  it("falls back to a generic name when nothing safe is left", () => {
    assert.equal(buildMediaKey("artwork", "???", 1), "images/1-file");
  });
});

describe("buildDownloadDisposition", () => {
  it("names the download after the mixtape", () => {
    assert.equal(
      buildDownloadDisposition("208", "Día de sol", "upload.MP3"),
      "attachment; filename*=UTF-8''208-D%C3%ADa%20de%20sol.mp3",
    );
  });

  it("removes slashes from the title and defaults to mp3", () => {
    assert.equal(
      buildDownloadDisposition("1", "A/B", "noext"),
      "attachment; filename*=UTF-8''1-A-B.mp3",
    );
  });
});

describe("isAllowedContentType", () => {
  it("only accepts audio for audio and images for artwork", () => {
    assert.equal(isAllowedContentType("audio", "audio/mpeg"), true);
    assert.equal(isAllowedContentType("audio", "image/png"), false);
    assert.equal(isAllowedContentType("artwork", "image/jpeg"), true);
    assert.equal(isAllowedContentType("artwork", "text/html"), false);
  });
});

describe("mediaKeyFromUrl", () => {
  const base = "https://media.example.com";

  it("decodes the key of a media URL", () => {
    assert.equal(mediaKeyFromUrl(`${base}/audio/Door%20208.mp3`, base), "audio/Door 208.mp3");
    assert.equal(mediaKeyFromUrl(`${base}/images/a.jpg`, `${base}/`), "images/a.jpg");
  });

  it("ignores URLs from other hosts", () => {
    assert.equal(mediaKeyFromUrl("https://media.example.com.evil.io/a.mp3", base), null);
    assert.equal(mediaKeyFromUrl("https://bucket.s3.amazonaws.com/a.mp3", base), null);
    assert.equal(mediaKeyFromUrl(`${base}/`, base), null);
  });
});

describe("findUnusedMediaUrls", () => {
  it("keeps only URLs no remaining mixtape uses", () => {
    const remaining = [{ audio_uri: "a2", artwork_uri: "shared.jpg" }];
    assert.deepEqual(findUnusedMediaUrls(["a1", "shared.jpg", "a1", ""], remaining), ["a1"]);
  });
});
