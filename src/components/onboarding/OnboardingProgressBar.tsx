interface OnboardingProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

export default function OnboardingProgressBar({ currentStep, totalSteps }: OnboardingProgressBarProps) {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="w-full h-1 bg-neutral-200" data-testid="onboarding-progress">
      <div
        className="h-full bg-primary-400 transition-all duration-300"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
