import { OnboardingStep } from '../types/onboarding';
import OnboardingSplashStep from '../components/onboarding/OnboardingSplashStep';
import OnboardingDropboxStep from '../components/onboarding/OnboardingDropboxStep';
import OnboardingAllergensStep from '../components/onboarding/OnboardingAllergensStep';

export const ONBOARDING_STEPS: OnboardingStep[] = [
  {
    id: 'splash',
    component: OnboardingSplashStep
  },
  {
    id: 'dropbox',
    component: OnboardingDropboxStep
  },
  {
    id: 'allergens',
    component: OnboardingAllergensStep
  }
];
