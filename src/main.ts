import { buildApp } from './bootstrap/app.factory';

// NicoHaze - asistido con CODEX-Gemini
// Punto de entrada: levanta la app y expone Swagger.
const bootstrap = async () => {
  const app = await buildApp();
  const port = process.env.PORT || 5050;
  await app.listen(port);
  // eslint-disable-next-line no-console
  console.log(`Mock API lista en http://localhost:${port}`);
};

bootstrap();
