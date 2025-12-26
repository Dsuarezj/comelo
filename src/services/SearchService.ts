import i18n from '../i18n';

type SearchableType = 'allergens' | 'products';

interface AliasMap {
  [region: string]: {
    [searchTerm: string]: string;
  };
}

interface SearchCache {
  [key: string]: AliasMap;
}

class SearchService {
  private cache: SearchCache = {};

  private getRegion(): string {
    const lang = i18n.language;
    if (lang.includes('-')) {
      return lang;
    }

    const browserLang = navigator.language;
    if (browserLang.startsWith(lang)) {
      return browserLang;
    }

    return lang;
  }

  private async loadAliases(type: SearchableType): Promise<void> {
    const cacheKey = `${type}_aliases`;

    if (this.cache[cacheKey]) {
      return;
    }

    try {
      const aliases = await import(`../data/translations/${type}/aliases.json`);
      this.cache[cacheKey] = aliases?.default || aliases || {};
    } catch (error) {
      console.warn(`No aliases found for ${type}`, error);
      this.cache[cacheKey] = {};
    }
  }

  async search(type: SearchableType, searchTerm: string): Promise<string | null> {
    await this.loadAliases(type);

    const aliases = this.cache[`${type}_aliases`];
    const region = this.getRegion();
    const lang = region.split('-')[0];
    const normalizedTerm = searchTerm.toLowerCase().trim();

    if (aliases[region]?.[normalizedTerm]) {
      return aliases[region][normalizedTerm];
    }

    if (aliases[lang]?.[normalizedTerm]) {
      return aliases[lang][normalizedTerm];
    }

    for (const regionKey of Object.keys(aliases)) {
      if (aliases[regionKey][normalizedTerm]) {
        return aliases[regionKey][normalizedTerm];
      }
    }

    return null;
  }

  async searchAllergen(searchTerm: string): Promise<string | null> {
    return this.search('allergens', searchTerm);
  }

  async searchProduct(searchTerm: string): Promise<string | null> {
    return this.search('products', searchTerm);
  }

  clearCache(): void {
    this.cache = {};
  }
}

export const searchService = new SearchService();
