'use client';

import { useParams, useRouter } from 'next/navigation';
import { FormStep, FORM_STEPS } from '../../../types';
import { ProgressIndicator } from '../../../components/ProgressIndicator';
import { LoanDetailsForm } from '../../../components/forms/LoanDetailsForm';
import { PersonalInfoForm } from '../../../components/forms/PersonalInfoForm';
import { EmploymentForm } from '../../../components/forms/EmploymentForm';
import { FinancialForm } from '../../../components/forms/FinancialForm';
import { ReviewForm } from '../../../components/forms/ReviewForm';

const formComponents: Record<FormStep, React.ComponentType> = {
  'loan-details': LoanDetailsForm,
  'personal-info': PersonalInfoForm,
  'employment': EmploymentForm,
  'financial': FinancialForm,
  'review': ReviewForm,
};

export default function StepPage() {
  const params = useParams();
  const router = useRouter();
  const step = params.step as FormStep;

  if (!FORM_STEPS.includes(step)) {
    router.push('/apply/loan-details');
    return null;
  }

  const FormComponent = formComponents[step];

  return (
    <>
      <ProgressIndicator currentStep={step} />
      <div className="form-content">
        <FormComponent />
      </div>
    </>
  );
}