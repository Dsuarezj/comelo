import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { translationService } from '../services/TranslationService';

type Language = 'es' | 'en' | 'ca';

export const useDataTranslation = () => {
  const { i18n } = useTranslation();

  const t = useCallback((path: string): Promise<string> => {
    const lang = i18n.language as Language;
    const parts = path.split('.');

    if (parts[0] === 'product') {
      return translationService.getProductName(parts[1], lang);
    }

    if (parts[0] === 'category') {
      return translationService.getCategoryName(parts[1], lang);
    }

    if (parts[0] === 'tag') {
      return translationService.getTagName(parts[1], lang);
    }

    if (parts[0] === 'nutrition') {
      return translationService.getNutritionDescription(parts[1], lang);
    }

    if (parts[0] === 'tool') {
      return translationService.getToolName(parts[1], lang);
    }

    return Promise.resolve(path);
  }, [i18n.language]);

  return t;
};
