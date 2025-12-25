import { ChevronLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { OnboardingStepProps } from '../../types/onboarding';
import OnboardingProgressBar from './OnboardingProgressBar';

export default function OnboardingDropboxStep({ onNext, onBack, currentStep, totalSteps }: OnboardingStepProps) {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <OnboardingProgressBar currentStep={currentStep} totalSteps={totalSteps} />

      <div className="flex-1 flex flex-col px-6 pt-4">
        <button
          onClick={onBack}
          className="self-start p-2 -ml-2 text-text-primary"
          aria-label={t('common.back')}
        >
          <ChevronLeft size={24} />
        </button>

        <div className="flex-1 flex flex-col items-center justify-center max-w-md mx-auto w-full py-8">
          <div className="w-48 h-48 bg-neutral-100 rounded-3xl mb-8 flex items-center justify-center">
            <div className="text-neutral-400 text-sm">{t('onboarding.dropbox.illustration')}</div>
          </div>

          <h1 className="text-2xl font-bold text-text-primary text-center mb-4 leading-tight">
            {t('onboarding.dropbox.title')}
          </h1>

          <p className="text-text-secondary text-center mb-3 leading-relaxed">
            {t('onboarding.dropbox.subtitle')}
          </p>

          <p className="text-text-secondary text-center font-medium">
            {t('onboarding.dropbox.footer')}
          </p>
        </div>

        <div className="pb-8 space-y-4 max-w-md mx-auto w-full">
          <button
            disabled
            className="w-full bg-primary-400 text-white rounded-full py-4 px-8 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t('onboarding.dropbox.connectButton')}
          </button>

          <button
            onClick={onNext}
            className="w-full text-text-primary font-medium py-2"
          >
            {t('onboarding.dropbox.skipButton')}
          </button>
        </div>
      </div>
    </div>
  );
}
