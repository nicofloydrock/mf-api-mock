import { Body, Controller, Get, Param, Patch } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { UpdateInventoryDto } from './dto/update-inventory.dto';
import { InventoryService } from './inventory.service';

// NicoHaze - asistido con CODEX-Gemini
// Controlador de inventario: listado y actualización parcial mock.
@ApiTags('inventory')
@Controller('inventory')
export class InventoryController {
  constructor(private readonly service: InventoryService) {}

  @Get()
  @ApiOkResponse({ description: 'Listado de inventario simulado' })
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOkResponse({ description: 'Detalle de inventario' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @ApiOkResponse({ description: 'Inventario actualizado' })
  update(@Param('id') id: string, @Body() body: UpdateInventoryDto) {
    return this.service.update(id, body);
  }
}
