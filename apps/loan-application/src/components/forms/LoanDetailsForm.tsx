'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useApplicationStore } from '../../store/applicationStore';
import { loanDetailsSchema, calculateMonthlyPayment } from '../../lib/validations';
import { LoanDetails, LoanPurpose } from '../../types';
import { useEffect } from 'react';

const LOAN_PURPOSES: { value: LoanPurpose; label: string }[] = [
  { value: 'debt-consolidation', label: 'Debt Consolidation' },
  { value: 'home-improvement', label: 'Home Improvement' },
  { value: 'major-purchase', label: 'Major Purchase' },
  { value: 'auto', label: 'Auto' },
  { value: 'medical', label: 'Medical Expenses' },
  { value: 'vacation', label: 'Vacation' },
  { value: 'wedding', label: 'Wedding' },
  { value: 'other', label: 'Other' },
];

export function LoanDetailsForm() {
  const router = useRouter();
  const { applicationData, updateLoanDetails, markStepCompleted } = useApplicationStore();
  
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<LoanDetails>({
    resolver: zodResolver(loanDetailsSchema),
    defaultValues: applicationData.loanDetails,
  });

  // Watch for changes to calculate monthly payment
  const amount = watch('amount');
  const term = watch('term');

  useEffect(() => {
    if (amount && term) {
      const monthlyPayment = calculateMonthlyPayment(amount, term, 0.15);
      setValue('monthlyPayment', monthlyPayment);
    }
  }, [amount, term, setValue]);

  const onSubmit = (data: LoanDetails) => {
    updateLoanDetails(data);
    markStepCompleted('loan-details');
    router.push('/apply/personal-info');
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="form-group">
        <label htmlFor="amount">Loan Amount</label>
        <input
          id="amount"
          type="number"
          {...register('amount', { valueAsNumber: true })}
          placeholder="Enter amount between $1,000 - $50,000"
        />
        {errors.amount && <p className="error">{errors.amount.message}</p>}
      </div>

      <div className="form-group">
        <label htmlFor="purpose">Loan Purpose</label>
        <select id="purpose" {...register('purpose')}>
          {LOAN_PURPOSES.map((purpose) => (
            <option key={purpose.value} value={purpose.value}>
              {purpose.label}
            </option>
          ))}
        </select>
        {errors.purpose && <p className="error">{errors.purpose.message}</p>}
      </div>

      <div className="form-group">
        <label htmlFor="term">Loan Term (months)</label>
        <select id="term" {...register('term', { valueAsNumber: true })}>
          <option value={12}>12 months</option>
          <option value={24}>24 months</option>
          <option value={36}>36 months</option>
          <option value={48}>48 months</option>
          <option value={60}>60 months</option>
          <option value={72}>72 months</option>
          <option value={84}>84 months</option>
        </select>
        {errors.term && <p className="error">{errors.term.message}</p>}
      </div>

      {amount && term && (
        <div className="summary-section">
          <h3>Estimated Monthly Payment</h3>
          <div className="summary-item">
            <label>Principal:</label>
            <span>${amount.toLocaleString()}</span>
          </div>
          <div className="summary-item">
            <label>Term:</label>
            <span>{term} months</span>
          </div>
          <div className="summary-item">
            <label>Estimated APR:</label>
            <span>15%</span>
          </div>
          <div className="summary-item" style={{ fontSize: '1.2em', fontWeight: 'bold' }}>
            <label>Monthly Payment:</label>
            <span>${watch('monthlyPayment')?.toFixed(2) || '0.00'}</span>
          </div>
        </div>
      )}

      <div className="form-actions">
        <button type="button" className="btn btn-secondary" disabled>
          Previous
        </button>
        <button type="submit" className="btn btn-primary">
          Continue
        </button>
      </div>
    </form>
  );
}