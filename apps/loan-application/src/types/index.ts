export type EmploymentType = 'employed' | 'self-employed' | 'retired' | 'unemployed' | 'student';

export type LoanPurpose = 
  | 'debt-consolidation'
  | 'home-improvement'
  | 'major-purchase'
  | 'auto'
  | 'medical'
  | 'vacation'
  | 'wedding'
  | 'other';

export interface LoanDetails {
  amount: number;
  purpose: LoanPurpose;
  term: number; // in months
  monthlyPayment?: number;
}

export interface PersonalInfo {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  residentialStatus: 'own' | 'rent' | 'other';
  monthlyHousingPayment: number;
}

export interface EmploymentInfo {
  employmentType: EmploymentType;
  // For employed
  employerName?: string;
  position?: string;
  yearsEmployed?: number;
  monthlyIncome?: number;
  // For self-employed
  businessName?: string;
  businessType?: string;
  yearsInBusiness?: number;
  annualRevenue?: number;
  // For retired
  pensionAmount?: number;
  otherIncome?: number;
  incomeSource?: string;
}

export interface FinancialInfo {
  monthlyIncome: number;
  otherMonthlyIncome: number;
  otherIncomeSource?: string;
  savingsAmount: number;
  investmentAmount: number;
  creditCardDebt: number;
  otherLoansAmount: number;
  monthlyExpenses: number;
}

export interface ApplicationData {
  loanDetails: LoanDetails;
  personalInfo: PersonalInfo;
  employmentInfo: EmploymentInfo;
  financialInfo: FinancialInfo;
  consentGiven?: boolean;
  submittedAt?: string;
  id?: string;
  status?: 'draft' | 'submitted' | 'under-review' | 'approved' | 'rejected';
}

export type FormStep = 'loan-details' | 'personal-info' | 'employment' | 'financial' | 'review';

export const FORM_STEPS: FormStep[] = [
  'loan-details',
  'personal-info',
  'employment',
  'financial',
  'review'
];

export const STEP_TITLES: Record<FormStep, string> = {
  'loan-details': 'Loan Details',
  'personal-info': 'Personal Information',
  'employment': 'Employment & Income',
  'financial': 'Financial Information',
  'review': 'Review & Submit'
};