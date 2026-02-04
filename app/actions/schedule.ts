"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import {
  generateRepaymentSchedule,
  getScheduleByLoanId,
  getScheduleWithLoanDetails,
  getScheduleSummary,
  updateScheduleWithPayment,
  markOverdueInstallments,
  getNextPendingInstallment,
} from "@/services/repayment-schedule.service";
import prisma from "@/lib/prisma";

// ============================================================================
// TYPES
// ============================================================================

export interface SerializedSchedule {
  id: string;
  loanId: string;
  installmentNumber: number;
  dueDate: string;
  scheduledPayment: number;
  principalPortion: number;
  interestPortion: number;
  expectedBalance: number;
  actualAmountPaid: number;
  actualPaymentDate: string | null;
  status: string;
  repaymentId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SerializedScheduleWithLoan extends SerializedSchedule {
  loan: {
    id: string;
    purpose: string;
    approvedAmount: number | null;
    amountRequested: number;
    client: {
      surname: string;
      otherNames: string;
    };
  };
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function serializeSchedule(schedule: any): SerializedSchedule {
  return {
    id: schedule.id,
    loanId: schedule.loanId,
    installmentNumber: schedule.installmentNumber,
    dueDate: schedule.dueDate.toISOString(),
    scheduledPayment: Number(schedule.scheduledPayment),
    principalPortion: Number(schedule.principalPortion),
    interestPortion: Number(schedule.interestPortion),
    expectedBalance: Number(schedule.expectedBalance),
    actualAmountPaid: Number(schedule.actualAmountPaid),
    actualPaymentDate: schedule.actualPaymentDate?.toISOString() || null,
    status: schedule.status,
    repaymentId: schedule.repaymentId,
    createdAt: schedule.createdAt.toISOString(),
    updatedAt: schedule.updatedAt.toISOString(),
  };
}

// ============================================================================
// ACTIONS
// ============================================================================

/**
 * Generate repayment schedule for a loan (Admin only)
 */
export async function generateScheduleAction(loanId: string) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return { success: false, error: "Unauthorized" };
    }

    const result = await generateRepaymentSchedule(loanId);

    if (result.success && result.data) {
      await prisma.auditLog.create({
        data: {
          userId: session.user.id as string,
          action: "GENERATE_SCHEDULE",
          entity: "RepaymentSchedule",
          entityId: loanId,
        },
      }).catch(() => {});

      revalidatePath(`/dss/admin/loans/${loanId}`);
      revalidatePath("/dss/admin/repayments");

      return {
        success: true,
        data: result.data.map(serializeSchedule),
      };
    }

    return { success: false, error: result.error };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

/**
 * Get schedule for a loan
 */
export async function getScheduleAction(loanId: string) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return { success: false, error: "Unauthorized" };
    }

    const result = await getScheduleByLoanId(loanId);

    if (result.success && result.data) {
      return {
        success: true,
        data: result.data.map(serializeSchedule),
      };
    }

    return { success: false, error: result.error };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

/**
 * Get schedule with loan details (for reports)
 */
export async function getScheduleWithLoanAction(loanId: string) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return { success: false, error: "Unauthorized" };
    }

    const result = await getScheduleWithLoanDetails(loanId);

    if (result.success && result.data) {
      return {
        success: true,
        data: result.data.map((s) => ({
          ...serializeSchedule(s),
          loan: {
            id: s.loan.id,
            purpose: s.loan.purpose,
            approvedAmount: s.loan.approvedAmount,
            amountRequested: Number(s.loan.amountRequested),
            client: s.loan.client,
          },
        })),
      };
    }

    return { success: false, error: result.error };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

/**
 * Get schedule summary for a loan
 */
export async function getScheduleSummaryAction(loanId: string) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return { success: false, error: "Unauthorized" };
    }

    const result = await getScheduleSummary(loanId);

    if (result.success && result.data) {
      return {
        success: true,
        data: {
          ...result.data,
          nextDueDate: result.data.nextDueDate?.toISOString() || null,
        },
      };
    }

    return { success: false, error: result.error };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

/**
 * Record payment against schedule
 */
export async function recordPaymentToScheduleAction(
  scheduleId: string,
  repaymentId: string,
  amount: number,
  paymentDate: Date
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return { success: false, error: "Unauthorized" };
    }

    const result = await updateScheduleWithPayment(
      scheduleId,
      repaymentId,
      amount,
      paymentDate
    );

    if (result.success && result.data) {
      await prisma.auditLog.create({
        data: {
          userId: session.user.id as string,
          action: "RECORD_SCHEDULE_PAYMENT",
          entity: "RepaymentSchedule",
          entityId: scheduleId,
          newValue: { amount, repaymentId },
        },
      }).catch(() => {});

      revalidatePath(`/dss/admin/loans/${result.data.loanId}`);
      revalidatePath("/dss/admin/repayments");

      return {
        success: true,
        data: serializeSchedule(result.data),
      };
    }

    return { success: false, error: result.error };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

/**
 * Get next pending installment for a loan
 */
export async function getNextInstallmentAction(loanId: string) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return { success: false, error: "Unauthorized" };
    }

    const result = await getNextPendingInstallment(loanId);

    if (result.success) {
      return {
        success: true,
        data: result.data ? serializeSchedule(result.data) : null,
      };
    }

    return { success: false, error: result.error };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

/**
 * Mark overdue installments (Admin cron job or manual trigger)
 */
export async function markOverdueAction() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return { success: false, error: "Unauthorized" };
    }

    const result = await markOverdueInstallments();

    if (result.success) {
      revalidatePath("/dss/admin/repayments");
      return { success: true, data: result.data };
    }

    return { success: false, error: result.error };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}
