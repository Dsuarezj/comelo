import { OnboardingStepProps } from '../../types/onboarding';
import { sessionService } from '../../services/SessionService';
import { useSplashInit } from '../../contexts';

const SPLASH_MIN_DURATION_DESKTOP = 3_500;
const SPLASH_MIN_DURATION_MOBILE = 2_500;
const IS_DESKTOP = window.innerWidth >= 768;
const MIN_DURATION = IS_DESKTOP ? SPLASH_MIN_DURATION_DESKTOP : SPLASH_MIN_DURATION_MOBILE;

export default function OnboardingSplashStep({ onNext }: OnboardingStepProps) {
  useSplashInit(MIN_DURATION, () => sessionService.init(), onNext);
  return null;
}
