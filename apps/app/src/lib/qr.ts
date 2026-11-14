import { renderSVG } from "uqr";
import { THEME_BG } from "./theme.ts";

// The QR code for `text` as an SVG string: dark modules on a transparent
// background, so whatever sits behind it is the light part. The SVG includes
// the 4-module quiet zone the QR spec asks for, so scanners can find the edges.
export function qrSvg(text: string): string {
  return renderSVG(text, { blackColor: THEME_BG, whiteColor: "transparent", border: 4 });
}
