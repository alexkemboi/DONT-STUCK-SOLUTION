-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "Title" AS ENUM ('Mr', 'Mrs', 'Miss', 'Ms');

-- CreateEnum
CREATE TYPE "MaritalStatus" AS ENUM ('Single', 'Married', 'Divorced', 'Widowed');

-- CreateEnum
CREATE TYPE "ClientStatus" AS ENUM ('Active', 'Inactive');

-- CreateEnum
CREATE TYPE "EmploymentType" AS ENUM ('FullTime', 'PartTime', 'Contract');

-- CreateEnum
CREATE TYPE "LoanApplicationStatus" AS ENUM ('Pending', 'Approved', 'Rejected', 'Disbursed', 'Active', 'NPL', 'Closed');

-- CreateEnum
CREATE TYPE "QualificationType" AS ENUM ('SalaryBased', 'StatementBased');

-- CreateEnum
CREATE TYPE "GuarantorStatus" AS ENUM ('Pending', 'Confirmed', 'Declined');

-- CreateEnum
CREATE TYPE "DisbursementMethod" AS ENUM ('Bank', 'Mpesa');

-- CreateEnum
CREATE TYPE "RepaymentCategory" AS ENUM ('Employment', 'Business', 'Repeat');

-- CreateEnum
CREATE TYPE "ScheduleStatus" AS ENUM ('Pending', 'Paid', 'Partial', 'Overdue');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('Cash', 'Bank', 'Mpesa');

-- CreateEnum
CREATE TYPE "InvoiceType" AS ENUM ('Disbursement', 'Repayment', 'Penalty', 'Fee');

-- CreateEnum
CREATE TYPE "InvoiceStatus" AS ENUM ('Draft', 'Issued', 'PartiallyPaid', 'Paid', 'Overdue');

-- CreateEnum
CREATE TYPE "ChargeType" AS ENUM ('Principal', 'Interest', 'Penalty', 'ProcessingFee', 'LegalFee');

-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('Disbursement', 'Repayment', 'Provision', 'Penalty', 'Expense', 'Recovery', 'Invest');

-- CreateEnum
CREATE TYPE "ReferenceType" AS ENUM ('Loan', 'Client', 'Investor', 'Expense');

-- CreateEnum
CREATE TYPE "TransactionStatus" AS ENUM ('Pending', 'Completed', 'Reversed');

-- CreateEnum
CREATE TYPE "DocumentType" AS ENUM ('ID', 'Payslip', 'Statement', 'PassportPhoto', 'AppointmentLetter', 'BankStatement', 'KRACertificate', 'Other');

-- CreateEnum
CREATE TYPE "SmsPurpose" AS ENUM ('Reminder', 'Guarantor', 'Recovery', 'Notification');

-- CreateEnum
CREATE TYPE "ExpenseType" AS ENUM ('Ops', 'Recovery', 'Legal');

-- CreateEnum
CREATE TYPE "AccountType" AS ENUM ('Asset', 'Liability', 'Equity', 'Income', 'Expense');

-- CreateEnum
CREATE TYPE "NormalBalance" AS ENUM ('Debit', 'Credit');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('LoanOfficer', 'Admin', 'Investor', 'RecoveryAgent', 'Client');

-- CreateEnum
CREATE TYPE "PaymentFrequency" AS ENUM ('MONTHLY', 'WEEKLY');

