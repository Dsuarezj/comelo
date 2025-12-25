import { OnboardingStep } from '../types/onboarding';
import OnboardingAllergensStep from '../components/onboarding/OnboardingAllergensStep';

export const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: 'allergens',
    component: OnboardingAllergensStep
  }
];
