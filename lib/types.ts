export type UserRole = "applicant" | "admin" | "investor";

export type LoanStatus =
  | "draft"
  | "submitted"
  | "under_review"
  | "approved"
  | "disbursed"
  | "repaying"
  | "completed"
  | "rejected"
  | "defaulted";

export type LoanType =
  | "personal"
  | "business"
  | "mortgage"
  | "auto"
  | "education";

export type EmploymentStatus =
  | "employed"
  | "self_employed"
  | "unemployed"
  | "retired";

export type CollateralType =
  | "property"
  | "vehicle"
  | "equipment"
  | "inventory"
  | "other";

export interface User {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  role: UserRole;
  is_verified: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface Applicant {
  id: string;
  user_id: string;
  date_of_birth: Date;
  national_id: string;
  address: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  marital_status?: string;
  dependents?: number;
  created_at: Date;
  updated_at: Date;
}

export interface EmploymentDetails {
  id: string;
  applicant_id: string;
  employment_status: EmploymentStatus;
  employer_name?: string;
  job_title?: string;
  monthly_income: number;
  employment_start_date?: Date;
  work_address?: string;
  work_phone?: string;
  created_at: Date;
  updated_at: Date;
}

export interface Guarantor {
  id: string;
  applicant_id: string;
  full_name: string;
  relationship: string;
  phone: string;
  email?: string;
  address: string;
  occupation: string;
  monthly_income?: number;
  created_at: Date;
}

export interface Collateral {
  id: string;
  loan_application_id: string;
  collateral_type: CollateralType;
  description: string;
  estimated_value: number;
  document_url?: string;
  verified: boolean;
  created_at: Date;
}

export interface LoanApplication {
  id: string;
  applicant_id: string;
  loan_type: LoanType;
  requested_amount: number;
  approved_amount?: number;
  interest_rate?: number;
  tenure_months: number;
  purpose: string;
  status: LoanStatus;
  submitted_at?: Date;
  reviewed_by?: string;
  reviewed_at?: Date;
  disbursed_at?: Date;
  rejection_reason?: string;
  created_at: Date;
  updated_at: Date;
}

export interface Document {
  id: string;
  loan_application_id: string;
  document_type: string;
  file_name: string;
  file_url: string;
  uploaded_at: Date;
  verified: boolean;
  verified_by?: string;
  verified_at?: Date;
}

export interface Repayment {
  id: string;
  loan_application_id: string;
  due_date: Date;
  amount_due: number;
  amount_paid: number;
  paid_at?: Date;
  payment_method?: string;
  transaction_reference?: string;
  status: "pending" | "paid" | "overdue" | "partial";
  created_at: Date;
}

export interface ActivityLog {
  id: string;
  user_id: string;
  action: string;
  entity_type: string;
  entity_id: string;
  details?: Record<string, unknown>;
  ip_address?: string;
  created_at: Date;
}

export interface InvestorPortfolio {
  id: string;
  investor_id: string;
  total_invested: number;
  total_returns: number;
  active_investments: number;
  risk_preference?: string;
  created_at: Date;
  updated_at: Date;
}

export interface LoanAllocation {
  id: string;
  loan_application_id: string;
  investor_portfolio_id: string;
  allocated_amount: number;
  expected_return: number;
  actual_return: number;
  status: "active" | "completed" | "defaulted";
  created_at: Date;
  updated_at: Date;
}

// Form step types for onboarding wizard
export interface PersonalInfoFormData {
  full_name: string;
  email: string;
  phone: string;
  date_of_birth: string;
  national_id: string;
  address: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  marital_status: string;
  dependents: number;
}

export interface EmploymentFormData {
  employment_status: EmploymentStatus;
  employer_name: string;
  job_title: string;
  monthly_income: number;
  employment_start_date: string;
  work_address: string;
  work_phone: string;
}

export interface LoanDetailsFormData {
  loan_type: LoanType;
  requested_amount: number;
  tenure_months: number;
  purpose: string;
}

export interface GuarantorFormData {
  full_name: string;
  relationship: string;
  phone: string;
  email: string;
  address: string;
  occupation: string;
  monthly_income: number;
}

export interface CollateralFormData {
  collateral_type: CollateralType;
  description: string;
  estimated_value: number;
}

export interface OnboardingFormData {
  personal: PersonalInfoFormData;
  employment: EmploymentFormData;
  loan: LoanDetailsFormData;
  guarantors: GuarantorFormData[];
  collaterals: CollateralFormData[];
}

// Dashboard stats types
export interface DashboardStats {
  totalApplications: number;
  pendingReview: number;
  approvedLoans: number;
  totalDisbursed: number;
  activeLoans: number;
  overduePayments: number;
}

export interface InvestorStats {
  totalInvested: number;
  totalReturns: number;
  activeInvestments: number;
  averageReturn: number;
  portfolioValue: number;
}
