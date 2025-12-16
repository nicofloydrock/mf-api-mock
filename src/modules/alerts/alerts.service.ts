import { Injectable, NotFoundException } from '@nestjs/common';
import { AlertsStore } from './alerts.store';
import { AckAlertDto } from './dto/ack-alert.dto';

// NicoHaze - asistido con CODEX-Gemini
// Servicio mock: replica el set de alertas del mf-api-mock.
@Injectable()
export class AlertsService {
  constructor(private readonly store: AlertsStore) {}

  findAll() {
    return { refreshedAt: Date.now(), alerts: this.store.randomSubset() };
  }

  ack(id: string, payload: AckAlertDto) {
    const alert = this.store.all().find((a) => a.id === id);
    if (!alert) throw new NotFoundException(`Alerta ${id} no existe`);
    const updated = { ...alert, ack: payload.ack };
    this.store.update(id, updated);
    return updated;
  }
}
