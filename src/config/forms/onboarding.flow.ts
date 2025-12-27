import { FormFlowConfig } from '../../types/form-flow';
import { LocalStorageService, StorageKeys } from '../../utils/storage';
import DropboxStep from '../../components/form-steps/onboarding/DropboxStep';
import AllergensStep from '../../components/form-steps/shared/AllergensStep';

export const onboardingFlow: FormFlowConfig = {
  id: 'onboarding',
  steps: [
    {
      id: 'dropbox',
      component: DropboxStep,
    },
    {
      id: 'allergens',
      component: AllergensStep,
    },
  ],
  onComplete: ({ origin }) => {
    LocalStorageService.set(StorageKeys.HAS_ONBOARDING, true);
    return origin === 'planner' ? '/plan-week' : '/';
  },
};

