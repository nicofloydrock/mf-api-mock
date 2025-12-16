import { Module } from '@nestjs/common';
import { AlertsModule } from './modules/alerts/alerts.module';
import { InventoryModule } from './modules/inventory/inventory.module';
import { MetricsModule } from './modules/metrics/metrics.module';
import { PushModule } from './modules/push/push.module';
import { TranslateModule } from './modules/translate/translate.module';

// NicoHaze - asistido con CODEX-Gemini
// Módulo raíz que agrupa los módulos mock de negocio.
@Module({
  imports: [
    MetricsModule,
    InventoryModule,
    AlertsModule,
    TranslateModule,
    PushModule,
  ],
})
export class AppModule {}
