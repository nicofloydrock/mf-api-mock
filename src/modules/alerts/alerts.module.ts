import { Module } from '@nestjs/common';
import { AlertsController } from './alerts.controller';
import { AlertsService } from './alerts.service';
import { AlertsStore } from './alerts.store';

@Module({
  controllers: [AlertsController],
  providers: [AlertsService, AlertsStore],
})
export class AlertsModule {}
