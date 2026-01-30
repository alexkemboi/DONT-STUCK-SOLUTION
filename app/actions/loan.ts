"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import prisma from "@/lib/prisma";
import {
  createLoanApplication,
  addGuarantor,
  getLoansByClientId,
  getAllLoans,
  updateLoanStatus,
  type LoanWithClient,
} from "@/services/loan.service";
import type { LoanApplicationSubmitData } from "@/lib/types";

export async function submitLoanApplicationAction(data: LoanApplicationSubmitData) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return { success: false, error: "Unauthorized" };
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id as string },
      select: { client: true },
    });

    if (!user?.client) {
      return { success: false, error: "Client profile not found. Please complete your profile first." };
    }

    const clientId = user.client.id;

    const loanResult = await createLoanApplication({
      clientId,
      purpose: data.purpose,
      amountRequested: data.amountRequested,
      repaymentPeriod: data.repaymentPeriod,
    });

    if (!loanResult.success || !loanResult.data) {
      return { success: false, error: loanResult.error || "Failed to create loan application" };
    }

    const loanId = loanResult.data.id;

    const guarantorResults = [];
    for (const guarantor of data.guarantors) {
      const result = await addGuarantor({
        loanId,
        fullName: guarantor.fullName,
        phone: guarantor.phone,
        email: guarantor.email || undefined,
        idNumber: guarantor.idNumber || undefined,
        relationship: guarantor.relationship || undefined,
      });
      guarantorResults.push(result);
    }

    return {
      success: true,
      data: {
        loanId,
        guarantorsAdded: guarantorResults.filter((r) => r.success).length,
      },
    };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

export async function getClientLoansAction() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return { success: false, error: "Unauthorized" };
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id as string },
      select: { client: true },
    });

    if (!user?.client) {
      return { success: false, data: [] };
    }

    const result = await getLoansByClientId(user.client.id);
    return { success: true, data: result.data || [] };
  } catch (error) {
    return { success: false, error: (error as Error).message, data: [] };
  }
}

export async function getClientForApplyAction() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return { success: false, error: "Unauthorized" };
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id as string },
      select: {
        client: {
          select: {
            id: true,
            surname: true,
            otherNames: true,
          },
        },
      },
    });

    if (!user?.client) {
      return { success: false, error: "Client profile not found" };
    }

    return { success: true, data: user.client };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

// ============================================================================
// ADMIN ACTIONS
// ============================================================================

export interface SerializedLoan {
  id: string;
  clientId: string;
  clientName: string;
  clientPhone: string;
  purpose: string;
  amountRequested: number;
  approvedAmount: number | null;
  interestRate: number;
  repaymentPeriod: number;
  status: string;
  qualificationType: string | null;
  appliedAt: string;
  rejectionReason: string | null;
}

function serializeLoan(loan: LoanWithClient): SerializedLoan {
  return {
    id: loan.id,
    clientId: loan.clientId,
    clientName: `${loan.client.surname} ${loan.client.otherNames}`,
    clientPhone: loan.client.phoneMobile,
    purpose: loan.purpose,
    amountRequested: Number(loan.amountRequested),
    approvedAmount: loan.approvedAmount ? Number(loan.approvedAmount) : null,
    interestRate: Number(loan.interestRate),
    repaymentPeriod: loan.repaymentPeriod,
    status: loan.status,
    qualificationType: loan.qualificationType || null,
    appliedAt: loan.appliedAt.toISOString(),
    rejectionReason: loan.rejectionReason || null,
  };
}

export async function getAllLoansAction(): Promise<{
  success: boolean;
  data: SerializedLoan[];
  error?: string;
}> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return { success: false, data: [], error: "Unauthorized" };
    }

    const result = await getAllLoans();
    if (!result.success || !result.data) {
      return { success: false, data: [], error: result.error };
    }

    return { success: true, data: result.data.map(serializeLoan) };
  } catch (error) {
    return { success: false, data: [], error: (error as Error).message };
  }
}

export async function approveLoanAction(loanId: string) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return { success: false, error: "Unauthorized" };
    }

    const result = await updateLoanStatus(
      loanId,
      "Approved",
      session.user.id as string
    );
    return { success: result.success, error: result.error };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

export async function rejectLoanAction(loanId: string, reason: string) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return { success: false, error: "Unauthorized" };
    }

    const result = await updateLoanStatus(
      loanId,
      "Rejected",
      session.user.id as string,
      reason
    );
    return { success: result.success, error: result.error };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

export async function disburseLoanAction(loanId: string) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return { success: false, error: "Unauthorized" };
    }

    const result = await updateLoanStatus(loanId, "Disbursed");
    return { success: result.success, error: result.error };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}
