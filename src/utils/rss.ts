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
	// Debug what's in the mixtapes data

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
			id: `${baseUrl}/mixtapes/${mixtape.number}`, // Use the mixtape URL as the guid (valid permalink)
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

	// Get the RSS output
	let rssOutput = feed.rss2();

	// Debug the output to see what's happening with enclosures
	const enclosureMatch = rssOutput.match(/<enclosure.*?>/g);

	// Add atom namespace to the rss tag
	rssOutput = rssOutput.replace(
		'<rss version="2.0">',
		'<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
	);

	// Add atom:link with rel="self" after the opening channel tag
	rssOutput = rssOutput.replace(
		"<channel>",
		`<channel>
    <atom:link href="https://www.door.link/rss.xml" rel="self" type="application/rss+xml" />`,
	);

	// Create a custom XML output with correct audio enclosures
	// This is a workaround if the feed library is not setting enclosures correctly
	if (enclosureMatch?.some((e) => e.includes("/media/images/"))) {
		// Method 1: Create custom enclosure elements by directly replacing the XML
		for (const mixtape of mixtapes) {
			const imageEnclosurePattern = new RegExp(
				`<enclosure url="${mixtape.artwork_uri.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"[^>]*>`,
				"g",
			);

			const audioMimeType = getAudioMimeType(mixtape.audio_uri);
			const newEnclosure = `<enclosure url="${mixtape.audio_uri}" length="0" type="${audioMimeType}"/>`;

			rssOutput = rssOutput.replace(imageEnclosurePattern, newEnclosure);
		}
	}

	return rssOutput;
}
