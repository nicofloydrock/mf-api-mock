export const buildConfig = () => ({
  base: process.env.TRANSLATE_BASE || 'https://lingva.ml/api/v1',
  sourceLang: process.env.TRANSLATE_SOURCE_LANG || 'es',
  targetLang: process.env.TRANSLATE_TARGET_LANG || 'en',
  useMock: process.env.MOCK_TRANSLATE !== 'false',
});
