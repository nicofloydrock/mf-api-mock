import { readFileSync } from 'fs';
import { join } from 'path';

export type InventoryTemplate = {
  id: string;
  name: string;
  stockBase: number;
  stockRange: number;
  incomingMax: number;
};

export type InventoryItem = {
  id: string;
  name: string;
  stock: number;
  incoming: number;
  updatedAt: number;
};

export type InventoryUpdate = Partial<Pick<InventoryItem, 'stock' | 'incoming'>>;

const load = (): InventoryTemplate[] => {
  const raw = readFileSync(
    join(__dirname, '../../dummyDB/inventory.json'),
    'utf8',
  );
  return JSON.parse(raw) as InventoryTemplate[];
};

const randomStock = (template: InventoryTemplate) =>
  Math.floor(template.stockBase + Math.random() * template.stockRange);

const randomIncoming = (template: InventoryTemplate) =>
  Math.floor(Math.random() * (template.incomingMax + 1));

export class InventoryStore {
  private readonly templates = load();
  private readonly overrides = new Map<string, InventoryUpdate>();

  snapshot(): InventoryItem[] {
    const now = Date.now();
    return this.templates.map((template) => {
      const override = this.overrides.get(template.id);
      return {
        id: template.id,
        name: template.name,
        stock: override?.stock ?? randomStock(template),
        incoming: override?.incoming ?? randomIncoming(template),
        updatedAt: now,
      };
    });
  }

  update(id: string, patch: InventoryUpdate) {
    const existing = this.overrides.get(id) ?? {};
    this.overrides.set(id, { ...existing, ...patch });
  }
}
