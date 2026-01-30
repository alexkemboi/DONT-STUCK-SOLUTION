// import { BaseService, ServiceResult } from "./base.service";
// import type {
//   NonPerformingLoan,
//   RecoveryAgent,
//   RecoveryRecord,
//   LoanApplication,
//   Prisma,
// } from "../lib/generated/prisma";

// // ============================================================================
// // TYPES
// // ============================================================================

// export type CreateRecoveryAgentInput = Prisma.RecoveryAgentCreateInput;
// export type UpdateRecoveryAgentInput = Prisma.RecoveryAgentUpdateInput;

// export interface NPLWithLoan extends NonPerformingLoan {
//   loan?: LoanApplication & {
//     client?: { surname: string; otherNames: string; phoneMobile: string };
//   };
// }

// export interface RecoveryRecordWithDetails extends RecoveryRecord {
//   loan?: LoanApplication;
//   agent?: RecoveryAgent;
// }

// export interface RecoveryAgentWithRecords extends RecoveryAgent {
//   records?: RecoveryRecord[];
// }

// export interface FlagNPLInput {
//   loanId: number;
//   capitalizedAmount: number;
// }

// export interface RecoveryActionInput {
//   loanId: number;
//   agentId: number;
//   actionTaken: string;
//   outcome?: string;
//   recordedAt?: Date;
// }

// export interface RecoveryPaymentInput {
//   loanId: number;
//   agentId: number;
//   amount: number;
//   paymentMethod: "Cash" | "Bank" | "Mpesa";
//   reference?: string;
// }

// export interface NPLSearchParams {
//   agentId?: number;
//   fromDate?: Date;
//   toDate?: Date;
//   skip?: number;
//   take?: number;
// }

// export interface RecoveryStats {
//   totalNPL: number;
//   totalCapitalized: number;
//   totalRecovered: number;
//   recoveryRate: number;
//   activeAgents: number;
//   pendingCases: number;
// }

// export interface AgentPerformance {
//   agentId: number;
//   agentName: string;
//   assignedCases: number;
//   recoveredAmount: number;
//   successRate: number;
// }

// // ============================================================================
// // SERVICE
// // ============================================================================

// export class RecoveryService extends BaseService {
//   // NPL Management
//   async flagAsNPL(data: FlagNPLInput): Promise<ServiceResult<NonPerformingLoan>> {
//     throw new Error("Not implemented");
//   }

//   async getNPLById(id: number): Promise<ServiceResult<NPLWithLoan | null>> {
//     throw new Error("Not implemented");
//   }

//   async getNPLByLoanId(loanId: number): Promise<ServiceResult<NPLWithLoan | null>> {
//     throw new Error("Not implemented");
//   }

//   async getAllNPL(params?: NPLSearchParams): Promise<ServiceResult<{ npls: NPLWithLoan[]; total: number }>> {
//     throw new Error("Not implemented");
//   }

//   async removeFromNPL(loanId: number): Promise<ServiceResult<void>> {
//     throw new Error("Not implemented");
//   }

//   // Recovery Agent Management
//   async createAgent(data: CreateRecoveryAgentInput): Promise<ServiceResult<RecoveryAgent>> {
//     throw new Error("Not implemented");
//   }

//   async getAgentById(id: number): Promise<ServiceResult<RecoveryAgentWithRecords | null>> {
//     throw new Error("Not implemented");
//   }

//   async getAgentByUserId(userId: number): Promise<ServiceResult<RecoveryAgent | null>> {
//     throw new Error("Not implemented");
//   }

//   async updateAgent(id: number, data: UpdateRecoveryAgentInput): Promise<ServiceResult<RecoveryAgent>> {
//     throw new Error("Not implemented");
//   }

//   async getAllAgents(activeOnly?: boolean): Promise<ServiceResult<RecoveryAgent[]>> {
//     throw new Error("Not implemented");
//   }

//   async deactivateAgent(id: number): Promise<ServiceResult<RecoveryAgent>> {
//     throw new Error("Not implemented");
//   }

//   // Case Assignment
//   async assignCaseToAgent(loanId: number, agentId: number): Promise<ServiceResult<RecoveryRecord>> {
//     throw new Error("Not implemented");
//   }

//   async reassignCase(loanId: number, newAgentId: number): Promise<ServiceResult<RecoveryRecord>> {
//     throw new Error("Not implemented");
//   }

//   async getAgentCases(agentId: number): Promise<ServiceResult<NPLWithLoan[]>> {
//     throw new Error("Not implemented");
//   }

//   // Recovery Actions
//   async recordAction(data: RecoveryActionInput): Promise<ServiceResult<RecoveryRecord>> {
//     throw new Error("Not implemented");
//   }

//   async getRecoveryHistory(loanId: number): Promise<ServiceResult<RecoveryRecordWithDetails[]>> {
//     throw new Error("Not implemented");
//   }

//   async getAgentActions(agentId: number, fromDate?: Date, toDate?: Date): Promise<ServiceResult<RecoveryRecord[]>> {
//     throw new Error("Not implemented");
//   }

//   // Recovery Payments
//   async recordRecoveryPayment(data: RecoveryPaymentInput): Promise<ServiceResult<{ repayment: unknown; remainingBalance: number }>> {
//     throw new Error("Not implemented");
//   }

//   async getRecoveryPayments(loanId: number): Promise<ServiceResult<unknown[]>> {
//     throw new Error("Not implemented");
//   }

//   // Statistics & Reports
//   async getStats(): Promise<ServiceResult<RecoveryStats>> {
//     throw new Error("Not implemented");
//   }

//   async getAgentPerformance(agentId?: number): Promise<ServiceResult<AgentPerformance[]>> {
//     throw new Error("Not implemented");
//   }

//   async getNPLAgingReport(): Promise<ServiceResult<{ age: string; count: number; amount: number }[]>> {
//     throw new Error("Not implemented");
//   }
// }

// export const recoveryService = new RecoveryService();
