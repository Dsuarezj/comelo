import { Recipe } from '../types';
import i18n from '../i18n';

type Language = 'es' | 'en' | 'ca';

interface TranslationCache {
  [key: string]: any;
}

class TranslationService {
  private cache: TranslationCache = {};
  private loadedRecipes: Set<string> = new Set();

  async loadProductTranslations(lang: Language): Promise<void> {
    const cacheKey = `products_${lang}`;

    if (this.cache[cacheKey]) {
      return;
    }

    try {
      const translations = await import(`../data/translations/products/common.${lang}.json`);
      this.cache[cacheKey] = translations.default || translations;
      
    } catch (error) {
      console.warn(`Failed to load product translations for ${lang}`, error);
      this.cache[cacheKey] = {};
    }
  }

  async loadRecipeTranslations(recipeId: string, lang: Language): Promise<void> {
    const cacheKey = `recipe_${recipeId}_${lang}`;

    if (this.cache[cacheKey]) {
      return;
    }

    try {
      const translations = await import(`../data/translations/recipes/${recipeId}.${lang}.json`);
      this.cache[cacheKey] = translations.default || translations;
      this.loadedRecipes.add(`${recipeId}_${lang}`);
    } catch (error) {
      console.warn(`Failed to load recipe translations for ${recipeId} (${lang})`, error);
      this.cache[cacheKey] = {};
    }
  }

  async getProductName(productKey: string, lang: Language = 'es'): Promise<string> {
    await this.loadProductTranslations(lang);
    const translations = this.cache[`products_${lang}`];
    return translations?.product?.[productKey] || productKey;
  }

  async getCategoryName(categoryKey: string, lang: Language = 'es'): Promise<string> {
    await this.loadProductTranslations(lang);
    const translations = this.cache[`products_${lang}`];
    return translations?.category?.[categoryKey] || categoryKey;
  }

  async getTagName(tagKey: string, lang: Language = 'es'): Promise<string> {
    await this.loadProductTranslations(lang);
    const translations = this.cache[`products_${lang}`];
    return translations?.tag?.[tagKey] || tagKey;
  }

  async getNutritionDescription(nutritionKey: string, lang: Language = 'es'): Promise<string> {
    await this.loadProductTranslations(lang);
    const translations = this.cache[`products_${lang}`];
    return translations?.nutrition?.[nutritionKey] || nutritionKey;
  }

  async getToolName(toolKey: string, lang: Language = 'es'): Promise<string> {
    await this.loadProductTranslations(lang);
    const translations = this.cache[`products_${lang}`];
    return translations?.tool?.[toolKey] || toolKey;
  }

  async getRecipeName(recipe: Recipe, lang: Language = 'es'): Promise<string> {
    if (recipe.name && typeof recipe.name === 'object') {
      return recipe.name[lang] || recipe.name.es || recipe.id;
    }

    if (recipe.nameKey) {
      await this.loadRecipeTranslations(recipe.id, lang);
      const translations = this.cache[`recipe_${recipe.id}_${lang}`];
      return translations?.recipe?.[recipe.id]?.name || recipe.id;
    }

    return recipe.id;
  }

  async getRecipeDescription(recipe: Recipe, lang: Language = 'es'): Promise<string> {
    if (recipe.description && typeof recipe.description === 'object') {
      return recipe.description[lang] || recipe.description.es || '';
    }

    if (recipe.descriptionKey) {
      await this.loadRecipeTranslations(recipe.id, lang);
      const translations = this.cache[`recipe_${recipe.id}_${lang}`];
      return translations?.recipe?.[recipe.id]?.description || '';
    }

    return '';
  }

  getRecipeImage(recipe: Recipe): string {
    return recipe.featuredImage || recipe.image || '/placeholder.svg';
  }

  translateKey(key: string): string {
    const parts = key.split('.');

    if (parts[0] === 'product' || parts[0] === 'category' || parts[0] === 'tag' ||
        parts[0] === 'nutrition' || parts[0] === 'tool' || parts[0] === 'storage') {
      const lang = i18n.language as Language;
      const translations = this.cache[`products_${lang}`];

      if (!translations) {
        return key;
      }

      let value = translations;
      for (const part of parts) {
        value = value?.[part];
        if (!value) break;
      }

      return value || key;
    }

    return key;
  }

  clearCache(): void {
    this.cache = {};
    this.loadedRecipes.clear();
  }

  async preloadEssentials(lang: Language): Promise<void> {
    await this.loadProductTranslations(lang);
  }
}

export const translationService = new TranslationService();
