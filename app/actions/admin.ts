"use server";

import { getAll as getAllClients, deactivate as deactivateClient, getById } from "@/services/client.service";
import { ServiceResult } from "@/services/base.service";
import { Client } from "@/lib/generated/prisma";
import { ClientSearchParams, ClientWithRelations } from "@/services/client.service";

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
