"use server";

import { ServiceResult } from "./base.service";
import type {
  LoanApplication,
  Guarantor,
  LoanApplicationStatus,
} from "../lib/generated/prisma";
import prisma from "@/lib/prisma";

// ============================================================================
// TYPES
// ============================================================================

export interface CreateLoanApplicationInput {
  clientId: string;
  purpose: string;
  amountRequested: number;
  repaymentPeriod: number;
}

export interface CreateGuarantorInput {
  loanId: string;
  fullName: string;
  phone: string;
  email?: string;
  idNumber?: string;
  relationship?: string;
}

// ============================================================================
// LOAN APPLICATION
// ============================================================================

export async function createLoanApplication(
  data: CreateLoanApplicationInput
): Promise<ServiceResult<LoanApplication>> {
  try {
    const loan = await prisma.loanApplication.create({
      data: {
        clientId: data.clientId,
        purpose: data.purpose,
        amountRequested: data.amountRequested,
        repaymentPeriod: data.repaymentPeriod,
      },
    });
    return { success: true, data: loan };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

export async function getLoansByClientId(
  clientId: string
): Promise<ServiceResult<LoanApplication[]>> {
  try {
    const loans = await prisma.loanApplication.findMany({
      where: { clientId },
      orderBy: { appliedAt: "desc" },
    });
    return { success: true, data: loans };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

// ============================================================================
// GUARANTORS
// ============================================================================

export async function addGuarantor(
  data: CreateGuarantorInput
): Promise<ServiceResult<Guarantor>> {
  try {
    const guarantor = await prisma.guarantor.create({
      data: {
        loanId: data.loanId,
        fullName: data.fullName,
        phone: data.phone,
        email: data.email || null,
        idNumber: data.idNumber || null,
        relationship: data.relationship || null,
      },
    });
    return { success: true, data: guarantor };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

export async function getGuarantorsByLoanId(
  loanId: string
): Promise<ServiceResult<Guarantor[]>> {
  try {
    const guarantors = await prisma.guarantor.findMany({
      where: { loanId },
    });
    return { success: true, data: guarantors };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

// ============================================================================
// ADMIN — ALL LOANS
// ============================================================================

export type LoanWithClient = LoanApplication & {
  client: { surname: string; otherNames: string; phoneMobile: string };
};

export async function getAllLoans(): Promise<ServiceResult<LoanWithClient[]>> {
  try {
    const loans = await prisma.loanApplication.findMany({
      include: {
        client: {
          select: {
            surname: true,
            otherNames: true,
            phoneMobile: true,
          },
        },
      },
      orderBy: { appliedAt: "desc" },
    });
    return { success: true, data: loans };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

// ============================================================================
// ADMIN — STATUS UPDATES
// ============================================================================

export async function updateLoanStatus(
  id: string,
  status: LoanApplicationStatus,
  reviewedById?: string,
  rejectionReason?: string
): Promise<ServiceResult<LoanApplication>> {
  try {
    const updateData: Record<string, unknown> = { status };

    if (status === "Approved") {
      const loan = await prisma.loanApplication.findUnique({ where: { id } });
      updateData.approvedAmount = loan?.amountRequested;
      updateData.approvedAt = new Date();
      updateData.approvedById = reviewedById;
      updateData.reviewedAt = new Date();
      updateData.reviewedById = reviewedById;
    }

    if (status === "Rejected") {
      updateData.rejectionReason = rejectionReason || null;
      updateData.reviewedAt = new Date();
      updateData.reviewedById = reviewedById;
    }

    if (status === "Disbursed") {
      updateData.startDate = new Date();
    }

    const updated = await prisma.loanApplication.update({
      where: { id },
      data: updateData,
    });
    return { success: true, data: updated };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}
