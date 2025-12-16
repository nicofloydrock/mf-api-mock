import { Module } from '@nestjs/common';
import { InventoryController } from './inventory.controller';
import { InventoryService } from './inventory.service';
import { InventoryStore } from './inventory.store';

@Module({
  controllers: [InventoryController],
  providers: [InventoryService, InventoryStore],
})
export class InventoryModule {}
