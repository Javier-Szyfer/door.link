// UTILS
import { generateRssFeed } from "@/utils/rss";

// ACTIONS
import { getPublishedMixtapes } from "@/actions/mixtapes";

export async function GET() {
	const { mixtapes, error } = await getPublishedMixtapes();

	if (error || !mixtapes) {
		return new Response("Error generating RSS feed", { status: 500 });
	}

	const rss = generateRssFeed(mixtapes);

	return new Response(rss, {
		headers: {
			"Content-Type": "application/xml;charset=utf-8",
			"Cache-Control": "s-maxage=3600, stale-while-revalidate",
		},
	});
}
