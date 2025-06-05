'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApplicationStore } from '../../store/applicationStore';
import { validateApplication } from '../../lib/validations';
import { STEP_TITLES } from '../../types';

export function ReviewForm() {
  const router = useRouter();
  const { applicationData, submitApplication, setCurrentStep } = useApplicationStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const handleSubmit = async () => {
    // Run cross-field validation
    const validationErrors = validateApplication(applicationData);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    if (!consent) {
      setErrors(['You must agree to the terms and conditions']);
      return;
    }

    setIsSubmitting(true);
    try {
      await submitApplication();
      router.push('/status/submitted');
    } catch (error) {
      setErrors(['An error occurred while submitting your application']);
      setIsSubmitting(false);
    }
  };

  const handleEdit = (step: string) => {
    setCurrentStep(step as any);
    router.push(`/apply/${step}`);
  };

  const handleBack = () => {
    setCurrentStep('financial');
    router.push('/apply/financial');
  };

  const formatCurrency = (amount?: number) => {
    return amount ? `$${amount.toLocaleString()}` : '$0';
  };

  const formatDate = (date?: string) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString();
  };

  return (
    <div>
      <h2 style={{ marginBottom: '1.5rem' }}>Review Your Application</h2>
      <p style={{ marginBottom: '2rem' }}>
        Please review all the information below before submitting your application. 
        Click on any section to make changes.
      </p>

      {errors.length > 0 && (
        <div className="summary-section" style={{ backgroundColor: '#ffebee', borderColor: '#ffcdd2' }}>
          <h3 style={{ color: '#c62828' }}>Please fix the following issues:</h3>
          <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
            {errors.map((error, index) => (
              <li key={index} style={{ color: '#c62828' }}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Loan Details Section */}
      <div className="summary-section">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3>{STEP_TITLES['loan-details']}</h3>
          <button 
            type="button" 
            className="btn btn-secondary" 
            style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
            onClick={() => handleEdit('loan-details')}
          >
            Edit
          </button>
        </div>
        <div className="summary-item">
          <label>Loan Amount:</label>
          <span>{formatCurrency(applicationData.loanDetails?.amount)}</span>
        </div>
        <div className="summary-item">
          <label>Purpose:</label>
          <span>{applicationData.loanDetails?.purpose?.replace('-', ' ')}</span>
        </div>
        <div className="summary-item">
          <label>Term:</label>
          <span>{applicationData.loanDetails?.term} months</span>
        </div>
        <div className="summary-item">
          <label>Monthly Payment:</label>
          <span>{formatCurrency(applicationData.loanDetails?.monthlyPayment)}</span>
        </div>
      </div>

      {/* Personal Information Section */}
      <div className="summary-section">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3>{STEP_TITLES['personal-info']}</h3>
          <button 
            type="button" 
            className="btn btn-secondary" 
            style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
            onClick={() => handleEdit('personal-info')}
          >
            Edit
          </button>
        </div>
        <div className="summary-item">
          <label>Name:</label>
          <span>{applicationData.personalInfo?.firstName} {applicationData.personalInfo?.lastName}</span>
        </div>
        <div className="summary-item">
          <label>Date of Birth:</label>
          <span>{formatDate(applicationData.personalInfo?.dateOfBirth)}</span>
        </div>
        <div className="summary-item">
          <label>Email:</label>
          <span>{applicationData.personalInfo?.email}</span>
        </div>
        <div className="summary-item">
          <label>Phone:</label>
          <span>{applicationData.personalInfo?.phone}</span>
        </div>
        <div className="summary-item">
          <label>Address:</label>
          <span>
            {applicationData.personalInfo?.address.street}, {applicationData.personalInfo?.address.city}, {' '}
            {applicationData.personalInfo?.address.state} {applicationData.personalInfo?.address.zipCode}
          </span>
        </div>
        <div className="summary-item">
          <label>Residential Status:</label>
          <span>{applicationData.personalInfo?.residentialStatus}</span>
        </div>
        <div className="summary-item">
          <label>Monthly Housing Payment:</label>
          <span>{formatCurrency(applicationData.personalInfo?.monthlyHousingPayment)}</span>
        </div>
      </div>

      {/* Employment Section */}
      <div className="summary-section">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3>{STEP_TITLES['employment']}</h3>
          <button 
            type="button" 
            className="btn btn-secondary" 
            style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
            onClick={() => handleEdit('employment')}
          >
            Edit
          </button>
        </div>
        <div className="summary-item">
          <label>Employment Type:</label>
          <span>{applicationData.employmentInfo?.employmentType?.replace('-', ' ')}</span>
        </div>
        {applicationData.employmentInfo?.employmentType === 'employed' && (
          <>
            <div className="summary-item">
              <label>Employer:</label>
              <span>{applicationData.employmentInfo.employerName}</span>
            </div>
            <div className="summary-item">
              <label>Position:</label>
              <span>{applicationData.employmentInfo.position}</span>
            </div>
            <div className="summary-item">
              <label>Years Employed:</label>
              <span>{applicationData.employmentInfo.yearsEmployed}</span>
            </div>
            <div className="summary-item">
              <label>Monthly Income:</label>
              <span>{formatCurrency(applicationData.employmentInfo.monthlyIncome)}</span>
            </div>
          </>
        )}
        {applicationData.employmentInfo?.employmentType === 'self-employed' && (
          <>
            <div className="summary-item">
              <label>Business Name:</label>
              <span>{applicationData.employmentInfo.businessName}</span>
            </div>
            <div className="summary-item">
              <label>Business Type:</label>
              <span>{applicationData.employmentInfo.businessType}</span>
            </div>
            <div className="summary-item">
              <label>Years in Business:</label>
              <span>{applicationData.employmentInfo.yearsInBusiness}</span>
            </div>
            <div className="summary-item">
              <label>Annual Revenue:</label>
              <span>{formatCurrency(applicationData.employmentInfo.annualRevenue)}</span>
            </div>
          </>
        )}
      </div>

      {/* Financial Information Section */}
      <div className="summary-section">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3>{STEP_TITLES['financial']}</h3>
          <button 
            type="button" 
            className="btn btn-secondary" 
            style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
            onClick={() => handleEdit('financial')}
          >
            Edit
          </button>
        </div>
        <div className="summary-item">
          <label>Total Monthly Income:</label>
          <span>
            {formatCurrency(
              (applicationData.financialInfo?.monthlyIncome || 0) + 
              (applicationData.financialInfo?.otherMonthlyIncome || 0)
            )}
          </span>
        </div>
        <div className="summary-item">
          <label>Total Assets:</label>
          <span>
            {formatCurrency(
              (applicationData.financialInfo?.savingsAmount || 0) + 
              (applicationData.financialInfo?.investmentAmount || 0)
            )}
          </span>
        </div>
        <div className="summary-item">
          <label>Total Debt:</label>
          <span>
            {formatCurrency(
              (applicationData.financialInfo?.creditCardDebt || 0) + 
              (applicationData.financialInfo?.otherLoansAmount || 0)
            )}
          </span>
        </div>
        <div className="summary-item">
          <label>Monthly Expenses:</label>
          <span>{formatCurrency(applicationData.financialInfo?.monthlyExpenses)}</span>
        </div>
      </div>

      {/* Consent Section */}
      <div className="consent-section">
        <h3>Terms and Conditions</h3>
        <p style={{ marginBottom: '1rem' }}>
          By submitting this application, I certify that all information provided is accurate and complete 
          to the best of my knowledge. I understand that any false or misleading information may result 
          in the denial of my application or cancellation of any approved loan.
        </p>
        <p style={{ marginBottom: '1rem' }}>
          I authorize the lender to verify all information provided and to obtain credit reports as necessary 
          for the evaluation of this application. I understand that this is not a commitment to lend and that 
          final approval is subject to verification of all information and meeting the lender's credit criteria.
        </p>
        <div className="checkbox-group">
          <input
            type="checkbox"
            id="consent"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
          />
          <label htmlFor="consent">
            I have read, understood, and agree to the terms and conditions above.
          </label>
        </div>
      </div>

      <div className="form-actions">
        <button 
          type="button" 
          className="btn btn-secondary" 
          onClick={handleBack}
          disabled={isSubmitting}
        >
          Previous
        </button>
        <button 
          type="button" 
          className="btn btn-primary" 
          onClick={handleSubmit}
          disabled={isSubmitting || !consent}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Application'}
        </button>
      </div>
    </div>
  );
}