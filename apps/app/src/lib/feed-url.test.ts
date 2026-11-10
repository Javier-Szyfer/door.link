import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { feedUrl } from "./feed-url.ts";

describe("feedUrl", () => {
  it("defaults to the door.link feed", () => {
    assert.equal(feedUrl({}), "https://www.door.link/rss.xml");
  });

  it("uses FEED_URL when set", () => {
    assert.equal(
      feedUrl({ FEED_URL: "http://localhost:3001/rss.xml" }),
      "http://localhost:3001/rss.xml",
    );
  });

  it("ignores an empty FEED_URL", () => {
    assert.equal(feedUrl({ FEED_URL: "" }), "https://www.door.link/rss.xml");
  });
});
