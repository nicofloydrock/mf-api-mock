# API Mock Nest

Arquetipo de API mock en NestJS para microfrontends (métricas, inventario, alertas, traducción y push). Listo para usarse en Railway, Render o local con CORS abierto y Swagger.

## Stack
- NestJS 10 + TypeScript
- Swagger UI (`/docs`)
- Validación con `class-validator`
- Web Push (`web-push`) con VAPID
- Axios para fallback de traducción (Lingva)

## Scripts
- `npm install`
- `npm run start:dev` → modo watch
- `npm run build` + `npm run start` → producción

## Variables de entorno
Ver `.env.example`:
- `PORT` (default `5050`)
- `MOCK_TRANSLATE` (`true` para usar diccionario mock)
- `LINGVA_BASE_URL` (`https://lingva.ml` por defecto)
- `VAPID_PUBLIC_KEY` / `VAPID_PRIVATE_KEY` / `VAPID_SUBJECT` para push

## Endpoints principales
- `GET /metrics?points=20` → series sintéticas para gráficas.
- `GET /inventory` y `GET /inventory/:id` → inventario mock; `PATCH /inventory/:id` para actualizar stock/ubicación.
- `GET /alerts` → alertas; `PATCH /alerts/:id/ack` para confirmar.
- `POST /translate` → `{ text, source?, target? }` usando diccionario mock o Lingva.
- `POST /push/subscribe` → guarda suscripción Web Push.
- `POST /push/send` → `{ title, body, target?, delaySeconds? }` envía/programa notificación.

## CORS y Swagger
- CORS abierto (`origin: true`) y cabecera `x-tunnel-id` permitida.
- Swagger disponible en `/docs`.

## Datos mock
Se cargan desde `src/dummyDB/*.json`. Puedes editar los JSON para simular otros escenarios sin tocar el código.

## Producción rápida
1. `npm install`
2. Configura VAPID en variables o desactiva push si no los tienes.
3. `npm run build && npm run start`
4. Abre `http://localhost:5050/docs` para probar.

## Notas
- Las suscripciones push se almacenan en memoria (se pierden al reiniciar). Si requieres persistencia, agrega un repositorio ligero en `PushService`.
- Si `MOCK_TRANSLATE=true`, no se llama a la API externa y nunca debería fallar con 500.
