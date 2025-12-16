import { Module } from '@nestjs/common';
import { PushController } from './push.controller';
import { PushService } from './push.service';
import { PushStore } from './push.store';

@Module({
  controllers: [PushController],
  providers: [PushService, PushStore],
})
export class PushModule {}
