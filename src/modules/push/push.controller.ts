import { Body, Controller, Post } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { SendPushDto } from './dto/send-push.dto';
import { SubscribeDto } from './dto/subscribe.dto';
import { PushService } from './push.service';

// NicoHaze - asistido con CODEX-Gemini
// Controlador de push: permite suscripción y envíos inmediatos/diferidos.
@ApiTags('push')
@Controller('push')
export class PushController {
  constructor(private readonly service: PushService) {}

  @Post('subscribe')
  @ApiOkResponse({ description: 'Suscripción registrada' })
  subscribe(@Body() body: SubscribeDto) {
    return this.service.subscribe(body);
  }

  @Post('send')
  @ApiOkResponse({ description: 'Notificación programada o enviada' })
  send(@Body() body: SendPushDto) {
    return this.service.send(body);
  }
}
