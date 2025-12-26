import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { translationService } from '../services/TranslationService';

export const useDataTranslation = () => {
  const { i18n } = useTranslation();

  const t = useCallback((path: string): Promise<string> => {
    return translationService.translate(path, i18n.language);
  }, [i18n.language]);

  return t;
};
