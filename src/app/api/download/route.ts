import { NextResponse } from "next/server";

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const url = searchParams.get("url");
	const filename = searchParams.get("filename");

	if (!url) return new NextResponse("URL is required", { status: 400 });

	try {
		const response = await fetch(url);
		const blob = await response.blob();

		const headers = new Headers();
		headers.set("Content-Type", "audio/mpeg");
		headers.set(
			"Content-Disposition",
			`attachment; filename="${filename || "download.mp3"}"`,
		);

		return new NextResponse(blob, {
			headers,
		});
	} catch (error) {
		console.error("Download error:", error);
		return new NextResponse("Failed to download file", { status: 500 });
	}
}
