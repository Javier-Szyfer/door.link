# door

Monorepo con bun workspaces.

## Estructura

- `apps/web`: door.link (workspace `web`, puerto 3001, Tailwind 3).
- `apps/app`: la PWA en app.door.link (workspace `app`, puerto 3000, Tailwind 4).
- Un solo `bun.lock` en la raíz; `overrides` y `trustedDependencies` viven en el `package.json` raíz.
- Cada app tiene su propio `AGENTS.md`/`CLAUDE.md`.

## Comandos

- `bun install` en la raíz.
- `bun run dev` / `bun run build` / `bun run test` en la raíz corren en todas las apps.
- Por app: `cd apps/<app>` y `bun run <script>`.

## Reglas

- No compartir UI ni CSS entre apps; door.link no cambia de estilos.
- No pushear hasta probar en local.
