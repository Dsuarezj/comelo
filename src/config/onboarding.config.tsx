import { OnboardingStep } from '../types/onboarding';
import OnboardingDropboxStep from '../components/onboarding/OnboardingDropboxStep';
import OnboardingAllergensStep from '../components/onboarding/OnboardingAllergensStep';
import OnboardingFoodPreferencesStep from '../components/onboarding/OnboardingFoodPreferencesStep';

export const ONBOARDING_CONFIG: OnboardingStep[] = [
  {
    id: 'dropbox',
    component: OnboardingDropboxStep,
    enabled: true,
    order: 1
  },
  {
    id: 'allergens',
    component: OnboardingAllergensStep,
    enabled: true,
    order: 2
  },
  {
    id: 'foodPreferences',
    component: OnboardingFoodPreferencesStep,
    enabled: true,
    order: 3
  }
];

export const getEnabledSteps = (): OnboardingStep[] => {
  return ONBOARDING_CONFIG
    .filter(step => step.enabled)
    .sort((a, b) => a.order - b.order);
};
