export interface Language {
  code: string;
  name: string;
  flag: string;
}

export const SUPPORTED_LANGUAGES: Language[] = [
  { code: 'es-ES', name: 'Espanol (Espana)', flag: '🇪🇸' },
  { code: 'es-EC', name: 'Espanol (Ecuador)', flag: '🇪🇨' },
  { code: 'es-MX', name: 'Espanol (Mexico)', flag: '🇲🇽' },
  { code: 'es-AR', name: 'Espanol (Argentina)', flag: '🇦🇷' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'ca', name: 'Catala', flag: '🇪🇸' },
];

export const DEFAULT_FALLBACK_LANGUAGE = 'es';

export const getLanguageByCode = (code: string): Language => {
  const exact = SUPPORTED_LANGUAGES.find(lang => lang.code === code);
  if (exact) return exact;

  const baseLang = code.split('-')[0];
  const baseMatch = SUPPORTED_LANGUAGES.find(lang => lang.code.startsWith(baseLang));

  return baseMatch || SUPPORTED_LANGUAGES[0];
};

export const getDefaultLanguage = (): string => {
  const savedLanguage = localStorage.getItem('comelo_language');
  if (savedLanguage) {
    const baseLang = savedLanguage.split('-')[0];
    if (SUPPORTED_LANGUAGES.some(lang => lang.code === baseLang)) {
      return savedLanguage;
    }
  }

  const browserLanguage = navigator.language || (navigator as any).userLanguage;
  const languageCode = browserLanguage.toLowerCase();
  const baseLangCode = languageCode.split('-')[0];

  const isSupported = SUPPORTED_LANGUAGES.some(lang => lang.code === baseLangCode);

  return isSupported ? languageCode : DEFAULT_FALLBACK_LANGUAGE;
};
