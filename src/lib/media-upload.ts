export type MediaKind = "audio" | "artwork";

export const IMMUTABLE_CACHE_CONTROL = "public, max-age=31536000, immutable";

const FOLDERS: Record<MediaKind, string> = { audio: "audio", artwork: "images" };
const CONTENT_TYPE_PREFIXES: Record<MediaKind, string> = { audio: "audio/", artwork: "image/" };

export const isAllowedContentType = (kind: MediaKind, contentType: string) =>
  contentType.startsWith(CONTENT_TYPE_PREFIXES[kind]);

const extensionOf = (fileName: string) => {
  const match = /\.([a-z0-9]{1,5})$/i.exec(fileName);
  return match ? `.${match[1].toLowerCase()}` : "";
};

// Builds a unique object key with a URL-safe version of the file name.
export const buildMediaKey = (kind: MediaKind, fileName: string, now = Date.now()) => {
  const safeName = fileName
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^\w.-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  return `${FOLDERS[kind]}/${now}-${safeName || `file${extensionOf(fileName)}`}`;
};

// Content-Disposition that makes a direct link download as "number-title.ext".
export const buildDownloadDisposition = (number: string, title: string, fileName: string) => {
  const name = `${number}-${title}${extensionOf(fileName) || ".mp3"}`.replace(/[/\\]/g, "-");
  return `attachment; filename*=UTF-8''${encodeURIComponent(name)}`;
};

// Object key of a URL served from `mediaBaseUrl`, or null for any other URL.
export const mediaKeyFromUrl = (url: string, mediaBaseUrl: string) => {
  const base = `${mediaBaseUrl.replace(/\/$/, "")}/`;
  if (!url.startsWith(base)) return null;

  const key = url.slice(base.length).split("/").map(decodeURIComponent).join("/");
  return key || null;
};

// URLs from `candidates` that no mixtape in `mixtapes` still uses.
export const findUnusedMediaUrls = (
  candidates: string[],
  mixtapes: { audio_uri: string; artwork_uri: string }[],
) => {
  const used = new Set(mixtapes.flatMap(({ audio_uri, artwork_uri }) => [audio_uri, artwork_uri]));
  return [...new Set(candidates)].filter((url) => url && !used.has(url));
};
