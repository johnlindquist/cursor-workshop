'use client';

import { FORM_STEPS, STEP_TITLES, FormStep } from '../types';
import { useApplicationStore } from '../store/applicationStore';

interface ProgressIndicatorProps {
  currentStep: FormStep;
}

export function ProgressIndicator({ currentStep }: ProgressIndicatorProps) {
  const completedSteps = useApplicationStore((state) => state.completedSteps);
  const currentStepIndex = FORM_STEPS.indexOf(currentStep);

  return (
    <div className="form-header">
      <h1>Personal Loan Application</h1>
      <p>{STEP_TITLES[currentStep]}</p>
      <div className="progress-bar">
        {FORM_STEPS.map((step, index) => (
          <div
            key={step}
            className={`progress-step ${
              completedSteps.includes(step) ? 'completed' : ''
            } ${index === currentStepIndex ? 'active' : ''}`}
          />
        ))}
      </div>
    </div>
  );
}