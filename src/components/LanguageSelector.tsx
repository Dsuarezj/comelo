import { Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useState, useRef, useEffect } from 'react';
import { IconButton, Text } from '../elements';

const languages = [
  { code: 'es', name: 'Español', nameKey: 'language.spanish', flag: 'ES' },
  { code: 'en', name: 'English', nameKey: 'language.english', flag: 'EN' },
  { code: 'ca', name: 'Català', nameKey: 'language.catalan', flag: 'CA' },
];

export default function LanguageSelector() {
  const { i18n, t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[1];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const handleLanguageChange = async (langCode: string) => {
    await i18n.changeLanguage(langCode);
    localStorage.setItem('comelo_language', langCode);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <IconButton
        icon={Globe}
        onClick={() => setIsOpen(!isOpen)}
        variant="default"
        size={20}
        ariaLabel={t('language.selectLanguage')}
        className="text-gray-700"
      />

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className={`w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-3 transition-colors ${
                currentLanguage.code === lang.code ? 'bg-gray-100' : ''
              }`}
              aria-label={`${t('language.selectLanguage')}: ${t(lang.nameKey)}`}
            >
              <div className="w-8 h-6 flex items-center justify-center bg-gray-100 rounded text-xs font-bold text-gray-700 border border-gray-300">
                {lang.flag}
              </div>
              <div className="flex-1">
                <Text variant="small" className="font-medium">
                  {t(lang.nameKey)}
                </Text>
              </div>
              {currentLanguage.code === lang.code && (
                <div className="w-2 h-2 bg-green-500 rounded-full" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
