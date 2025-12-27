import { useTranslation } from 'react-i18next';
import { FormStepProps } from '../../../types/form-flow';
import FormLayout from '../../form-flow/FormLayout';

export default function ExercisePreferenceStep({ 
  onNext, 
  onBack, 
  onClose, 
  currentStep, 
  totalSteps,
  data,
  setData 
}: FormStepProps) {
  const { t } = useTranslation();
  const likesExercise = data.likesExercise as boolean | undefined;

  const handleSelect = (likes: boolean) => {
    setData(prev => ({ ...prev, likesExercise: likes }));
  };

  const handleContinue = () => {
    if (likesExercise !== undefined) {
      onNext();
    }
  };

  return (
    <FormLayout
      currentStep={currentStep}
      totalSteps={totalSteps}
      onClose={onClose}
      onBack={onBack}
      showBackButton={currentStep > 1}
      primaryButtonText={t('common.continue')}
      onPrimaryClick={handleContinue}
    >
      <div className="flex flex-col py-6">
        <h1 className="text-[28px] font-bold text-text-primary text-center mb-3 leading-tight px-4">
          {t('planner.exercise.title')}
        </h1>

        <p className="text-text-secondary text-center mb-8 text-[15px] leading-[1.5] px-4">
          {t('planner.exercise.description')}
        </p>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => handleSelect(true)}
            className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
              likesExercise === true
                ? 'border-primary-500 bg-primary-50'
                : 'border-neutral-200 bg-surface'
            }`}
          >
            <span className="text-[16px] font-medium text-text-primary">
              {t('planner.exercise.yes')}
            </span>
          </button>

          <button
            onClick={() => handleSelect(false)}
            className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
              likesExercise === false
                ? 'border-primary-500 bg-primary-50'
                : 'border-neutral-200 bg-surface'
            }`}
          >
            <span className="text-[16px] font-medium text-text-primary">
              {t('planner.exercise.no')}
            </span>
          </button>
        </div>
      </div>
    </FormLayout>
  );
}

