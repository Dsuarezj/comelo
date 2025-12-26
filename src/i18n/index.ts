import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { getDefaultLanguage, DEFAULT_FALLBACK_LANGUAGE } from './languages';

import es from './locales/es.json';
import esES from './locales/es-ES.json';
import esEC from './locales/es-EC.json';
import en from './locales/en.json';
import ca from './locales/ca.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      es: { translation: es },
      'es-ES': { translation: { ...es, ...esES } },
      'es-EC': { translation: { ...es, ...esEC } },
      'es-MX': { translation: es },
      'es-AR': { translation: es },
      en: { translation: en },
      ca: { translation: ca },
    },
    fallbackLng: (code) => {
      if (!code) return [DEFAULT_FALLBACK_LANGUAGE];
      const baseLang = code.split('-')[0];
      return baseLang === code
        ? [DEFAULT_FALLBACK_LANGUAGE]
        : [baseLang, DEFAULT_FALLBACK_LANGUAGE];
    },
    lng: getDefaultLanguage(),
    debug: false,
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'comelo_language',
    },
  });

export default i18n;
