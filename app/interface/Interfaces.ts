export interface LanguageDetectorPlugin {
  type: 'languageDetector';
  async: boolean;
  detect: (_: (_: string) => void) => void;
  init: () => void;
  cacheUserLanguage: (_: string) => void;
}
