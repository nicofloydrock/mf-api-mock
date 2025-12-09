# API Mock

Servidor HTTP sencillo (Node) para métricas, inventario, alerts, traducción mock y Web Push (VAPID).

## Endpoints
- `GET /metrics` o `/api/metrics` (`?points=22`): métricas mock.
- `GET /inventory`, `GET /alerts`.
- `POST /translate`: `{ text }` → traducción mock (o Lingva si `MOCK_TRANSLATE=false`).
- `POST /push/subscribe`: guarda suscripciones push (usa VAPID).
- `POST /push/send`: `{ title?, body?, target?, delaySeconds? }` envía push a las suscripciones.

## Variables
- `PORT` (default 5050)
- `MOCK_TRANSLATE` (default true; pon `false` para usar Lingva)
- `TRANSLATE_API`, `TRANSLATE_SOURCE_LANG`, `TRANSLATE_TARGET_LANG`
- `VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`, `VAPID_SUBJECT` (obligatorias para Web Push)

## Scripts
- `npm run dev` (tsx), `npm run build`, `npm run start` (usa dist/index.js).

## CORS
- `Access-Control-Allow-Origin: *` y headers abiertos.
