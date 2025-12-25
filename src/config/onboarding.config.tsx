import { OnboardingStep } from '../types/onboarding';
import OnboardingAllergensStep from '../components/onboarding/OnboardingAllergensStep';
import OnboardingFoodPreferencesStep from '../components/onboarding/OnboardingFoodPreferencesStep';

export const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: 'allergens',
    component: OnboardingAllergensStep
  },
  {
    id: 'foodPreferences',
    component: OnboardingFoodPreferencesStep
  }
];
