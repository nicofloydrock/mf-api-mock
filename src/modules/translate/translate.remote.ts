import { Logger } from '@nestjs/common';
import { translateExternal } from './translate.external';

export const translateRemote = async (
  base: string,
  source: string,
  target: string,
  text: string,
  logger: Logger,
) => {
  try {
    const translated = await translateExternal(base, source, target, text);
    return { translatedText: translated, provider: 'lingva', source, target };
  } catch (err) {
    logger.warn(`Fallo traducción externa: ${(err as Error).message}`);
    return {
      translatedText: `[fallback] ${text}`,
      provider: 'fallback',
      source,
      target,
    };
  }
};
