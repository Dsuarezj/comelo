export interface OnboardingStepProps {
  onNext: () => void;
  onBack: () => void;
  currentStep: number;
  totalSteps: number;
}

export interface OnboardingStep {
  id: string;
  component: React.ComponentType<OnboardingStepProps>;
}
