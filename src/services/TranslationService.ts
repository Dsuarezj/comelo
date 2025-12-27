import i18n from '../i18n';
import { sessionService } from './SessionService';
import { StorageKeys } from '../utils/storage';

type Language = 'es' | 'en' | 'ca';
type RegionalLanguage = Language | string;

interface VersionMap {
  [key: string]: string;
}

enum VersionStatus {
  Idle = 'idle',
  Loading = 'loading',
  Ready = 'ready',
  Error = 'error',
}

class TranslationService {
  private versionCache: VersionMap | null = null;
  private versionStatus: VersionStatus = VersionStatus.Idle;
  private versionWaiters: Array<(map: VersionMap) => void> = [];
  private backgroundCheckedKeys: Set<string> = new Set();
  private loadingPromises: Map<string, Promise<any>> = new Map();

  private getRegionalLanguage(): RegionalLanguage {
    const savedLang = localStorage.getItem(StorageKeys.LANGUAGE);
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

  private async fetchVersions(): Promise<VersionMap> {
    if (this.versionStatus === VersionStatus.Ready && this.versionCache) {
      return this.versionCache;
    }

    if (this.versionStatus === VersionStatus.Loading) {
      return new Promise(resolve => this.versionWaiters.push(resolve));
    }

    this.versionStatus = VersionStatus.Loading;

    try {
      const response = await fetch('/versions.json');
      if (!response.ok) {
        throw new Error('Failed to fetch versions');
      }
      const versions = await response.json();
      this.versionCache = versions;
      this.versionStatus = VersionStatus.Ready;
      this.versionWaiters.forEach(resolve => resolve(versions));
      this.versionWaiters = [];
      return versions;
    } catch (error) {
      console.warn('Failed to fetch versions, using empty map', error);
      this.versionCache = {};
      this.versionStatus = VersionStatus.Error;
      this.versionWaiters.forEach(resolve => resolve({}));
      this.versionWaiters = [];
      return {};
    }
  }

  private getVersionKey(type: string, id: string): string {
    if (type === 'recipes' && id !== '_index') {
      return `recipes/${id}`;
    }
    return type.replace(/s$/, '');
  }

  private async loadTranslationFromNetwork(type: string, id: string, lang: RegionalLanguage): Promise<any | null> {
    try {
      const translations = await import(`../data/translations/${type}/${id}.${lang}.json`);
      return translations?.default || translations || null;
    } catch {
      return null;
    }
  }

  private async loadWithVersionCheck(type: string, id: string, lang: RegionalLanguage): Promise<any | null> {
    const cacheKey = `${type}/${id}/${lang}`;
    const versionKey = this.getVersionKey(type, id);

    const versions = await this.fetchVersions();
    const currentVersion = versions[versionKey] || '1.0.0';

    const cached = await sessionService.getTranslation(cacheKey);

    if (cached && cached.version === currentVersion) {
      this.checkForUpdatesInBackground(type, id, lang, cacheKey, currentVersion);
      return cached.data;
    }

    const data = await this.loadTranslationFromNetwork(type, id, lang);

    if (data) {
      await sessionService.setTranslation(cacheKey, data, currentVersion);
      return data;
    }

    if (cached) {
      return cached.data;
    }

    return null;
  }

  private checkForUpdatesInBackground(
    type: string,
    id: string,
    lang: RegionalLanguage,
    cacheKey: string,
    cachedVersion: string
  ): void {
    setTimeout(async () => {
      try {
        const versionKey = this.getVersionKey(type, id);
        if (this.backgroundCheckedKeys.has(versionKey)) {
          return;
        }

        this.backgroundCheckedKeys.add(versionKey);

        const versions = await this.fetchVersions();
        const latestVersion = versions[versionKey] || '1.0.0';

        if (latestVersion !== cachedVersion) {
          const data = await this.loadTranslationFromNetwork(type, id, lang);
          if (data) {
            await sessionService.setTranslation(cacheKey, data, latestVersion);
          }
        }
      } catch (error) {
        console.warn('Background update check failed', error);
      } finally {
        const versionKey = this.getVersionKey(type, id);
        this.backgroundCheckedKeys.delete(versionKey);
      }
    }, 0);
  }

  private async loadWithFallback(type: string, id: string, regionalLang: RegionalLanguage): Promise<any> {
    const baseLang = regionalLang.split('-')[0] as Language;

    const cacheKey = `${type}/${id}/${regionalLang}`;
    if (this.loadingPromises.has(cacheKey)) {
      return this.loadingPromises.get(cacheKey);
    }

    const promise = (async () => {
      let regionalData = {};
      let baseData = {};

      if (regionalLang !== baseLang) {
        const regional = await this.loadWithVersionCheck(type, id, regionalLang);
        if (regional) regionalData = regional;
      }

      const base = await this.loadWithVersionCheck(type, id, baseLang);
      if (base) baseData = base;

      return { ...baseData, ...regionalData };
    })();

    this.loadingPromises.set(cacheKey, promise);

    try {
      return await promise;
    } finally {
      this.loadingPromises.delete(cacheKey);
    }
  }

  private resolveTranslationFile(scope: string, rest: string[]): { type: string; id: string } {
    const type = `${scope}s`;
    const id = rest.length >= 2 ? rest[0] : 'common';
    return { type, id };
  }

  async warmVersions(): Promise<void> {
    await this.fetchVersions();
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

    const navigationPath = rest.length >= 2 ? rest.slice(1) : rest;

    let value = translations;
    for (const part of navigationPath) {
      value = value?.[part];
      if (!value) break;
    }

    return value || path;
  }

  async loadRecipeIndex(lang?: RegionalLanguage): Promise<any[]> {
    const currentLang = lang || this.getRegionalLanguage();
    const translations = await this.loadWithFallback('recipes', '_index', currentLang);
    return translations?.recipes || [];
  }

  async clearCache(): Promise<void> {
    await sessionService.clearTranslations();
    this.versionCache = null;
    this.versionStatus = VersionStatus.Idle;
    this.versionWaiters = [];
    this.backgroundCheckedKeys.clear();
    this.loadingPromises.clear();
  }

  async preloadEssentials(lang?: RegionalLanguage): Promise<void> {
    const currentLang = lang || this.getRegionalLanguage();

    await this.fetchVersions();

    await Promise.all([
      this.loadWithFallback('products', 'common', currentLang),
      this.loadWithFallback('allergens', 'common', currentLang),
      this.loadWithFallback('recipes', '_index', currentLang),
    ]);
  }
}

export const translationService = new TranslationService();
