import { neon } from '@neondatabase/serverless'

export const sql = neon(process.env.DATABASE_URL!)

export type User = {
  id: number
  email: string
  password_hash: string
  role: 'applicant' | 'admin' | 'investor'
  full_name: string | null
  created_at: string
  updated_at: string
}

export type Applicant = {
  id: number
  user_id: number | null
  surname: string
  other_names: string
  date_of_birth: string
  marital_status: 'single' | 'married' | 'divorced' | 'widowed'
  nationality: string
  id_passport_no: string
  kra_pin: string
  phone: string | null
  address: string | null
  created_at: string
  updated_at: string
}

export type EmploymentDetails = {
  id: number
  applicant_id: number
  employer_name: string
  job_title: string
  net_salary: number
  contract_type: 'permanent' | 'contract' | 'casual' | 'self_employed'
  employment_duration_months: number | null
  employer_phone: string | null
  employer_address: string | null
  created_at: string
  updated_at: string
}

export type Guarantor = {
  id: number
  applicant_id: number
  full_name: string
  id_number: string
  phone: string
  relationship: string
  verified: boolean
  verification_sent_at: string | null
  created_at: string
}

export type Collateral = {
  id: number
  applicant_id: number
  asset_type: 'vehicle' | 'property' | 'equipment' | 'other'
  vehicle_registration: string | null
  chassis_number: string | null
  make_model: string | null
  estimated_value: number | null
  description: string | null
  created_at: string
  updated_at: string
}

export type LoanApplication = {
  id: number
  applicant_id: number
  loan_amount: number
  processing_fee: number
  legal_fee: number
  interest_rate: number
  monthly_installment: number | null
  repayment_period_months: number | null
  is_refinance: boolean
  existing_balance: number
  net_disbursement: number | null
  qualification_cap: number | null
  status: 'pending' | 'under_review' | 'approved' | 'disbursed' | 'active' | 'npl' | 'closed' | 'rejected'
  terms_accepted: boolean
  signature_data: string | null
  signed_at: string | null
  submitted_at: string
  reviewed_at: string | null
  reviewed_by: number | null
  approved_at: string | null
  approved_by: number | null
  disbursed_at: string | null
  created_at: string
  updated_at: string
}

export type Document = {
  id: number
  applicant_id: number
  loan_application_id: number | null
  document_type: 'id_copy' | 'payslip' | 'bank_statement' | 'kra_certificate' | 'employment_letter' | 'other'
  file_name: string
  file_url: string
  file_size: number | null
  mime_type: string | null
  uploaded_at: string
}

export type Repayment = {
  id: number
  loan_application_id: number
  amount: number
  payment_date: string
  payment_method: 'mpesa' | 'bank_transfer' | 'cash' | 'cheque'
  reference_number: string | null
  status: 'pending' | 'confirmed' | 'failed'
  recorded_by: number | null
  created_at: string
}

export type ActivityLog = {
  id: number
  user_id: number | null
  loan_application_id: number | null
  action: string
  description: string | null
  ip_address: string | null
  created_at: string
}

export type InvestorPortfolio = {
  id: number
  user_id: number
  total_invested: number
  total_returns: number
  active_loans_count: number
  created_at: string
  updated_at: string
}

export type LoanAllocation = {
  id: number
  portfolio_id: number
  loan_application_id: number
  allocated_amount: number
  expected_return: number | null
  actual_return: number
  allocation_date: string
  created_at: string
}

// Financial calculation helpers
export function calculateProcessingFee(amount: number): number {
  if (amount <= 10000) {
    return 500
  }
  return amount * 0.05
}

export function calculateQualificationCap(netSalary: number): number {
  return netSalary * 0.5
}

export function calculateMonthlyInstallment(
  principal: number,
  annualInterestRate: number,
  months: number
): number {
  const monthlyRate = annualInterestRate / 100 / 12
  if (monthlyRate === 0) return principal / months
  const installment =
    (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
    (Math.pow(1 + monthlyRate, months) - 1)
  return Math.round(installment * 100) / 100
}

export function calculateNetDisbursement(
  loanAmount: number,
  processingFee: number,
  legalFee: number,
  existingBalance: number = 0
): number {
  return loanAmount - processingFee - legalFee - existingBalance
}
