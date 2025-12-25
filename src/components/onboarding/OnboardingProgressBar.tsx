interface OnboardingProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

export default function OnboardingProgressBar({ currentStep, totalSteps }: OnboardingProgressBarProps) {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="w-full h-1 bg-neutral-200 overflow-hidden">
      <div
        className="h-full bg-primary-400 transition-all duration-300 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
