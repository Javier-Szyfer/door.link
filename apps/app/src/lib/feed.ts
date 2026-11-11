import { XMLParser } from "fast-xml-parser";
import type { Mix } from "./mix.ts";

type RawItem = {
  title?: unknown;
  link?: unknown;
  pubDate?: unknown;
  description?: unknown;
  enclosure?: { "@_url"?: string };
  "itunes:duration"?: unknown;
  "itunes:image"?: { "@_href"?: string };
};

const parser = new XMLParser({
  ignoreAttributes: false,
  parseTagValue: false,
  isArray: (name) => name === "item",
});

const text = (value: unknown) => (value == null ? "" : String(value).trim());

// Converts an itunes:duration ("2712" seconds, "45:12", "1:02:03") to seconds, or null.
const parseItunesDuration = (value: unknown): number | null => {
  const raw = text(value);
  if (/^\d+$/.test(raw)) return Number(raw);
  if (!/^\d+(?::\d{1,2}){1,2}$/.test(raw)) return null;
  return raw.split(":").reduce((total, part) => total * 60 + Number(part), 0);
};

const toMix = (item: RawItem): Mix | null => {
  const link = text(item.link);
  const audioUrl = item.enclosure?.["@_url"];
  const number = link.match(/\/mixtapes\/([^/?#]+)/)?.[1];
  if (!number || !audioUrl) return null;

  const fullTitle = text(item.title);
  const separator = fullTitle.indexOf(" - ");
  const date = new Date(text(item.pubDate));

  return {
    number: decodeURIComponent(number),
    title: separator === -1 ? fullTitle : fullTitle.slice(separator + 3),
    description: text(item.description),
    publishedAt: Number.isNaN(date.getTime()) ? "" : date.toISOString(),
    audioUrl,
    artworkUrl: item["itunes:image"]?.["@_href"] ?? null,
    durationSeconds: parseItunesDuration(item["itunes:duration"]),
  };
};

// Parses the door.link RSS into mixes, newest number first.
export function parseFeed(xml: string): Mix[] {
  const items: RawItem[] = parser.parse(xml)?.rss?.channel?.item ?? [];
  return items
    .map(toMix)
    .filter((mix): mix is Mix => mix !== null)
    .sort((a, b) => b.number.localeCompare(a.number, undefined, { numeric: true }));
}
