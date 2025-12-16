import { readFileSync } from 'fs';
import { join } from 'path';

export type Metric = {
  id: string;
  label: string;
  value: number;
  variation?: number;
  unit?: string;
};

export const loadMetrics = (): Metric[] => {
  const raw = readFileSync(
    join(__dirname, '../../dummyDB/metrics.json'),
    'utf8',
  );
  return JSON.parse(raw) as Metric[];
};
