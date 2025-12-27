const STORAGE_PREFIX = 'comelo_';

export const StorageKeys = {
  SHOPPING_LISTS: `${STORAGE_PREFIX}shopping_lists`,
  USER_PROFILE: `${STORAGE_PREFIX}user_profile`,
  FAVORITE_RECIPES: `${STORAGE_PREFIX}favorite_recipes`,
  FAVORITE_PRODUCTS: `${STORAGE_PREFIX}favorite_products`,
  DROPBOX_AUTH: `${STORAGE_PREFIX}dropbox_auth`,
  LANGUAGE: `${STORAGE_PREFIX}language`,
  SEARCH_HISTORY: `${STORAGE_PREFIX}search_history`,
  COOKIE_CONSENT: `${STORAGE_PREFIX}cookie_consent`,
  HAS_ONBOARDING: `${STORAGE_PREFIX}has_onboarding`,
  NAV_STACK: `${STORAGE_PREFIX}nav_stack`,
} as const;

export class LocalStorageService {
  static set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }

  static get<T>(key: string, defaultValue: T): T {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return defaultValue;
    }
  }

  static remove(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing from localStorage:', error);
    }
  }

  static clear(): void {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith(STORAGE_PREFIX)) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  }
}

export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const normalizeText = (text: string): string => {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
};
