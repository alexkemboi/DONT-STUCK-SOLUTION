// import { BaseService, ServiceResult } from "./base.service";
// import type {
//   LoanApplication,
//   LoanQualification,
//   LoanSecurity,
//   VehicleSecurity,
//   LoanFinancial,
//   LoanDisbursement,
//   Guarantor,
//   LoanApplicationStatus,
//   QualificationType,
//   DisbursementMethod,
//   GuarantorStatus,
//   Prisma,
// } from "../lib/generated/prisma";

// // ============================================================================
// // TYPES
// // ============================================================================

// export type CreateLoanApplicationInput = Prisma.LoanApplicationCreateInput;
// export type UpdateLoanApplicationInput = Prisma.LoanApplicationUpdateInput;

// export interface LoanWithRelations extends LoanApplication {
//   client?: { surname: string; otherNames: string; phoneMobile: string };
//   qualification?: LoanQualification | null;
//   security?: LoanSecurity | null;
//   vehicleSecurity?: VehicleSecurity | null;
//   financials?: LoanFinancial | null;
//   disbursement?: LoanDisbursement | null;
//   guarantors?: Guarantor[];
// }

// export interface QualificationInput {
//   loanId: number;
//   avgIncome: number;
//   ruleApplied: QualificationType;
// }

// export interface QualificationResult {
//   eligibilityAmount: number;
//   ruleApplied: QualificationType;
//   avgIncome: number;
// }

// export interface DisbursementInput {
//   loanId: number;
//   amount: number;
//   method: DisbursementMethod;
//   reference?: string;
// }

// export interface GuarantorInput {
//   loanId: number;
//   fullName: string;
//   phone: string;
//   email?: string;
//   idNumber?: string;
//   relationship?: string;
// }

// export interface LoanSearchParams {
//   clientId?: number;
//   status?: LoanApplicationStatus;
//   qualificationType?: QualificationType;
//   fromDate?: Date;
//   toDate?: Date;
//   skip?: number;
//   take?: number;
// }

// export interface LoanStats {
//   totalApplications: number;
//   pendingReview: number;
//   approved: number;
//   disbursed: number;
//   active: number;
//   npl: number;
//   totalDisbursedAmount: number;
// }

// // ============================================================================
// // SERVICE
// // ============================================================================

// export class LoanService extends BaseService {
//   // Loan Application CRUD
//   async create(data: CreateLoanApplicationInput): Promise<ServiceResult<LoanApplication>> {
//     throw new Error("Not implemented");
//   }

//   async getById(id: number, includeRelations?: boolean): Promise<ServiceResult<LoanWithRelations | null>> {
//     throw new Error("Not implemented");
//   }

//   async getByClientId(clientId: number): Promise<ServiceResult<LoanApplication[]>> {
//     throw new Error("Not implemented");
//   }

//   async update(id: number, data: UpdateLoanApplicationInput): Promise<ServiceResult<LoanApplication>> {
//     throw new Error("Not implemented");
//   }

//   async getAll(params?: LoanSearchParams): Promise<ServiceResult<{ loans: LoanWithRelations[]; total: number }>> {
//     throw new Error("Not implemented");
//   }

//   // Loan Status Management
//   async review(loanId: number, reviewerId: number): Promise<ServiceResult<LoanApplication>> {
//     throw new Error("Not implemented");
//   }

//   async approve(loanId: number, approverId: number, approvedAmount?: number): Promise<ServiceResult<LoanApplication>> {
//     throw new Error("Not implemented");
//   }

//   async reject(loanId: number, reviewerId: number, reason: string): Promise<ServiceResult<LoanApplication>> {
//     throw new Error("Not implemented");
//   }

//   async updateStatus(loanId: number, status: LoanApplicationStatus): Promise<ServiceResult<LoanApplication>> {
//     throw new Error("Not implemented");
//   }

//   // Qualification
//   async qualifyBySalary(loanId: number, netSalary: number): Promise<ServiceResult<QualificationResult>> {
//     throw new Error("Not implemented");
//   }

//   async qualifyByStatement(loanId: number, avgMonthlyIncome: number): Promise<ServiceResult<QualificationResult>> {
//     throw new Error("Not implemented");
//   }

//   async getQualification(loanId: number): Promise<ServiceResult<LoanQualification | null>> {
//     throw new Error("Not implemented");
//   }

//   // Security & Documents
//   async createSecurity(loanId: number, data: Partial<LoanSecurity>): Promise<ServiceResult<LoanSecurity>> {
//     throw new Error("Not implemented");
//   }

//   async updateSecurity(loanId: number, data: Partial<LoanSecurity>): Promise<ServiceResult<LoanSecurity>> {
//     throw new Error("Not implemented");
//   }

//   async createVehicleSecurity(loanId: number, data: Omit<VehicleSecurity, "id" | "loanId" | "createdAt" | "updatedAt">): Promise<ServiceResult<VehicleSecurity>> {
//     throw new Error("Not implemented");
//   }

//   // Financials
//   async calculateFinancials(loanId: number): Promise<ServiceResult<LoanFinancial>> {
//     throw new Error("Not implemented");
//   }

//   async getFinancials(loanId: number): Promise<ServiceResult<LoanFinancial | null>> {
//     throw new Error("Not implemented");
//   }

//   // Disbursement
//   async disburse(data: DisbursementInput): Promise<ServiceResult<LoanDisbursement>> {
//     throw new Error("Not implemented");
//   }

//   async getDisbursement(loanId: number): Promise<ServiceResult<LoanDisbursement | null>> {
//     throw new Error("Not implemented");
//   }

//   // Guarantors
//   async addGuarantor(data: GuarantorInput): Promise<ServiceResult<Guarantor>> {
//     throw new Error("Not implemented");
//   }

//   async updateGuarantorStatus(guarantorId: number, status: GuarantorStatus): Promise<ServiceResult<Guarantor>> {
//     throw new Error("Not implemented");
//   }

//   async getGuarantors(loanId: number): Promise<ServiceResult<Guarantor[]>> {
//     throw new Error("Not implemented");
//   }

//   async removeGuarantor(guarantorId: number): Promise<ServiceResult<void>> {
//     throw new Error("Not implemented");
//   }

//   // Statistics
//   async getStats(): Promise<ServiceResult<LoanStats>> {
//     throw new Error("Not implemented");
//   }

//   async getClientLoanHistory(clientId: number): Promise<ServiceResult<LoanApplication[]>> {
//     throw new Error("Not implemented");
//   }
// }

// export const loanService = new LoanService();
