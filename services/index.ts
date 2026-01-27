// Base service
export { BaseService, type ServiceResult } from "./base.service";

// Domain services
export { ClientService, clientService } from "./client.service";
export type {
  CreateClientInput,
  UpdateClientInput,
  CreateAddressInput,
  CreateEmploymentInput,
  CreateRefereeInput,
  CreateBankDetailInput,
  ClientWithRelations,
  CompleteOnboardingInput,
  KYCValidationResult,
  ClientSearchParams,
} from "./client.service";

export { LoanService, loanService } from "./loan.service";
export type {
  CreateLoanApplicationInput,
  UpdateLoanApplicationInput,
  LoanWithRelations,
  QualificationInput,
  QualificationResult,
  DisbursementInput,
  GuarantorInput,
  LoanSearchParams,
  LoanStats,
} from "./loan.service";

export { FinancialService, financialService } from "./financial.service";
export type {
  InvoiceWithItems,
  CreateInvoiceInput,
  RecordPaymentInput,
  CreateTransactionInput,
  RepaymentInput,
  InvoiceSearchParams,
  TransactionSearchParams,
  FinancialSummary,
} from "./financial.service";

export { InvestorService, investorService } from "./investor.service";
export type {
  CreateInvestorInput,
  UpdateInvestorInput,
  InvestorWithRelations,
  AllocationInput,
  PayoutInput,
  InvestorStats,
  AllocationWithLoan,
  AvailableLoan,
  InvestorSearchParams,
  PerformanceData,
} from "./investor.service";

export { RecoveryService, recoveryService } from "./recovery.service";
export type {
  CreateRecoveryAgentInput,
  UpdateRecoveryAgentInput,
  NPLWithLoan,
  RecoveryRecordWithDetails,
  RecoveryAgentWithRecords,
  FlagNPLInput,
  RecoveryActionInput,
  RecoveryPaymentInput,
  NPLSearchParams,
  RecoveryStats,
  AgentPerformance,
} from "./recovery.service";

export { AdminService, adminService } from "./admin.service";
export type {
  CreateUserInput,
  UpdateUserInput,
  UserWithRelations,
  AuditLogInput,
  SmsInput,
  ExpenseInput,
  DocumentInput,
  UserSearchParams,
  AuditSearchParams,
  DashboardStats,
} from "./admin.service";

export {
  StorageService,
  storageService,
  kycStorage,
  loanDocStorage,
  profileStorage,
  fileToInput,
  uploadFromFormData,
  uploadMultipleFromFormData,
} from "./storage.service";
export type { UploadResult, FileInput } from "./storage.service";
