import { useTranslation } from 'react-i18next';
import { FormStepProps } from '../../../types/form-flow';
import FormLayout from '../../form-flow/FormLayout';

export default function TrainingDetailsStep({ 
  onNext, 
  onBack, 
  onClose, 
  currentStep, 
  totalSteps 
}: FormStepProps) {
  const { t } = useTranslation();

  return (
    <FormLayout
      currentStep={currentStep}
      totalSteps={totalSteps}
      onClose={onClose}
      onBack={onBack}
      showBackButton={currentStep > 1}
      primaryButtonText={t('common.continue')}
      secondaryButtonText={t('common.skip')}
      onPrimaryClick={onNext}
      onSecondaryClick={onNext}
    >
      <div className="flex flex-col py-6">
        <h1 className="text-[28px] font-bold text-text-primary text-center mb-3 leading-tight px-4">
          {t('planner.training.title')}
        </h1>

        <p className="text-text-secondary text-center mb-8 text-[15px] leading-[1.5] px-4">
          {t('planner.training.description')}
        </p>

        <div className="flex items-center justify-center h-32 bg-neutral-100 rounded-xl">
          <span className="text-neutral-400">{t('common.comingSoon')}</span>
        </div>
      </div>
    </FormLayout>
  );
}

