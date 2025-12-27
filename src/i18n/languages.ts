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

export const getLanguageByCode = (code: string | undefined): Language => {
  if (!code) {
    return SUPPORTED_LANGUAGES[0];
  }

  const exact = SUPPORTED_LANGUAGES.find(lang => lang.code === code);
  if (exact) return exact;

  const baseLang = code.split('-')[0];
  const baseMatch = SUPPORTED_LANGUAGES.find(lang => lang.code.startsWith(baseLang));

  return baseMatch || SUPPORTED_LANGUAGES[0];
};
