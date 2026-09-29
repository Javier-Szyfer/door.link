# door.link

A handpicked music selection, grown over time, algorithm-free, made for listening
and dancing.

The site at [door.link](https://door.link) is a mixtape archive: a public catalogue
with a persistent audio player, per-mixtape pages, an RSS feed, and a small admin
area for publishing new entries.

## Stack

- **Next.js 16** (App Router) and **React 19**
- **TypeScript 7**
- **Tailwind CSS 3** with **shadcn/ui** components on Radix
- **Supabase** for Postgres, auth and file storage
- **Biome** for linting and formatting
- Deployed on **Vercel**

## Running it locally

Requires [Bun](https://bun.sh) and Node 24 or newer — the test runner relies on
Node's native TypeScript stripping.

```bash
bun install
cp .env.example .env.local   # fill in your Supabase credentials
bun dev
```

| Script | |
| --- | --- |
| `bun dev` | development server |
| `bun run build` | production build |
| `bun run test` | unit tests |
| `bun run lint` / `bun run lint:fix` | lint |
| `bun run format:fix` | format |

## Environment

| Variable | |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key |
| `ADMIN_UUIDS` | comma-separated Supabase user ids allowed into `/admin` |

The two `NEXT_PUBLIC_` values ship in the browser bundle, as they are meant to.
What protects the data is Supabase's row level security, not keeping them secret.

## Database

The schema is not checked in. To run this against your own Supabase project you
need a `mixtapes` table:

| Column | Type |
| --- | --- |
| `id` | integer, primary key |
| `number` | `text`, unique |
| `title` | `text` |
| `description` | `text` |
| `duration` | `text` |
| `status` | enum `status`: `draft` \| `published` |
| `audio_uri` | `text` |
| `artwork_uri` | `text` |
| `created_at` | `timestamptz` |

You also need a public storage bucket named `media`, with `audio/` and `images/`
prefixes.

Row level security policies should let anonymous visitors read only `published`
rows, and restrict every write — on the table and on the bucket — to your admin
users. The app checks `ADMIN_UUIDS` on every mutation, but that is the second
line of defence, not the first: the upload form writes to storage straight from
the browser with the anon key, so the bucket's policies are what actually stop a
stranger from uploading.

## How it fits together

**Public pages** read through a cookie-free Supabase client (`src/lib/mixtapes.ts`)
so they can be statically rendered. `/` and `/rss.xml` revalidate on a timer, and
every published mixtape page is prerendered.

**The admin area** lives under `/admin`, behind Supabase password auth. The
`(protected)` layout redirects anyone without a session, and each server action
re-checks `ADMIN_UUIDS` — a session alone is not enough.

**Downloads** go straight to Supabase Storage, which sets the filename through a
`?download` parameter. Mixtapes still hosted on an older S3 bucket cannot do that
on unsigned requests, so those alone are proxied through `/api/download`, which
only fetches from an allowlist of known media hosts.

**Playback state** is held in one context (`src/contexts/audio-context.tsx`) so the
player keeps going across navigations, and it wires up the Media Session API for
lock screen controls.
