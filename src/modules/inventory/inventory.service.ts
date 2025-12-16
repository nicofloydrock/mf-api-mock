import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { InventoryStore } from './inventory.store';

// NicoHaze - asistido con CODEX-Gemini
// Servicio mock: replica el comportamiento del mf-api-mock con valores aleatorios.
@Injectable()
export class InventoryService {
  constructor(private readonly store: InventoryStore) {}

  findAll() {
    return { refreshedAt: Date.now(), items: this.store.snapshot() };
  }

  findOne(id: string) {
    const item = this.store.snapshot().find((i) => i.id === id);
    if (!item) throw new NotFoundException(`Inventario ${id} no encontrado`);
    return item;
  }

  update(id: string, payload: UpdateInventoryDto) {
    this.findOne(id);
    this.store.update(id, payload);
    return this.findOne(id);
  }
}
