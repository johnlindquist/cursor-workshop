'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useApplicationStore } from '../../store/applicationStore';
import { getEmploymentSchema } from '../../lib/validations';
import { EmploymentInfo, EmploymentType } from '../../types';
import { useState, useEffect } from 'react';

export function EmploymentForm() {
  const router = useRouter();
  const { applicationData, updateEmploymentInfo, updateFinancialInfo, markStepCompleted, setCurrentStep } = useApplicationStore();
  const [employmentType, setEmploymentType] = useState<EmploymentType>(
    applicationData.employmentInfo?.employmentType || 'employed'
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EmploymentInfo>({
    resolver: zodResolver(getEmploymentSchema(employmentType)),
    defaultValues: applicationData.employmentInfo,
  });

  useEffect(() => {
    // Reset form when employment type changes
    reset({
      ...applicationData.employmentInfo,
      employmentType,
    });
  }, [employmentType, reset, applicationData.employmentInfo]);

  const onSubmit = (data: EmploymentInfo) => {
    // Calculate monthly income for financial page
    let monthlyIncome = 0;
    if (data.employmentType === 'employed' && data.monthlyIncome) {
      monthlyIncome = data.monthlyIncome;
    } else if (data.employmentType === 'self-employed' && data.annualRevenue) {
      monthlyIncome = data.annualRevenue / 12;
    } else if (data.employmentType === 'retired') {
      monthlyIncome = (data.pensionAmount || 0) + (data.otherIncome || 0);
    }

    updateEmploymentInfo(data);
    // Pre-populate financial info with calculated income
    updateFinancialInfo({ monthlyIncome });
    markStepCompleted('employment');
    router.push('/apply/financial');
  };

  const handleBack = () => {
    setCurrentStep('personal-info');
    router.push('/apply/personal-info');
  };

  const renderEmploymentFields = () => {
    switch (employmentType) {
      case 'employed':
        return (
          <>
            <div className="form-group">
              <label htmlFor="employerName">Employer Name</label>
              <input
                id="employerName"
                type="text"
                {...register('employerName')}
                placeholder="Enter your employer's name"
              />
              {errors.employerName && <p className="error">{errors.employerName.message}</p>}
            </div>

            <div className="form-group">
              <label htmlFor="position">Position/Job Title</label>
              <input
                id="position"
                type="text"
                {...register('position')}
                placeholder="Enter your position"
              />
              {errors.position && <p className="error">{errors.position.message}</p>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="yearsEmployed">Years Employed</label>
                <input
                  id="yearsEmployed"
                  type="number"
                  {...register('yearsEmployed', { valueAsNumber: true })}
                  placeholder="0"
                  min="0"
                />
                {errors.yearsEmployed && <p className="error">{errors.yearsEmployed.message}</p>}
              </div>

              <div className="form-group">
                <label htmlFor="monthlyIncome">Monthly Income (Gross)</label>
                <input
                  id="monthlyIncome"
                  type="number"
                  {...register('monthlyIncome', { valueAsNumber: true })}
                  placeholder="Enter monthly income"
                />
                {errors.monthlyIncome && <p className="error">{errors.monthlyIncome.message}</p>}
              </div>
            </div>
          </>
        );

      case 'self-employed':
        return (
          <>
            <div className="form-group">
              <label htmlFor="businessName">Business Name</label>
              <input
                id="businessName"
                type="text"
                {...register('businessName')}
                placeholder="Enter your business name"
              />
              {errors.businessName && <p className="error">{errors.businessName.message}</p>}
            </div>

            <div className="form-group">
              <label htmlFor="businessType">Type of Business</label>
              <input
                id="businessType"
                type="text"
                {...register('businessType')}
                placeholder="e.g., Consulting, Retail, etc."
              />
              {errors.businessType && <p className="error">{errors.businessType.message}</p>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="yearsInBusiness">Years in Business</label>
                <input
                  id="yearsInBusiness"
                  type="number"
                  {...register('yearsInBusiness', { valueAsNumber: true })}
                  placeholder="0"
                  min="0"
                />
                {errors.yearsInBusiness && <p className="error">{errors.yearsInBusiness.message}</p>}
              </div>

              <div className="form-group">
                <label htmlFor="annualRevenue">Annual Revenue</label>
                <input
                  id="annualRevenue"
                  type="number"
                  {...register('annualRevenue', { valueAsNumber: true })}
                  placeholder="Enter annual revenue"
                />
                {errors.annualRevenue && <p className="error">{errors.annualRevenue.message}</p>}
              </div>
            </div>
          </>
        );

      case 'retired':
        return (
          <>
            <div className="form-group">
              <label htmlFor="pensionAmount">Monthly Pension Amount</label>
              <input
                id="pensionAmount"
                type="number"
                {...register('pensionAmount', { valueAsNumber: true })}
                placeholder="Enter monthly pension"
              />
              {errors.pensionAmount && <p className="error">{errors.pensionAmount.message}</p>}
            </div>

            <div className="form-group">
              <label htmlFor="otherIncome">Other Monthly Income</label>
              <input
                id="otherIncome"
                type="number"
                {...register('otherIncome', { valueAsNumber: true })}
                placeholder="Enter other income"
              />
              {errors.otherIncome && <p className="error">{errors.otherIncome.message}</p>}
            </div>

            <div className="form-group">
              <label htmlFor="incomeSource">Source of Other Income</label>
              <input
                id="incomeSource"
                type="text"
                {...register('incomeSource')}
                placeholder="e.g., Social Security, Investments"
              />
              {errors.incomeSource && <p className="error">{errors.incomeSource.message}</p>}
            </div>
          </>
        );

      case 'unemployed':
      case 'student':
        return (
          <div className="summary-section" style={{ backgroundColor: '#fff3cd', borderColor: '#ffeaa7' }}>
            <p>
              We understand your current situation. Please proceed to the next step to provide 
              information about any other sources of income or financial support you may have.
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="form-group">
        <label>Employment Status</label>
        <div className="radio-group">
          <div className="radio-option">
            <input
              type="radio"
              id="employed"
              value="employed"
              {...register('employmentType')}
              onChange={(e) => setEmploymentType(e.target.value as EmploymentType)}
            />
            <label htmlFor="employed">Employed</label>
          </div>
          <div className="radio-option">
            <input
              type="radio"
              id="self-employed"
              value="self-employed"
              {...register('employmentType')}
              onChange={(e) => setEmploymentType(e.target.value as EmploymentType)}
            />
            <label htmlFor="self-employed">Self-Employed</label>
          </div>
          <div className="radio-option">
            <input
              type="radio"
              id="retired"
              value="retired"
              {...register('employmentType')}
              onChange={(e) => setEmploymentType(e.target.value as EmploymentType)}
            />
            <label htmlFor="retired">Retired</label>
          </div>
          <div className="radio-option">
            <input
              type="radio"
              id="unemployed"
              value="unemployed"
              {...register('employmentType')}
              onChange={(e) => setEmploymentType(e.target.value as EmploymentType)}
            />
            <label htmlFor="unemployed">Unemployed</label>
          </div>
          <div className="radio-option">
            <input
              type="radio"
              id="student"
              value="student"
              {...register('employmentType')}
              onChange={(e) => setEmploymentType(e.target.value as EmploymentType)}
            />
            <label htmlFor="student">Student</label>
          </div>
        </div>
      </div>

      {renderEmploymentFields()}

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