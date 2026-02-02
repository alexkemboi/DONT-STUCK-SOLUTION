"use server";

import { getAll as getAllClients, deactivate as deactivateClient, getById, createClientService, createAddress, createEmployment, createBankDetail, createReferee } from "@/services/client.service";
import type { CreateAddressInput, CreateEmploymentInput, CreateBankDetailInput, CreateRefereeInput } from "@/services/client.service";
import { ServiceResult } from "@/services/base.service";
import { Client } from "@/lib/generated/prisma";
import { ClientSearchParams, ClientWithRelations } from "@/services/client.service";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getClients(params?: ClientSearchParams): Promise<ServiceResult<{ clients: Client[]; total: number }>> {
  try {
    const result = await getAllClients(params);
    return result;
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

export async function deleteClient(id: string): Promise<ServiceResult<Client>> {
    try {
        const result = await deactivateClient(id);
        return result;
    } catch (error) {
        return { success: false, error: (error as Error).message };
    }
}

export async function getClientById(id: string): Promise<ServiceResult<ClientWithRelations | null>> {
    try {
        const result = await getById(id, true);
        return result;
    } catch (error) {
        return { success: false, error: (error as Error).message };
    }
}

// ============================================================================
// ADMIN — REQUIRE ADMIN HELPER
// ============================================================================

async function requireAdmin() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) throw new Error("Unauthorized");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, role: true },
  });
  if (user?.role !== "Admin") throw new Error("Admin access required");

  return { userId: user.id };
}

// ============================================================================
// ADMIN — CREATE CLIENT (USER + CLIENT RECORD)
// ============================================================================

export interface CreateClientByAdminInput {
  name: string;
  email: string;
  password: string;
  title: string;
  surname: string;
  otherNames: string;
  dateOfBirth: string;
  maritalStatus: string;
  nationality: string;
  dependents: number;
  idPassportNo: string;
  kraPin?: string;
  phoneMobile: string;
  phoneWork?: string;
  phoneAlternative?: string;
  emailPersonal?: string;
  emailOfficial?: string;
}

export async function createClientByAdminAction(
  data: CreateClientByAdminInput
): Promise<{ success: boolean; clientId?: string; error?: string }> {
  try {
    const { userId: adminId } = await requireAdmin();

    // 1. Create user account via better-auth
    const newUser = await auth.api.signUpEmail({
      body: {
        email: data.email,
        password: data.password,
        name: data.name,
        role: "Client",
      },
    });

    if (!newUser?.user?.id) {
      return { success: false, error: "Failed to create user account" };
    }

    // 2. Create client record linked to user
    const clientResult = await createClientService({
      user: { connect: { id: newUser.user.id } },
      title: data.title as "Mr" | "Mrs" | "Ms",
      surname: data.surname,
      otherNames: data.otherNames,
      dateOfBirth: new Date(data.dateOfBirth),
      maritalStatus: data.maritalStatus as "Single" | "Married" | "Divorced" | "Widowed",
      nationality: data.nationality,
      dependents: data.dependents,
      idPassportNo: data.idPassportNo,
      kraPin: data.kraPin || null,
      phoneMobile: data.phoneMobile,
      phoneWork: data.phoneWork || null,
      phoneAlternative: data.phoneAlternative || null,
      emailPersonal: data.emailPersonal || null,
      emailOfficial: data.emailOfficial || null,
    });

    if (!clientResult.success || !clientResult.data) {
      return { success: false, error: clientResult.error || "Failed to create client record" };
    }

    // 3. Audit log
    await prisma.auditLog.create({
      data: {
        userId: adminId,
        action: "CREATE",
        entity: "Client",
        entityId: clientResult.data.id,
        newValue: { name: data.name, email: data.email, surname: data.surname },
      },
    }).catch(() => {});

    revalidatePath("/dss/admin/clients");

    return { success: true, clientId: clientResult.data.id };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

// ============================================================================
// ADMIN — CREATE SUB-RECORDS FOR A CLIENT
// ============================================================================

export async function adminCreateAddressAction(
  clientId: string,
  data: CreateAddressInput
): Promise<{ success: boolean; error?: string }> {
  try {
    const { userId: adminId } = await requireAdmin();

    const result = await createAddress(clientId, data);
    if (!result.success) {
      return { success: false, error: result.error || "Failed to create address" };
    }

    await prisma.auditLog.create({
      data: {
        userId: adminId,
        action: "CREATE",
        entity: "ClientAddress",
        entityId: result.data?.id,
        newValue: data as object,
      },
    }).catch(() => {});

    revalidatePath("/dss/admin/clients");
    return { success: true };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

export async function adminCreateEmploymentAction(
  clientId: string,
  data: CreateEmploymentInput
): Promise<{ success: boolean; error?: string }> {
  try {
    const { userId: adminId } = await requireAdmin();

    const result = await createEmployment(clientId, data);
    if (!result.success) {
      return { success: false, error: result.error || "Failed to create employment detail" };
    }

    await prisma.auditLog.create({
      data: {
        userId: adminId,
        action: "CREATE",
        entity: "EmploymentDetail",
        entityId: result.data?.id,
        newValue: { employerName: String((data as Record<string, unknown>).employerName || "") },
      },
    }).catch(() => {});

    revalidatePath("/dss/admin/clients");
    return { success: true };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

export async function adminCreateBankAction(
  clientId: string,
  data: CreateBankDetailInput
): Promise<{ success: boolean; error?: string }> {
  try {
    const { userId: adminId } = await requireAdmin();

    const result = await createBankDetail(clientId, data);
    if (!result.success) {
      return { success: false, error: result.error || "Failed to create bank detail" };
    }

    await prisma.auditLog.create({
      data: {
        userId: adminId,
        action: "CREATE",
        entity: "BankDetail",
        entityId: result.data?.id,
        newValue: data as object,
      },
    }).catch(() => {});

    revalidatePath("/dss/admin/clients");
    return { success: true };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

export async function adminCreateRefereeAction(
  clientId: string,
  data: CreateRefereeInput
): Promise<{ success: boolean; error?: string }> {
  try {
    const { userId: adminId } = await requireAdmin();

    const result = await createReferee(clientId, data);
    if (!result.success) {
      return { success: false, error: result.error || "Failed to create referee" };
    }

    await prisma.auditLog.create({
      data: {
        userId: adminId,
        action: "CREATE",
        entity: "Referee",
        entityId: result.data?.id,
        newValue: { surname: String((data as Record<string, unknown>).surname || "") },
      },
    }).catch(() => {});

    revalidatePath("/dss/admin/clients");
    return { success: true };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}
