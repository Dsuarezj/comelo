import { FormFlowConfig } from '../../types/form-flow';
import AllergensStep from '../../components/form-steps/shared/AllergensStep';
import ExercisePreferenceStep from '../../components/form-steps/planner/ExercisePreferenceStep';
import TrainingDetailsStep from '../../components/form-steps/planner/TrainingDetailsStep';

export const plannerFlow: FormFlowConfig = {
  id: 'planner',
  steps: [
    {
      id: 'allergens',
      component: AllergensStep,
    },
    {
      id: 'exercise',
      component: ExercisePreferenceStep,
    },
    {
      id: 'training',
      component: TrainingDetailsStep,
      shouldSkip: (data) => data.likesExercise === false,
    },
  ],
  onComplete: ({ origin }) => {
    return origin === 'home' ? '/' : '/plan-week';
  },
};

