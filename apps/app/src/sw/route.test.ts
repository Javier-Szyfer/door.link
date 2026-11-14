import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { MEDIA_ORIGIN } from "./caches.ts";
import { serveFromDownloads } from "./route.ts";

const mp3 = `${MEDIA_ORIGIN}/audio/door-214.mp3`;

describe("serveFromDownloads", () => {
  it("leaves non-downloaded media to the browser once the list is known", () =>
    assert.equal(serveFromDownloads(mp3, new Set()), false));
  it("serves downloaded media", () => assert.equal(serveFromDownloads(mp3, new Set([mp3])), true));
  it("checks the cache for media while the list is still loading", () =>
    assert.equal(serveFromDownloads(mp3, null), true));
  it("never touches other origins", () => {
    assert.equal(serveFromDownloads("https://fonts.example/a.woff2", null), false);
    assert.equal(
      serveFromDownloads(
        "https://fonts.example/a.woff2",
        new Set(["https://fonts.example/a.woff2"]),
      ),
      false,
    );
  });
});
