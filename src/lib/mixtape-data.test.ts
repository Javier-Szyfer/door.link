import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { Mixtape } from "../types/mixtape.ts";
import { nextMixtapeId, parseMixtapeInput, sortMixtapes } from "./mixtape-data.ts";

const mixtape = (id: number, number: string): Mixtape => ({
  id,
  number,
  title: `Mix ${number}`,
  description: "",
  duration: "60:00",
  created_at: "2026-01-01",
  audio_uri: "https://media.example.com/a.mp3",
  artwork_uri: "https://media.example.com/a.jpg",
  status: "published",
});

const validInput = {
  number: "208",
  title: "Title",
  description: "Description",
  duration: "60:00",
  created_at: "2026-11-02",
  audio_uri: "https://media.example.com/audio/a.mp3",
  artwork_uri: "https://media.example.com/images/a.jpg",
  status: "published",
};

describe("sortMixtapes", () => {
  it("orders by number numerically, newest first", () => {
    const sorted = sortMixtapes([mixtape(1, "99"), mixtape(2, "208"), mixtape(3, "100")]);
    assert.deepEqual(
      sorted.map(({ number }) => number),
      ["208", "100", "99"],
    );
  });
});

describe("nextMixtapeId", () => {
  it("is one past the highest id", () => {
    assert.equal(nextMixtapeId([mixtape(4, "1"), mixtape(9, "2")]), 10);
  });

  it("starts at 1 for an empty list", () => {
    assert.equal(nextMixtapeId([]), 1);
  });
});

describe("parseMixtapeInput", () => {
  it("keeps the known fields", () => {
    assert.deepEqual(parseMixtapeInput(validInput), { input: validInput });
  });

  it("drops unknown fields, including id", () => {
    const { input } = parseMixtapeInput({ ...validInput, id: 1, admin: true });
    assert.deepEqual(input, validInput);
  });

  it("defaults the status to draft", () => {
    const { status: _status, ...withoutStatus } = validInput;
    assert.equal(parseMixtapeInput(withoutStatus).input?.status, "draft");
  });

  it("rejects missing fields, wrong types and unknown statuses", () => {
    const { title: _title, ...withoutTitle } = validInput;
    assert.ok(parseMixtapeInput(withoutTitle).error);
    assert.ok(parseMixtapeInput({ ...validInput, number: 208 }).error);
    assert.ok(parseMixtapeInput({ ...validInput, status: "public" }).error);
    assert.ok(parseMixtapeInput(null).error);
  });
});
