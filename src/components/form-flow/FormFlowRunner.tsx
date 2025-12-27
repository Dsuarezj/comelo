import { useState, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { FormFlowConfig, FormFlowData } from '../../types/form-flow';

interface FormFlowRunnerProps {
  config: FormFlowConfig;
}

export default function FormFlowRunner({ config }: FormFlowRunnerProps) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const origin = searchParams.get('origin') ?? undefined;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [data, setData] = useState<FormFlowData>({});

  const getVisibleSteps = useCallback(() => {
    return config.steps.filter(step => !step.shouldSkip?.(data));
  }, [config.steps, data]);

  const visibleSteps = getVisibleSteps();
  const currentStepConfig = visibleSteps[currentIndex];

  const findNextValidIndex = useCallback((fromIndex: number): number | null => {
    for (let i = fromIndex + 1; i < visibleSteps.length; i++) {
      const step = visibleSteps[i];
      if (!step.shouldSkip?.(data)) {
        return i;
      }
    }
    return null;
  }, [visibleSteps, data]);

  const findPrevValidIndex = useCallback((fromIndex: number): number | null => {
    for (let i = fromIndex - 1; i >= 0; i--) {
      const step = visibleSteps[i];
      if (!step.shouldSkip?.(data)) {
        return i;
      }
    }
    return null;
  }, [visibleSteps, data]);

  const handleComplete = useCallback(() => {
    const redirectPath = config.onComplete({ origin, data });
    navigate(redirectPath, { replace: true });
  }, [config, origin, data, navigate]);

  const handleNext = useCallback(() => {
    const nextIndex = findNextValidIndex(currentIndex);
    if (nextIndex !== null) {
      setCurrentIndex(nextIndex);
    } else {
      handleComplete();
    }
  }, [currentIndex, findNextValidIndex, handleComplete]);

  const handleBack = useCallback(() => {
    const prevIndex = findPrevValidIndex(currentIndex);
    if (prevIndex !== null) {
      setCurrentIndex(prevIndex);
    }
  }, [currentIndex, findPrevValidIndex]);

  const handleClose = useCallback(() => {
    const redirectPath = config.onComplete({ origin, data });
    navigate(redirectPath, { replace: true });
  }, [config, origin, data, navigate]);

  if (!currentStepConfig) {
    handleComplete();
    return null;
  }

  const StepComponent = currentStepConfig.component;

  return (
    <StepComponent
      onNext={handleNext}
      onBack={handleBack}
      onClose={handleClose}
      currentStep={currentIndex + 1}
      totalSteps={visibleSteps.length}
      data={data}
      setData={setData}
    />
  );
}

