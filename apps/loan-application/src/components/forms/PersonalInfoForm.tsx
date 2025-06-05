'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useApplicationStore } from '../../store/applicationStore';
import { personalInfoSchema } from '../../lib/validations';
import { PersonalInfo } from '../../types';
import { useRef } from 'react';
import { IMaskInput } from 'react-imask';

const US_STATES = [
  { code: 'AL', name: 'Alabama' }, { code: 'AK', name: 'Alaska' },
  { code: 'AZ', name: 'Arizona' }, { code: 'AR', name: 'Arkansas' },
  { code: 'CA', name: 'California' }, { code: 'CO', name: 'Colorado' },
  { code: 'CT', name: 'Connecticut' }, { code: 'DE', name: 'Delaware' },
  { code: 'FL', name: 'Florida' }, { code: 'GA', name: 'Georgia' },
  { code: 'HI', name: 'Hawaii' }, { code: 'ID', name: 'Idaho' },
  { code: 'IL', name: 'Illinois' }, { code: 'IN', name: 'Indiana' },
  { code: 'IA', name: 'Iowa' }, { code: 'KS', name: 'Kansas' },
  { code: 'KY', name: 'Kentucky' }, { code: 'LA', name: 'Louisiana' },
  { code: 'ME', name: 'Maine' }, { code: 'MD', name: 'Maryland' },
  { code: 'MA', name: 'Massachusetts' }, { code: 'MI', name: 'Michigan' },
  { code: 'MN', name: 'Minnesota' }, { code: 'MS', name: 'Mississippi' },
  { code: 'MO', name: 'Missouri' }, { code: 'MT', name: 'Montana' },
  { code: 'NE', name: 'Nebraska' }, { code: 'NV', name: 'Nevada' },
  { code: 'NH', name: 'New Hampshire' }, { code: 'NJ', name: 'New Jersey' },
  { code: 'NM', name: 'New Mexico' }, { code: 'NY', name: 'New York' },
  { code: 'NC', name: 'North Carolina' }, { code: 'ND', name: 'North Dakota' },
  { code: 'OH', name: 'Ohio' }, { code: 'OK', name: 'Oklahoma' },
  { code: 'OR', name: 'Oregon' }, { code: 'PA', name: 'Pennsylvania' },
  { code: 'RI', name: 'Rhode Island' }, { code: 'SC', name: 'South Carolina' },
  { code: 'SD', name: 'South Dakota' }, { code: 'TN', name: 'Tennessee' },
  { code: 'TX', name: 'Texas' }, { code: 'UT', name: 'Utah' },
  { code: 'VT', name: 'Vermont' }, { code: 'VA', name: 'Virginia' },
  { code: 'WA', name: 'Washington' }, { code: 'WV', name: 'West Virginia' },
  { code: 'WI', name: 'Wisconsin' }, { code: 'WY', name: 'Wyoming' },
];

export function PersonalInfoForm() {
  const router = useRouter();
  const { applicationData, updatePersonalInfo, markStepCompleted, setCurrentStep } = useApplicationStore();
  
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<PersonalInfo>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: applicationData.personalInfo,
  });

  const phoneRef = useRef<any>(null);

  const onSubmit = (data: PersonalInfo) => {
    updatePersonalInfo(data);
    markStepCompleted('personal-info');
    router.push('/apply/employment');
  };

  const handleBack = () => {
    setCurrentStep('loan-details');
    router.push('/apply/loan-details');
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="firstName">First Name</label>
          <input
            id="firstName"
            type="text"
            {...register('firstName')}
            placeholder="Enter your first name"
          />
          {errors.firstName && <p className="error">{errors.firstName.message}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="lastName">Last Name</label>
          <input
            id="lastName"
            type="text"
            {...register('lastName')}
            placeholder="Enter your last name"
          />
          {errors.lastName && <p className="error">{errors.lastName.message}</p>}
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="dateOfBirth">Date of Birth</label>
        <input
          id="dateOfBirth"
          type="date"
          {...register('dateOfBirth')}
          max={new Date().toISOString().split('T')[0]}
        />
        {errors.dateOfBirth && <p className="error">{errors.dateOfBirth.message}</p>}
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input
            id="email"
            type="email"
            {...register('email')}
            placeholder="your@email.com"
          />
          {errors.email && <p className="error">{errors.email.message}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="phone">Phone Number</label>
          <IMaskInput
            id="phone"
            mask="(000) 000-0000"
            placeholder="(555) 123-4567"
            onAccept={(value) => setValue('phone', value)}
            ref={phoneRef}
            defaultValue={applicationData.personalInfo?.phone || ''}
          />
          {errors.phone && <p className="error">{errors.phone.message}</p>}
        </div>
      </div>

      <h3 style={{ marginTop: '2rem', marginBottom: '1rem' }}>Address Information</h3>

      <div className="form-group">
        <label htmlFor="street">Street Address</label>
        <input
          id="street"
          type="text"
          {...register('address.street')}
          placeholder="123 Main Street"
        />
        {errors.address?.street && <p className="error">{errors.address.street.message}</p>}
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="city">City</label>
          <input
            id="city"
            type="text"
            {...register('address.city')}
            placeholder="City"
          />
          {errors.address?.city && <p className="error">{errors.address.city.message}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="state">State</label>
          <select id="state" {...register('address.state')}>
            <option value="">Select State</option>
            {US_STATES.map((state) => (
              <option key={state.code} value={state.code}>
                {state.name}
              </option>
            ))}
          </select>
          {errors.address?.state && <p className="error">{errors.address.state.message}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="zipCode">ZIP Code</label>
          <input
            id="zipCode"
            type="text"
            {...register('address.zipCode')}
            placeholder="12345"
            maxLength={5}
          />
          {errors.address?.zipCode && <p className="error">{errors.address.zipCode.message}</p>}
        </div>
      </div>

      <h3 style={{ marginTop: '2rem', marginBottom: '1rem' }}>Housing Information</h3>

      <div className="form-group">
        <label>Residential Status</label>
        <div className="radio-group">
          <div className="radio-option">
            <input
              type="radio"
              id="own"
              value="own"
              {...register('residentialStatus')}
            />
            <label htmlFor="own">Own</label>
          </div>
          <div className="radio-option">
            <input
              type="radio"
              id="rent"
              value="rent"
              {...register('residentialStatus')}
            />
            <label htmlFor="rent">Rent</label>
          </div>
          <div className="radio-option">
            <input
              type="radio"
              id="other"
              value="other"
              {...register('residentialStatus')}
            />
            <label htmlFor="other">Other</label>
          </div>
        </div>
        {errors.residentialStatus && <p className="error">{errors.residentialStatus.message}</p>}
      </div>

      <div className="form-group">
        <label htmlFor="monthlyHousingPayment">Monthly Housing Payment</label>
        <input
          id="monthlyHousingPayment"
          type="number"
          {...register('monthlyHousingPayment', { valueAsNumber: true })}
          placeholder="Enter monthly payment"
        />
        {errors.monthlyHousingPayment && <p className="error">{errors.monthlyHousingPayment.message}</p>}
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