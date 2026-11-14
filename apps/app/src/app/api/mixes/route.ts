import { parseFeed } from "@/lib/feed";
import { feedUrl } from "@/lib/feed-url";

export async function GET() {
  try {
    const response = await fetch(feedUrl(), { next: { revalidate: 300 } });
    if (!response.ok) throw new Error(`Feed responded ${response.status}`);
    const mixes = parseFeed(await response.text());

    return Response.json(
      { mixes },
      { headers: { "Cache-Control": "s-maxage=300, stale-while-revalidate=3600" } },
    );
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Could not load the door.link feed" }, { status: 502 });
  }
}
