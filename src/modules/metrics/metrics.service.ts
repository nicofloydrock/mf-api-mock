import { Injectable } from '@nestjs/common';
import { buildSeries, clampPoints } from './metrics.generator';
import { loadMetrics } from './metrics.data';

const DEFAULT_POINTS = 15;
const MIN_POINTS = 5;
const MAX_POINTS = 60;
const INTERVAL_MS = 5000;

// NicoHaze - asistido con CODEX-Gemini
// Servicio mock: replica la forma y el comportamiento del mf-api-mock.
@Injectable()
export class MetricsService {
  private readonly base = loadMetrics();

  getMetrics(points?: number) {
    const length = clampPoints(points ?? DEFAULT_POINTS, MIN_POINTS, MAX_POINTS);
    return {
      refreshedAt: Date.now(),
      series: buildSeries(this.base, length, INTERVAL_MS),
    };
  }
}
