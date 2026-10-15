import { NextResponse } from "next/server";
import { isAllowedMediaUrl } from "@/constants/media-hosts";

const ALLOWED_CONTENT_TYPES = [
  "audio/mpeg",
  "audio/mp3",
  "audio/wav",
  "audio/m4a",
  "audio/mp4",
  "audio/x-m4a",
  "audio/aac",
];

const FETCH_TIMEOUT_MS = 30_000;

const isSafeFilename = (filename: string) =>
  !filename.includes("..") && !filename.includes("/") && !filename.includes("\\");

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");
  const filename = searchParams.get("filename");

  if (!url) {
    return new NextResponse("URL is required", { status: 400 });
  }

  if (!isAllowedMediaUrl(url)) {
    return new NextResponse("Invalid or unsafe URL", { status: 400 });
  }

  if (filename && !isSafeFilename(filename)) {
    return new NextResponse("Invalid filename", { status: 400 });
  }

  let response: Response;
  try {
    response = await fetch(url, {
      redirect: "error",
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });
  } catch (error) {
    if (error instanceof Error && error.name === "TimeoutError") {
      return new NextResponse("Request timeout", { status: 408 });
    }
    console.error("Download error:", error);
    return new NextResponse("Failed to fetch upstream file", { status: 502 });
  }

  if (!response.ok) {
    return new NextResponse(`Upstream server error: ${response.status}`, {
      status: response.status,
    });
  }

  const contentType = response.headers.get("content-type");
  if (!contentType || !ALLOWED_CONTENT_TYPES.some((type) => contentType.includes(type))) {
    return new NextResponse("File type not allowed", { status: 415 });
  }

  const headers = new Headers({
    "content-type": contentType,
    "content-disposition": `attachment; filename*=UTF-8''${encodeURIComponent(
      filename || "download.mp3",
    )}`,
  });

  const contentLength = response.headers.get("content-length");
  if (contentLength) headers.set("content-length", contentLength);

  return new NextResponse(response.body, { headers, status: 200 });
}
