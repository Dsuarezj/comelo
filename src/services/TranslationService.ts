import i18n from '../i18n';

type Language = 'es' | 'en' | 'ca';
type RegionalLanguage = Language | string;

interface TranslationCache {
  [key: string]: any;
}

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

  async translate(path: string, lang?: RegionalLanguage): Promise<string> {
    const currentLang = lang || this.getRegionalLanguage();
    const parts = path.split('.');

    if (parts.length < 2) {
      return path;
    }

    const [scope, ...rest] = parts;

    if (scope === 'recipe') {
      const recipeId = rest[0];
      if (!recipeId) return path;

      const translations = await this.loadWithFallback('recipes', recipeId, currentLang);

      let value = translations;
      for (const part of parts) {
        value = value?.[part];
        if (!value) break;
      }

      return value || path;
    }

    if (scope === 'allergens') {
      const translations = await this.loadWithFallback('allergens', 'allergens', currentLang);

      const allergenId = rest[0];
      return translations?.[allergenId] || path;
    }

    const translations = await this.loadWithFallback('products', 'common', currentLang);

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
    await this.loadWithFallback('products', 'common', currentLang);
    await this.loadWithFallback('allergens', 'allergens', currentLang);
  }
}

export const translationService = new TranslationService();
