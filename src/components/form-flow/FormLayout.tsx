import { ReactNode } from 'react';
import { ChevronLeft, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import ProgressBar from './ProgressBar';

interface FormLayoutProps {
  children: ReactNode;
  currentStep: number;
  totalSteps: number;
  onClose: () => void;
  onBack?: () => void;
  showBackButton?: boolean;
  primaryButtonText: string;
  secondaryButtonText?: string;
  onPrimaryClick: () => void;
  onSecondaryClick?: () => void;
}

export default function FormLayout({
  children,
  currentStep,
  totalSteps,
  onClose,
  onBack,
  showBackButton = false,
  primaryButtonText,
  secondaryButtonText,
  onPrimaryClick,
  onSecondaryClick,
}: FormLayoutProps) {
  const { t } = useTranslation();

  return (
    <div className="fixed inset-0 flex flex-col bg-background overflow-hidden" data-testid="form-layout">
      <div className="relative">
        <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />

        <button
          onClick={onClose}
          className="absolute top-4 right-6 p-2 text-text-primary z-10"
          aria-label={t('common.close')}
          data-testid="form-close-button"
        >
          <X size={24} />
        </button>
      </div>

      <div className="flex-1 flex flex-col px-6 pt-4 overflow-hidden">
        {showBackButton && onBack && (
          <button
            onClick={onBack}
            className="self-start p-2 -ml-2 text-text-primary mb-2"
            aria-label={t('common.back')}
            data-testid="form-back-button"
          >
            <ChevronLeft size={24} />
          </button>
        )}

        <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide">
          <div className="max-w-md mx-auto w-full h-full" data-testid="form-content">
            {children}
          </div>
        </div>

        <div className="pb-8 pt-4 space-y-3 max-w-md mx-auto w-full flex-shrink-0">
          <button
            onClick={onPrimaryClick}
            className="w-full bg-primary-400 text-white rounded-full py-4 px-8 text-[17px] font-semibold"
            data-testid="form-primary-button"
          >
            {primaryButtonText}
          </button>

          {secondaryButtonText && onSecondaryClick && (
            <button
              onClick={onSecondaryClick}
              className="w-full text-text-primary font-semibold py-3 text-[17px]"
              data-testid="form-secondary-button"
            >
              {secondaryButtonText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

