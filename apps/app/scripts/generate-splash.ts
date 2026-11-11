import { mkdirSync } from "node:fs";
import sharp from "sharp";
import { splashFiles } from "../src/lib/splash.ts";
import { THEME_BG } from "../src/lib/theme.ts";

mkdirSync("public/splash", { recursive: true });
for (const { path, width, height } of splashFiles()) {
  await sharp({ create: { width, height, channels: 3, background: THEME_BG } })
    .png({ compressionLevel: 9 })
    .toFile(`public${path}`);
}
