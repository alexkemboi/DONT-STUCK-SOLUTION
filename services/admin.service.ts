// "use server"
// import { BaseService, ServiceResult } from "./base.service";
// import type {
//   User,
//   AuditLog,
//   SystemConfig,
//   SmsLog,
//   Expense,
//   Document,
//   UserRole,
//   SmsPurpose,
//   ExpenseType,
//   DocumentType,
//   Prisma,
// } from "../lib/generated/prisma";

// // ============================================================================
// // TYPES
// // ============================================================================

// export type CreateUserInput = Prisma.UserCreateInput;
// export type UpdateUserInput = Prisma.UserUpdateInput;

// export interface UserWithRelations extends User {
//   client?: { id: number; surname: string } | null;
//   investor?: { id: number; name: string } | null;
//   recoveryAgent?: { id: number; name: string } | null;
// }

// export interface AuditLogInput {
//   userId?: number;
//   action: string;
//   entity: string;
//   entityId?: number;
//   oldValue?: unknown;
//   newValue?: unknown;
//   ipAddress?: string;
// }

// export interface SmsInput {
//   recipient: string;
//   message: string;
//   purpose: SmsPurpose;
//   cost?: number;
// }

// export interface ExpenseInput {
//   expenseType: ExpenseType;
//   amount: number;
//   description?: string;
//   incurredAt?: Date;
// }

// export interface DocumentInput {
//   entityType: any;
//   entityId: number;
//   clientId?: number;
//   loanId?: number;
//   documentType: DocumentType;
//   fileName: string;
//   filePath: string;
//   fileSize?: number;
//   mimeType?: string;
// }

// export interface UserSearchParams {
//   role?: UserRole;
//   isActive?: boolean;
//   search?: string;
//   skip?: number;
//   take?: number;
// }

// export interface AuditSearchParams {
//   userId?: number;
//   entity?: string;
//   entityId?: number;
//   action?: string;
//   fromDate?: Date;
//   toDate?: Date;
//   skip?: number;
//   take?: number;
// }

// export interface DashboardStats {
//   totalUsers: number;
//   activeLoans: number;
//   totalClients: number;
//   pendingApplications: number;
//   totalDisbursed: number;
//   nplCount: number;
// }

// // ============================================================================
// // SERVICE
// // ============================================================================


// // User Management
// async function createUser(data: CreateUserInput): Promise<ServiceResult<User>> {
//   throw new Error("Not implemented");
// }

// async function getUserById(id: number): Promise<ServiceResult<UserWithRelations | null>> {
//   throw new Error("Not implemented");
// }

// async function getUserByEmail(email: string): Promise<ServiceResult<User | null>> {
//   throw new Error("Not implemented");
// }

// async function updateUser(id: number, data: UpdateUserInput): Promise<ServiceResult<User>> {
//   throw new Error("Not implemented");
// }

// async function deactivateUser(id: number): Promise<ServiceResult<User>> {
//   throw new Error("Not implemented");
// }

// async function activateUser(id: number): Promise<ServiceResult<User>> {
//   throw new Error("Not implemented");
// }

// async function getAllUsers(params?: UserSearchParams): Promise<ServiceResult<{ users: User[]; total: number }>> {
//   throw new Error("Not implemented");
// }

// async function changePassword(userId: number, newPasswordHash: string): Promise<ServiceResult<void>> {
//   throw new Error("Not implemented");
// }

// async function getUsersByRole(role: UserRole): Promise<ServiceResult<User[]>> {
//   throw new Error("Not implemented");
// }

// // Audit Logging
// async function logAction(data: AuditLogInput): Promise<ServiceResult<AuditLog>> {
//   throw new Error("Not implemented");
// }

// async function getAuditLogs(params?: AuditSearchParams): Promise<ServiceResult<{ logs: AuditLog[]; total: number }>> {
//   throw new Error("Not implemented");
// }

// async function getEntityAuditTrail(entity: string, entityId: number): Promise<ServiceResult<AuditLog[]>> {
//   throw new Error("Not implemented");
// }

// async function getUserActivityLog(userId: number, limit?: number): Promise<ServiceResult<AuditLog[]>> {
//   throw new Error("Not implemented");
// }

// // System Configuration
// async function getConfig(key: string): Promise<ServiceResult<string | null>> {
//   throw new Error("Not implemented");
// }

// async function setConfig(key: string, value: string, category?: string): Promise<ServiceResult<SystemConfig>> {
//   throw new Error("Not implemented");
// }

// async function getConfigsByCategory(category: string): Promise<ServiceResult<SystemConfig[]>> {
//   throw new Error("Not implemented");
// }

// async function getAllConfigs(): Promise<ServiceResult<SystemConfig[]>> {
//   throw new Error("Not implemented");
// }

// async function deleteConfig(key: string): Promise<ServiceResult<void>> {
//   throw new Error("Not implemented");
// }

// // SMS Management
// async function sendSms(data: SmsInput): Promise<ServiceResult<SmsLog>> {
//   throw new Error("Not implemented");
// }

// async function getSmsLogs(recipient?: string, purpose?: SmsPurpose): Promise<ServiceResult<SmsLog[]>> {
//   throw new Error("Not implemented");
// }

// async function getSmsCosts(fromDate: Date, toDate: Date): Promise<ServiceResult<{ total: number; count: number }>> {
//   throw new Error("Not implemented");
// }

// // Expense Management
// async function createExpense(data: ExpenseInput): Promise<ServiceResult<Expense>> {
//   throw new Error("Not implemented");
// }

// async function getExpenses(expenseType?: ExpenseType, fromDate?: Date, toDate?: Date): Promise<ServiceResult<Expense[]>> {
//   throw new Error("Not implemented");
// }

// async function getExpenseSummary(fromDate: Date, toDate: Date): Promise<ServiceResult<{ byType: Record<string, number>; total: number }>> {
//   throw new Error("Not implemented");
// }

// // Document Management
// async function uploadDocument(data: DocumentInput): Promise<ServiceResult<Document>> {
//   throw new Error("Not implemented");
// }

// async function getDocument(id: number): Promise<ServiceResult<Document | null>> {
//   throw new Error("Not implemented");
// }

// // async function getDocumentsByEntity(entityType: EntityType, entityId: number): Promise<ServiceResult<Document[]>> {
// //   throw new Error("Not implemented");
// // }

// async function deleteDocument(id: number): Promise<ServiceResult<void>> {
//   throw new Error("Not implemented");
// }

// // Dashboard & Reports
// async function getDashboardStats(): Promise<ServiceResult<DashboardStats>> {
//   throw new Error("Not implemented");
// }

// async function getSystemHealth(): Promise<ServiceResult<{ database: boolean; smsGateway: boolean; storage: boolean }>> {
//   throw new Error("Not implemented");
// }

