import { OnboardingStep } from '../types/onboarding';
import OnboardingDropboxStep from '../components/onboarding/OnboardingDropboxStep';
import OnboardingAllergensStep from '../components/onboarding/OnboardingAllergensStep';

export const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: 'dropbox',
    component: OnboardingDropboxStep
  },
  {
    id: 'allergens',
    component: OnboardingAllergensStep
  }
];
