import i18n from '../i18n';

type Language = 'es' | 'en' | 'ca';

interface TranslationCache {
  [key: string]: any;
}

class TranslationService {
  private cache: TranslationCache = {};

  private async loadTranslations(type: string, id: string, lang: Language): Promise<void> {
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

  async translate(path: string, lang?: Language): Promise<string> {
    const currentLang = lang || (i18n.language as Language);
    const parts = path.split('.');

    if (parts.length < 2) {
      return path;
    }

    const [scope, ...rest] = parts;

    if (scope === 'recipe') {
      const recipeId = rest[0];
      if (!recipeId) return path;

      await this.loadTranslations('recipes', recipeId, currentLang);
      const translations = this.cache[`recipes_${recipeId}_${currentLang}`];

      let value = translations;
      for (const part of parts) {
        value = value?.[part];
        if (!value) break;
      }

      return value || path;
    }

    if (scope === 'allergens') {
      await this.loadTranslations('allergens', 'allergens', currentLang);
      const translations = this.cache[`allergens_allergens_${currentLang}`];

      const allergenId = rest[0];
      return translations?.[allergenId] || path;
    }

    await this.loadTranslations('products', 'common', currentLang);
    const translations = this.cache[`products_common_${currentLang}`];

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

  async preloadEssentials(lang: Language): Promise<void> {
    await this.loadTranslations('products', 'common', lang);
  }
}

export const translationService = new TranslationService();
