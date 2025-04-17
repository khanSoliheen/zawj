import * as Localization from 'expo-localization';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import { LanguageDetectorPlugin } from './interface/Interfaces';
import ar from './locales/ar.json';
import en from './locales/en.json';

// creating a language detection plugin using expo
// http://i18next.com/docs/ownplugin/#languagedetector
const languageDetector: LanguageDetectorPlugin = {
  type: 'languageDetector',
  async: true, // flags below detection to be async
  detect: (callback) => {
    Localization.getLocalizationAsync().then(({ locale }) => {
      callback(locale);
    });
  },
  init: () => { },
  cacheUserLanguage: () => { },
};

i18n
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      ar: { translation: ar }
    },
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
