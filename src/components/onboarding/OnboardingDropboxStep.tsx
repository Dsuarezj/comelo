import { ChevronLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { OnboardingStepProps } from '../../types/onboarding';
import OnboardingProgressBar from './OnboardingProgressBar';

export default function OnboardingDropboxStep({ onNext, onBack, currentStep, totalSteps }: OnboardingStepProps) {
  const { t } = useTranslation();

  const handleConnect = () => {
    onNext();
  };

  const handleSkip = () => {
    onNext();
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <OnboardingProgressBar currentStep={currentStep} totalSteps={totalSteps} />

      <div className="flex-1 flex flex-col px-6 pt-4">
        {currentStep > 1 && (
          <button
            onClick={onBack}
            className="self-start p-2 -ml-2 text-text-primary"
            aria-label={t('common.back')}
          >
            <ChevronLeft size={24} />
          </button>
        )}

        <div className="flex-1 flex flex-col justify-center items-center max-w-md mx-auto w-full py-6">
          <div className="mb-12 relative w-64 h-64 flex items-center justify-center">
            <svg viewBox="0 0 400 400" className="w-full h-full">
              <g transform="translate(200, 200)">
                <rect x="-90" y="-140" width="180" height="240" rx="15" fill="#E5E7EB" />
                <rect x="-90" y="-130" width="180" height="20" rx="10" fill="#1F2937" />

                <rect x="-70" y="-90" width="60" height="40" rx="4" fill="#86EFAC" />
                <rect x="-70" y="-40" width="140" height="20" rx="4" fill="#86EFAC" />
                <rect x="-70" y="-10" width="80" height="20" rx="4" fill="#86EFAC" />

                <line x1="10" y1="-65" x2="40" y2="-65" stroke="#86EFAC" strokeWidth="4" />
                <line x1="25" y1="-80" x2="25" y2="-50" stroke="#86EFAC" strokeWidth="4" />

                <polyline points="-150,-120 -180,-140 -180,-100" fill="none" stroke="#86EFAC" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                <polyline points="-150,-40 -180,-60 -180,-20" fill="none" stroke="#86EFAC" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />

                <polyline points="80,-10 110,10 140,-10" fill="none" stroke="#86EFAC" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />

                <line x1="100" y1="-100" x2="130" y2="-80" stroke="#1F2937" strokeWidth="3" strokeLinecap="round" />
                <line x1="130" y1="-100" x2="100" y2="-80" stroke="#1F2937" strokeWidth="3" strokeLinecap="round" />

                <ellipse cx="-130" cy="70" rx="25" ry="30" fill="#4ADE80" />
                <ellipse cx="-145" cy="60" rx="15" ry="20" fill="#22C55E" />
                <rect x="-135" y="100" width="10" height="20" fill="#22C55E" />

                <circle cx="150" cy="80" r="20" fill="#FCD34D" />
                <path d="M150,60 Q160,70 150,80 Q140,70 150,60" fill="#FBBF24" />

                <ellipse cx="-110" cy="-180" rx="12" ry="15" fill="#D1D5DB" />
                <ellipse cx="-85" cy="-185" rx="18" ry="20" fill="#E5E7EB" />
                <ellipse cx="-60" cy="-180" rx="15" ry="18" fill="#D1D5DB" />

                <g transform="translate(-30, 50)">
                  <ellipse cx="0" cy="20" rx="25" ry="8" fill="#22C55E" opacity="0.3" />
                  <path d="M-20,0 Q-10,-40 10,-30 Q20,-20 15,0 L10,20 Q5,5 -5,5 L-15,20 Z" fill="#4ADE80" />
                  <circle cx="0" cy="-20" r="18" fill="#22C55E" />
                  <ellipse cx="-8" cy="-25" rx="6" ry="10" fill="#4ADE80" />
                  <ellipse cx="8" cy="-25" rx="6" ry="10" fill="#4ADE80" />
                </g>
              </g>
            </svg>
          </div>

          <h1 className="text-[26px] font-bold text-text-primary text-center mb-4 leading-tight px-4">
            {t('onboarding.dropbox.title')}
          </h1>

          <p className="text-text-secondary text-center mb-12 text-[15px] leading-[1.5] px-6">
            {t('onboarding.dropbox.description')}
          </p>
        </div>

        <div className="pb-8 space-y-3 max-w-md mx-auto w-full">
          <button
            onClick={handleConnect}
            className="w-full bg-primary-400 text-white rounded-full py-4 px-8 text-[17px] font-semibold"
          >
            {t('onboarding.dropbox.connectButton')}
          </button>

          <button
            onClick={handleSkip}
            className="w-full text-text-primary font-semibold py-3 text-[17px]"
          >
            {t('onboarding.dropbox.skipButton')}
          </button>
        </div>
      </div>
    </div>
  );
}
