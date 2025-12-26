import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { getDefaultLanguage, DEFAULT_FALLBACK_LANGUAGE } from './languages';

import es from './locales/es.json';
import en from './locales/en.json';
import ca from './locales/ca.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      es: { translation: es },
      en: { translation: en },
      ca: { translation: ca },
    },
    fallbackLng: {
      'es-AR': ['es'],
      'es-MX': ['es'],
      'es-EC': ['es'],
      'es-ES': ['es'],
      'en-US': ['en'],
      'en-GB': ['en'],
      'ca-ES': ['ca'],
      'default': [DEFAULT_FALLBACK_LANGUAGE]
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
    load: 'currentOnly',
    nonExplicitSupportedLngs: true,
  });

export default i18n;