-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'Client',
    "phone" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "image" TEXT,
    "emailVerified" BOOLEAN DEFAULT false,
    "name" TEXT NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clients" (
    "id" TEXT NOT NULL,
    "user_id" TEXT,
    "title" "Title" NOT NULL,
    "surname" TEXT NOT NULL,
    "other_names" TEXT NOT NULL,
    "date_of_birth" TIMESTAMP(3) NOT NULL,
    "marital_status" "MaritalStatus" NOT NULL,
    "nationality" TEXT NOT NULL,
    "dependents" INTEGER NOT NULL DEFAULT 0,
    "id_passport_no" TEXT NOT NULL,
    "kra_pin" TEXT,
    "phone_work" TEXT,
    "phone_mobile" TEXT NOT NULL,
    "phone_alternative" TEXT,
    "email_personal" TEXT,
    "email_official" TEXT,
    "status" "ClientStatus" NOT NULL DEFAULT 'Active',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "clients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "client_addresses" (
    "id" TEXT NOT NULL,
    "client_id" TEXT NOT NULL,
    "postal_address" TEXT,
    "postal_code" TEXT,
    "town_city" TEXT,
    "residential_address" TEXT,
    "location" TEXT,
    "estate" TEXT,
    "building" TEXT,
    "house_number" TEXT,
    "landmark" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "client_addresses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "employment_details" (
    "id" TEXT NOT NULL,
    "client_id" TEXT NOT NULL,
    "employer_name" TEXT NOT NULL,
    "job_title" TEXT NOT NULL,
    "department" TEXT,
    "date_joined" TIMESTAMP(3),
    "period_worked" TEXT,
    "employment_type" "EmploymentType" NOT NULL,
    "contract_expiry" TIMESTAMP(3),
    "on_notice" BOOLEAN NOT NULL DEFAULT false,
    "net_salary" DECIMAL(15,2) NOT NULL,
    "branch_location" TEXT,
    "road_street" TEXT,
    "building" TEXT,
    "floor_office" TEXT,
    "telephone" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "employment_details_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "referees_next_of_kin" (
    "id" TEXT NOT NULL,
    "client_id" TEXT NOT NULL,
    "surname" TEXT NOT NULL,
    "other_names" TEXT NOT NULL,
    "relationship" TEXT NOT NULL,
    "id_passport_no" TEXT,
    "employer_name" TEXT,
    "location_station" TEXT,
    "phone_work" TEXT,
    "phone_mobile" TEXT NOT NULL,
    "is_relative" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "referees_next_of_kin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bank_details" (
    "id" TEXT NOT NULL,
    "client_id" TEXT NOT NULL,
    "bank_name" TEXT NOT NULL,
    "branch" TEXT NOT NULL,
    "account_name" TEXT NOT NULL,
    "account_number" TEXT NOT NULL,
    "proof_document" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "proof_document_url" TEXT,

    CONSTRAINT "bank_details_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "loan_applications" (
    "id" TEXT NOT NULL,
    "client_id" TEXT NOT NULL,
    "purpose" TEXT NOT NULL,
    "amount_requested" DECIMAL(15,2) NOT NULL,
    "approved_amount" DECIMAL(15,2),
    "qualification_type" "QualificationType",
    "interest_rate" DECIMAL(5,2) NOT NULL DEFAULT 20,
    "start_date" TIMESTAMP(3),
    "repayment_period" INTEGER NOT NULL,
    "status" "LoanApplicationStatus" NOT NULL DEFAULT 'Pending',
    "applied_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewed_at" TIMESTAMP(3),
    "reviewed_by_id" TEXT,
    "approved_at" TIMESTAMP(3),
    "approved_by_id" TEXT,
    "rejection_reason" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "payment_frequency" "PaymentFrequency" NOT NULL DEFAULT 'MONTHLY',
    "loan_number" SERIAL NOT NULL,

    CONSTRAINT "loan_applications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "loan_qualifications" (
    "id" TEXT NOT NULL,
    "loan_id" TEXT NOT NULL,
    "avg_income" DECIMAL(15,2) NOT NULL,
    "eligibility_amount" DECIMAL(15,2) NOT NULL,
    "rule_applied" "QualificationType" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "loan_qualifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "loan_security" (
    "id" TEXT NOT NULL,
    "loan_id" TEXT NOT NULL,
    "id_copy" BOOLEAN NOT NULL DEFAULT false,
    "passport_photo" BOOLEAN NOT NULL DEFAULT false,
    "appointment_letter" BOOLEAN NOT NULL DEFAULT false,
    "payslips" BOOLEAN NOT NULL DEFAULT false,
    "bank_statement" BOOLEAN NOT NULL DEFAULT false,
    "cheque_leaf_no" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "loan_security_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vehicle_security" (
    "id" TEXT NOT NULL,
    "loan_id" TEXT NOT NULL,
    "registration_number" TEXT NOT NULL,
    "chassis_number" TEXT NOT NULL,
    "engine_number" TEXT NOT NULL,
    "year_of_manufacture" INTEGER NOT NULL,
    "make" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "body_color" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "vehicle_security_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "guarantors" (
    "id" TEXT NOT NULL,
    "loan_id" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "id_number" TEXT,
    "relationship" TEXT,
    "confirmation_status" "GuarantorStatus" NOT NULL DEFAULT 'Pending',
    "confirmed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "guarantors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "loan_disbursements" (
    "id" TEXT NOT NULL,
    "loan_id" TEXT NOT NULL,
    "amount" DECIMAL(15,2) NOT NULL,
    "method" "DisbursementMethod" NOT NULL,
    "reference" TEXT,
    "disbursed_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "loan_disbursements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "loan_financials" (
    "id" TEXT NOT NULL,
    "loan_id" TEXT NOT NULL,
    "processing_fee" DECIMAL(15,2) NOT NULL,
    "legal_fee" DECIMAL(15,2) NOT NULL DEFAULT 200,
    "penalty_fee" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "interest_amount" DECIMAL(15,2) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "loan_financials_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invoices" (
    "id" TEXT NOT NULL,
    "invoice_number" TEXT NOT NULL,
    "client_id" TEXT NOT NULL,
    "loan_id" TEXT NOT NULL,
    "invoice_type" "InvoiceType" NOT NULL,
    "invoice_date" TIMESTAMP(3) NOT NULL,
    "due_date" TIMESTAMP(3) NOT NULL,
    "total_amount" DECIMAL(15,2) NOT NULL,
    "status" "InvoiceStatus" NOT NULL DEFAULT 'Draft',
    "issued_by" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "invoices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invoice_items" (
    "id" TEXT NOT NULL,
    "invoice_id" TEXT NOT NULL,
    "charge_type" "ChargeType" NOT NULL,
    "description" TEXT,
    "amount" DECIMAL(15,2) NOT NULL,
    "gl_account" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "invoice_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "invoice_payments" (
    "id" TEXT NOT NULL,
    "invoice_id" TEXT NOT NULL,
    "transaction_id" TEXT,
    "amount_paid" DECIMAL(15,2) NOT NULL,
    "payment_date" TIMESTAMP(3) NOT NULL,
    "payment_method" "PaymentMethod" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "invoice_payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transactions" (
    "id" TEXT NOT NULL,
    "transaction_code" TEXT NOT NULL,
    "transaction_type" "TransactionType" NOT NULL,
    "reference_type" "ReferenceType" NOT NULL,
    "reference_id" TEXT NOT NULL,
    "amount" DECIMAL(15,2) NOT NULL,
    "debit_account" TEXT NOT NULL,
    "credit_account" TEXT NOT NULL,
    "payment_method" "PaymentMethod",
    "transaction_date" TIMESTAMP(3) NOT NULL,
    "description" TEXT,
    "status" "TransactionStatus" NOT NULL DEFAULT 'Pending',
    "created_by" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "client_id" TEXT,

    CONSTRAINT "transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "repayments" (
    "id" TEXT NOT NULL,
    "loan_id" TEXT NOT NULL,
    "amount" DECIMAL(15,2) NOT NULL,
    "payment_method" "PaymentMethod" NOT NULL,
    "payment_date" TIMESTAMP(3) NOT NULL,
    "category" "RepaymentCategory" NOT NULL,
    "reference" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "repayments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "repayment_schedules" (
    "id" TEXT NOT NULL,
    "loan_id" TEXT NOT NULL,
    "installment_number" INTEGER NOT NULL,
    "due_date" TIMESTAMP(3) NOT NULL,
    "scheduled_payment" DECIMAL(15,2) NOT NULL,
    "principal_portion" DECIMAL(15,2) NOT NULL,
    "interest_portion" DECIMAL(15,2) NOT NULL,
    "expected_balance" DECIMAL(15,2) NOT NULL,
    "actual_amount_paid" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "actual_principal_paid" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "actual_interest_paid" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "remaining_principal" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "remaining_interest" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "actual_payment_date" TIMESTAMP(3),
    "status" "ScheduleStatus" NOT NULL DEFAULT 'Pending',
    "repayment_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "repayment_schedules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "non_performing_loans" (
    "id" TEXT NOT NULL,
    "loan_id" TEXT NOT NULL,
    "capitalized_amount" DECIMAL(15,2) NOT NULL,
    "flagged_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "non_performing_loans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "recovery_agents" (
    "id" TEXT NOT NULL,
    "user_id" TEXT,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "recovery_agents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "recovery_records" (
    "id" TEXT NOT NULL,
    "loan_id" TEXT NOT NULL,
    "agent_id" TEXT NOT NULL,
    "action_taken" TEXT NOT NULL,
    "outcome" TEXT,
    "recorded_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "recovery_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "investors" (
    "id" TEXT NOT NULL,
    "user_id" TEXT,
    "name" TEXT NOT NULL,
    "contact" TEXT NOT NULL,
    "email" TEXT,
    "invested_amount" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "investors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "investor_allocations" (
    "id" TEXT NOT NULL,
    "investor_id" TEXT NOT NULL,
    "loan_id" TEXT NOT NULL,
    "allocated_amount" DECIMAL(15,2) NOT NULL,
    "expected_return" DECIMAL(15,2),
    "actual_return" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "allocation_date" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "investor_allocations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "investor_payouts" (
    "id" TEXT NOT NULL,
    "investor_id" TEXT NOT NULL,
    "amount" DECIMAL(15,2) NOT NULL,
    "payout_date" TIMESTAMP(3) NOT NULL,
    "reference" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "investor_payouts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "documents" (
    "id" TEXT NOT NULL,
    "client_id" TEXT,
    "loan_id" TEXT,
    "document_type" "DocumentType" NOT NULL,
    "file_public_id" TEXT NOT NULL,
    "file_unique_id" TEXT NOT NULL,
    "file_name" TEXT NOT NULL,
    "file_path" TEXT NOT NULL,
    "file_size" INTEGER,
    "mime_type" TEXT,
    "uploaded_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "expenses" (
    "id" TEXT NOT NULL,
    "expense_type" "ExpenseType" NOT NULL,
    "amount" DECIMAL(15,2) NOT NULL,
    "description" TEXT,
    "incurred_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "expenses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sms_logs" (
    "id" TEXT NOT NULL,
    "recipient" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "purpose" "SmsPurpose" NOT NULL,
    "cost" DECIMAL(10,2),
    "sent_at" TIMESTAMP(3) NOT NULL,
    "status" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sms_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL,
    "user_id" TEXT,
    "action" TEXT NOT NULL,
    "entity" TEXT NOT NULL,
    "entity_id" TEXT,
    "old_value" JSONB,
    "new_value" JSONB,
    "ip_address" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChartOfAccount" (
    "id" TEXT NOT NULL,
    "accountCode" TEXT NOT NULL,
    "accountName" TEXT NOT NULL,
    "accountType" TEXT NOT NULL,
    "parentAccountId" TEXT,
    "normalBalance" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ChartOfAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transaction_matrix" (
    "id" TEXT NOT NULL,
    "transaction_type" "TransactionType" NOT NULL,
    "component" "ChargeType" NOT NULL,
    "debit_account_code" TEXT NOT NULL,
    "credit_account_code" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "transaction_matrix_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "companies" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "tagline" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "address" TEXT,
    "city" TEXT,
    "country" TEXT,
    "logo_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "companies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system_config" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "category" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "system_config_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "session" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "token" TEXT NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,

    CONSTRAINT "session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "account" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,
    "accountId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "idToken" TEXT,
    "accessTokenExpiresAt" TIMESTAMP(3),
    "refreshTokenExpiresAt" TIMESTAMP(3),
    "password" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verification_tokens" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "verification" (
    "id" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "verification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE INDEX "user_role_idx" ON "user"("role");

-- CreateIndex
CREATE INDEX "user_is_active_idx" ON "user"("is_active");

-- CreateIndex
CREATE INDEX "user_name_idx" ON "user"("name");

-- CreateIndex
CREATE UNIQUE INDEX "clients_user_id_key" ON "clients"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "clients_id_passport_no_key" ON "clients"("id_passport_no");

-- CreateIndex
CREATE INDEX "clients_status_idx" ON "clients"("status");

-- CreateIndex
CREATE INDEX "clients_phone_mobile_idx" ON "clients"("phone_mobile");

-- CreateIndex
CREATE INDEX "clients_surname_idx" ON "clients"("surname");

-- CreateIndex
CREATE INDEX "clients_nationality_idx" ON "clients"("nationality");

-- CreateIndex
CREATE INDEX "clients_created_at_idx" ON "clients"("created_at");

-- CreateIndex
CREATE INDEX "clients_kra_pin_idx" ON "clients"("kra_pin");

-- CreateIndex
CREATE INDEX "client_addresses_client_id_idx" ON "client_addresses"("client_id");

-- CreateIndex
CREATE INDEX "client_addresses_town_city_idx" ON "client_addresses"("town_city");

-- CreateIndex
CREATE INDEX "employment_details_client_id_idx" ON "employment_details"("client_id");

-- CreateIndex
CREATE INDEX "employment_details_employer_name_idx" ON "employment_details"("employer_name");

-- CreateIndex
CREATE INDEX "employment_details_employment_type_idx" ON "employment_details"("employment_type");

-- CreateIndex
CREATE INDEX "employment_details_net_salary_idx" ON "employment_details"("net_salary");

-- CreateIndex
CREATE INDEX "referees_next_of_kin_client_id_idx" ON "referees_next_of_kin"("client_id");

-- CreateIndex
CREATE INDEX "referees_next_of_kin_phone_mobile_idx" ON "referees_next_of_kin"("phone_mobile");

-- CreateIndex
CREATE INDEX "referees_next_of_kin_is_relative_idx" ON "referees_next_of_kin"("is_relative");

-- CreateIndex
CREATE INDEX "bank_details_client_id_idx" ON "bank_details"("client_id");

-- CreateIndex
CREATE INDEX "bank_details_bank_name_idx" ON "bank_details"("bank_name");

-- CreateIndex
CREATE INDEX "bank_details_account_number_idx" ON "bank_details"("account_number");

-- CreateIndex
CREATE UNIQUE INDEX "loan_applications_loan_number_key" ON "loan_applications"("loan_number");

-- CreateIndex
CREATE INDEX "loan_applications_client_id_idx" ON "loan_applications"("client_id");

-- CreateIndex
CREATE INDEX "loan_applications_status_idx" ON "loan_applications"("status");

-- CreateIndex
CREATE INDEX "loan_applications_applied_at_idx" ON "loan_applications"("applied_at");

-- CreateIndex
CREATE INDEX "loan_applications_reviewed_by_id_idx" ON "loan_applications"("reviewed_by_id");

-- CreateIndex
CREATE INDEX "loan_applications_approved_by_id_idx" ON "loan_applications"("approved_by_id");

-- CreateIndex
CREATE INDEX "loan_applications_qualification_type_idx" ON "loan_applications"("qualification_type");

-- CreateIndex
CREATE INDEX "loan_applications_created_at_idx" ON "loan_applications"("created_at");

-- CreateIndex
CREATE INDEX "loan_applications_client_id_status_idx" ON "loan_applications"("client_id", "status");

-- CreateIndex
CREATE UNIQUE INDEX "loan_qualifications_loan_id_key" ON "loan_qualifications"("loan_id");

-- CreateIndex
CREATE UNIQUE INDEX "loan_security_loan_id_key" ON "loan_security"("loan_id");

-- CreateIndex
CREATE UNIQUE INDEX "vehicle_security_loan_id_key" ON "vehicle_security"("loan_id");

-- CreateIndex
CREATE INDEX "guarantors_loan_id_idx" ON "guarantors"("loan_id");

-- CreateIndex
CREATE INDEX "guarantors_confirmation_status_idx" ON "guarantors"("confirmation_status");

-- CreateIndex
CREATE INDEX "guarantors_phone_idx" ON "guarantors"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "loan_disbursements_loan_id_key" ON "loan_disbursements"("loan_id");

-- CreateIndex
CREATE UNIQUE INDEX "loan_financials_loan_id_key" ON "loan_financials"("loan_id");

-- CreateIndex
CREATE UNIQUE INDEX "invoices_invoice_number_key" ON "invoices"("invoice_number");

-- CreateIndex
CREATE INDEX "invoices_client_id_idx" ON "invoices"("client_id");

-- CreateIndex
CREATE INDEX "invoices_loan_id_idx" ON "invoices"("loan_id");

-- CreateIndex
CREATE INDEX "invoices_status_idx" ON "invoices"("status");

-- CreateIndex
CREATE INDEX "invoices_due_date_idx" ON "invoices"("due_date");

-- CreateIndex
CREATE INDEX "invoices_invoice_date_idx" ON "invoices"("invoice_date");

-- CreateIndex
CREATE INDEX "invoices_invoice_type_idx" ON "invoices"("invoice_type");

-- CreateIndex
CREATE INDEX "invoices_client_id_status_idx" ON "invoices"("client_id", "status");

-- CreateIndex
CREATE INDEX "invoice_items_invoice_id_idx" ON "invoice_items"("invoice_id");

-- CreateIndex
CREATE INDEX "invoice_items_charge_type_idx" ON "invoice_items"("charge_type");

-- CreateIndex
CREATE INDEX "invoice_payments_invoice_id_idx" ON "invoice_payments"("invoice_id");

-- CreateIndex
CREATE INDEX "invoice_payments_transaction_id_idx" ON "invoice_payments"("transaction_id");

-- CreateIndex
CREATE INDEX "invoice_payments_payment_date_idx" ON "invoice_payments"("payment_date");

-- CreateIndex
CREATE INDEX "invoice_payments_payment_method_idx" ON "invoice_payments"("payment_method");

-- CreateIndex
CREATE UNIQUE INDEX "transactions_transaction_code_key" ON "transactions"("transaction_code");

-- CreateIndex
CREATE INDEX "transactions_transaction_type_idx" ON "transactions"("transaction_type");

-- CreateIndex
CREATE INDEX "transactions_reference_type_idx" ON "transactions"("reference_type");

-- CreateIndex
CREATE INDEX "transactions_reference_id_idx" ON "transactions"("reference_id");

-- CreateIndex
CREATE INDEX "transactions_status_idx" ON "transactions"("status");

-- CreateIndex
CREATE INDEX "transactions_transaction_date_idx" ON "transactions"("transaction_date");

-- CreateIndex
CREATE INDEX "transactions_reference_type_reference_id_idx" ON "transactions"("reference_type", "reference_id");

-- CreateIndex
CREATE INDEX "repayments_loan_id_idx" ON "repayments"("loan_id");

-- CreateIndex
CREATE INDEX "repayments_payment_date_idx" ON "repayments"("payment_date");

-- CreateIndex
CREATE INDEX "repayments_payment_method_idx" ON "repayments"("payment_method");

-- CreateIndex
CREATE INDEX "repayments_category_idx" ON "repayments"("category");

-- CreateIndex
CREATE INDEX "repayment_schedules_loan_id_idx" ON "repayment_schedules"("loan_id");

-- CreateIndex
CREATE INDEX "repayment_schedules_due_date_idx" ON "repayment_schedules"("due_date");

-- CreateIndex
CREATE INDEX "repayment_schedules_status_idx" ON "repayment_schedules"("status");

-- CreateIndex
CREATE INDEX "repayment_schedules_repayment_id_idx" ON "repayment_schedules"("repayment_id");

-- CreateIndex
CREATE UNIQUE INDEX "repayment_schedules_loan_id_installment_number_key" ON "repayment_schedules"("loan_id", "installment_number");

-- CreateIndex
CREATE UNIQUE INDEX "non_performing_loans_loan_id_key" ON "non_performing_loans"("loan_id");

-- CreateIndex
CREATE INDEX "non_performing_loans_flagged_at_idx" ON "non_performing_loans"("flagged_at");

-- CreateIndex
CREATE UNIQUE INDEX "recovery_agents_user_id_key" ON "recovery_agents"("user_id");

-- CreateIndex
CREATE INDEX "recovery_agents_is_active_idx" ON "recovery_agents"("is_active");

-- CreateIndex
CREATE INDEX "recovery_agents_name_idx" ON "recovery_agents"("name");

-- CreateIndex
CREATE INDEX "recovery_records_loan_id_idx" ON "recovery_records"("loan_id");

-- CreateIndex
CREATE INDEX "recovery_records_agent_id_idx" ON "recovery_records"("agent_id");

-- CreateIndex
CREATE INDEX "recovery_records_recorded_at_idx" ON "recovery_records"("recorded_at");

-- CreateIndex
CREATE UNIQUE INDEX "investors_user_id_key" ON "investors"("user_id");

-- CreateIndex
CREATE INDEX "investors_name_idx" ON "investors"("name");

-- CreateIndex
CREATE INDEX "investors_invested_amount_idx" ON "investors"("invested_amount");

-- CreateIndex
CREATE INDEX "investor_allocations_investor_id_idx" ON "investor_allocations"("investor_id");

-- CreateIndex
CREATE INDEX "investor_allocations_loan_id_idx" ON "investor_allocations"("loan_id");

-- CreateIndex
CREATE INDEX "investor_allocations_allocation_date_idx" ON "investor_allocations"("allocation_date");

-- CreateIndex
CREATE INDEX "investor_allocations_investor_id_loan_id_idx" ON "investor_allocations"("investor_id", "loan_id");

-- CreateIndex
CREATE INDEX "investor_payouts_investor_id_idx" ON "investor_payouts"("investor_id");

-- CreateIndex
CREATE INDEX "investor_payouts_payout_date_idx" ON "investor_payouts"("payout_date");

-- CreateIndex
CREATE INDEX "documents_client_id_idx" ON "documents"("client_id");

-- CreateIndex
CREATE INDEX "documents_loan_id_idx" ON "documents"("loan_id");

-- CreateIndex
CREATE INDEX "documents_document_type_idx" ON "documents"("document_type");

-- CreateIndex
CREATE INDEX "documents_uploaded_at_idx" ON "documents"("uploaded_at");

-- CreateIndex
CREATE INDEX "expenses_expense_type_idx" ON "expenses"("expense_type");

-- CreateIndex
CREATE INDEX "expenses_incurred_at_idx" ON "expenses"("incurred_at");

-- CreateIndex
CREATE INDEX "sms_logs_recipient_idx" ON "sms_logs"("recipient");

-- CreateIndex
CREATE INDEX "sms_logs_purpose_idx" ON "sms_logs"("purpose");

-- CreateIndex
CREATE INDEX "sms_logs_sent_at_idx" ON "sms_logs"("sent_at");

-- CreateIndex
CREATE INDEX "sms_logs_status_idx" ON "sms_logs"("status");

-- CreateIndex
CREATE INDEX "audit_logs_user_id_idx" ON "audit_logs"("user_id");

-- CreateIndex
CREATE INDEX "audit_logs_entity_idx" ON "audit_logs"("entity");

-- CreateIndex
CREATE INDEX "audit_logs_entity_id_idx" ON "audit_logs"("entity_id");

-- CreateIndex
CREATE INDEX "audit_logs_action_idx" ON "audit_logs"("action");

-- CreateIndex
CREATE INDEX "audit_logs_timestamp_idx" ON "audit_logs"("timestamp");

-- CreateIndex
CREATE INDEX "audit_logs_entity_entity_id_idx" ON "audit_logs"("entity", "entity_id");

-- CreateIndex
CREATE UNIQUE INDEX "ChartOfAccount_accountCode_key" ON "ChartOfAccount"("accountCode");

-- CreateIndex
CREATE UNIQUE INDEX "transaction_matrix_transaction_type_component_key" ON "transaction_matrix"("transaction_type", "component");

-- CreateIndex
CREATE UNIQUE INDEX "system_config_key_key" ON "system_config"("key");

-- CreateIndex
CREATE INDEX "system_config_category_idx" ON "system_config"("category");

-- CreateIndex
CREATE UNIQUE INDEX "session_token_key" ON "session"("token");

-- CreateIndex
CREATE INDEX "session_userId_idx" ON "session"("userId");

-- CreateIndex
CREATE INDEX "account_user_id_idx" ON "account"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "account_providerId_accountId_key" ON "account"("providerId", "accountId");

-- CreateIndex
CREATE UNIQUE INDEX "verification_tokens_token_key" ON "verification_tokens"("token");

-- CreateIndex
CREATE UNIQUE INDEX "verification_tokens_identifier_token_key" ON "verification_tokens"("identifier", "token");

-- CreateIndex
CREATE INDEX "verification_identifier_idx" ON "verification"("identifier");

-- AddForeignKey
ALTER TABLE "clients" ADD CONSTRAINT "clients_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "client_addresses" ADD CONSTRAINT "client_addresses_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employment_details" ADD CONSTRAINT "employment_details_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "referees_next_of_kin" ADD CONSTRAINT "referees_next_of_kin_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bank_details" ADD CONSTRAINT "bank_details_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "loan_applications" ADD CONSTRAINT "loan_applications_approved_by_id_fkey" FOREIGN KEY ("approved_by_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "loan_applications" ADD CONSTRAINT "loan_applications_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "loan_applications" ADD CONSTRAINT "loan_applications_reviewed_by_id_fkey" FOREIGN KEY ("reviewed_by_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "loan_qualifications" ADD CONSTRAINT "loan_qualifications_loan_id_fkey" FOREIGN KEY ("loan_id") REFERENCES "loan_applications"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "loan_security" ADD CONSTRAINT "loan_security_loan_id_fkey" FOREIGN KEY ("loan_id") REFERENCES "loan_applications"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vehicle_security" ADD CONSTRAINT "vehicle_security_loan_id_fkey" FOREIGN KEY ("loan_id") REFERENCES "loan_applications"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "guarantors" ADD CONSTRAINT "guarantors_loan_id_fkey" FOREIGN KEY ("loan_id") REFERENCES "loan_applications"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "loan_disbursements" ADD CONSTRAINT "loan_disbursements_loan_id_fkey" FOREIGN KEY ("loan_id") REFERENCES "loan_applications"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "loan_financials" ADD CONSTRAINT "loan_financials_loan_id_fkey" FOREIGN KEY ("loan_id") REFERENCES "loan_applications"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_loan_id_fkey" FOREIGN KEY ("loan_id") REFERENCES "loan_applications"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoice_items" ADD CONSTRAINT "invoice_items_invoice_id_fkey" FOREIGN KEY ("invoice_id") REFERENCES "invoices"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoice_payments" ADD CONSTRAINT "invoice_payments_invoice_id_fkey" FOREIGN KEY ("invoice_id") REFERENCES "invoices"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoice_payments" ADD CONSTRAINT "invoice_payments_transaction_id_fkey" FOREIGN KEY ("transaction_id") REFERENCES "transactions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transaction_client" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "repayments" ADD CONSTRAINT "repayments_loan_id_fkey" FOREIGN KEY ("loan_id") REFERENCES "loan_applications"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "repayment_schedules" ADD CONSTRAINT "repayment_schedules_loan_id_fkey" FOREIGN KEY ("loan_id") REFERENCES "loan_applications"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "repayment_schedules" ADD CONSTRAINT "repayment_schedules_repayment_id_fkey" FOREIGN KEY ("repayment_id") REFERENCES "repayments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "non_performing_loans" ADD CONSTRAINT "non_performing_loans_loan_id_fkey" FOREIGN KEY ("loan_id") REFERENCES "loan_applications"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recovery_agents" ADD CONSTRAINT "recovery_agents_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recovery_records" ADD CONSTRAINT "recovery_records_agent_id_fkey" FOREIGN KEY ("agent_id") REFERENCES "recovery_agents"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recovery_records" ADD CONSTRAINT "recovery_records_loan_id_fkey" FOREIGN KEY ("loan_id") REFERENCES "loan_applications"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "investors" ADD CONSTRAINT "investors_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "investor_allocations" ADD CONSTRAINT "investor_allocations_investor_id_fkey" FOREIGN KEY ("investor_id") REFERENCES "investors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "investor_allocations" ADD CONSTRAINT "investor_allocations_loan_id_fkey" FOREIGN KEY ("loan_id") REFERENCES "loan_applications"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "investor_payouts" ADD CONSTRAINT "investor_payouts_investor_id_fkey" FOREIGN KEY ("investor_id") REFERENCES "investors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_loan_id_fkey" FOREIGN KEY ("loan_id") REFERENCES "loan_applications"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session" ADD CONSTRAINT "session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

