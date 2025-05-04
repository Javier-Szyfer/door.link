import { NextResponse } from "next/server";

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const url = searchParams.get("url");
	const filename = searchParams.get("filename");

	if (!url) return new NextResponse("URL is required", { status: 400 });

	try {
		const response = await fetch(url);

		if (!response.ok) {
			return new NextResponse(`Upstream server error: ${response.status}`, {
				status: response.status,
			});
		}

		// Get all headers from the original response
		const headers = new Headers();
		response.headers.forEach((value, key) => {
			// Copy all headers except those we want to override
			if (!["content-disposition"].includes(key.toLowerCase())) {
				headers.set(key, value);
			}
		});

		// Ensure we have the correct content type
		if (!headers.has("content-type")) {
			headers.set("content-type", "audio/mpeg");
		}

		// Set the filename for download
		headers.set(
			"Content-Disposition",
			`attachment; filename="${filename || "download.mp3"}"`,
		);

		// Forward the actual response body as a stream instead of buffering
		// This is critical for large files to avoid timeout issues
		return new NextResponse(response.body, {
			headers,
			status: 200,
		});
	} catch (error) {
		console.error("Download error:", error);
		return new NextResponse("Failed to download file", { status: 500 });
	}
}
