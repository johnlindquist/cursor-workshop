'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useApplicationStore } from '../../store/applicationStore';
import { financialInfoSchema } from '../../lib/validations';
import { FinancialInfo } from '../../types';

export function FinancialForm() {
  const router = useRouter();
  const { applicationData, updateFinancialInfo, markStepCompleted, setCurrentStep } = useApplicationStore();
  
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FinancialInfo>({
    resolver: zodResolver(financialInfoSchema),
    defaultValues: applicationData.financialInfo,
  });

  const otherMonthlyIncome = watch('otherMonthlyIncome');

  const onSubmit = (data: FinancialInfo) => {
    updateFinancialInfo(data);
    markStepCompleted('financial');
    router.push('/apply/review');
  };

  const handleBack = () => {
    setCurrentStep('employment');
    router.push('/apply/employment');
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h3 style={{ marginBottom: '1.5rem' }}>Income Information</h3>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="monthlyIncome">Monthly Income</label>
          <input
            id="monthlyIncome"
            type="number"
            {...register('monthlyIncome', { valueAsNumber: true })}
            placeholder="Primary income"
          />
          {errors.monthlyIncome && <p className="error">{errors.monthlyIncome.message}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="otherMonthlyIncome">Other Monthly Income</label>
          <input
            id="otherMonthlyIncome"
            type="number"
            {...register('otherMonthlyIncome', { valueAsNumber: true })}
            placeholder="Additional income"
          />
          {errors.otherMonthlyIncome && <p className="error">{errors.otherMonthlyIncome.message}</p>}
        </div>
      </div>

      {otherMonthlyIncome > 0 && (
        <div className="form-group">
          <label htmlFor="otherIncomeSource">Source of Other Income</label>
          <input
            id="otherIncomeSource"
            type="text"
            {...register('otherIncomeSource')}
            placeholder="e.g., Rental income, investments, etc."
          />
          {errors.otherIncomeSource && <p className="error">{errors.otherIncomeSource.message}</p>}
        </div>
      )}

      <h3 style={{ marginTop: '2rem', marginBottom: '1.5rem' }}>Assets</h3>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="savingsAmount">Savings Account Balance</label>
          <input
            id="savingsAmount"
            type="number"
            {...register('savingsAmount', { valueAsNumber: true })}
            placeholder="Total savings"
          />
          {errors.savingsAmount && <p className="error">{errors.savingsAmount.message}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="investmentAmount">Investment Account Balance</label>
          <input
            id="investmentAmount"
            type="number"
            {...register('investmentAmount', { valueAsNumber: true })}
            placeholder="Total investments"
          />
          {errors.investmentAmount && <p className="error">{errors.investmentAmount.message}</p>}
        </div>
      </div>

      <h3 style={{ marginTop: '2rem', marginBottom: '1.5rem' }}>Liabilities & Expenses</h3>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="creditCardDebt">Total Credit Card Debt</label>
          <input
            id="creditCardDebt"
            type="number"
            {...register('creditCardDebt', { valueAsNumber: true })}
            placeholder="Outstanding balance"
          />
          {errors.creditCardDebt && <p className="error">{errors.creditCardDebt.message}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="otherLoansAmount">Other Loans Amount</label>
          <input
            id="otherLoansAmount"
            type="number"
            {...register('otherLoansAmount', { valueAsNumber: true })}
            placeholder="Auto, student loans, etc."
          />
          {errors.otherLoansAmount && <p className="error">{errors.otherLoansAmount.message}</p>}
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="monthlyExpenses">Monthly Expenses (excluding housing)</label>
        <input
          id="monthlyExpenses"
          type="number"
          {...register('monthlyExpenses', { valueAsNumber: true })}
          placeholder="Utilities, food, transportation, etc."
        />
        {errors.monthlyExpenses && <p className="error">{errors.monthlyExpenses.message}</p>}
      </div>

      <div className="summary-section" style={{ marginTop: '2rem' }}>
        <h3>Financial Summary</h3>
        <div className="summary-item">
          <label>Total Monthly Income:</label>
          <span>${((watch('monthlyIncome') || 0) + (watch('otherMonthlyIncome') || 0)).toLocaleString()}</span>
        </div>
        <div className="summary-item">
          <label>Total Assets:</label>
          <span>${((watch('savingsAmount') || 0) + (watch('investmentAmount') || 0)).toLocaleString()}</span>
        </div>
        <div className="summary-item">
          <label>Total Debt:</label>
          <span>${((watch('creditCardDebt') || 0) + (watch('otherLoansAmount') || 0)).toLocaleString()}</span>
        </div>
        <div className="summary-item">
          <label>Monthly Housing Payment:</label>
          <span>${(applicationData.personalInfo?.monthlyHousingPayment || 0).toLocaleString()}</span>
        </div>
        <div className="summary-item">
          <label>Other Monthly Expenses:</label>
          <span>${(watch('monthlyExpenses') || 0).toLocaleString()}</span>
        </div>
      </div>

      <div className="form-actions">
        <button type="button" className="btn btn-secondary" onClick={handleBack}>
          Previous
        </button>
        <button type="submit" className="btn btn-primary">
          Continue
        </button>
      </div>
    </form>
  );
}