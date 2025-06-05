import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { ApplicationData, FormStep } from '../types';

interface ApplicationStore {
  applicationData: Partial<ApplicationData>;
  currentStep: FormStep;
  completedSteps: FormStep[];
  
  // Actions
  updateLoanDetails: (data: Partial<ApplicationData['loanDetails']>) => void;
  updatePersonalInfo: (data: Partial<ApplicationData['personalInfo']>) => void;
  updateEmploymentInfo: (data: Partial<ApplicationData['employmentInfo']>) => void;
  updateFinancialInfo: (data: Partial<ApplicationData['financialInfo']>) => void;
  setCurrentStep: (step: FormStep) => void;
  markStepCompleted: (step: FormStep) => void;
  resetApplication: () => void;
  submitApplication: () => Promise<void>;
}

const initialState: Partial<ApplicationData> = {
  loanDetails: {
    amount: 10000,
    purpose: 'debt-consolidation',
    term: 36,
  },
  personalInfo: {
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    email: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
    },
    residentialStatus: 'rent',
    monthlyHousingPayment: 0,
  },
  employmentInfo: {
    employmentType: 'employed',
  },
  financialInfo: {
    monthlyIncome: 0,
    otherMonthlyIncome: 0,
    savingsAmount: 0,
    investmentAmount: 0,
    creditCardDebt: 0,
    otherLoansAmount: 0,
    monthlyExpenses: 0,
  },
};

export const useApplicationStore = create<ApplicationStore>()(
  persist(
    (set, get) => ({
      applicationData: initialState,
      currentStep: 'loan-details',
      completedSteps: [],

      updateLoanDetails: (data) =>
        set((state) => ({
          applicationData: {
            ...state.applicationData,
            loanDetails: {
              ...state.applicationData.loanDetails!,
              ...data,
            } as ApplicationData['loanDetails'],
          },
        })),

      updatePersonalInfo: (data) =>
        set((state) => ({
          applicationData: {
            ...state.applicationData,
            personalInfo: {
              ...state.applicationData.personalInfo!,
              ...data,
            } as ApplicationData['personalInfo'],
          },
        })),

      updateEmploymentInfo: (data) =>
        set((state) => ({
          applicationData: {
            ...state.applicationData,
            employmentInfo: {
              ...state.applicationData.employmentInfo!,
              ...data,
            } as ApplicationData['employmentInfo'],
          },
        })),

      updateFinancialInfo: (data) =>
        set((state) => ({
          applicationData: {
            ...state.applicationData,
            financialInfo: {
              ...state.applicationData.financialInfo!,
              ...data,
            } as ApplicationData['financialInfo'],
          },
        })),

      setCurrentStep: (step) => set({ currentStep: step }),

      markStepCompleted: (step) =>
        set((state) => ({
          completedSteps: [...new Set([...state.completedSteps, step])],
        })),

      resetApplication: () =>
        set({
          applicationData: initialState,
          currentStep: 'loan-details',
          completedSteps: [],
        }),

      submitApplication: async () => {
        const { applicationData } = get();
        const application = {
          ...applicationData,
          id: Math.random().toString(36).substr(2, 9),
          submittedAt: new Date().toISOString(),
          status: 'submitted' as const,
          consentGiven: true,
        };
        
        // Store in localStorage for demo purposes
        const applications = JSON.parse(localStorage.getItem('applications') || '[]');
        applications.push(application);
        localStorage.setItem('applications', JSON.stringify(applications));
        
        // Reset after submission
        get().resetApplication();
      },
    }),
    {
      name: 'loan-application-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);