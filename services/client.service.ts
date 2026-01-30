"use server";
import {  ServiceResult } from "./base.service";
import type {
  Client,
  ClientAddress,
  EmploymentDetail,
  Referee,
  BankDetail,
  Prisma,
} from "../lib/generated/prisma";
import prisma from "@/lib/prisma";

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


// Client CRUD
export async function createClientService(data: CreateClientInput): Promise<ServiceResult<Client>> {
  try{  
    const newClient = await prisma.client.create({
      data
    });
    return { success: true, data: newClient };

  }catch(error){
    return { success: false,  error: (error as Error).message };
  }
}

export async function getById(id: number, includeRelations?: boolean): Promise<ServiceResult<ClientWithRelations | null>> {
  throw new Error("Not implemented");
}

export async function getByIdPassport(idPassportNo: string): Promise<ServiceResult<Client | null>> {
  throw new Error("Not implemented");
}

export async function getByUserId(userId: number): Promise<ServiceResult<ClientWithRelations | null>> {
  throw new Error("Not implemented");
}

export async function updateClient(id: string, data: UpdateClientInput): Promise<ServiceResult<Client>> {
  try{
    const updatedClient = await prisma.client.update({
      where: { id },
      data
    });
    return { success: true, data: updatedClient };

  }catch(error){
    return { success: false,  error: (error as Error).message };
  }
}

export async function getAll(params?: ClientSearchParams): Promise<ServiceResult<{ clients: Client[]; total: number }>> {
  throw new Error("Not implemented");
}

export async function deactivate(id: number): Promise<ServiceResult<Client>> {
  throw new Error("Not implemented");
}

// Address operations
export async function createAddress(clientId: string, data: CreateAddressInput): Promise<ServiceResult<ClientAddress>> {
  try{
    const newAddress =  await prisma.clientAddress.create({
      data: {
        ...data,
        clientId:clientId as string
      }
    });
    return { success: true, data: newAddress };

  }catch(error){
    return { success: false,  error: (error as Error).message };
  }
}

export async function updateAddress(id: string, data: Partial<CreateAddressInput>): Promise<ServiceResult<ClientAddress>> {
 try{
    const updatedAddress = await prisma.clientAddress.update({
      where: { id },
      data
    });
    return { success: true, data: updatedAddress };
  }catch(error){
    return { success: false,  error: (error as Error).message };
  }
}

export async function getAddresses(clientId: string): Promise<ServiceResult<ClientAddress[]>> {
 try{

    const addresses = await prisma.clientAddress.findMany({
      where: { clientId }
    });
    return { success: true, data: addresses };
 }catch (error){
    return { success: false,  error: (error as Error).message };
  } 
}

export async function deleteAddress(id: number): Promise<ServiceResult<void>> {
  throw new Error("Not implemented");
}

// Employment operations
export async function createEmployment(clientId: string, data: CreateEmploymentInput): Promise<ServiceResult<EmploymentDetail>> {
  try{
    const newEmployment =  await prisma.employmentDetail.create({
      data: {
        ...data,
        clientId:clientId as string
      }
    });
    return { success: true, data: newEmployment };

  }catch (error){
    return { success: false,  error: (error as Error).message };
  }
}

export async function updateEmployment(id: string, data: Partial<CreateEmploymentInput>): Promise<ServiceResult<EmploymentDetail>> {
  try{
    const updatedEmployment =  await prisma.employmentDetail.update({
      where: { id },
      data: {
        ...data
      }
    });
    return { success: true, data: updatedEmployment };
  }catch (error){
    return { success: false,  error: (error as Error).message };
  }
}

export async function getEmploymentHistory(clientId: number): Promise<ServiceResult<EmploymentDetail[]>> {
  throw new Error("Not implemented");
}

export async function getLatestEmployment(clientId: string): Promise<ServiceResult<EmploymentDetail | null>> {
  try {
    const employment = await prisma.employmentDetail.findFirst({
      where: { clientId },
      orderBy: { createdAt: 'desc' }
    });
    return { success: true, data: employment };
  }catch (error) {
    return { success: false,  error: (error as Error).message };
  }
}

// Referee operations
export async function createReferee(clientId: string, data: CreateRefereeInput): Promise<ServiceResult<Referee>> {
  try{
    const newReferee =  await prisma.referee.create({
      data: {
        ...data,
        clientId:clientId as string
      }
    });
    return { success: true, data: newReferee };
  }catch (error){
    return { success: false,  error: (error as Error).message };
  }
}

export async function updateReferee(id: string, data: Partial<CreateRefereeInput>): Promise<ServiceResult<Referee>> {
  try{
    const updatedReferee =  await prisma.referee.update({
      where: { id },
      data: {
        ...data
      }
    });
    return { success: true, data: updatedReferee };
  }catch (error){
    return { success: false,  error: (error as Error).message };
  }
}

export async function getReferees(clientId: string): Promise<ServiceResult<Referee[]>> {
  try {
    
    const referees = await prisma.referee.findMany({
      where: { clientId }
    });
    return { success: true, data: referees };
  } catch (error) {
    return { success: false,  error: (error as Error).message };
    
  }
}

export async function getReferee(refereeId: string): Promise<ServiceResult<Referee>> {
  try {

    const referee = await prisma.referee.findUnique({
      where: { id: refereeId }
    });
    return { success: true, data: referee as Referee };
  } catch (error) {
    return { success: false, error: (error as Error).message };

  }
}

export async function deleteReferee(id: string): Promise<ServiceResult<void>> {
  try{
    await prisma.referee.delete({
      where: { id }
    });
    return { success: true, data: undefined };
  }catch (error){
    return { success: false,  error: (error as Error).message };
  }
}

// Bank details operations
export async function createBankDetail(clientId: string, data: CreateBankDetailInput): Promise<ServiceResult<BankDetail>> {
  try {
    const newBankDetail =  await prisma.bankDetail.create({
      data: {
        ...data,
        clientId:clientId  as string
      }
    });
    return { success: true, data: newBankDetail };
    
  } catch (error) {
    return { success: false,  error: (error as Error).message };
    
  }
}

export async function updateBankDetail(id: string, data: Partial<CreateBankDetailInput>): Promise<ServiceResult<BankDetail>> {
  try {
    const updatedBankDetail =  await prisma.bankDetail.update({
      where: { id },
      data: {
        ...data
      }
    });
    return { success: true, data: updatedBankDetail };
  } catch (error) {
    return { success: false,  error: (error as Error).message };
  }
}

export async function getBankDetails(clientId: string): Promise<ServiceResult<BankDetail | null>> {
  try {
    const bankDetails = await prisma.bankDetail.findFirst({
      where: { clientId }
    });
    return { success: true, data: bankDetails };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

export async function deleteBankDetail(id: string): Promise<ServiceResult<void>> {
  try{
    await prisma.bankDetail.delete({
      where: { id }
    });
    return { success: true, data: undefined };
  }catch (error){
    return { success: false,  error: (error as Error).message };
  }
}

// Onboarding & KYC
export async function completeOnboarding(data: CompleteOnboardingInput): Promise<ServiceResult<ClientWithRelations>> {
  throw new Error("Not implemented");
}

export async function validateKYC(clientId: number): Promise<ServiceResult<KYCValidationResult>> {
  throw new Error("Not implemented");
}



