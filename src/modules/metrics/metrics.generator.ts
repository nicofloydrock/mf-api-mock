import { Metric } from './metrics.data';

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

const withRandomDrift = (
  length: number,
  start: number,
  variation: number,
): number[] => {
  const result: number[] = [];
  let current = start;
  for (let i = 0; i < length; i += 1) {
    const drift = (Math.random() - 0.5) * variation;
    current = clamp(current + drift, 0, Number.MAX_SAFE_INTEGER);
    result.push(Math.round(current * 100) / 100);
  }
  return result;
};

export const clampPoints = (points: number, min: number, max: number) =>
  clamp(points, min, max);

export const buildSeries = (
  base: Metric[],
  points: number,
  intervalMs: number,
) => {
  const now = Date.now();
  const length = clampPoints(points, 5, 60);

  return base.map((metric) => {
    const values = withRandomDrift(
      length,
      metric.value,
      metric.variation ?? metric.value * 0.15,
    );

    return {
      id: metric.id,
      label: metric.label,
      points: values.map((value, idx) => ({
        t: now - (length - idx - 1) * intervalMs,
        value,
      })),
    };
  });
};
