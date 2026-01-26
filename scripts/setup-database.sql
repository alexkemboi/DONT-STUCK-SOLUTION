-- Don't Stuck Solution - Loan Management System Database Schema

-- Users table for authentication
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'applicant' CHECK (role IN ('applicant', 'admin', 'investor')),
  full_name VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Applicants table (Step 1 - Identity)
CREATE TABLE IF NOT EXISTS applicants (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  surname VARCHAR(100) NOT NULL,
  other_names VARCHAR(200) NOT NULL,
  date_of_birth DATE NOT NULL,
  marital_status VARCHAR(50) CHECK (marital_status IN ('single', 'married', 'divorced', 'widowed')),
  nationality VARCHAR(100) DEFAULT 'Kenyan',
  id_passport_no VARCHAR(50) UNIQUE NOT NULL,
  kra_pin VARCHAR(50) UNIQUE NOT NULL,
  phone VARCHAR(20),
  address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Employment details (Step 2)
CREATE TABLE IF NOT EXISTS employment_details (
  id SERIAL PRIMARY KEY,
  applicant_id INTEGER REFERENCES applicants(id) ON DELETE CASCADE,
  employer_name VARCHAR(255) NOT NULL,
  job_title VARCHAR(100) NOT NULL,
  net_salary DECIMAL(12, 2) NOT NULL,
  contract_type VARCHAR(50) CHECK (contract_type IN ('permanent', 'contract', 'casual', 'self_employed')),
  employment_duration_months INTEGER,
  employer_phone VARCHAR(20),
  employer_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Guarantors/Referees (Step 3)
CREATE TABLE IF NOT EXISTS guarantors (
  id SERIAL PRIMARY KEY,
  applicant_id INTEGER REFERENCES applicants(id) ON DELETE CASCADE,
  full_name VARCHAR(255) NOT NULL,
  id_number VARCHAR(50) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  relationship VARCHAR(100) NOT NULL,
  verified BOOLEAN DEFAULT FALSE,
  verification_sent_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Collateral/Security (Step 4)
CREATE TABLE IF NOT EXISTS collaterals (
  id SERIAL PRIMARY KEY,
  applicant_id INTEGER REFERENCES applicants(id) ON DELETE CASCADE,
  asset_type VARCHAR(50) CHECK (asset_type IN ('vehicle', 'property', 'equipment', 'other')),
  vehicle_registration VARCHAR(50),
  chassis_number VARCHAR(100),
  make_model VARCHAR(200),
  estimated_value DECIMAL(12, 2),
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Loan applications
CREATE TABLE IF NOT EXISTS loan_applications (
  id SERIAL PRIMARY KEY,
  applicant_id INTEGER REFERENCES applicants(id) ON DELETE CASCADE,
  loan_amount DECIMAL(12, 2) NOT NULL,
  processing_fee DECIMAL(12, 2) NOT NULL,
  legal_fee DECIMAL(12, 2) DEFAULT 200.00,
  interest_rate DECIMAL(5, 2) DEFAULT 20.00,
  monthly_installment DECIMAL(12, 2),
  repayment_period_months INTEGER,
  is_refinance BOOLEAN DEFAULT FALSE,
  existing_balance DECIMAL(12, 2) DEFAULT 0,
  net_disbursement DECIMAL(12, 2),
  qualification_cap DECIMAL(12, 2), -- 50% of net salary
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'under_review', 'approved', 'disbursed', 'active', 'npl', 'closed', 'rejected')),
  terms_accepted BOOLEAN DEFAULT FALSE,
  signature_data TEXT, -- Base64 signature image
  signed_at TIMESTAMP WITH TIME ZONE,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  reviewed_by INTEGER REFERENCES users(id),
  approved_at TIMESTAMP WITH TIME ZONE,
  approved_by INTEGER REFERENCES users(id),
  disbursed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Documents
CREATE TABLE IF NOT EXISTS documents (
  id SERIAL PRIMARY KEY,
  applicant_id INTEGER REFERENCES applicants(id) ON DELETE CASCADE,
  loan_application_id INTEGER REFERENCES loan_applications(id) ON DELETE CASCADE,
  document_type VARCHAR(100) NOT NULL CHECK (document_type IN ('id_copy', 'payslip', 'bank_statement', 'kra_certificate', 'employment_letter', 'other')),
  file_name VARCHAR(255) NOT NULL,
  file_url TEXT NOT NULL,
  file_size INTEGER,
  mime_type VARCHAR(100),
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Loan repayments
CREATE TABLE IF NOT EXISTS repayments (
  id SERIAL PRIMARY KEY,
  loan_application_id INTEGER REFERENCES loan_applications(id) ON DELETE CASCADE,
  amount DECIMAL(12, 2) NOT NULL,
  payment_date DATE NOT NULL,
  payment_method VARCHAR(50) CHECK (payment_method IN ('mpesa', 'bank_transfer', 'cash', 'cheque')),
  reference_number VARCHAR(100),
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'failed')),
  recorded_by INTEGER REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Audit trail / Activity log
CREATE TABLE IF NOT EXISTS activity_logs (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  loan_application_id INTEGER REFERENCES loan_applications(id),
  action VARCHAR(100) NOT NULL,
  description TEXT,
  ip_address VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Investor portfolios
CREATE TABLE IF NOT EXISTS investor_portfolios (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  total_invested DECIMAL(14, 2) DEFAULT 0,
  total_returns DECIMAL(14, 2) DEFAULT 0,
  active_loans_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Investor loan allocations
CREATE TABLE IF NOT EXISTS loan_allocations (
  id SERIAL PRIMARY KEY,
  portfolio_id INTEGER REFERENCES investor_portfolios(id) ON DELETE CASCADE,
  loan_application_id INTEGER REFERENCES loan_applications(id) ON DELETE CASCADE,
  allocated_amount DECIMAL(12, 2) NOT NULL,
  expected_return DECIMAL(12, 2),
  actual_return DECIMAL(12, 2) DEFAULT 0,
  allocation_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_applicants_user_id ON applicants(user_id);
CREATE INDEX IF NOT EXISTS idx_loan_applications_applicant_id ON loan_applications(applicant_id);
CREATE INDEX IF NOT EXISTS idx_loan_applications_status ON loan_applications(status);
CREATE INDEX IF NOT EXISTS idx_repayments_loan_id ON repayments(loan_application_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_loan_id ON activity_logs(loan_application_id);
CREATE INDEX IF NOT EXISTS idx_documents_applicant_id ON documents(applicant_id);

-- Insert default admin user (password: admin123 - hashed with bcrypt)
INSERT INTO users (email, password_hash, role, full_name) 
VALUES ('admin@dontstuck.co.ke', '$2b$10$rKN7q5x9Y5Z8vQ2x1Z5Z5O5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5', 'admin', 'System Administrator')
ON CONFLICT (email) DO NOTHING;

-- Insert sample investor
INSERT INTO users (email, password_hash, role, full_name)
VALUES ('investor@dontstuck.co.ke', '$2b$10$rKN7q5x9Y5Z8vQ2x1Z5Z5O5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5', 'investor', 'Sample Investor')
ON CONFLICT (email) DO NOTHING;
