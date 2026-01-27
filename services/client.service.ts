import { BaseService, ServiceResult } from "./base.service";
import type {
  Client,
  ClientAddress,
  EmploymentDetail,
  Referee,
  BankDetail,
  Prisma,
} from "../lib/generated/prisma";

// ============================================================================
// TYPES
// ============================================================================

export type CreateClientInput = Prisma.ClientCreateInput;
export type UpdateClientInput = Prisma.ClientUpdateInput;
export type CreateAddressInput = Prisma.ClientAddressCreateWithoutClientInput;
export type CreateEmploymentInput = Prisma.EmploymentDetailCreateWithoutClientInput;
export type CreateRefereeInput = Prisma.RefereeCreateWithoutClientInput;
export type CreateBankDetailInput = Prisma.BankDetailCreateWithoutClientInput;

export interface ClientWithRelations extends Client {
  addresses?: ClientAddress[];
  employmentDetails?: EmploymentDetail[];
  referees?: Referee[];
  bankDetails?: BankDetail[];
}

export interface CompleteOnboardingInput {
  client: CreateClientInput;
  address?: CreateAddressInput;
  employment?: CreateEmploymentInput;
  referees?: CreateRefereeInput[];
  bankDetails?: CreateBankDetailInput;
}

export interface KYCValidationResult {
  isComplete: boolean;
  missingFields: string[];
}

export interface ClientSearchParams {
  status?: "Active" | "Inactive";
  search?: string;
  skip?: number;
  take?: number;
}

// ============================================================================
// SERVICE
// ============================================================================

export class ClientService extends BaseService {
  // Client CRUD
  async create(data: CreateClientInput): Promise<ServiceResult<Client>> {
    throw new Error("Not implemented");
  }

  async getById(id: number, includeRelations?: boolean): Promise<ServiceResult<ClientWithRelations | null>> {
    throw new Error("Not implemented");
  }

  async getByIdPassport(idPassportNo: string): Promise<ServiceResult<Client | null>> {
    throw new Error("Not implemented");
  }

  async getByUserId(userId: number): Promise<ServiceResult<ClientWithRelations | null>> {
    throw new Error("Not implemented");
  }

  async update(id: number, data: UpdateClientInput): Promise<ServiceResult<Client>> {
    throw new Error("Not implemented");
  }

  async getAll(params?: ClientSearchParams): Promise<ServiceResult<{ clients: Client[]; total: number }>> {
    throw new Error("Not implemented");
  }

  async deactivate(id: number): Promise<ServiceResult<Client>> {
    throw new Error("Not implemented");
  }

  // Address operations
  async createAddress(clientId: number, data: CreateAddressInput): Promise<ServiceResult<ClientAddress>> {
    throw new Error("Not implemented");
  }

  async updateAddress(id: number, data: Partial<CreateAddressInput>): Promise<ServiceResult<ClientAddress>> {
    throw new Error("Not implemented");
  }

  async getAddresses(clientId: number): Promise<ServiceResult<ClientAddress[]>> {
    throw new Error("Not implemented");
  }

  async deleteAddress(id: number): Promise<ServiceResult<void>> {
    throw new Error("Not implemented");
  }

  // Employment operations
  async createEmployment(clientId: number, data: CreateEmploymentInput): Promise<ServiceResult<EmploymentDetail>> {
    throw new Error("Not implemented");
  }

  async updateEmployment(id: number, data: Partial<CreateEmploymentInput>): Promise<ServiceResult<EmploymentDetail>> {
    throw new Error("Not implemented");
  }

  async getEmploymentHistory(clientId: number): Promise<ServiceResult<EmploymentDetail[]>> {
    throw new Error("Not implemented");
  }

  async getLatestEmployment(clientId: number): Promise<ServiceResult<EmploymentDetail | null>> {
    throw new Error("Not implemented");
  }

  // Referee operations
  async createReferee(clientId: number, data: CreateRefereeInput): Promise<ServiceResult<Referee>> {
    throw new Error("Not implemented");
  }

  async updateReferee(id: number, data: Partial<CreateRefereeInput>): Promise<ServiceResult<Referee>> {
    throw new Error("Not implemented");
  }

  async getReferees(clientId: number): Promise<ServiceResult<Referee[]>> {
    throw new Error("Not implemented");
  }

  async deleteReferee(id: number): Promise<ServiceResult<void>> {
    throw new Error("Not implemented");
  }

  // Bank details operations
  async createBankDetail(clientId: number, data: CreateBankDetailInput): Promise<ServiceResult<BankDetail>> {
    throw new Error("Not implemented");
  }

  async updateBankDetail(id: number, data: Partial<CreateBankDetailInput>): Promise<ServiceResult<BankDetail>> {
    throw new Error("Not implemented");
  }

  async getBankDetails(clientId: number): Promise<ServiceResult<BankDetail[]>> {
    throw new Error("Not implemented");
  }

  async deleteBankDetail(id: number): Promise<ServiceResult<void>> {
    throw new Error("Not implemented");
  }

  // Onboarding & KYC
  async completeOnboarding(data: CompleteOnboardingInput): Promise<ServiceResult<ClientWithRelations>> {
    throw new Error("Not implemented");
  }

  async validateKYC(clientId: number): Promise<ServiceResult<KYCValidationResult>> {
    throw new Error("Not implemented");
  }
}

export const clientService = new ClientService();
