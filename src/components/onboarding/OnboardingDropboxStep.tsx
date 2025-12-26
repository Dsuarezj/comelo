import { useTranslation } from 'react-i18next';
import { OnboardingStepProps } from '../../types/onboarding';
import OnboardingLayout from './OnboardingLayout';
import DropboxSyncIcon from '../icons/DropboxSyncIcon';

export default function OnboardingDropboxStep({ onNext, onBack, onClose, currentStep, totalSteps }: OnboardingStepProps) {
  const { t } = useTranslation();

  return (
    <OnboardingLayout
      currentStep={currentStep}
      totalSteps={totalSteps}
      onClose={onClose}
      onBack={onBack}
      showBackButton={currentStep > 1}
      primaryButtonText={t('onboarding.dropbox.connectButton')}
      secondaryButtonText={t('onboarding.dropbox.skipButton')}
      onPrimaryClick={onNext}
      onSecondaryClick={onNext}
    >
      <div className="flex flex-col justify-center items-center py-6 h-full">
        <div className="mb-6 relative w-48 h-48 flex items-center justify-center flex-shrink-0">
          <DropboxSyncIcon className="w-full h-full" />
        </div>

        <h1 className="text-[22px] font-bold text-text-primary text-center mb-3 leading-[1.3] px-4">
          {t('onboarding.dropbox.title')}
        </h1>

        <p className="text-text-secondary text-center text-[14px] leading-[1.5] px-6">
          {t('onboarding.dropbox.description')}
        </p>
      </div>
    </OnboardingLayout>
  );
}
