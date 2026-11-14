import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { Mix } from "./mix.ts";
import { normalize, searchMixes } from "./search.ts";

const mix = (number: string, title: string, description = ""): Mix => ({
  number,
  title,
  description,
  publishedAt: "",
  audioUrl: "",
  artworkUrl: null,
  durationSeconds: null,
});

const mixes = [
  mix("214", "now more than ever"),
  mix("213", "door 213", "Featuring Harold Budd, Mouse on Mars"),
  mix("212", "Café Tradición"),
];

const numbers = (result: Mix[]) => result.map((m) => m.number);

describe("normalize", () => {
  it("lowercases and strips accents", () =>
    assert.equal(normalize("Café TRADICIÓN"), "cafe tradicion"));
});

describe("searchMixes", () => {
  it("ignores accents", () => assert.deepEqual(numbers(searchMixes(mixes, "cafe")), ["212"]));
  it("requires every term", () =>
    assert.deepEqual(numbers(searchMixes(mixes, "budd 213")), ["213"]));
  it("matches by number", () => assert.deepEqual(numbers(searchMixes(mixes, "212")), ["212"]));
  it("searches descriptions", () => assert.deepEqual(numbers(searchMixes(mixes, "mars")), ["213"]));
  it("returns nothing for an empty query", () => assert.deepEqual(searchMixes(mixes, "   "), []));
});

describe("searchMixes ranking", () => {
  it("puts a title that starts with the query before newer incidental matches", () =>
    assert.deepEqual(
      numbers(
        searchMixes(
          [
            mix("214", "now more", "this is it"),
            mix("205", "2o5 is live"),
            mix("202", "is this a door"),
          ],
          "is",
        ),
      ),
      ["202", "205", "214"],
    ));
  it("doesn't match inside a word of the description", () =>
    assert.deepEqual(searchMixes([mix("1", "a", "this one comes from afar")], "is"), []));
  it("still matches inside a title or artist", () => {
    assert.deepEqual(numbers(searchMixes([mix("1", "dooring")], "ring")), ["1"]);
    assert.deepEqual(numbers(searchMixes([mix("1", "a", "featuring: Sunmoonstar")], "moon")), [
      "1",
    ]);
  });
  it("finds a word start in the title", () =>
    assert.deepEqual(
      numbers(
        searchMixes(
          [mix("9", "x", "featuring: Rose"), mix("3", "mirror"), mix("2", "room service")],
          "ro",
        ),
      ),
      ["2", "9", "3"],
    ));
  it("puts the exact number first, without nearby numbers or inner digits", () =>
    assert.deepEqual(
      numbers(
        searchMixes(
          [
            mix("212", "a", "made in 2025"),
            mix("204", "b"),
            mix("202", "c"),
            mix("004", "regarding 2020"),
          ],
          "202",
        ),
      ),
      ["202", "004"],
    ));
  it("matches a number regardless of leading zeros", () => {
    assert.deepEqual(numbers(searchMixes([mix("047", "a")], "47")), ["047"]);
    assert.deepEqual(numbers(searchMixes([mix("047", "a")], "047")), ["047"]);
  });
  it("lists numbers that start with the query before titles that do", () =>
    assert.deepEqual(
      numbers(searchMixes([mix("004", "regarding 2020"), mix("100", "a"), mix("205", "b")], "20")),
      ["205", "004"],
    ));
  it("puts an artist that starts with the query before a later word of a name", () =>
    assert.deepEqual(
      numbers(
        searchMixes(
          [
            mix("213", "a", "featuring: Harold Budd"),
            mix("192", "b", "featuring: Buffalo Daughter"),
          ],
          "bu",
        ),
      ),
      ["192", "213"],
    ));
  it("ranks artists above plain words in descriptions", () =>
    assert.deepEqual(
      numbers(
        searchMixes(
          [mix("9", "a", "buffalo is an animal"), mix("1", "b", "featuring: Buffalo Daughter")],
          "buffalo",
        ),
      ),
      ["1", "9"],
    ));
  it("puts the whole phrase before scattered terms", () =>
    assert.deepEqual(
      numbers(
        searchMixes(
          [mix("9", "room with a view", "the service was slow"), mix("1", "room service")],
          "room service",
        ),
      ),
      ["1", "9"],
    ));
  it("keeps the given order on a tie", () =>
    assert.deepEqual(numbers(searchMixes([mix("3", "door a"), mix("2", "door b")], "door")), [
      "3",
      "2",
    ]));
});
