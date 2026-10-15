import { Feed } from "feed";
import { SITE_URL } from "@/constants/urls";
import type { Database } from "@/types/database.types";

type Mixtape = Database["public"]["Tables"]["mixtapes"]["Row"];

function getAudioMimeType(url: string): string {
  const extension = url.split(".").pop()?.toLowerCase();
  switch (extension) {
    case "mp3":
      return "audio/mpeg";
    case "m4a":
      return "audio/mp4";
    case "wav":
      return "audio/wav";
    case "ogg":
      return "audio/ogg";
    case "aac":
      return "audio/aac";
    case "flac":
      return "audio/flac";
    default:
      return "audio/mpeg";
  }
}

export function generateRssFeed(mixtapes: Mixtape[]) {
  const feed = new Feed({
    title: "door.link",
    description: "Latest mixtapes from door.link",
    id: SITE_URL,
    link: SITE_URL,
    language: "en",
    favicon: `${SITE_URL}/favicon.ico`,
    image: `${SITE_URL}/android-chrome-256x256.png`,
    copyright: `All rights reserved ${new Date().getFullYear()}`,
    updated: mixtapes.length > 0 ? new Date(mixtapes[0].created_at) : new Date(),
    generator: "Door RSS Feed",
    feedLinks: {
      rss2: `${SITE_URL}/rss.xml`,
    },
    author: {
      name: "door.link",
      link: SITE_URL,
    },
  });

  for (const mixtape of mixtapes) {
    feed.addItem({
      title: `${mixtape.number} - ${mixtape.title}`,
      link: `${SITE_URL}/mixtapes/${mixtape.number}`,
      description: mixtape.description,
      date: new Date(mixtape.created_at),
      enclosure: {
        url: mixtape.audio_uri,
        type: getAudioMimeType(mixtape.audio_uri),
        length: 0,
      },
    });
  }

  let rssOutput = feed.rss2();

  rssOutput = rssOutput.replace(
    '<rss version="2.0">',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
  );

  rssOutput = rssOutput.replace(
    "<channel>",
    `<channel>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml" />`,
  );

  return rssOutput;
}
