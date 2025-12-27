import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { DEFAULT_FALLBACK_LANGUAGE, SUPPORTED_LANGUAGES } from './languages';
import { StorageKeys } from '../utils/storage';

const TRANSLATION_NAMESPACE = 'translation';
const loadedLanguages = new Set<string>();

const loadTranslationFile = async (langCode: string): Promise<Record<string, any> | null> => {
  try {
    const module = await import(`./locales/${langCode}.json`);
    return module.default;
  } catch {
    return null;
  }
};

export const loadLanguage = async (langCode: string): Promise<void> => {
  if (loadedLanguages.has(langCode)) {
    return;
  }

  if (!i18n.isInitialized) {
    await new Promise<void>((resolve) => {
      const checkInitialized = () => {
        if (i18n.isInitialized) {
          resolve();
        } else {
          requestAnimationFrame(checkInitialized);
        }
      };
      checkInitialized();
    });
  }

  const baseLang = langCode.includes('-') ? langCode.split('-')[0] : langCode;
  const isRegionalVariant = langCode !== baseLang;

  if (isRegionalVariant) {
    const [baseTranslation, variantTranslation] = await Promise.all([
      loadTranslationFile(baseLang),
      loadTranslationFile(langCode),
    ]);

    if (!loadedLanguages.has(baseLang)) {
      if (!baseTranslation) {
        await loadLanguage(DEFAULT_FALLBACK_LANGUAGE);
      }
      const base = baseTranslation || i18n.getResourceBundle(DEFAULT_FALLBACK_LANGUAGE, TRANSLATION_NAMESPACE) || {};
      i18n.addResourceBundle(baseLang, TRANSLATION_NAMESPACE, base, true, true);
      loadedLanguages.add(baseLang);
    }

    i18n.addResourceBundle(langCode, TRANSLATION_NAMESPACE, variantTranslation || {}, true, true);
    
    if (!loadedLanguages.has(DEFAULT_FALLBACK_LANGUAGE)) {
      await loadLanguage(DEFAULT_FALLBACK_LANGUAGE);
    }
  } else {
    const translation = await loadTranslationFile(langCode);
    
    if (!translation) {
      await loadLanguage(DEFAULT_FALLBACK_LANGUAGE);
      const fallback = i18n.getResourceBundle(DEFAULT_FALLBACK_LANGUAGE, TRANSLATION_NAMESPACE);
      i18n.addResourceBundle(langCode, TRANSLATION_NAMESPACE, fallback, true, true);
    } else {
      i18n.addResourceBundle(langCode, TRANSLATION_NAMESPACE, translation, true, true);
      await loadLanguage(DEFAULT_FALLBACK_LANGUAGE);
    }
  }

  loadedLanguages.add(langCode);
};

const getInitialLanguage = (): string | undefined => {
  const savedLanguage = localStorage.getItem(StorageKeys.LANGUAGE);
  if (savedLanguage && SUPPORTED_LANGUAGES.some(lang => lang.code === savedLanguage)) {
    return savedLanguage;
  }
  return undefined;
};

const initializeI18n = async () => {
  const savedLanguage = getInitialLanguage();
  let initialLanguage = savedLanguage;

  if (!initialLanguage) {
    const detectedLanguage = new LanguageDetector().detect();
    if (typeof detectedLanguage === 'string') {
      const baseLang = detectedLanguage.split('-')[0];
      const supportedMatch = SUPPORTED_LANGUAGES.find(
        lang => lang.code === detectedLanguage || lang.code.startsWith(baseLang)
      );
      if (supportedMatch) {
        initialLanguage = supportedMatch.code;
      }
    }
  }

  initialLanguage = initialLanguage || DEFAULT_FALLBACK_LANGUAGE;

  await i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      resources: {},
      fallbackLng: (code) => {
        if (!code) return [DEFAULT_FALLBACK_LANGUAGE];
        const baseLang = code.split('-')[0];
        return baseLang === code
          ? [DEFAULT_FALLBACK_LANGUAGE]
          : [baseLang, DEFAULT_FALLBACK_LANGUAGE];
      },
      lng: initialLanguage,
      debug: false,
      interpolation: {
        escapeValue: false,
      },
      detection: {
        order: ['localStorage', 'navigator'],
        caches: ['localStorage'],
        lookupLocalStorage: StorageKeys.LANGUAGE,
      },
    });

  await loadLanguage(initialLanguage);
};

initializeI18n();

export default i18n;
