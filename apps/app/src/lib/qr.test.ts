import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { qrSvg } from "./qr.ts";

describe("qrSvg", () => {
  it("returns an svg document", () => {
    const svg = qrSvg("https://app.door.link").trim();
    assert.ok(svg.startsWith("<svg"));
    assert.ok(svg.endsWith("</svg>"));
  });

  it("is deterministic", () => {
    assert.equal(qrSvg("https://app.door.link"), qrSvg("https://app.door.link"));
  });

  it("differs per input", () => {
    assert.notEqual(qrSvg("https://app.door.link"), qrSvg("https://localhost:3443"));
  });
});
