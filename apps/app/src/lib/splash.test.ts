import assert from "node:assert/strict";
import { describe, it } from "node:test";
import sharp from "sharp";
import { splashFiles, splashImages } from "./splash.ts";
import { THEME_BG } from "./theme.ts";

const background = [1, 3, 5].map((start) => Number.parseInt(THEME_BG.slice(start, start + 2), 16));

// Reads the size and two pixels of an image: its corner and its center.
const readImage = async (path: string) => {
  const { data, info } = await sharp(path).raw().toBuffer({ resolveWithObject: true });
  const pixel = (x: number, y: number) => {
    const start = (y * info.width + x) * info.channels;
    return [data[start], data[start + 1], data[start + 2]];
  };
  return {
    width: info.width,
    height: info.height,
    corner: pixel(0, 0),
    center: pixel(Math.floor(info.width / 2), Math.floor(info.height / 2)),
  };
};

describe("splash images", () => {
  it("are the plain theme background at their device's exact size", async () => {
    for (const { path, width, height } of splashFiles()) {
      const image = await readImage(`public${path}`);
      assert.equal(image.width, width, path);
      assert.equal(image.height, height, path);
      assert.deepEqual(image.corner, background, `${path}: run bun run splash`);
      assert.deepEqual(image.center, background, `${path}: run bun run splash`);
    }
  });

  it("target each device in portrait", () => {
    const { media, url } = splashImages().find((image) => image.url.includes("1206x2622")) ?? {};
    assert.equal(url, "/splash/1206x2622.png");
    assert.equal(
      media,
      "(device-width: 402px) and (device-height: 874px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)",
    );
  });
});
