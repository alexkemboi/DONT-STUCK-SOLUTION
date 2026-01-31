"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import prisma from "@/lib/prisma";
import {
  getAllDocuments,
  deleteDocument,
  type DocumentWithRelations,
} from "@/services/document.service";

// ============================================================================
// TYPES
// ============================================================================

export interface SerializedDocument {
  id: string;
  clientId: string | null;
  clientName: string | null;
  loanId: string | null;
  loanPurpose: string | null;
  documentType: string;
  fileName: string;
  filePath: string;
  fileSize: number | null;
  mimeType: string | null;
  uploadedAt: string;
}

function serializeDocument(doc: DocumentWithRelations): SerializedDocument {
  return {
    id: doc.id,
    clientId: doc.clientId,
    clientName: doc.client
      ? `${doc.client.surname} ${doc.client.otherNames}`
      : null,
    loanId: doc.loanId,
    loanPurpose: doc.loan?.purpose || null,
    documentType: doc.documentType,
    fileName: doc.fileName,
    filePath: doc.filePath,
    fileSize: doc.fileSize,
    mimeType: doc.mimeType,
    uploadedAt: doc.uploadedAt.toISOString(),
  };
}

// ============================================================================
// ACTIONS
// ============================================================================

export async function getAllDocumentsAction(): Promise<{
  success: boolean;
  data: SerializedDocument[];
  error?: string;
}> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return { success: false, data: [], error: "Unauthorized" };
    }

    const result = await getAllDocuments();
    if (!result.success || !result.data) {
      return { success: false, data: [], error: result.error };
    }

    return { success: true, data: result.data.map(serializeDocument) };
  } catch (error) {
    return { success: false, data: [], error: (error as Error).message };
  }
}

export async function deleteDocumentAction(documentId: string) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return { success: false, error: "Unauthorized" };
    }

    const result = await deleteDocument(documentId);

    if (result.success) {
      await prisma.auditLog.create({
        data: {
          userId: session.user.id as string,
          action: "DELETE",
          entity: "Document",
          entityId: documentId,
          oldValue: { fileName: result.data?.fileName },
        },
      }).catch(() => {});
    }

    return { success: result.success, error: result.error };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}
