# Personal Loan Application System - Integration Testing Example Plan

## Overview
A comprehensive loan application system with multi-step forms, complex validation rules, and conditional logic based on applicant information. This application provides numerous scenarios for integration testing that will be implemented during the workshop.

## Key Features

### 1. Multi-Step Application Flow
- **Step 1: Loan Details** - Amount, purpose, term length
- **Step 2: Personal Information** - Name, DOB, contact details
- **Step 3: Employment & Income** - Job details, income sources
- **Step 4: Financial Information** - Assets, liabilities, expenses
- **Step 5: Review & Submit** - Summary and consent

### 2. Dynamic Form Behavior
- **Conditional Fields**: Show/hide based on previous answers
- **Progressive Disclosure**: Additional fields based on loan amount
- **Smart Defaults**: Pre-fill based on user selections
- **Real-time Validation**: Instant feedback on field changes

### 3. Complex Validation Rules
- **Cross-field Validation**: Income vs loan amount ratios
- **Business Logic**: Eligibility calculations
- **External Validations**: Address verification, employer lookup
- **Temporal Validations**: Age requirements, employment duration

## Technical Architecture

### Frontend (Next.js App Router)
- **Pages**:
  - `/` - Landing page with loan calculator
  - `/apply` - Main application wizard
  - `/apply/[step]` - Individual form steps
  - `/status/[id]` - Application status page
  - `/admin` - Review submitted applications

### Form Management
- **State Management**: Complex form state with Zustand
- **Validation Library**: Zod for schema validation
- **Form Library**: React Hook Form for form handling
- **Progress Tracking**: Save and resume functionality

## Complex Form Scenarios

### 1. Conditional Logic Examples

```typescript
// Employment fields change based on employment type
if (employmentType === 'self-employed') {
  // Show: Business name, ABN, years in business, annual revenue
  // Hide: Employer name, position, salary
} else if (employmentType === 'employed') {
  // Show: Employer name, position, salary, years employed
  // Hide: Business fields
} else if (employmentType === 'retired') {
  // Show: Pension details, other income sources
  // Hide: Employment fields
}
```

### 2. Cross-Field Validation Rules

```typescript
// Debt-to-income ratio
const monthlyIncome = calculateMonthlyIncome(formData);
const monthlyObligations = calculateMonthlyObligations(formData);
const dtiRatio = monthlyObligations / monthlyIncome;

if (dtiRatio > 0.43) {
  errors.push('Debt-to-income ratio exceeds maximum allowed');
}

// Loan-to-income validation
if (loanAmount > annualIncome * 5) {
  errors.push('Loan amount cannot exceed 5x annual income');
}
```

### 3. Multi-Step Dependencies

- Step 2 fields depend on loan amount from Step 1
- Step 3 validation depends on age from Step 2
- Step 4 requirements change based on employment from Step 3
- Step 5 displays different consent forms based on all previous data

## Integration Testing Scenarios (To Be Added During Workshop)

### 1. Happy Path Tests
- **Standard Employee**: Complete application with typical data
- **Self-Employed**: Business owner application flow
- **Joint Application**: Two applicants with combined income

### 2. Validation Tests
- **Boundary Testing**: Min/max values for all numeric fields
- **Required Field Testing**: Ensure all required fields are enforced
- **Format Testing**: Email, phone, postal code formats
- **Business Rule Testing**: Income ratios, age limits

### 3. User Flow Tests
- **Save and Resume**: Partial completion and return
- **Back Navigation**: Changing previous answers
- **Error Recovery**: Network failures during submission
- **Session Timeout**: Handle expired sessions gracefully

### 4. Edge Cases
- **Multiple Income Sources**: Complex income calculations
- **International Addresses**: Non-standard address formats
- **Special Characters**: Names with apostrophes, hyphens
- **Concurrent Applications**: Same user, multiple applications

## Complex Validation Examples

### 1. Address Validation
```typescript
interface AddressValidation {
  // Autocomplete suggestions
  suggestAddresses(partial: string): Promise<Address[]>;
  
  // Verify address exists
  verifyAddress(address: Address): Promise<boolean>;
  
  // Check if residential (not PO Box for home loans)
  isResidential(address: Address): boolean;
}
```

### 2. Income Verification
```typescript
interface IncomeValidation {
  // Different rules for different employment types
  validateSalary(data: SalaryData): ValidationResult;
  validateSelfEmployedIncome(data: BusinessData): ValidationResult;
  validateInvestmentIncome(data: InvestmentData): ValidationResult;
  
  // Combined income calculations
  calculateTotalMonthlyIncome(sources: IncomeSource[]): number;
}
```

### 3. Eligibility Engine
```typescript
interface EligibilityCheck {
  // Real-time eligibility as user fills form
  checkEligibility(formData: Partial<Application>): {
    eligible: boolean;
    reasons: string[];
    suggestions: string[];
  };
}
```

## Testing Focus Areas

### 1. Form Navigation
- Forward/backward navigation maintains state
- Skip logic works correctly
- Progress indicator accuracy
- Keyboard navigation support

### 2. Data Persistence
- Form data saves correctly
- Resume from different devices
- Handle browser refresh
- Clear data on submission

### 3. Error Handling
- Field-level error display
- Summary error display
- API error handling
- Graceful degradation

### 4. Accessibility
- Screen reader compatibility
- Keyboard-only navigation
- Error announcements
- Focus management

## Real-World Testing Challenges

1. **Async Validation**: Address lookup, employer verification
2. **Date Calculations**: Age validation, employment duration
3. **Currency Formatting**: Display vs stored values
4. **File Uploads**: Document size/type validation
5. **Multi-tab Behavior**: Prevent duplicate submissions

## Setup Commands
```bash
# Generate the Next.js app
npx nx g @nx/next:app loan-application --directory=apps/loan-application --appDir=true --e2eTestRunner=none --projectNameAndRootFormat=as-provided

# Install additional dependencies
pnpm add --filter=loan-application react-hook-form zod @hookform/resolvers zustand date-fns react-imask
```

## Workshop Testing Strategy

Participants will create integration tests for:
1. Complete user journeys
2. Form validation rules
3. API integration points
4. Error scenarios
5. Accessibility requirements

The tests will cover both happy paths and edge cases, demonstrating real-world testing patterns that apply to any complex form application.