"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import prisma from "@/lib/prisma";
import type { PaymentMethod, RepaymentCategory } from "@/lib/generated/prisma";
import {
  createRepayment,
  getAllRepayments,
  getRepaymentsByLoanId,
  getLoanRepaymentSummary,
  type RepaymentWithLoan,
} from "@/services/repayment.service";

// ============================================================================
// TYPES
// ============================================================================

export interface SerializedRepayment {
  id: string;
  loanId: string;
  clientName: string;
  clientPhone: string;
  loanPurpose: string;
  amount: number;
  paymentMethod: string;
  paymentDate: string;
  category: string;
  reference: string | null;
  createdAt: string;
}

function serializeRepayment(r: RepaymentWithLoan): SerializedRepayment {
  return {
    id: r.id,
    loanId: r.loanId,
    clientName: `${r.loan.client.surname} ${r.loan.client.otherNames}`,
    clientPhone: r.loan.client.phoneMobile,
    loanPurpose: r.loan.purpose,
    amount: Number(r.amount),
    paymentMethod: r.paymentMethod,
    paymentDate: r.paymentDate.toISOString(),
    category: r.category,
    reference: r.reference,
    createdAt: r.createdAt.toISOString(),
  };
}

// ============================================================================
// ACTIONS
// ============================================================================

export async function recordRepaymentAction(data: {
  loanId: string;
  amount: number;
  paymentMethod: PaymentMethod;
  paymentDate: string;
  category: RepaymentCategory;
  reference?: string;
}) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return { success: false, error: "Unauthorized" };
    }

    const result = await createRepayment({
      loanId: data.loanId,
      amount: data.amount,
      paymentMethod: data.paymentMethod,
      paymentDate: new Date(data.paymentDate),
      category: data.category,
      reference: data.reference,
    });

    if (result.success && result.data) {
      await prisma.auditLog.create({
        data: {
          userId: session.user.id as string,
          action: "CREATE",
          entity: "Repayment",
          entityId: result.data.id,
          newValue: {
            loanId: data.loanId,
            amount: data.amount,
            paymentMethod: data.paymentMethod,
            reference: data.reference,
          },
        },
      }).catch(() => {});
    }

    return { success: result.success, error: result.error };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

export async function getAllRepaymentsAction(): Promise<{
  success: boolean;
  data: SerializedRepayment[];
  error?: string;
}> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return { success: false, data: [], error: "Unauthorized" };
    }

    const result = await getAllRepayments();
    if (!result.success || !result.data) {
      return { success: false, data: [], error: result.error };
    }

    return { success: true, data: result.data.map(serializeRepayment) };
  } catch (error) {
    return { success: false, data: [], error: (error as Error).message };
  }
}

export async function getLoanRepaymentSummaryAction(loanId: string) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return { success: false, error: "Unauthorized" };
    }

    const result = await getLoanRepaymentSummary(loanId);
    return result;
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

export async function getDisbursedLoansForRepaymentAction() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return { success: false, data: [], error: "Unauthorized" };
    }

    const loans = await prisma.loanApplication.findMany({
      where: {
        status: { in: ["Disbursed", "Active"] },
      },
      include: {
        client: {
          select: {
            surname: true,
            otherNames: true,
          },
        },
      },
      orderBy: { appliedAt: "desc" },
    });

    const serialized = loans.map((l) => ({
      id: l.id,
      clientName: `${l.client.surname} ${l.client.otherNames}`,
      purpose: l.purpose,
      amountRequested: Number(l.amountRequested),
      approvedAmount: l.approvedAmount ? Number(l.approvedAmount) : null,
    }));

    return { success: true, data: serialized };
  } catch (error) {
    return { success: false, data: [], error: (error as Error).message };
  }
}
