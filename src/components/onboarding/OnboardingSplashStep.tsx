import { useEffect } from 'react';
import { OnboardingStepProps } from '../../types/onboarding';
import { sessionService } from '../../services/SessionService';
import { useSplash } from '../../contexts';

const SPLASH_MIN_DURATION_DESKTOP = 3_500;
const SPLASH_MIN_DURATION_MOBILE = 2_500;

export default function OnboardingSplashStep({ onNext }: OnboardingStepProps) {
  const splash = useSplash();
  const isDesktop = window.innerWidth >= 768;
  const minDuration = isDesktop ? SPLASH_MIN_DURATION_DESKTOP : SPLASH_MIN_DURATION_MOBILE;

  useEffect(() => {
    splash.show(minDuration, { onFadeStart: onNext });

    sessionService.init()
      .catch(error => console.error('Error initializing services:', error))
      .finally(() => splash.markReady());
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
