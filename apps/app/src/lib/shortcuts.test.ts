import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { Mix } from "./mix.ts";
import { artistShortcuts, filterByShortcut, yearShortcuts } from "./shortcuts.ts";

const mix = (number: string, publishedAt: string, description = ""): Mix => ({
  number,
  title: number,
  description,
  publishedAt,
  audioUrl: "",
  artworkUrl: null,
  durationSeconds: null,
});

describe("yearShortcuts", () => {
  it("groups by year, newest first, with the newest mix as cover", () => {
    const years = yearShortcuts([
      mix("1", "2024-03-01T00:00:00.000Z"),
      mix("3", "2025-06-01T00:00:00.000Z"),
      mix("2", "2024-09-01T00:00:00.000Z"),
    ]);
    assert.deepEqual(
      years.map(({ year, count, cover }) => [year, count, cover.number]),
      [
        [2025, 1, "3"],
        [2024, 2, "2"],
      ],
    );
  });
  it("reads the year in UTC", () =>
    assert.equal(yearShortcuts([mix("1", "2025-01-01T00:00:00.000Z")])[0].year, 2025));
  it("skips mixes without a valid date", () => assert.deepEqual(yearShortcuts([mix("1", "")]), []));
});

describe("artistShortcuts", () => {
  it("orders by count, then by name", () => {
    const artists = artistShortcuts([
      mix("1", "", "featuring: Zed, Ana"),
      mix("2", "", "featuring: Zed, Bea"),
    ]);
    assert.deepEqual(
      artists.map(({ name, count }) => [name, count]),
      [
        ["Zed", 2],
        ["Ana", 1],
        ["Bea", 1],
      ],
    );
  });
  it("merges case and accent variants under the most common spelling", () => {
    const artists = artistShortcuts([
      mix("1", "", "featuring: Félicia Atkinson"),
      mix("2", "", "featuring: Félicia Atkinson"),
      mix("3", "", "featuring: felicia atkinson"),
    ]);
    assert.deepEqual(
      artists.map(({ name, count }) => [name, count]),
      [["Félicia Atkinson", 3]],
    );
  });
  it("prefers the capitalized spelling on a tie", () =>
    assert.equal(
      artistShortcuts([mix("1", "", "featuring: nueen"), mix("2", "", "featuring: Nueen")])[0].name,
      "Nueen",
    ));
  it("counts an artist once per mix", () =>
    assert.equal(artistShortcuts([mix("1", "", "featuring: Ana, ana")])[0].count, 1));
  it("keeps only the top artists", () =>
    assert.equal(artistShortcuts([mix("1", "", "featuring: A, B, C")], 2).length, 2));
});

describe("filterByShortcut", () => {
  const mixes = [
    mix("1", "2024-03-01T00:00:00.000Z", "featuring: Félicia Atkinson, Ana"),
    mix("2", "2025-03-01T00:00:00.000Z", "featuring: felicia atkinson"),
    mix("3", "2025-04-01T00:00:00.000Z", "A note on Felicia Atkinson"),
  ];
  const numbers = (list: Mix[]) => list.map((item) => item.number);

  it("selects a year", () =>
    assert.deepEqual(numbers(filterByShortcut(mixes, { kind: "year", year: 2025 })), ["2", "3"]));
  it("selects every spelling of an artist, only where featured", () =>
    assert.deepEqual(
      numbers(
        filterByShortcut(mixes, {
          kind: "artist",
          key: "felicia atkinson",
          name: "Félicia Atkinson",
        }),
      ),
      ["1", "2"],
    ));
});
