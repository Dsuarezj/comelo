import { ComponentType } from 'react';

export type FormFlowData = Record<string, unknown>;

export interface FormStepProps {
  onNext: () => void;
  onBack: () => void;
  onClose: () => void;
  currentStep: number;
  totalSteps: number;
  data: FormFlowData;
  setData: (updater: (prev: FormFlowData) => FormFlowData) => void;
}

export interface FormStepConfig {
  id: string;
  component: ComponentType<FormStepProps>;
  primaryLabelKey?: string;
  secondaryLabelKey?: string;
  showBack?: boolean;
  isSkippable?: boolean;
  shouldSkip?: (data: FormFlowData) => boolean;
}

export interface FormFlowConfig {
  id: string;
  steps: FormStepConfig[];
  onComplete: (ctx: FormFlowCompleteContext) => string;
}

export interface FormFlowCompleteContext {
  origin?: string;
  data: FormFlowData;
}

