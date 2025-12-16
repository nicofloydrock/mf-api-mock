import { Injectable, Logger } from '@nestjs/common';
import { SendPushDto } from './dto/send-push.dto';
import { SubscribeDto } from './dto/subscribe.dto';
import { configureVapid } from './push.config';
import { deliver } from './push.notifier';
import { PushStore } from './push.store';
// NicoHaze - asistido con CODEX-Gemini
// Servicio mock: suscribe y programa envíos push.
@Injectable()
export class PushService {
  private readonly logger = new Logger(PushService.name);
  private readonly vapid = configureVapid();
  constructor(private readonly store: PushStore) {}

  subscribe(payload: SubscribeDto) {
    return this.store.save(payload);
  }

  async send(payload: SendPushDto) {
    if (!this.vapid.enabled) {
      throw new Error('VAPID keys missing in env');
    }

    const delayMs = (payload.delaySeconds ?? 0) * 1000;
    const exec = async () => {
      await deliver(this.store, payload);
    };

    if (delayMs > 0) {
      setTimeout(exec, delayMs);
    } else {
      await exec();
    }

    return { ok: true };
  }
}
