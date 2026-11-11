import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { THEME_BG } from "../lib/theme.ts";
import manifest from "./manifest.ts";

describe("manifest", () => {
  const m = manifest();
  it("opens standalone", () => assert.equal(m.display, "standalone"));
  it("starts at the root", () => assert.equal(m.start_url, "/"));
  it("has a 192px icon", () => assert.ok(m.icons?.some((icon) => icon.sizes === "192x192")));
  it("has a 512px icon", () => assert.ok(m.icons?.some((icon) => icon.sizes === "512x512")));
  it("points at icons that exist", () => {
    for (const icon of m.icons ?? []) assert.ok(existsSync(`public${icon.src}`), icon.src);
  });
  it("opens on the theme background", () => {
    assert.equal(m.background_color, THEME_BG);
    assert.equal(m.theme_color, THEME_BG);
  });
  it("matches the background token", () => {
    const css = readFileSync(new URL("./globals.css", import.meta.url), "utf8");
    assert.match(css, new RegExp(`--bg: ${THEME_BG};`));
  });
});
