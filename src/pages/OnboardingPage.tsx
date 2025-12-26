import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ONBOARDING_STEPS } from '../config/onboarding.config';
import { LocalStorageService, StorageKeys } from '../utils/storage';

const VISIBLE_STEPS = ONBOARDING_STEPS.filter(step => step.id !== 'splash');

export default function OnboardingPage() {
  const navigate = useNavigate();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const currentStep = ONBOARDING_STEPS[currentStepIndex];
  
  if (!currentStep) {
    LocalStorageService.set(StorageKeys.HAS_ONBOARDING, true);
    navigate('/', { replace: true });
    return null;
  }
  
  const StepComponent = currentStep.component;

  const visibleStepNumber = currentStep.id === 'splash' ? 0 : VISIBLE_STEPS.findIndex(s => s.id === currentStep.id) + 1;

  const handleNext = () => {
    if (currentStepIndex < ONBOARDING_STEPS.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      LocalStorageService.set(StorageKeys.HAS_ONBOARDING, true);
      navigate('/', { replace: true });
    }
  };

  const handleBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  return (
    <StepComponent
      onNext={handleNext}
      onBack={handleBack}
      currentStep={visibleStepNumber}
      totalSteps={VISIBLE_STEPS.length}
    />
  );
}
