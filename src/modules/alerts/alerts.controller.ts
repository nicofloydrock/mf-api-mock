import { Body, Controller, Get, Param, Patch } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AckAlertDto } from './dto/ack-alert.dto';
import { AlertsService } from './alerts.service';

// NicoHaze - asistido con CODEX-Gemini
// Controlador de alertas: listado y ack para pruebas de front.
@ApiTags('alerts')
@Controller('alerts')
export class AlertsController {
  constructor(private readonly service: AlertsService) {}

  @Get()
  @ApiOkResponse({ description: 'Alertas simuladas' })
  findAll() {
    return this.service.findAll();
  }

  @Patch(':id/ack')
  @ApiOkResponse({ description: 'Alerta actualizada' })
  ack(@Param('id') id: string, @Body() body: AckAlertDto) {
    return this.service.ack(id, body);
  }
}
