import { NextResponse } from "next/server";

// Simple in-memory rate limiting (for production, use Redis or database)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

// Rate limiting configuration
const RATE_LIMIT = {
  windowMs: 60 * 5 * 1000, // 5 minutes
  maxRequests: 10, // 10 downloads per 5 minutes per IP
};

// Allowed content types
const ALLOWED_CONTENT_TYPES = ["audio/mpeg", "audio/mp3", "audio/wav", "audio/m4a"];

function getRateLimitKey(request: Request): string {
  // In production, consider using a more sophisticated key
  // that includes user ID if authenticated
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(",")[0] : "unknown";
  return ip;
}

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(key);

  if (!record || now > record.resetTime) {
    // Reset or create new record
    rateLimitMap.set(key, {
      count: 1,
      resetTime: now + RATE_LIMIT.windowMs,
    });
    return false;
  }

  if (record.count >= RATE_LIMIT.maxRequests) {
    return true;
  }

  record.count++;
  return false;
}

function isValidUrl(url: string): boolean {
  try {
    const parsedUrl = new URL(url);

    // Only allow HTTPS
    if (parsedUrl.protocol !== "https:") {
      return false;
    }

    // Prevent internal network access
    const hostname = parsedUrl.hostname;
    if (hostname === "localhost" || hostname === "127.0.0.1") {
      return false;
    }

    return true;
  } catch {
    return false;
  }
}

export async function GET(request: Request) {
  // Rate limiting check
  const rateLimitKey = getRateLimitKey(request);
  if (isRateLimited(rateLimitKey)) {
    return new NextResponse("Too many requests. Please try again in 5 minutes.", {
      status: 429,
      headers: {
        "Retry-After": "60",
      },
    });
  }

  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");
  const filename = searchParams.get("filename");

  // Input validation
  if (!url) {
    return new NextResponse("URL is required", { status: 400 });
  }

  if (!isValidUrl(url)) {
    return new NextResponse("Invalid or unsafe URL", { status: 400 });
  }

  // Validate filename to prevent path traversal
  if (filename && (filename.includes("..") || filename.includes("/") || filename.includes("\\"))) {
    return new NextResponse("Invalid filename", { status: 400 });
  }

  try {
    // Add timeout to prevent hanging requests
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent": "YourAppName/1.0", // Identify your app
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      return new NextResponse(`Upstream server error: ${response.status}`, {
        status: response.status,
      });
    }

    // Check content type
    const contentType = response.headers.get("content-type");
    if (contentType && !ALLOWED_CONTENT_TYPES.some((type) => contentType.includes(type))) {
      return new NextResponse("File type not allowed", { status: 415 });
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
    headers.set("Content-Disposition", `attachment; filename="${filename || "download.mp3"}"`);

    // Forward the actual response body as a stream instead of buffering
    // This is critical for large files to avoid timeout issues
    return new NextResponse(response.body, {
      headers,
      status: 200,
    });
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      return new NextResponse("Request timeout", { status: 408 });
    }
    console.error("Download error:", error);
    return new NextResponse("Failed to download file", { status: 500 });
  }
}
