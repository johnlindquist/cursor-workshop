import { z } from 'zod';
import { differenceInYears } from 'date-fns';

// Loan Details Schema
export const loanDetailsSchema = z.object({
  amount: z
    .number()
    .min(1000, 'Minimum loan amount is $1,000')
    .max(50000, 'Maximum loan amount is $50,000'),
  purpose: z.enum([
    'debt-consolidation',
    'home-improvement',
    'major-purchase',
    'auto',
    'medical',
    'vacation',
    'wedding',
    'other',
  ]),
  term: z
    .number()
    .min(12, 'Minimum term is 12 months')
    .max(84, 'Maximum term is 84 months'),
});

// Personal Info Schema
export const personalInfoSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  dateOfBirth: z.string().refine((date) => {
    const age = differenceInYears(new Date(), new Date(date));
    return age >= 18 && age <= 100;
  }, 'You must be between 18 and 100 years old'),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^\(\d{3}\) \d{3}-\d{4}$/, 'Phone must be in format (XXX) XXX-XXXX'),
  address: z.object({
    street: z.string().min(5, 'Street address is required'),
    city: z.string().min(2, 'City is required'),
    state: z.string().length(2, 'State must be 2 characters'),
    zipCode: z.string().regex(/^\d{5}$/, 'ZIP code must be 5 digits'),
  }),
  residentialStatus: z.enum(['own', 'rent', 'other']),
  monthlyHousingPayment: z.number().min(0, 'Housing payment cannot be negative'),
});

// Employment Info Schema - Dynamic based on employment type
export const employmentInfoBaseSchema = z.object({
  employmentType: z.enum(['employed', 'self-employed', 'retired', 'unemployed', 'student']),
});

export const employedSchema = employmentInfoBaseSchema.extend({
  employmentType: z.literal('employed'),
  employerName: z.string().min(2, 'Employer name is required'),
  position: z.string().min(2, 'Position is required'),
  yearsEmployed: z.number().min(0, 'Years employed cannot be negative'),
  monthlyIncome: z.number().min(1000, 'Monthly income must be at least $1,000'),
});

export const selfEmployedSchema = employmentInfoBaseSchema.extend({
  employmentType: z.literal('self-employed'),
  businessName: z.string().min(2, 'Business name is required'),
  businessType: z.string().min(2, 'Business type is required'),
  yearsInBusiness: z.number().min(0, 'Years in business cannot be negative'),
  annualRevenue: z.number().min(12000, 'Annual revenue must be at least $12,000'),
});

export const retiredSchema = employmentInfoBaseSchema.extend({
  employmentType: z.literal('retired'),
  pensionAmount: z.number().min(0, 'Pension amount cannot be negative'),
  otherIncome: z.number().min(0, 'Other income cannot be negative'),
  incomeSource: z.string().optional(),
});

export const getEmploymentSchema = (employmentType: string) => {
  switch (employmentType) {
    case 'employed':
      return employedSchema;
    case 'self-employed':
      return selfEmployedSchema;
    case 'retired':
      return retiredSchema;
    default:
      return employmentInfoBaseSchema;
  }
};

// Financial Info Schema
export const financialInfoSchema = z
  .object({
    monthlyIncome: z.number().min(0, 'Monthly income cannot be negative'),
    otherMonthlyIncome: z.number().min(0, 'Other income cannot be negative'),
    otherIncomeSource: z.string().optional(),
    savingsAmount: z.number().min(0, 'Savings cannot be negative'),
    investmentAmount: z.number().min(0, 'Investments cannot be negative'),
    creditCardDebt: z.number().min(0, 'Credit card debt cannot be negative'),
    otherLoansAmount: z.number().min(0, 'Other loans cannot be negative'),
    monthlyExpenses: z.number().min(0, 'Monthly expenses cannot be negative'),
  })
  .refine(
    (data) => {
      // Validate other income source is provided if other income > 0
      if (data.otherMonthlyIncome > 0 && !data.otherIncomeSource) {
        return false;
      }
      return true;
    },
    {
      message: 'Please specify the source of other income',
      path: ['otherIncomeSource'],
    }
  );

// Cross-field validation for the entire application
export const validateApplication = (data: any) => {
  const errors: string[] = [];
  
  // Debt-to-income ratio
  const monthlyIncome = data.financialInfo?.monthlyIncome || 0;
  const otherIncome = data.financialInfo?.otherMonthlyIncome || 0;
  const totalIncome = monthlyIncome + otherIncome;
  
  const housingPayment = data.personalInfo?.monthlyHousingPayment || 0;
  const creditCardPayments = (data.financialInfo?.creditCardDebt || 0) * 0.02; // 2% minimum payment
  const otherLoanPayments = (data.financialInfo?.otherLoansAmount || 0) * 0.05; // 5% estimate
  const loanPayment = calculateMonthlyPayment(
    data.loanDetails?.amount || 0,
    data.loanDetails?.term || 36,
    0.15 // 15% APR estimate
  );
  
  const totalObligations = housingPayment + creditCardPayments + otherLoanPayments + loanPayment;
  const dtiRatio = totalIncome > 0 ? totalObligations / totalIncome : 1;
  
  if (dtiRatio > 0.43) {
    errors.push('Your debt-to-income ratio exceeds the maximum allowed (43%)');
  }
  
  // Loan-to-income validation
  const annualIncome = totalIncome * 12;
  const loanAmount = data.loanDetails?.amount || 0;
  
  if (loanAmount > annualIncome * 5) {
    errors.push('Loan amount cannot exceed 5x your annual income');
  }
  
  // Minimum income requirement
  if (totalIncome < 2000) {
    errors.push('Minimum monthly income requirement is $2,000');
  }
  
  return errors;
};

// Helper function to calculate monthly payment
export const calculateMonthlyPayment = (
  principal: number,
  termMonths: number,
  annualRate: number
): number => {
  const monthlyRate = annualRate / 12;
  const payment =
    (principal * monthlyRate * Math.pow(1 + monthlyRate, termMonths)) /
    (Math.pow(1 + monthlyRate, termMonths) - 1);
  return Math.round(payment * 100) / 100;
};