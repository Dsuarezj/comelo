import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
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
    <header className="bg-surface border-b border-neutral-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
        {shouldShowBack ? (
          <button
            onClick={handleBack}
            aria-label={t('common.back')}
            className="p-2 rounded-full hover:bg-neutral-100 transition-colors text-neutral-700"
          >
            <ArrowLeft size={24} />
          </button>
        ) : (
          <div className="w-10" />
        )}

        <h2 className="flex-1 text-center text-xl font-bold text-neutral-900">
          {title}
        </h2>

        <div className="w-10" />
      </div>
    </header>
  );
}
