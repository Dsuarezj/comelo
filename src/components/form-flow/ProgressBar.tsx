interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

export default function ProgressBar({ currentStep, totalSteps }: ProgressBarProps) {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="w-full h-1 bg-neutral-200" data-testid="form-progress">
      <div
        className="h-full bg-primary-400 transition-all duration-300"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

