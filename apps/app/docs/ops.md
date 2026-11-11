# Operations

## Media bucket CORS

The `door-media` policy has two rules, and `docs/r2-cors.json` is the complete policy:

- `PUT` from door.link: admin uploads (`apps/web`). Locally, door.link runs on `localhost:3001`.
- `GET`/`HEAD` with `Range` from the app: offline downloads read the MP3s with `fetch`.

To change it:

1. Cloudflare → R2 → `door-media` → Settings → CORS Policy → Edit.
2. Paste the whole `docs/r2-cors.json`. If you paste just one rule, the other is lost.
3. Verify:

   ```sh
   curl -sI -H "Origin: http://localhost:3000" \
     https://media.keyholemedia.store/audio/1793797475579-door-214.mp3 \
     | grep -i access-control-allow-origin
   ```

   It must print the origin.

R2 doesn't accept subdomain wildcards: each origin is added exactly. A preview can only download from its branch's fixed URL (`door-app-git-<branch>-javierszyfers-projects.vercel.app`), and only if that URL is in the rule.

## Deploy

- The app lives in the door.link monorepo (`apps/app`), imported into Vercel (Next.js framework, build `bun run build`). In the app's project, Root Directory is `apps/app`.
- Two Vercel projects point at this repo: `door-link` (Root Directory `apps/web`) and `door-app` (Root Directory `apps/app`). Both have "Include files outside the root directory" and "Skip deployments when there are no changes" enabled.
- Production domain: `app.door.link`, with a CNAME in Namecheap (door.link's DNS is not on Cloudflare). It is already in the CORS rule.
- Deployment Protection is disabled on `door-app`, because the app installed on iOS doesn't share cookies with Safari. The app sends `noindex`.

## Data

The list comes from `FEED_URL`. If unset in production it uses `https://www.door.link/rss.xml`; locally it uses `http://localhost:3001/rss.xml` (`apps/web` running with `bun run dev`). Next may prerender `/api/mixes` during the build, so `FEED_URL` must be set both at build time and at startup. See `.env.example`. The cover and duration come from `itunes:image` and `itunes:duration`, which `apps/web/src/utils/rss.ts` emits.

## Launch screen

The images in `public/splash` are plain, in the `THEME_BG` color from `src/lib/theme.ts`. After them the app shows a Home skeleton: we tried a lock as the splash, but in the installed iOS app the launch image doesn't blend with the page and the cut was noticeable. If the background changes, update `THEME_BG` and `--bg` and run `bun run splash`; the tests warn if they don't match. iOS reads them when the app is installed, so to see a change you have to delete it and add it to the home screen again.

## Testing on the iPhone

`bun dev --hostname 0.0.0.0` and opening `http://<mac-ip>:3000` in Safari works for the UI, but the service worker and downloads need HTTPS: test those on the Vercel deploy, installed with "Add to Home Screen".
