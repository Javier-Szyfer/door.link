# door

Monorepo with bun workspaces.

## Structure

- `apps/web`: door.link (workspace `web`, port 3001, Tailwind 3).
- `apps/app`: the PWA at app.door.link (workspace `app`, port 3000, Tailwind 4).
- A single `bun.lock` at the root; `overrides` and `trustedDependencies` live in the root `package.json`.
- Each app has its own `AGENTS.md`/`CLAUDE.md`.

## Commands

- `bun install` at the root.
- `bun run dev` / `bun run build` / `bun run test` at the root run across all apps.
- Per app: `cd apps/<app>` and `bun run <script>`.
- Run Biome/lint inside each app (`cd apps/web` / `cd apps/app`), never from the root: each uses a different version and the root resolves the wrong one.

## Rules

- Do not share UI or CSS between apps; door.link's styles do not change.
- Do not push until tested locally.
- Everything written in the repo is in English: docs, code comments, commit messages, PR titles and descriptions.
