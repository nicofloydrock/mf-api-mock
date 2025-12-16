import { Body, Controller, Post } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { TranslateDto } from './dto/translate.dto';
import { TranslateService } from './translate.service';

// NicoHaze - asistido con CODEX-Gemini
// Controlador de traducción: expone POST /translate con payload simple.
@ApiTags('translate')
@Controller(['translate', 'api/translate'])
export class TranslateController {
  constructor(private readonly service: TranslateService) {}

  @Post()
  @ApiOkResponse({ description: 'Texto traducido' })
  translate(@Body() body: TranslateDto) {
    return this.service.translate(body);
  }
}
