import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Text, IconButton } from '../elements';
import { useNavigationContext } from './NavigationContext';
import LanguageSelector from './LanguageSelector';

interface NavigationHeaderProps {
  title: string;
  showBackButton?: boolean;
}

export default function NavigationHeader({
  title,
  showBackButton = true
}: NavigationHeaderProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { goBack, canGoBack } = useNavigationContext();

  const handleBack = () => {
    const backRoute = goBack();
    if (backRoute) {
      navigate(backRoute);
    } else {
      navigate('/');
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
        {showBackButton && canGoBack && (
          <IconButton
            icon={ArrowLeft}
            onClick={handleBack}
            variant="default"
            size={24}
            ariaLabel={t('common.back')}
            className="text-gray-700"
          />
        )}

        <div className="flex-1">
          <Text variant="h2" className="font-bold text-gray-900">
            {title}
          </Text>
        </div>

        <LanguageSelector />
      </div>
    </header>
  );
}
