import { MIXTAPE_STATUSES, type Mixtape, type MixtapeInput } from "../types/mixtape.ts";

// Sorts mixtapes by number, newest first, comparing numbers numerically.
export const sortMixtapes = (mixtapes: Mixtape[]) =>
  [...mixtapes].sort((a, b) => b.number.localeCompare(a.number, undefined, { numeric: true }));

export const nextMixtapeId = (mixtapes: Mixtape[]) =>
  mixtapes.reduce((max, { id }) => Math.max(max, id), 0) + 1;

const STRING_FIELDS = [
  "number",
  "title",
  "description",
  "duration",
  "created_at",
  "audio_uri",
  "artwork_uri",
] as const;

// Keeps only the known mixtape fields, or returns an error message.
export const parseMixtapeInput = (
  input: unknown,
): { input: MixtapeInput; error?: never } | { input?: never; error: string } => {
  if (typeof input !== "object" || input === null) return { error: "Invalid mixtape" };
  const record = input as Record<string, unknown>;

  for (const field of STRING_FIELDS) {
    if (typeof record[field] !== "string") return { error: `Missing ${field}` };
  }
  const status = record.status ?? "draft";
  if (!MIXTAPE_STATUSES.includes(status as Mixtape["status"])) return { error: "Invalid status" };

  const fields = Object.fromEntries(STRING_FIELDS.map((field) => [field, record[field]]));
  return { input: { ...fields, status } as MixtapeInput };
};

export const isPublished = (mixtape: Mixtape) => mixtape.status === "published";
