import FormFlowRunner from '../components/form-flow/FormFlowRunner';
import { plannerFlow } from '../config/forms/planner.flow';

export default function PlannerSetupPage() {
  return <FormFlowRunner config={plannerFlow} />;
}

