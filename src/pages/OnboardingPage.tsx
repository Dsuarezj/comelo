import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getEnabledSteps } from '../config/onboarding.config';
import { LocalStorageService, StorageKeys } from '../utils/storage';

export default function OnboardingPage() {
  const navigate = useNavigate();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const enabledSteps = getEnabledSteps();

  if (enabledSteps.length === 0) {
    LocalStorageService.set(StorageKeys.HAS_ONBOARDING, true);
    navigate('/', { replace: true });
    return null;
  }

  const currentStep = enabledSteps[currentStepIndex];
  const StepComponent = currentStep.component;

  const handleNext = () => {
    if (currentStepIndex < enabledSteps.length - 1) {
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
      currentStep={currentStepIndex + 1}
      totalSteps={enabledSteps.length}
    />
  );
}
