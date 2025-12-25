import { useState } from 'react';
import { ChevronLeft, Search, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { OnboardingStepProps } from '../../types/onboarding';
import OnboardingProgressBar from './OnboardingProgressBar';
import { FOOD_PREFERENCES_CONFIG } from '../../data/foodPreferences';
import { LocalStorageService, StorageKeys } from '../../utils/storage';
import { UserProfile, UserProfileSchema } from '../../types';

export default function OnboardingFoodPreferencesStep({ onNext, onBack, currentStep, totalSteps }: OnboardingStepProps) {
  const { t } = useTranslation();
  const [selectedPreferences, setSelectedPreferences] = useState<Set<string>>(new Set());

  const topPreferences = FOOD_PREFERENCES_CONFIG
    .filter(p => p.priority <= 12)
    .sort((a, b) => a.priority - b.priority);

  const togglePreference = (id: string) => {
    setSelectedPreferences(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleSave = () => {
    const currentProfile = LocalStorageService.get<Partial<UserProfile>>(StorageKeys.USER_PROFILE, {});
    const updatedProfile: Partial<UserProfile> = {
      ...currentProfile,
      foodPreferences: Array.from(selectedPreferences),
    };

    const validatedProfile = UserProfileSchema.partial().parse(updatedProfile);
    LocalStorageService.set(StorageKeys.USER_PROFILE, validatedProfile);
    onNext();
  };

  const handleSkip = () => {
    const currentProfile = LocalStorageService.get<Partial<UserProfile>>(StorageKeys.USER_PROFILE, {});
    const updatedProfile: Partial<UserProfile> = {
      ...currentProfile,
      foodPreferences: [],
    };

    const validatedProfile = UserProfileSchema.partial().parse(updatedProfile);
    LocalStorageService.set(StorageKeys.USER_PROFILE, validatedProfile);
    onNext();
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <OnboardingProgressBar currentStep={currentStep} totalSteps={totalSteps} />

      <div className="flex-1 flex flex-col px-6 pt-4">
        <button
          onClick={onBack}
          className="self-start p-2 -ml-2 text-text-primary"
          aria-label={t('common.back')}
        >
          <ChevronLeft size={24} />
        </button>

        <div className="flex-1 flex flex-col max-w-md mx-auto w-full py-6">
          <h1 className="text-2xl font-bold text-text-primary text-center mb-3">
            {t('onboarding.foodPreferences.title')}
          </h1>

          <p className="text-text-secondary text-center mb-6 text-sm leading-relaxed">
            {t('onboarding.foodPreferences.description')}
          </p>

          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={20} />
            <input
              type="text"
              disabled
              placeholder={t('onboarding.foodPreferences.comingSoon')}
              className="w-full bg-neutral-100 text-neutral-400 rounded-full py-3 pl-12 pr-4 cursor-not-allowed"
            />
          </div>

          <div className="grid grid-cols-2 gap-3 mb-8 overflow-y-auto scrollbar-hide max-h-96">
            {topPreferences.map((preference) => {
              const isSelected = selectedPreferences.has(preference.id);
              const Icon = preference.icon;

              return (
                <button
                  key={preference.id}
                  onClick={() => togglePreference(preference.id)}
                  className={`
                    relative flex items-center gap-3 p-3 rounded-2xl border-2 transition-all
                    ${isSelected
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-neutral-200 bg-surface'
                    }
                  `}
                >
                  {isSelected && (
                    <div className="absolute top-2 right-2 w-5 h-5 bg-primary-500 rounded-full flex items-center justify-center">
                      <Check size={14} className="text-white" strokeWidth={3} />
                    </div>
                  )}

                  <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${preference.colors.iconBg}`}>
                    <Icon size={20} className={preference.colors.iconColor} />
                  </div>

                  <span className="text-sm font-medium text-text-primary text-left">
                    {t(`foodPreferences.${preference.translationKey}`)}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="pb-8 space-y-4 max-w-md mx-auto w-full">
          <button
            onClick={handleSave}
            className="w-full bg-primary-400 text-white rounded-full py-4 px-8 text-lg font-semibold"
          >
            {t('onboarding.foodPreferences.continueButton')}
          </button>

          <button
            onClick={handleSkip}
            className="w-full text-text-primary font-medium py-2"
          >
            {t('onboarding.foodPreferences.skipButton')}
          </button>
        </div>
      </div>
    </div>
  );
}
