export type ByteRange = { start: number; end: number };

// Reads a single "bytes=" range against a file size; null means serve the whole file.
export function parseRange(header: string, size: number): ByteRange | "unsatisfiable" | null {
  const match = header.trim().match(/^bytes=(\d*)-(\d*)$/);
  if (!match || (match[1] === "" && match[2] === "")) return null;

  if (match[1] === "") {
    const length = Math.min(Number(match[2]), size);
    if (length === 0) return "unsatisfiable";
    return { start: size - length, end: size - 1 };
  }

  const start = Number(match[1]);
  if (start >= size) return "unsatisfiable";
  const end = match[2] === "" ? size - 1 : Math.min(Number(match[2]), size - 1);
  if (end < start) return null;
  return { start, end };
}

// Answers a request from a stored file, honoring its Range header.
export function rangeResponse(blob: Blob, rangeHeader: string | null, contentType: string) {
  const size = blob.size;
  const range = rangeHeader ? parseRange(rangeHeader, size) : null;

  if (range === "unsatisfiable") {
    return new Response(null, { status: 416, headers: { "Content-Range": `bytes */${size}` } });
  }
  if (!range) {
    return new Response(blob, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Length": String(size),
        "Accept-Ranges": "bytes",
      },
    });
  }
  const { start, end } = range;
  return new Response(blob.slice(start, end + 1), {
    status: 206,
    headers: {
      "Content-Type": contentType,
      "Content-Length": String(end - start + 1),
      "Content-Range": `bytes ${start}-${end}/${size}`,
      "Accept-Ranges": "bytes",
    },
  });
}
