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
import {
  updateScheduleWithPayment,
  getNextPendingInstallment,
} from "@/services/repayment-schedule.service";
import { revalidatePath } from "next/cache";

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
  scheduleId?: string; // Optional: link to specific schedule installment
}) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return { success: false, error: "Unauthorized" };
    }

    const paymentDateObj = new Date(data.paymentDate);

    const result = await createRepayment({
      loanId: data.loanId,
      amount: data.amount,
      paymentMethod: data.paymentMethod,
      paymentDate: paymentDateObj,
      category: data.category,
      reference: data.reference,
    });

    if (result.success && result.data) {
      // If scheduleId provided, update that specific installment
      // Otherwise, auto-apply to next pending installment
      let targetScheduleId = data.scheduleId;

      if (!targetScheduleId) {
        // Find next pending installment for this loan
        const nextInstallment = await getNextPendingInstallment(data.loanId);
        if (nextInstallment.success && nextInstallment.data) {
          targetScheduleId = nextInstallment.data.id;
        }
      }

      // Update schedule entry with payment
      if (targetScheduleId) {
        await updateScheduleWithPayment(
          targetScheduleId,
          result.data.id,
          data.amount,
          paymentDateObj
        );
      }

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
            scheduleId: targetScheduleId,
          },
        },
      }).catch(() => {});

      revalidatePath(`/dss/admin/loans/${data.loanId}`);
      revalidatePath("/dss/admin/repayments");
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


export async function updateRepaymentAction({
  repaymentId,
  amount,
  paymentMethod,
  paymentDate,
  category,
  reference,
}: {
  repaymentId: string;
  amount: number;
  paymentMethod: PaymentMethod;
  paymentDate: string;
  category: RepaymentCategory;
  reference?: string;
}) {
  try {

    const repayment = await prisma.repayment.update({
      where: {
        id: repaymentId,
      },

      data: {
        amount,
        paymentMethod,
        paymentDate: new Date(paymentDate),
        category,
        reference,
      },
    });

    revalidatePath("/admin/repayments");

    return {
      success: true,
      data: repayment,
    };

  } catch (error) {

    console.error(error);

    return {
      success: false,
      error: "Failed to update repayment",
    };
  }
}