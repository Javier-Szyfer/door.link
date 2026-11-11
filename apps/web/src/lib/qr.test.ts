import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { APP_URL, qrSvg } from "./qr.ts";

describe("qrSvg", () => {
  it("renders an SVG", () => {
    const svg = qrSvg(APP_URL).trim();
    assert.ok(svg.startsWith("<svg"));
    assert.ok(svg.endsWith("</svg>"));
  });

  it("encodes different text as different codes", () => {
    assert.notEqual(qrSvg(APP_URL), qrSvg("https://door.link"));
  });
});
