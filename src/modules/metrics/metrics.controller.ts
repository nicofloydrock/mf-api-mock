import { Controller, Get, Query } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { MetricsQueryDto } from './dto/metrics-query.dto';
import { MetricsService } from './metrics.service';

// NicoHaze - asistido con CODEX-Gemini
// Controlador de métricas: entrega series sintéticas para gráficas en tiempo real.
@ApiTags('metrics')
@Controller(['metrics', 'api/metrics'])
export class MetricsController {
  constructor(private readonly service: MetricsService) {}

  @Get()
  @ApiOkResponse({
    description: 'Series de métricas simuladas',
  })
  getMetrics(@Query() query: MetricsQueryDto) {
    return this.service.getMetrics(query.points);
  }
}
