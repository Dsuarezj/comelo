import { useTranslation } from 'react-i18next';
import Text from '../elements/Text';
import LanguageSelector from './LanguageSelector';

interface HeaderProps {
  title?: string;
  showLanguageSelector?: boolean;
}

export default function Header({ title, showLanguageSelector = true }: HeaderProps) {
  const { t } = useTranslation();
  const displayTitle = title || t('app.name');

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex-1">
          <Text variant="h2" className="font-bold text-gray-900">
            {displayTitle}
          </Text>
        </div>

        {showLanguageSelector && (
          <div className="ml-4">
            <LanguageSelector />
          </div>
        )}
      </div>
    </header>
  );
}
