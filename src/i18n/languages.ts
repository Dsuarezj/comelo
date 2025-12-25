export interface Language {
  code: string;
  name: string;
  flag: string;
}

export const SUPPORTED_LANGUAGES: Language[] = [
  { code: 'es', name: 'Espanol', flag: 'ES' },
  { code: 'en', name: 'English', flag: 'EN' },
  { code: 'ca', name: 'Catala', flag: 'CA' },
];

export const DEFAULT_FALLBACK_LANGUAGE = 'es';

export const getLanguageByCode = (code: string): Language => {
  return SUPPORTED_LANGUAGES.find(lang => lang.code === code) || SUPPORTED_LANGUAGES[0];
};

export const getDefaultLanguage = (): string => {
  const savedLanguage = localStorage.getItem('comelo_language');
  if (savedLanguage && SUPPORTED_LANGUAGES.some(lang => lang.code === savedLanguage)) {
    return savedLanguage;
  }

  const browserLanguage = navigator.language || (navigator as any).userLanguage;
  const languageCode = browserLanguage.split('-')[0].toLowerCase();

  const isSupported = SUPPORTED_LANGUAGES.some(lang => lang.code === languageCode);

  return isSupported ? languageCode : DEFAULT_FALLBACK_LANGUAGE;
};
