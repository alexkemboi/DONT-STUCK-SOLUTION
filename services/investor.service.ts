// import { BaseService, ServiceResult } from "./base.service";
// import type {
//   Investor,
//   InvestorAllocation,
//   InvestorPayout,
//   LoanApplication,
//   Prisma,
// } from "../lib/generated/prisma";

// // ============================================================================
// // TYPES
// // ============================================================================

// export type CreateInvestorInput = Prisma.InvestorCreateInput;
// export type UpdateInvestorInput = Prisma.InvestorUpdateInput;

// export interface InvestorWithRelations extends Investor {
//   allocations?: InvestorAllocation[];
//   payouts?: InvestorPayout[];
// }

// export interface AllocationInput {
//   investorId: number;
//   loanId: number;
//   allocatedAmount: number;
// }

// export interface PayoutInput {
//   investorId: number;
//   amount: number;
//   reference?: string;
//   payoutDate?: Date;
// }

// export interface InvestorStats {
//   totalInvested: number;
//   totalReturns: number;
//   activeInvestments: number;
//   averageReturn: number;
//   portfolioValue: number;
// }

// export interface AllocationWithLoan extends InvestorAllocation {
//   loan?: LoanApplication;
// }

// export interface AvailableLoan {
//   id: number;
//   approvedAmount: number;
//   interestRate: number;
//   repaymentPeriod: number;
//   purpose: string;
//   alreadyFunded: number;
//   remainingAmount: number;
//   borrowerName?: string;
//   riskScore?: number;
// }

// export interface InvestorSearchParams {
//   search?: string;
//   minInvested?: number;
//   maxInvested?: number;
//   skip?: number;
//   take?: number;
// }

// export interface PerformanceData {
//   month: string;
//   invested: number;
//   returns: number;
// }

// // ============================================================================
// // SERVICE
// // ============================================================================

// export class InvestorService extends BaseService {
//   // Investor CRUD
//   async create(data: CreateInvestorInput): Promise<ServiceResult<Investor>> {
//     throw new Error("Not implemented");
//   }

//   async getById(id: number, includeRelations?: boolean): Promise<ServiceResult<InvestorWithRelations | null>> {
//     throw new Error("Not implemented");
//   }

//   async getByUserId(userId: number): Promise<ServiceResult<InvestorWithRelations | null>> {
//     throw new Error("Not implemented");
//   }

//   async update(id: number, data: UpdateInvestorInput): Promise<ServiceResult<Investor>> {
//     throw new Error("Not implemented");
//   }

//   async getAll(params?: InvestorSearchParams): Promise<ServiceResult<{ investors: Investor[]; total: number }>> {
//     throw new Error("Not implemented");
//   }

//   // Portfolio & Stats
//   async getStats(investorId: number): Promise<ServiceResult<InvestorStats>> {
//     throw new Error("Not implemented");
//   }

//   async getPortfolio(investorId: number): Promise<ServiceResult<AllocationWithLoan[]>> {
//     throw new Error("Not implemented");
//   }

//   async getMonthlyPerformance(investorId: number, year?: number): Promise<ServiceResult<PerformanceData[]>> {
//     throw new Error("Not implemented");
//   }

//   // Allocations
//   async allocateToLoan(data: AllocationInput): Promise<ServiceResult<InvestorAllocation>> {
//     throw new Error("Not implemented");
//   }

//   async getAllocations(investorId: number): Promise<ServiceResult<AllocationWithLoan[]>> {
//     throw new Error("Not implemented");
//   }

//   async getAllocationsByLoan(loanId: number): Promise<ServiceResult<InvestorAllocation[]>> {
//     throw new Error("Not implemented");
//   }

//   async updateAllocationReturn(allocationId: number, actualReturn: number): Promise<ServiceResult<InvestorAllocation>> {
//     throw new Error("Not implemented");
//   }

//   // Available Loans for Investment
//   async getAvailableLoans(): Promise<ServiceResult<AvailableLoan[]>> {
//     throw new Error("Not implemented");
//   }

//   async getLoanFundingStatus(loanId: number): Promise<ServiceResult<{ total: number; funded: number; remaining: number }>> {
//     throw new Error("Not implemented");
//   }

//   // Payouts
//   async createPayout(data: PayoutInput): Promise<ServiceResult<InvestorPayout>> {
//     throw new Error("Not implemented");
//   }

//   async getPayouts(investorId: number): Promise<ServiceResult<InvestorPayout[]>> {
//     throw new Error("Not implemented");
//   }

//   async getPayoutSchedule(investorId: number): Promise<ServiceResult<{ date: Date; expectedAmount: number; loanId: number }[]>> {
//     throw new Error("Not implemented");
//   }

//   // Risk & Exposure
//   async getExposure(investorId: number): Promise<ServiceResult<{ totalExposure: number; byLoanType: Record<string, number>; nplExposure: number }>> {
//     throw new Error("Not implemented");
//   }

//   async calculateExpectedReturn(loanId: number, investmentAmount: number): Promise<ServiceResult<{ expectedReturn: number; monthlyReturn: number }>> {
//     throw new Error("Not implemented");
//   }
// }

// export const investorService = new InvestorService();
