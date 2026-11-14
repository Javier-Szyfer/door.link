import { parseFeaturing } from "./featuring.ts";
import type { Mix } from "./mix.ts";

// Lowercases text and strips diacritics so "Café" matches "cafe".
export const normalize = (text: string) =>
  text
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();

type Fields = { number: string; title: string; artists: string[]; description: string };

const Rank = {
  numberExact: 1,
  titleExact: 2,
  numberStart: 3,
  titleStart: 4,
  titleWordStart: 5,
  artistStart: 6,
  artistWordStart: 7,
  titleContains: 8,
  artistContains: 9,
  descriptionWord: 10,
} as const;

const ALPHANUMERIC = /[\p{L}\p{N}]/u;
const isBoundary = (char: string | undefined) => !char || !ALPHANUMERIC.test(char);
const withoutLeadingZeros = (text: string) => text.replace(/^0+(?=.)/, "");

// Whether the text has a match starting at a word, and ending at one when whole is set.
const matchesWord = (text: string, query: string, whole = false) => {
  for (let index = text.indexOf(query); index !== -1; index = text.indexOf(query, index + 1)) {
    const startsWord = isBoundary(text[index - 1]);
    if (startsWord && (!whole || isBoundary(text[index + query.length]))) return true;
  }
  return false;
};

// The best way a mix matches a text, lower being better, or null when it doesn't.
const rankMatch = ({ number, title, artists, description }: Fields, query: string) => {
  const bareNumber = withoutLeadingZeros(number);
  const bareQuery = withoutLeadingZeros(query);
  if (bareNumber === bareQuery) return Rank.numberExact;
  if (title === query) return Rank.titleExact;
  if (number.startsWith(query) || bareNumber.startsWith(bareQuery)) return Rank.numberStart;
  if (title.startsWith(query)) return Rank.titleStart;
  if (matchesWord(title, query)) return Rank.titleWordStart;
  if (artists.some((artist) => artist.startsWith(query))) return Rank.artistStart;
  if (artists.some((artist) => matchesWord(artist, query))) return Rank.artistWordStart;
  if (title.includes(query)) return Rank.titleContains;
  if (artists.some((artist) => artist.includes(query))) return Rank.artistContains;
  if (matchesWord(description, query, true)) return Rank.descriptionWord;
  return null;
};

// Scores a mix by the whole phrase, or below that by its worst matching term.
const scoreMix = (fields: Fields, phrase: string, terms: string[]) => {
  const phraseRank = rankMatch(fields, phrase);
  if (phraseRank !== null) return phraseRank;
  let worst = 0;
  for (const term of terms) {
    const rank = rankMatch(fields, term);
    if (rank === null) return null;
    worst = Math.max(worst, rank);
  }
  return Rank.descriptionWord + worst;
};

// The mixes matching every term of the query, best match first, then in their given order.
export function searchMixes(mixes: Mix[], query: string): Mix[] {
  const terms = normalize(query).split(/\s+/).filter(Boolean);
  if (terms.length === 0) return [];
  const phrase = terms.join(" ");
  return mixes
    .flatMap((mix) => {
      const score = scoreMix(
        {
          number: normalize(mix.number),
          title: normalize(mix.title),
          artists: parseFeaturing(mix.description).map(normalize),
          description: normalize(mix.description),
        },
        phrase,
        terms,
      );
      return score === null ? [] : [{ mix, score }];
    })
    .sort((a, b) => a.score - b.score)
    .map(({ mix }) => mix);
}
