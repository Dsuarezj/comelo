import { useState } from 'react';
import { Search, Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { OnboardingStepProps } from '../../types/onboarding';
import OnboardingLayout from './OnboardingLayout';
import { ALLERGENS_CONFIG } from '../../data/allergens';
import { LocalStorageService, StorageKeys } from '../../utils/storage';
import { UserProfile, UserProfileSchema } from '../../types';

export default function OnboardingAllergensStep({ onNext, onBack, onClose, currentStep, totalSteps }: OnboardingStepProps) {
  const { t } = useTranslation();
  const [selectedAllergens, setSelectedAllergens] = useState<Set<string>>(new Set());

  const topAllergens = ALLERGENS_CONFIG.filter(a => a.priority <= 7).sort((a, b) => a.priority - b.priority);

  const toggleAllergen = (id: string) => {
    setSelectedAllergens(prev => {
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
      allergens: Array.from(selectedAllergens),
    };
    const validatedProfile = UserProfileSchema.partial().parse(updatedProfile);
    LocalStorageService.set(StorageKeys.USER_PROFILE, validatedProfile);
    onNext();
  };

  const handleSkip = () => {
    const currentProfile = LocalStorageService.get<Partial<UserProfile>>(StorageKeys.USER_PROFILE, {});
    const updatedProfile: Partial<UserProfile> = {
      ...currentProfile,
      allergens: [],
    };
    const validatedProfile = UserProfileSchema.partial().parse(updatedProfile);
    LocalStorageService.set(StorageKeys.USER_PROFILE, validatedProfile);
    onNext();
  };

  return (
    <OnboardingLayout
      currentStep={currentStep}
      totalSteps={totalSteps}
      onClose={onClose}
      onBack={onBack}
      showBackButton={currentStep > 1}
      primaryButtonText={t('onboarding.allergens.saveButton')}
      secondaryButtonText={t('onboarding.allergens.skipButton')}
      onPrimaryClick={handleSave}
      onSecondaryClick={handleSkip}
    >
      <div className="flex flex-col py-6">
        <h1 className="text-[28px] font-bold text-text-primary text-center mb-3 leading-tight px-4">
          {t('onboarding.allergens.title')}
        </h1>

        <p className="text-text-secondary text-center mb-8 text-[15px] leading-[1.5] px-4">
          {t('onboarding.allergens.description')}
        </p>

        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={20} />
          <input
            type="text"
            disabled
            placeholder=""
            className="w-full bg-neutral-100 text-neutral-400 rounded-full py-3.5 pl-12 pr-4 text-[15px]"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          {topAllergens.map((allergen) => {
            const isSelected = selectedAllergens.has(allergen.id);

            return (
              <button
                key={allergen.id}
                onClick={() => toggleAllergen(allergen.id)}
                className={`
                  relative flex items-center gap-2.5 p-3 rounded-2xl border-2 transition-all min-h-[60px]
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

                <span className="text-[15px] font-medium text-text-primary text-left flex-1">
                  {t(`allergens.${allergen.translationKey}`)}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </OnboardingLayout>
  );
}
