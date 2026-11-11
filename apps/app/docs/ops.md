# Operación

## CORS del bucket de media

Las descargas offline leen los MP3 con `fetch`, así que `door-media` tiene que permitir el origen de la app.

1. Cloudflare → R2 → `door-media` → Settings → CORS Policy → Edit.
2. Pegar `docs/r2-cors.json`. Reemplazar `https://door-app-lac.vercel.app` por la URL de producción real si Vercel asigna otra.
3. Verificar:

   ```sh
   curl -sI -H "Origin: http://localhost:3000" \
     https://media.keyholemedia.store/audio/1793797475579-door-214.mp3 \
     | grep -i access-control-allow-origin
   ```

   Debe imprimir el origen.

R2 no acepta comodines de subdominio: cada origen (dominio propio, URL de producción) se agrega exacto. Los previews por branch no pueden descargar.

## Deploy

- Repo privado en GitHub, importado en Vercel (framework Next.js, build `bun run build`).
- Deployment Protection activada mientras se itera: solo el dueño puede abrirla.
- Para abrirla a oyentes: desactivar la protección (la app ya manda `noindex`).
- Dominio propio: agregarlo en Vercel y en `AllowedOrigins`.

## Datos

La lista sale de `https://www.door.link/rss.xml`. La portada y la duración vienen de `itunes:image` e `itunes:duration`, que agrega door-new (branch `feat/rss-itunes-tags`). Hasta que eso esté en producción, los mixes aparecen sin portada ni duración.

## Pantalla de arranque

Las imágenes de `public/splash` son lisas, del color `THEME_BG` de `src/lib/theme.ts`. Después de ellas la app muestra un skeleton de Home: probamos una cerradura como splash, pero en la app instalada iOS no empalma su imagen de arranque con la página y el corte se notaba. Si cambia el fondo, actualizar `THEME_BG` y `--bg` y correr `bun run splash`; los tests avisan si no coinciden. iOS las lee al instalar la app, así que para ver un cambio hay que borrarla y volver a agregarla a la pantalla de inicio.

## Probar en el iPhone

`bun dev --hostname 0.0.0.0` y abrir `http://<ip-de-la-mac>:3000` en Safari sirve para la UI, pero el service worker y las descargas necesitan HTTPS: probar eso en el deploy de Vercel, instalada con "Agregar a pantalla de inicio".
