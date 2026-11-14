import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { parseFeaturing } from "./featuring.ts";

describe("parseFeaturing", () => {
  it("splits the artists after 'featuring:'", () =>
    assert.deepEqual(
      parseFeaturing("This is 213 featuring: John Foxx, Fifto, Looper, Harold Budd"),
      ["John Foxx", "Fifto", "Looper", "Harold Budd"],
    ));
  it("ignores case and trims the trailing period", () =>
    assert.deepEqual(parseFeaturing("Featuring: Ruin, Anasisana."), ["Ruin", "Anasisana"]));
  it("reads a list after a slash separator", () =>
    assert.deepEqual(parseFeaturing("A mixtape for Beams T.  / Featuring: Ruin, JJ+JS,  Ishi Vu"), [
      "Ruin",
      "JJ+JS",
      "Ishi Vu",
    ]));
  it("returns nothing without a featuring list", () =>
    assert.deepEqual(parseFeaturing("In moments of sudden clarity"), []));
  it("collapses repeated spaces inside a name", () =>
    assert.deepEqual(parseFeaturing("featuring: Tujiko  Noriko"), ["Tujiko Noriko"]));
  it("drops empty entries", () =>
    assert.deepEqual(parseFeaturing("featuring: A,, B, "), ["A", "B"]));
  it("reads a list without a colon", () =>
    assert.deepEqual(parseFeaturing("this is 207 featuring pan american, bjarki"), [
      "pan american",
      "bjarki",
    ]));
  it("reads a list after a semicolon", () =>
    assert.deepEqual(parseFeaturing("This is 49, featuring; Merope, Panoram"), [
      "Merope",
      "Panoram",
    ]));
  it("reads a list after ft or feat", () => {
    assert.deepEqual(parseFeaturing("hi, this is 10 ft. Ana, Bea"), ["Ana", "Bea"]);
    assert.deepEqual(parseFeaturing("hi, this is 10 feat Ana, Bea"), ["Ana", "Bea"]);
  });
  it("doesn't read ft inside a word", () =>
    assert.deepEqual(parseFeaturing("a soft left turn, after, all"), []));
  it("reads a bare list of names after a colon", () =>
    assert.deepEqual(parseFeaturing("This is 174: Seefeel, Tris, Low"), [
      "Seefeel",
      "Tris",
      "Low",
    ]));
  it("keeps an inner feat as part of a bare list", () =>
    assert.deepEqual(parseFeaturing("esto es Door 61, con: In Fosa, Stigma feat L., Pendant"), [
      "In Fosa",
      "Stigma feat L",
      "Pendant",
    ]));
  it("ignores a colon followed by prose", () =>
    assert.deepEqual(parseFeaturing("Door is here: ~natnex/door-link ... see you there."), []));
  it("stops at an ellipsis", () =>
    assert.deepEqual(parseFeaturing("featuring ae, ulrich schnauss... enjoy"), [
      "ae",
      "ulrich schnauss",
    ]));
  it("drops the sign-off", () => {
    assert.deepEqual(parseFeaturing("featuring: Malibu., Biosphere. xx, r"), [
      "Malibu",
      "Biosphere",
    ]);
    assert.deepEqual(parseFeaturing("featuring: Raum / xx, r"), ["Raum"]);
    assert.deepEqual(parseFeaturing("con: Pendant, OHYUNG, Glass Salt ~ Love, R."), [
      "Pendant",
      "OHYUNG",
      "Glass Salt",
    ]);
    assert.deepEqual(parseFeaturing("featuring: Biosphere - Luv, R."), ["Biosphere"]);
  });
  it("keeps names that contain love", () =>
    assert.deepEqual(parseFeaturing("featuring: Free Love, Love Spirals Downwards"), [
      "Free Love",
      "Love Spirals Downwards",
    ]));
  it("drops a leading and", () =>
    assert.deepEqual(parseFeaturing("featuring: Ana, and Colin Blunstone."), [
      "Ana",
      "Colin Blunstone",
    ]));
});
