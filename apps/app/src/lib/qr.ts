import { renderSVG } from "uqr";
import { THEME_BG } from "./theme.ts";

// The QR code for `text` as an SVG string: dark modules on a transparent
// background, so whatever sits behind it is the light part.
export function qrSvg(text: string): string {
  return renderSVG(text, { blackColor: THEME_BG, whiteColor: "transparent", border: 0 });
}
