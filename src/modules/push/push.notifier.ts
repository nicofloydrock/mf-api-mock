import * as webPush from 'web-push';
import { SendPushDto } from './dto/send-push.dto';
import { PushStore } from './push.store';

export const deliver = async (store: PushStore, payload: SendPushDto) => {
  const results = await Promise.allSettled(
    store.all().map((sub) =>
      webPush.sendNotification(
        sub,
        JSON.stringify({
          title: payload.title ?? 'Push desde mock',
          body: payload.body ?? 'Mensaje generado por api-mock',
          target: payload.target,
        }),
      ),
    ),
  );
  const sent = results.filter((r) => r.status === 'fulfilled').length;
  return { sent, failed: results.length - sent, target: payload.target };
};
