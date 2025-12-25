import { X, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { SUPPORTED_LANGUAGES, getLanguageByCode } from '../i18n/languages';
import { useEffect, useRef } from 'react';

interface LanguageModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LanguageModal({ isOpen, onClose }: LanguageModalProps) {
  const { t, i18n } = useTranslation();
  const currentLanguage = getLanguageByCode(i18n.language);
  const selectedRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen && selectedRef.current) {
      selectedRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [isOpen]);

  const handleLanguageChange = async (langCode: string) => {
    await i18n.changeLanguage(langCode);
    localStorage.setItem('comelo_language', langCode);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/40 z-50 transition-opacity"
        onClick={onClose}
      />

      <div className="fixed bottom-0 left-0 right-0 bg-surface rounded-t-3xl z-50 animate-slide-up max-h-[70vh] flex flex-col">
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-12 h-1.5 bg-neutral-300 rounded-full" />
        </div>

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
              const isSelected = currentLanguage.code === lang.code;
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
                    <div className="w-10 h-8 flex items-center justify-center bg-white rounded border border-neutral-300 text-sm font-bold text-neutral-700">
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
    </>
  );
}
