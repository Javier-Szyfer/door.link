const FEATURING = /\bfeaturing\b\s*[:;]?\s*/i;
const FT = /\b(?:ft|feat)\b\.?\s*[:;]?\s*/i;
const SIGN_OFF = /[\s./~-]*\b(?:xx|love|luv)\s*,\s*r\.?\s*$/i;
const MIN_BARE_LIST = 3;

const toNames = (list: string) =>
  list
    .replace(SIGN_OFF, "")
    .split(/\.{2,}|…/)[0]
    .split(",")
    .map((name) =>
      name
        .replace(/\s+/g, " ")
        .trim()
        .replace(/^and\s+/i, "")
        .replace(/\.$/, "")
        .trim(),
    )
    .filter(Boolean);

const after = (text: string, marker: RegExp) => {
  const match = marker.exec(text);
  return match ? text.slice(match.index + match[0].length) : null;
};

// A list of names after the last colon, long enough not to be prose.
const bareList = (text: string) => {
  const colon = text.lastIndexOf(":");
  if (colon === -1) return null;
  const names = toNames(text.slice(colon + 1));
  return names.length >= MIN_BARE_LIST ? names : null;
};

// The artists of a mix: after "featuring", in a bare list after a colon, or after "ft".
export function parseFeaturing(description: string): string[] {
  const featuring = after(description, FEATURING);
  if (featuring !== null) return toNames(featuring);
  const bare = bareList(description);
  if (bare) return bare;
  const ft = after(description, FT);
  return ft === null ? [] : toNames(ft);
}
