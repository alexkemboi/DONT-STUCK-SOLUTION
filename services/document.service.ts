"use server";

import { ServiceResult } from "./base.service";
import type { Document, DocumentType } from "../lib/generated/prisma";
import prisma from "@/lib/prisma";

// ============================================================================
// TYPES
// ============================================================================

export type DocumentWithRelations = Document & {
  client: { surname: string; otherNames: string } | null;
  loan: { id: string; purpose: string } | null;
};

// ============================================================================
// QUERIES
// ============================================================================

export async function getAllDocuments(): Promise<
  ServiceResult<DocumentWithRelations[]>
> {
  try {
    const documents = await prisma.document.findMany({
      include: {
        client: {
          select: {
            surname: true,
            otherNames: true,
          },
        },
        loan: {
          select: {
            id: true,
            purpose: true,
          },
        },
      },
      orderBy: { uploadedAt: "desc" },
    });
    return { success: true, data: documents };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

export async function getDocumentsByClientId(
  clientId: string
): Promise<ServiceResult<Document[]>> {
  try {
    const documents = await prisma.document.findMany({
      where: { clientId },
      orderBy: { uploadedAt: "desc" },
    });
    return { success: true, data: documents };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

export async function getDocumentsByLoanId(
  loanId: string
): Promise<ServiceResult<Document[]>> {
  try {
    const documents = await prisma.document.findMany({
      where: { loanId },
      orderBy: { uploadedAt: "desc" },
    });
    return { success: true, data: documents };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

export async function deleteDocument(
  id: string
): Promise<ServiceResult<Document>> {
  try {
    const deleted = await prisma.document.delete({
      where: { id },
    });
    return { success: true, data: deleted };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}
