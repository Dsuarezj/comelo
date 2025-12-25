import { useTranslation } from 'react-i18next';
import LanguageSelector from './LanguageSelector';

interface HeaderProps {
  title?: string;
  showLanguageSelector?: boolean;
}

export default function Header({ title, showLanguageSelector = true }: HeaderProps) {
  const { t } = useTranslation();
  const displayTitle = title || t('app.name');

  return (
    <header className="bg-surface border-b border-neutral-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <h2 className="flex-1 text-xl font-bold text-neutral-900">
          {displayTitle}
        </h2>

        {showLanguageSelector && (
          <div className="ml-4">
            <LanguageSelector />
          </div>
        )}
      </div>
    </header>
  );
}
