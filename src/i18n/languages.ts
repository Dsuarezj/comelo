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

export const DEFAULT_LANGUAGE = 'es';

export const getLanguageByCode = (code: string): Language => {
  return SUPPORTED_LANGUAGES.find(lang => lang.code === code) || SUPPORTED_LANGUAGES[0];
};
