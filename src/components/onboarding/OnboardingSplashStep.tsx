import { useState, useEffect, useRef } from 'react';
import SplashScreen from '../SplashScreen';
import { OnboardingStepProps } from '../../types/onboarding';
import { sessionService } from '../../services/SessionService';

export default function OnboardingSplashStep({ onNext }: OnboardingStepProps) {
  const [isLoading, setIsLoading] = useState(true);
  const onNextRef = useRef(onNext);
  const hasInitialized = useRef(false);
  
  onNextRef.current = onNext;

  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;
    
    const initialize = async () => {
      const isDesktop = window.innerWidth >= 768;
      const minDuration = isDesktop ? 3_500 : 2_500;
      const startTime = Date.now();

      try {
        await sessionService.init();
      } catch (error) {
        console.error('Error initializing services:', error);
      }

      const elapsed = Date.now() - startTime;
      const remainingTime = Math.max(0, minDuration - elapsed);

      if (remainingTime > 0) {
        await new Promise(resolve => setTimeout(resolve, remainingTime));
      }

      setIsLoading(false);
      onNextRef.current();
    };

    initialize();
  }, []);

  if (!isLoading) {
    return null;
  }

  return <SplashScreen />;
}
