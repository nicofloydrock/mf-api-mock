import { readFileSync } from 'fs';
import { join } from 'path';

export type Dictionary = Record<string, Record<string, string>>;

export const loadDictionary = (): Dictionary => {
  const raw = readFileSync(
    join(__dirname, '../../dummyDB/translations.json'),
    'utf8',
  );
  return JSON.parse(raw) as Dictionary;
};

export const lookup = (dict: Dictionary, text: string, target: string) =>
  dict[text]?.[target];
