import { useState, useEffect } from 'react';
import { Search, Check, Wheat, Milk, Nut, Fish, Egg, Leaf, Coffee } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { OnboardingStepProps } from '../../types/onboarding';
import OnboardingLayout from './OnboardingLayout';
import allergensData from '../../data/allergens.json';
import { LocalStorageService, StorageKeys } from '../../utils/storage';
import { UserProfile, UserProfileSchema } from '../../types';
import { useDataTranslation } from '../../hooks/useDataTranslation';

const iconMap: Record<string, any> = {
  Wheat,
  Milk,
  Nut,
  Fish,
  Egg,
  Leaf,
  Coffee,
};

export default function OnboardingAllergensStep({ onNext, onBack, onClose, currentStep, totalSteps }: OnboardingStepProps) {
  const { t } = useTranslation();
  const dt = useDataTranslation();
  const [selectedAllergens, setSelectedAllergens] = useState<Set<string>>(new Set());
  const [showAllAllergens, setShowAllAllergens] = useState(false);
  const [allergenNames, setAllergenNames] = useState<Record<string, string>>({});

  const allergens = [...allergensData].sort((a, b) => a.priority - b.priority);
  const visibleAllergens = showAllAllergens ? allergens : allergens.slice(0, 6);
  const hasMoreAllergens = allergens.length > 6 && !showAllAllergens;

  useEffect(() => {
    const loadAllergenNames = async () => {
      const names: Record<string, string> = {};
      await Promise.all(
        visibleAllergens.map(async (allergen) => {
          if (!allergenNames[allergen.id]) {
            names[allergen.id] = await dt(`allergens.${allergen.id}`);
          }
        })
      );
      if (Object.keys(names).length > 0) {
        setAllergenNames(prev => ({ ...prev, ...names }));
      }
    };

    loadAllergenNames();
  }, [visibleAllergens.length]);

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

        <div className="flex flex-wrap gap-2.5">
          {visibleAllergens.map((allergen) => {
            const isSelected = selectedAllergens.has(allergen.id);
            const Icon = iconMap[allergen.icon];

            return (
              <button
                key={allergen.id}
                onClick={() => toggleAllergen(allergen.id)}
                className={`
                  relative flex items-center gap-2 px-4 py-2.5 rounded-full border-2 transition-all
                  ${isSelected
                    ? 'border-primary-500 bg-primary-500 text-white'
                    : 'border-neutral-300 bg-surface text-text-primary'
                  }
                `}
              >
                <Check
                  size={16}
                  className={`transition-opacity ${isSelected ? 'text-white opacity-100' : 'text-neutral-300 opacity-40'}`}
                  strokeWidth={2.5}
                />

                <span className="text-[14px] font-medium whitespace-nowrap">
                  {allergenNames[allergen.id] || allergen.id}
                </span>
              </button>
            );
          })}

          {hasMoreAllergens && (
            <button
              onClick={() => setShowAllAllergens(true)}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-full border-2 border-neutral-300 bg-surface text-text-secondary transition-all"
            >
              <span className="text-[14px] font-medium">...</span>
              <span className="text-[14px] font-medium">{t('onboarding.allergens.searchMore')}</span>
            </button>
          )}
        </div>
      </div>
    </OnboardingLayout>
  );
}
