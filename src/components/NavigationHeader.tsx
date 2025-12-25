import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Text from '../elements/Text';
import IconButton from '../elements/IconButton';
import { useNavigationContext } from '../contexts/NavigationContext';

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
  const { goBack, navigationStack } = useNavigationContext();

  const handleBack = () => {
    const backRoute = goBack();
    if (backRoute) {
      navigate(backRoute);
    } else {
      navigate('/');
    }
  };

  const shouldShowBack = showBackButton && navigationStack.length > 0;

  return (
    <header className="bg-white border-b border-neutral-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
        {shouldShowBack ? (
          <IconButton
            icon={ArrowLeft}
            onClick={handleBack}
            variant="default"
            size={24}
            ariaLabel={t('common.back')}
            className="text-neutral-700"
          />
        ) : (
          <div className="w-10" />
        )}

        <div className="flex-1 text-center">
          <Text variant="h2" className="font-bold text-neutral-900">
            {title}
          </Text>
        </div>

        <div className="w-10" />
      </div>
    </header>
  );
}
