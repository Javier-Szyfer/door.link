import { parseFeaturing } from "./featuring.ts";
import type { Mix } from "./mix.ts";
import { normalize } from "./search.ts";

export type YearShortcut = { year: number; count: number; cover: Mix };
export type ArtistShortcut = { key: string; name: string; count: number };

export type ShortcutFilter =
  | { kind: "year"; year: number }
  | { kind: "artist"; key: string; name: string };

const MAX_ARTISTS = 40;

const mixYear = (mix: Mix) => new Date(mix.publishedAt).getUTCFullYear();

const compareNames = (a: string, b: string) =>
  a.localeCompare(b, undefined, { caseFirst: "upper" });

// The years with mixes, newest first, each with its count and newest mix as cover.
export function yearShortcuts(mixes: Mix[]): YearShortcut[] {
  const years = new Map<number, YearShortcut>();
  for (const mix of mixes) {
    const year = mixYear(mix);
    if (Number.isNaN(year)) continue;
    const entry = years.get(year);
    if (!entry) years.set(year, { year, count: 1, cover: mix });
    else {
      entry.count += 1;
      if (mix.publishedAt > entry.cover.publishedAt) entry.cover = mix;
    }
  }
  return [...years.values()].sort((a, b) => b.year - a.year);
}

// The most featured artists, merging spelling variants under their most common form.
export function artistShortcuts(mixes: Mix[], limit = MAX_ARTISTS): ArtistShortcut[] {
  const artists = new Map<string, { count: number; spellings: Map<string, number> }>();
  for (const mix of mixes) {
    const seen = new Set<string>();
    for (const name of parseFeaturing(mix.description)) {
      const key = normalize(name);
      const entry = artists.get(key) ?? { count: 0, spellings: new Map() };
      if (!seen.has(key)) entry.count += 1;
      seen.add(key);
      entry.spellings.set(name, (entry.spellings.get(name) ?? 0) + 1);
      artists.set(key, entry);
    }
  }
  return [...artists]
    .map(([key, { count, spellings }]) => {
      const [[name]] = [...spellings].sort((a, b) => b[1] - a[1] || compareNames(a[0], b[0]));
      return { key, name, count };
    })
    .sort((a, b) => b.count - a.count || compareNames(a.name, b.name))
    .slice(0, limit);
}

// The mixes a year or artist shortcut selects.
export function filterByShortcut(mixes: Mix[], filter: ShortcutFilter): Mix[] {
  if (filter.kind === "year") return mixes.filter((mix) => mixYear(mix) === filter.year);
  return mixes.filter((mix) =>
    parseFeaturing(mix.description).some((name) => normalize(name) === filter.key),
  );
}
