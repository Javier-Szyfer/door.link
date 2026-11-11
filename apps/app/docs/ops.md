# Operación

## CORS del bucket de media

La política de `door-media` tiene dos reglas, y `docs/r2-cors.json` es la política completa:

- `PUT` desde door.link: las subidas del admin (`apps/web`). En local, door.link corre en `localhost:3001`.
- `GET`/`HEAD` con `Range` desde la app: las descargas offline leen los MP3 con `fetch`.

Para cambiarla:

1. Cloudflare → R2 → `door-media` → Settings → CORS Policy → Edit.
2. Pegar `docs/r2-cors.json` entero. Si se pega solo una regla, se pierde la otra.
3. Verificar:

   ```sh
   curl -sI -H "Origin: http://localhost:3000" \
     https://media.keyholemedia.store/audio/1793797475579-door-214.mp3 \
     | grep -i access-control-allow-origin
   ```

   Debe imprimir el origen.

R2 no acepta comodines de subdominio: cada origen se agrega exacto. Un preview solo puede descargar desde la URL fija de su branch (`door-app-git-<branch>-javierszyfers-projects.vercel.app`), y solo si esa URL está en la regla.

## Deploy

- La app vive en el monorepo de door.link (`apps/app`), importado en Vercel (framework Next.js, build `bun run build`). En el proyecto de la app, Root Directory `apps/app`.
- Dos proyectos en Vercel apuntan a este repo: `door-link` (Root Directory `apps/web`) y `door-app` (Root Directory `apps/app`). En los dos están activados "Include files outside the root directory" y "Skip deployments when there are no changes".
- Dominio de producción: `app.door.link`, con un CNAME en Namecheap (el DNS de door.link no está en Cloudflare). Ya está en la regla de CORS.
- Deployment Protection está desactivada en `door-app`, porque la app instalada en iOS no comparte cookies con Safari. La app manda `noindex`.

## Datos

La lista sale de `FEED_URL`. Sin definir en producción usa `https://www.door.link/rss.xml`; en local usa `http://localhost:3001/rss.xml` (`apps/web` corriendo con `bun run dev`). Next puede prerenderizar `/api/mixes` durante el build, así que `FEED_URL` tiene que estar definida al hacer build y también al arrancar. Ver `.env.example`. La portada y la duración vienen de `itunes:image` e `itunes:duration`, que emite `apps/web/src/utils/rss.ts`.

## Pantalla de arranque

Las imágenes de `public/splash` son lisas, del color `THEME_BG` de `src/lib/theme.ts`. Después de ellas la app muestra un skeleton de Home: probamos una cerradura como splash, pero en la app instalada iOS no empalma su imagen de arranque con la página y el corte se notaba. Si cambia el fondo, actualizar `THEME_BG` y `--bg` y correr `bun run splash`; los tests avisan si no coinciden. iOS las lee al instalar la app, así que para ver un cambio hay que borrarla y volver a agregarla a la pantalla de inicio.

## Probar en el iPhone

`bun dev --hostname 0.0.0.0` y abrir `http://<ip-de-la-mac>:3000` en Safari sirve para la UI, pero el service worker y las descargas necesitan HTTPS: probar eso en el deploy de Vercel, instalada con "Agregar a pantalla de inicio".
