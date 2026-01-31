import { Prisma } from "./generated/prisma";

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



// Enums
export type Title = 'Mr' | 'Mrs' | 'Ms' | 'Miss'
export type MaritalStatus = 'Single' | 'Married' | 'Divorced' | 'Widowed'
export type ClientStatus = 'Active' | 'Inactive' 
export type EmploymentType = 'FullTime' | 'PartTime' | 'Contract' 
export type LoanApplicationStatus = 'Pending' | 'UnderReview' | 'Approved' | 'Rejected' | 'Disbursed'
export type QualificationType = 'New' | 'Repeat' | 'TopUp'

// Client Profile
export interface Client {
  id?: string
  userId?: string | null
  title: Title
  surname: string
  otherNames: string
  dateOfBirth: string | Date
  maritalStatus: MaritalStatus
  nationality: string
  dependents: number
  idPassportNo: string
  kraPin?: string | null
  phoneWork?: string | null
  phoneMobile: string
  phoneAlternative?: string | null
  emailPersonal?: string | null
  emailOfficial?: string | null
  status?: ClientStatus
  createdAt?: string | Date
  updatedAt?: string | Date
}

// Client Address
export interface ClientAddress {
  id?: string
  clientId?: string
  postalAddress: string | null
  postalCode: string | null
  townCity: string | null
  residentialAddress: string | null
  location: string | null
  estate: string | null
  building: string | null
  houseNumber: string  | null
  landmark: string | null
  createdAt?: Date
  updatedAt?: Date
}

// Employment Details
export interface EmploymentDetail {
  id?: string
  clientId?: string

  employerName: string
  jobTitle: string

  department?: string | null
  dateJoined?: string | Date | null
  periodWorked?: string | null

  employmentType: EmploymentType
  contractExpiry?: string | Date | null

  onNotice: boolean

  netSalary: any // (see Decimal note below)

  branchLocation?: string | null
  roadStreet?: string | null
  building?: string | null
  floorOffice?: string | null
  telephone?: string | null

  createdAt?: string | Date
  updatedAt?: string | Date
}


// Referee/Next of Kin
export interface Referee {
  id?: string
  clientId?: string
  surname: string
  otherNames: string
  relationship: string
  idPassportNo: string | null
  employerName: string | null
  locationStation: string | null
  phoneWork: string | null
  phoneMobile: string
  isRelative: boolean
  createdAt?: string
}

// Bank Details
export interface BankDetail {
  id?: string
  clientId?: string
  bankName: string
  branch: string
  accountName: string
  accountNumber: string
  proofDocument?: string 
  proofDocumentUrl?: string 
  createdAt?: string
  updatedAt?: string
}

// Loan Application
export interface LoanApplication {
  id: string
  clientId: string
  purpose: string
  amountRequested: number
  approvedAmount?: number
  qualificationType?: QualificationType
  interestRate: number
  startDate?: string
  repaymentPeriod: number
  status: LoanStatus
  appliedAt: string
  reviewedAt?: string
  reviewedById?: string
  approvedAt?: string
  approvedById?: string
  rejectionReason?: string
  createdAt: string
  updatedAt: string
}

// Full Profile with Relations
export interface FullProfile {
  client: Client | null
  address: ClientAddress | null
  employment: EmploymentDetail | null
  referees: Referee[]
  bankDetails: BankDetail | null
}

// Form Values
export interface PersonalInfoFormValues {
  id?: string
  userId?: string
  title: Title
  surname: string
  otherNames: string
  dateOfBirth: string
  maritalStatus: MaritalStatus
  nationality: string
  dependents: number
  idPassportNo: string
  kraPin: string
  phoneWork: string
  phoneMobile: string
  phoneAlternative: string
  emailPersonal: string
  emailOfficial: string
}

export interface AddressFormValues {
  id?: string
  clientId?: string
  postalAddress: string
  postalCode: string
  townCity: string
  residentialAddress: string
  location: string
  estate: string
  building: string
  houseNumber: string
  landmark: string
}

export interface EmploymentFormValues {
  id?: string
  clientId?: string
  employerName: string
  jobTitle: string
  department: string
  dateJoined: string
  periodWorked: string
  employmentType: EmploymentType
  contractExpiry: string
  onNotice: boolean
  netSalary: number
  branchLocation: string
  roadStreet: string
  building: string
  floorOffice: string
  telephone: string
}

export interface RefereeFormValues {
  id?: string
  surname: string
  otherNames: string
  relationship: string
  idPassportNo: string
  employerName: string
  locationStation: string
  phoneWork: string
  phoneMobile: string
  isRelative: boolean
}

export interface BankDetailFormValues {
  bankName: string
  branch: string
  accountName: string
  accountNumber: string
  proofDocumentUrl: string
}

export interface LoanApplicationFormValues {
  purpose: string
  amountRequested: number
  repaymentPeriod: number
}

// Guarantor form values for Apply Loan page (matches Prisma Guarantor model)
export interface GuarantorFormValues {
  fullName: string
  phone: string
  email: string
  idNumber: string
  relationship: string
}

export interface Allocation {
  id: string;
  loan_application_id: string;
  allocated_amount: number;
  expected_return: number;
  actual_return: number;
  status: string;
  created_at: string;
  loan_type: string;
  approved_amount: number;
  interest_rate: number;
  tenure_months: number;
  loan_status: string;
  borrower_name: string;
}

export interface AvailableLoan {
  id: string;
  loan_type: string;
  approved_amount: number;
  interest_rate: number;
  tenure_months: number;
  purpose: string;
  borrower_name: string;
  city: string;
  state: string;
  employment_status: string;
  monthly_income: number;
  already_funded: number;
}

// Combined submit data for the multi-step loan application
export interface LoanApplicationSubmitData {
  purpose: string
  amountRequested: number
  repaymentPeriod: number
  guarantors: GuarantorFormValues[]
}
