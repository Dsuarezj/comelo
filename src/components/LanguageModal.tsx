import { X, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { SUPPORTED_LANGUAGES } from '../i18n/languages';
import { useEffect, useRef } from 'react';
import { translationService } from '../services/TranslationService';

interface LanguageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLanguageSelected?: () => void;
}

export default function LanguageModal({ isOpen, onClose, onLanguageSelected }: LanguageModalProps) {
  const { t, i18n } = useTranslation();
  const currentLanguageCode = i18n.language;
  const selectedRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen && selectedRef.current) {
      selectedRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [isOpen]);

  const handleLanguageChange = async (langCode: string) => {
    await i18n.changeLanguage(langCode);
    localStorage.setItem('comelo_language', langCode);

    translationService.clearCache();
    await translationService.preloadEssentials(langCode);

    onClose();
    onLanguageSelected?.();
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/60 z-[60] transition-opacity flex items-center justify-center p-4"
        onClick={onClose}
      >
        <div
          className="bg-surface rounded-2xl w-full max-w-md max-h-[80vh] flex flex-col shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200">
            <h2 className="text-xl font-bold text-neutral-900">
              {t('language.selectLanguage')}
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-neutral-100 transition-colors"
            >
              <X size={24} className="text-neutral-600" />
            </button>
          </div>

          <div className="overflow-y-auto flex-1 px-6 py-4">
            <div className="space-y-2">
              {SUPPORTED_LANGUAGES.map((lang) => {
                const isSelected = currentLanguageCode === lang.code ||
                  (currentLanguageCode.startsWith(lang.code.split('-')[0]) && !SUPPORTED_LANGUAGES.some(l => l.code === currentLanguageCode));
                return (
                  <button
                    key={lang.code}
                    ref={isSelected ? selectedRef : null}
                    onClick={() => handleLanguageChange(lang.code)}
                    className={`w-full flex items-center justify-between p-4 rounded-xl transition-colors ${
                      isSelected
                        ? 'bg-primary-50 border-2 border-primary-500'
                        : 'bg-neutral-50 hover:bg-neutral-100 border-2 border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-2xl">
                        {lang.flag}
                      </div>
                      <span className={`font-medium ${isSelected ? 'text-primary-700' : 'text-neutral-900'}`}>
                        {lang.name}
                      </span>
                    </div>
                    {isSelected && (
                      <Check size={24} className="text-primary-500" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
