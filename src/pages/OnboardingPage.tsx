import FormFlowRunner from '../components/form-flow/FormFlowRunner';
import { onboardingFlow } from '../config/forms/onboarding.flow';

export default function OnboardingPage() {
  return <FormFlowRunner config={onboardingFlow} />;
}
