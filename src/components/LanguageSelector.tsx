import { Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useState, useRef, useEffect } from 'react';
import { IconButton, Text } from '../elements';

const languages = [
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'ca', name: 'Català', flag: '🏴󠁧󠁢󠁣󠁴󠁿' },
];

export default function LanguageSelector() {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

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
        ariaLabel="Select language"
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
            >
              <span className="text-2xl">{lang.flag}</span>
              <div className="flex-1">
                <Text variant="small" className="font-medium">
                  {lang.name}
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
