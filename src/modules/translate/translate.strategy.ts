import { Logger } from '@nestjs/common';
import { TranslateDto } from './dto/translate.dto';
import { translateMock } from './translate.mock';
import { translateRemote } from './translate.remote';

export type TranslateConfig = {
  base: string;
  sourceLang: string;
  targetLang: string;
  useMock: boolean;
};

export const translateText = async (
  payload: TranslateDto,
  cfg: TranslateConfig,
  logger: Logger,
) => {
  const source = payload.source || cfg.sourceLang;
  const target = payload.target || cfg.targetLang;
  const text = payload.text;

  if (cfg.useMock) return translateMock(text, target);

  try {
    const translated = await translateRemote(cfg.base, source, target, text, logger);
    return { lang: target, translated };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    logger.warn(`Fallo traducción externa: ${message}`);
    return { lang: target, translated: `[fallback] ${text} (${message})` };
  }
};
