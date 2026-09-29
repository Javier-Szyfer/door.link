# door.link

A handpicked music selection, grown over time, algorithm-free, made for listening
and dancing.

[door.link](https://door.link)

## Overview

A mixtape archive: a public catalogue with a persistent audio player, per-mixtape
pages, an RSS feed, and an admin area for publishing new entries.

Built with Next.js 16, React 19, TypeScript, Tailwind and Supabase. Deployed on
Vercel.

## Development

### Prerequisites

- [Bun](https://bun.sh)
- Node 24+
- A Supabase project with a `mixtapes` table and a public `media` storage bucket

### Setup

```bash
bun install
cp .env.example .env.local   # fill in your Supabase credentials
bun dev
```

| Variable | |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key |
| `ADMIN_UUIDS` | comma-separated Supabase user ids allowed into `/admin` |

The `NEXT_PUBLIC_` values ship in the browser bundle by design, so configure row
level security on every table and bucket before pointing this at real data.

### Scripts

`bun dev` · `bun run build` · `bun run test` · `bun run lint:fix` · `bun run format:fix`

## License

[MIT](./LICENSE)
