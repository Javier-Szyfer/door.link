import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { Mixtape } from "../types/mixtape.ts";
import { generateRssFeed } from "./rss.ts";

const mixtape = (number: string, duration: string): Mixtape => ({
  id: Number(number),
  number,
  title: `Mix ${number}`,
  description: "",
  duration,
  created_at: "2026-01-01",
  audio_uri: `https://media.example/${number}.mp3`,
  artwork_uri: `https://media.example/${number}.jpg`,
  status: "published",
});

const items = (xml: string) => xml.split("<item>").slice(1);

describe("generateRssFeed", () => {
  const xml = generateRssFeed([mixtape("2", "45:12"), mixtape("1", "")]);
  const [withDuration, withoutDuration] = items(xml);

  it("declares the itunes namespace", () => assert.match(xml, /xmlns:itunes=/));

  it("adds the artwork as itunes:image", () =>
    assert.match(withDuration, /<itunes:image href="https:\/\/media\.example\/2\.jpg"\/>/));

  it("adds itunes:duration when the duration parses", () =>
    assert.match(withDuration, /<itunes:duration>45:12<\/itunes:duration>/));

  it("omits itunes:duration when the duration is empty", () =>
    assert.doesNotMatch(withoutDuration, /itunes:duration/));

  it("keeps one audio enclosure per item", () => {
    assert.equal(withDuration.match(/<enclosure/g)?.length, 1);
    assert.match(withDuration, /<enclosure[^>]*url="https:\/\/media\.example\/2\.mp3"/);
  });
});
