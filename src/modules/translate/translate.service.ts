import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { TranslateDto } from './dto/translate.dto';
import { buildConfig } from './translate.config';
import { translateText } from './translate.strategy';

// NicoHaze - asistido con CODEX-Gemini
// Servicio de traducción: replica la respuesta del mf-api-mock con opción de mock.
@Injectable()
export class TranslateService {
  private readonly cfg = buildConfig();
  private readonly logger = new Logger(TranslateService.name);

  translate(payload: TranslateDto) {
    if (!payload.text?.trim()) {
      throw new BadRequestException('text is required');
    }
    return translateText(payload, this.cfg, this.logger);
  }
}
