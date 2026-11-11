import { renderSVG } from "uqr";

// Where the door app lives; the QR in the nav's app dialog opens it.
export const APP_URL = "https://app.door.link";

// The QR code for `text` as an SVG string: dark modules on a transparent
// background, so whatever sits behind it is the light part. The SVG includes
// the 4-module quiet zone the QR spec asks for, so scanners can find the edges.
export function qrSvg(text: string): string {
  return renderSVG(text, { blackColor: "#121212", whiteColor: "transparent", border: 4 });
}
