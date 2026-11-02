import { OG_VIDEO } from "@/constants/metadata";

const PLAYER_HTML = `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      html, body { margin: 0; height: 100%; background: #fff; overflow: hidden; }
      video { width: 100%; height: 100%; object-fit: cover; display: block; }
    </style>
  </head>
  <body>
    <video src="${OG_VIDEO.url}" autoplay muted loop playsinline></video>
  </body>
</html>`;

export function GET() {
  return new Response(PLAYER_HTML, {
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}
