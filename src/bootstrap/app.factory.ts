import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as dotenv from 'dotenv';
import { AppModule } from '../app.module';
import { corsConfig } from './cors';
import { setupSwagger } from './swagger';

// NicoHaze - asistido con CODEX-Gemini
// Construye la app Nest con CORS, validación y Swagger.
export const buildApp = async () => {
  dotenv.config();
  const app = await NestFactory.create(AppModule, { cors: false });
  app.enableCors(corsConfig);
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, transform: true, forbidNonWhitelisted: true }),
  );
  setupSwagger(app);
  return app;
};
