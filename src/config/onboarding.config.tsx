import { OnboardingStep } from '../types/onboarding';
import OnboardingSplashStep from '../components/onboarding/OnboardingSplashStep';
import OnboardingAllergensStep from '../components/onboarding/OnboardingAllergensStep';

export const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: 'splash',
    component: OnboardingSplashStep
  },
  {
    id: 'allergens',
    component: OnboardingAllergensStep
  }
];
