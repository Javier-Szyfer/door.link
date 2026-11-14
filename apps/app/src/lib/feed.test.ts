import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { parseFeed } from "./feed.ts";

const xml = readFileSync(new URL("./fixtures/rss.xml", import.meta.url), "utf8");

describe("parseFeed", () => {
  const mixes = parseFeed(xml);
  const byNumber = Object.fromEntries(mixes.map((mix) => [mix.number, mix]));

  it("sorts newest number first", () =>
    assert.deepEqual(
      mixes.map((mix) => mix.number),
      ["214", "213", "212"],
    ));

  it("takes the number from the link and the title after the first ' - '", () => {
    assert.equal(byNumber["214"].title, "now more than ever... door...");
    assert.equal(byNumber["212"].title, "door 212 for Beams T");
  });

  it("keeps the whole title when there is no separator", () =>
    assert.equal(byNumber["213"].title, "in door we trust"));

  it("reads audio, artwork, date and description", () => {
    const mix = byNumber["214"];
    assert.equal(mix.audioUrl, "https://media.keyholemedia.store/audio/door-214.mp3");
    assert.equal(mix.artworkUrl, "https://media.keyholemedia.store/images/door-214.jpeg");
    assert.equal(mix.publishedAt, "2026-11-04T00:00:00.000Z");
    assert.equal(mix.description, "In moments of sudden clarity");
  });

  it("reads itunes:duration as seconds or h:mm:ss", () => {
    assert.equal(byNumber["214"].durationSeconds, 2712);
    assert.equal(byNumber["213"].durationSeconds, 2712);
  });

  it("uses null when artwork or duration are missing", () => {
    assert.equal(byNumber["212"].artworkUrl, null);
    assert.equal(byNumber["212"].durationSeconds, null);
  });

  it("returns an empty list for a feed with no items", () =>
    assert.deepEqual(parseFeed("<rss><channel><title>x</title></channel></rss>"), []));
});
