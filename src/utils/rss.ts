import { Feed } from "feed";

// CONSTANTS
import { baseUrl } from "@/constants/urls";

// TYPES
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
			return "audio/mpeg"; // fallback to mp3 if unknown
	}
}

export function generateRssFeed(mixtapes: Mixtape[]) {
	const feed = new Feed({
		title: "door.link",
		description: "Latest mixtapes from door.link",
		id: baseUrl,
		link: baseUrl,
		language: "en",
		favicon: `${baseUrl}/favicon.ico`,
		image: `${baseUrl}/android-chrome-256x256.png`,
		copyright: `All rights reserved ${new Date().getFullYear()}`,
		updated:
			mixtapes.length > 0 ? new Date(mixtapes[0].created_at) : new Date(),
		generator: "Door RSS Feed",
		feedLinks: {
			rss2: `${baseUrl}/rss.xml`,
		},
		author: {
			name: "door.link",
			link: baseUrl,
		},
	});

	for (const mixtape of mixtapes) {
		feed.addItem({
			title: `${mixtape.number} - ${mixtape.title}`,
			id: `${baseUrl}/mixtapes/${mixtape.number}`,
			link: `${baseUrl}/mixtapes/${mixtape.number}`,
			description: mixtape.description,
			date: new Date(mixtape.created_at),
			image: mixtape.artwork_uri,
			enclosure: {
				url: mixtape.audio_uri,
				type: getAudioMimeType(mixtape.audio_uri),
				length: 0, // Optional: You could add file size here if available
			},
		});
	}

	return feed.rss2();
}
