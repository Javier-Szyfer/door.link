import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { encode } from "uqr";
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

  it("keeps a 4-module quiet zone on every side", () => {
    for (const url of ["https://app.door.link", "https://javiers-macbook-pro.local:3443"]) {
      const { size } = encode(url);
      const [, , w, h] = (qrSvg(url).match(/viewBox="([^"]+)"/)?.[1] ?? "").split(" ").map(Number);
      // encode() reports the code plus its own 1-module margin, so size - 2 modules
      // of code, and 4 modules of quiet zone on each side.
      const module = w / (size - 2 + 8);
      assert.equal(w, h);
      assert.ok(Number.isInteger(module) && module > 0);
      // the first dark module sits 4 modules in from the top-left corner
      assert.ok(qrSvg(url).includes(`M${4 * module},${4 * module}h`));
    }
  });
});
