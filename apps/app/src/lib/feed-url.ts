// The RSS feed of mixes. FEED_URL points it elsewhere (e.g. apps/web locally).
const DEFAULT_FEED_URL = "https://www.door.link/rss.xml";

export function feedUrl(env: Record<string, string | undefined> = process.env): string {
  return env.FEED_URL || DEFAULT_FEED_URL;
}
