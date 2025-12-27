import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ONBOARDING_STEPS } from '../config/onboarding.config';
import { LocalStorageService, StorageKeys } from '../utils/storage';

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

  const handleClose = () => {
    LocalStorageService.set(StorageKeys.HAS_ONBOARDING, true);
    navigate('/', { replace: true });
  };

  return (
    <StepComponent
      onNext={handleNext}
      onBack={handleBack}
      onClose={handleClose}
      currentStep={currentStepIndex + 1}
      totalSteps={ONBOARDING_STEPS.length}
    />
  );
}
