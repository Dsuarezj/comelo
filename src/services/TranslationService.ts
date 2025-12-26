import i18n from '../i18n';

type Language = 'es' | 'en' | 'ca';
type RegionalLanguage = Language | string;

interface TranslationCache {
  [key: string]: any;
}

const SCOPES_WITH_DYNAMIC_ID = ['recipe'];

class TranslationService {
  private cache: TranslationCache = {};

  private getRegionalLanguage(): RegionalLanguage {
    const savedLang = localStorage.getItem('comelo_language');
    if (savedLang && savedLang.includes('-')) {
      return savedLang;
    }

    const browserLang = navigator.language || (navigator as any).userLanguage;
    const normalizedLang = browserLang.toLowerCase();

    if (normalizedLang.includes('-')) {
      return normalizedLang;
    }

    return i18n.language;
  }

  private async loadTranslations(type: string, id: string, lang: RegionalLanguage): Promise<void> {
    const cacheKey = `${type}_${id}_${lang}`;

    if (this.cache[cacheKey]) {
      return;
    }

    try {
      const translations = await import(`../data/translations/${type}/${id}.${lang}.json`);
      this.cache[cacheKey] = translations?.default || translations || {};
    } catch (error) {
      console.warn(`Failed to load ${type} translations for ${id} (${lang})`, error);
      this.cache[cacheKey] = {};
    }
  }

  private async loadWithFallback(type: string, id: string, regionalLang: RegionalLanguage): Promise<any> {
    const baseLang = regionalLang.split('-')[0] as Language;
    const regionalKey = `${type}_${id}_${regionalLang}`;
    const baseKey = `${type}_${id}_${baseLang}`;

    if (regionalLang !== baseLang) {
      await this.loadTranslations(type, id, regionalLang);
    }
    await this.loadTranslations(type, id, baseLang);

    const regionalData = this.cache[regionalKey] || {};
    const baseData = this.cache[baseKey] || {};

    return { ...baseData, ...regionalData };
  }

  private resolveTranslationFile(scope: string, rest: string[]): { type: string; id: string } {
    const type = `${scope}s`;

    if (SCOPES_WITH_DYNAMIC_ID.includes(scope)) {
      return { type, id: rest[0] };
    }

    return { type, id: 'common' };
  }

  private async loadByScope(scope: string, lang: RegionalLanguage, dynamicId?: string): Promise<any> {
    const rest = dynamicId ? [dynamicId] : [];
    const { type, id } = this.resolveTranslationFile(scope, rest);
    return this.loadWithFallback(type, id, lang);
  }

  async translate(path: string, lang?: RegionalLanguage): Promise<string> {
    const currentLang = lang || this.getRegionalLanguage();
    const parts = path.split('.');

    if (parts.length < 2) {
      return path;
    }

    const [scope, ...rest] = parts;
    const { type, id } = this.resolveTranslationFile(scope, rest);

    const translations = await this.loadWithFallback(type, id, currentLang);

    let value = translations;
    for (const part of parts) {
      value = value?.[part];
      if (!value) break;
    }

    return value || path;
  }

  clearCache(): void {
    this.cache = {};
  }

  async preloadEssentials(lang?: RegionalLanguage): Promise<void> {
    const currentLang = lang || this.getRegionalLanguage();
    await this.loadByScope('product', currentLang);
    await this.loadByScope('allergen', currentLang);
  }
}

export const translationService = new TranslationService();
