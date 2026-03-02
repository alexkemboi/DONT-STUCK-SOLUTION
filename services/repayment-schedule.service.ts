"use server";

import { ServiceResult } from "./base.service";
import type { RepaymentSchedule, ScheduleStatus } from "../lib/generated/prisma";
import prisma from "@/lib/prisma";

// ============================================================================
// TYPES
// ============================================================================

export interface ScheduleRowInput {
  installmentNumber: number;
  dueDate: Date;
  scheduledPayment: number;
  principalPortion: number;
  interestPortion: number;
  expectedBalance: number;
}

export type RepaymentScheduleWithLoan = RepaymentSchedule & {
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
};

// ============================================================================
// SCHEDULE GENERATION
// ============================================================================

/**
 * Calculate amortization schedule rows for a loan (internal helper).
 *
 * @param principal       - Loan principal amount
 * @param periodRate      - Interest rate per installment period (as a decimal, already converted)
 *                          Monthly: monthlyRate / 100
 *                          Weekly:  (monthlyRate * 12 / 52) / 100
 * @param periods         - Total number of installments
 * @param startDate       - Schedule start date
 * @param frequency       - "MONTHLY" or "WEEKLY" — controls due-date stepping
 */
function calculateScheduleRows(
  principal: number,
  periodRate: number,
  periods: number,
  startDate: Date,
  frequency: "MONTHLY" | "WEEKLY" = "MONTHLY"
): ScheduleRowInput[] {
  if (principal <= 0 || periods <= 0) {
    return [];
  }

  // PMT formula: P * r * (1+r)^n / ((1+r)^n - 1)
  const installmentPayment =
    periodRate === 0
      ? principal / periods
      : (principal * periodRate * Math.pow(1 + periodRate, periods)) /
        (Math.pow(1 + periodRate, periods) - 1);

  const rows: ScheduleRowInput[] = [];
  let balance = principal;

  for (let i = 1; i <= periods; i++) {
    const interestPayment = balance * periodRate;
    const principalPayment = installmentPayment - interestPayment;
    balance = Math.max(0, balance - principalPayment);

    // Due date: add N months (monthly) or N*7 days (weekly)
    const dueDate = new Date(startDate);
    if (frequency === "WEEKLY") {
      dueDate.setDate(dueDate.getDate() + i * 7);
    } else {
      dueDate.setMonth(dueDate.getMonth() + i);
    }

    rows.push({
      installmentNumber: i,
      dueDate,
      scheduledPayment: Math.round(installmentPayment * 100) / 100,
      principalPortion: Math.round(principalPayment * 100) / 100,
      interestPortion: Math.round(interestPayment * 100) / 100,
      expectedBalance: Math.round(balance * 100) / 100,
    });
  }

  return rows;
}

/**
 * Convert stored loan terms into period-rate and period-count for any frequency.
 * DB stores interestRate as monthly percentage (e.g. 20 = 20% per month).
 */
function deriveScheduleParams(
  monthlyInterestRatePct: number,
  repaymentMonths: number,
  frequency: "MONTHLY" | "WEEKLY"
): { periodRate: number; periods: number } {
  if (frequency === "WEEKLY") {
    // annual rate = monthly% * 12; weekly rate = annual / 52
    const annualRate = (monthlyInterestRatePct / 100) * 12;
    const periodRate = annualRate / 52;
    const periods = Math.round(repaymentMonths * 52 / 12);
    return { periodRate, periods };
  }
  return {
    periodRate: monthlyInterestRatePct / 100,
    periods: repaymentMonths,
  };
}

/**
 * Generate and store repayment schedule for a loan
 * Called when a loan is disbursed
 */
export async function generateRepaymentSchedule(
  loanId: string
): Promise<ServiceResult<RepaymentSchedule[]>> {
  try {
    // Get loan details
    const loan = await prisma.loanApplication.findUnique({
      where: { id: loanId },
      select: {
        id: true,
        approvedAmount: true,
        amountRequested: true,
        interestRate: true,
        repaymentPeriod: true,
        paymentFrequency: true,
        startDate: true,
        disbursement: {
          select: { disbursedAt: true },
        },
      },
    });

    if (!loan) {
      return { success: false, error: "Loan not found" };
    }

    const principal = Number(loan.approvedAmount || loan.amountRequested);
    const frequency = loan.paymentFrequency as "MONTHLY" | "WEEKLY";
    const startDate = loan.disbursement?.disbursedAt || loan.startDate || new Date();

    const { periodRate, periods } = deriveScheduleParams(
      Number(loan.interestRate),
      loan.repaymentPeriod,
      frequency
    );

    // Calculate schedule rows
    const scheduleRows = calculateScheduleRows(
      principal,
      periodRate,
      periods,
      startDate,
      frequency
    );

    if (scheduleRows.length === 0) {
      return { success: false, error: "Could not calculate schedule" };
    }

    // Delete any existing schedule for this loan (in case of regeneration)
    await prisma.repaymentSchedule.deleteMany({
      where: { loanId },
    });

    // Create schedule entries
    const schedules = await prisma.repaymentSchedule.createMany({
      data: scheduleRows.map((row) => ({
        loanId,
        installmentNumber: row.installmentNumber,
        dueDate: row.dueDate,
        scheduledPayment: row.scheduledPayment,
        principalPortion: row.principalPortion,
        interestPortion: row.interestPortion,
        expectedBalance: row.expectedBalance,
        actualPrincipalPaid: 0,
        actualInterestPaid: 0,
        remainingPrincipal: row.principalPortion,
        remainingInterest: row.interestPortion,
        status: "Pending" as ScheduleStatus,
      })),
    });

    // Fetch and return the created schedules
    const createdSchedules = await prisma.repaymentSchedule.findMany({
      where: { loanId },
      orderBy: { installmentNumber: "asc" },
    });

    return { success: true, data: createdSchedules };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

// ============================================================================
// SCHEDULE QUERIES
// ============================================================================

/**
 * Get repayment schedule for a loan
 */
export async function getScheduleByLoanId(
  loanId: string
): Promise<ServiceResult<RepaymentSchedule[]>> {
  try {
    const schedules = await prisma.repaymentSchedule.findMany({
      where: { loanId },
      orderBy: { installmentNumber: "asc" },
    });
    return { success: true, data: schedules };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

/**
 * Get schedule with loan details (for reports)
 */
export async function getScheduleWithLoanDetails(
  loanId: string
): Promise<ServiceResult<RepaymentScheduleWithLoan[]>> {
  try {
    const schedules = await prisma.repaymentSchedule.findMany({
      where: { loanId },
      include: {
        loan: {
          select: {
            id: true,
            purpose: true,
            approvedAmount: true,
            amountRequested: true,
            client: {
              select: {
                surname: true,
                otherNames: true,
              },
            },
          },
        },
      },
      orderBy: { installmentNumber: "asc" },
    });

    // Type assertion needed due to Decimal types
    return { success: true, data: schedules as unknown as RepaymentScheduleWithLoan[] };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

// ============================================================================
// SCHEDULE UPDATES
// ============================================================================

/**
 * Update schedule entry with actual payment
 */
export async function updateScheduleWithPayment(
  scheduleId: string,
  repaymentId: string,
  amountPaid: number,
  paymentDate: Date
): Promise<ServiceResult<RepaymentSchedule>> {
  try {
    const schedule = await prisma.repaymentSchedule.findUnique({
      where: { id: scheduleId },
      include: {
        loan: {
          select: {
            interestRate: true,
            approvedAmount: true,
            amountRequested: true,
            repaymentPeriod: true,
            paymentFrequency: true,
            startDate: true,
            disbursement: {
              select: { disbursedAt: true },
            },
          },
        },
      },
    });

    if (!schedule || !schedule.loan) {
      return { success: false, error: "Schedule entry or associated loan not found" };
    }

    let paymentRemaining = amountPaid;
    let currentActualPrincipalPaid = Number(schedule.actualPrincipalPaid);
    let currentActualInterestPaid = Number(schedule.actualInterestPaid);
    let currentRemainingPrincipal = Number(schedule.remainingPrincipal);
    let currentRemainingInterest = Number(schedule.remainingInterest);

    // 1. Apply payment to outstanding interest first
    const interestToPay = Math.min(paymentRemaining, currentRemainingInterest);
    currentActualInterestPaid += interestToPay;
    currentRemainingInterest -= interestToPay;
    paymentRemaining -= interestToPay;

    // 2. Apply remaining payment to outstanding principal
    const principalToPay = Math.min(paymentRemaining, currentRemainingPrincipal);
    currentActualPrincipalPaid += principalToPay;
    currentRemainingPrincipal -= principalToPay;
    paymentRemaining -= principalToPay;

    // Update actual amount paid for this installment
    const totalActualAmountPaid = currentActualPrincipalPaid + currentActualInterestPaid;

    // Determine new status
    let newStatus: ScheduleStatus = "Partial";
    if (currentRemainingPrincipal <= 0 && currentRemainingInterest <= 0) {
      newStatus = "Paid";
    } else if (totalActualAmountPaid > 0) {
      newStatus = "Partial";
    } else {
      newStatus = "Pending"; // Should not happen if amountPaid > 0
    }

    const updatedSchedule = await prisma.repaymentSchedule.update({
      where: { id: scheduleId },
      data: {
        actualAmountPaid: totalActualAmountPaid,
        actualPrincipalPaid: currentActualPrincipalPaid,
        actualInterestPaid: currentActualInterestPaid,
        remainingPrincipal: currentRemainingPrincipal,
        remainingInterest: currentRemainingInterest,
        actualPaymentDate: paymentDate,
        status: newStatus,
        repaymentId,
      },
    });

    // --- Propagation Logic for Subsequent Installments ---
    // If there's an excess payment or a change in remaining principal,
    // we need to adjust subsequent installments.

    // Get all remaining installments for this loan, starting from the next one
    const subsequentSchedules = await prisma.repaymentSchedule.findMany({
      where: {
        loanId: schedule.loanId,
        installmentNumber: { gt: schedule.installmentNumber },
      },
      orderBy: { installmentNumber: "asc" },
    });

    // Calculate the current total outstanding principal for the loan
    // This is the sum of remainingPrincipal for all installments from the current one onwards
    let loanOutstandingPrincipal = Number(updatedSchedule.remainingPrincipal);
    for (const subSchedule of subsequentSchedules) {
      loanOutstandingPrincipal += Number(subSchedule.remainingPrincipal);
    }

    // Apply any excess payment to the loan's outstanding principal
    if (paymentRemaining > 0) {
      loanOutstandingPrincipal = Math.max(0, loanOutstandingPrincipal - paymentRemaining);
    }

    // Recalculate and update subsequent schedules
    if (subsequentSchedules.length > 0 && loanOutstandingPrincipal > 0) {
      const frequency = (schedule.loan.paymentFrequency ?? "MONTHLY") as "MONTHLY" | "WEEKLY";
      const remainingInstallments = subsequentSchedules.length;

      // Use frequency-aware rate conversion; remaining periods = installments left
      const { periodRate } = deriveScheduleParams(
        Number(schedule.loan.interestRate),
        remainingInstallments, // passed as months but we only need the rate here
        frequency
      );

      // Recalculate the remaining schedule based on the new loanOutstandingPrincipal
      const recalculatedRows = calculateScheduleRows(
        loanOutstandingPrincipal,
        periodRate,
        remainingInstallments,
        updatedSchedule.dueDate,
        frequency
      );

      const updates = recalculatedRows.map((row, index) => {
        const targetSchedule = subsequentSchedules[index];
        return prisma.repaymentSchedule.update({
          where: { id: targetSchedule.id },
          data: {
            scheduledPayment: row.scheduledPayment,
            principalPortion: row.principalPortion,
            interestPortion: row.interestPortion,
            expectedBalance: row.expectedBalance,
            // Reset remaining principal/interest for these future installments
            // as they are being recalculated based on the new outstanding balance
            remainingPrincipal: row.principalPortion,
            remainingInterest: row.interestPortion,
            // Ensure status is not changed if it was already Paid or Overdue
            status: targetSchedule.status === "Paid" ? "Paid" : "Pending", // Or "Overdue" if applicable
          },
        });
      });
      await prisma.$transaction(updates);
    } else if (loanOutstandingPrincipal <= 0) {
      // If loan outstanding principal is zero, mark all subsequent as paid or cancel them
      // For now, let's mark them as paid with 0 amounts
      const zeroOutUpdates = subsequentSchedules.map((subSchedule) =>
        prisma.repaymentSchedule.update({
          where: { id: subSchedule.id },
          data: {
            scheduledPayment: 0,
            principalPortion: 0,
            interestPortion: 0,
            expectedBalance: 0,
            actualAmountPaid: Number(subSchedule.actualAmountPaid), // Keep any actual payments made
            actualPrincipalPaid: Number(subSchedule.actualPrincipalPaid),
            actualInterestPaid: Number(subSchedule.actualInterestPaid),
            remainingPrincipal: 0,
            remainingInterest: 0,
            status: "Paid", // Mark as paid if loan is fully covered
          },
        })
      );
      await prisma.$transaction(zeroOutUpdates);
    }

    return { success: true, data: updatedSchedule };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

/**
 * Mark overdue installments
 * Called periodically or on-demand
 */
export async function markOverdueInstallments(): Promise<
  ServiceResult<{ updated: number }>
> {
  try {
    const now = new Date();

    const result = await prisma.repaymentSchedule.updateMany({
      where: {
        status: "Pending",
        dueDate: { lt: now },
      },
      data: {
        status: "Overdue",
      },
    });

    return { success: true, data: { updated: result.count } };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

/**
 * Get next pending installment for a loan
 */
export async function getNextPendingInstallment(
  loanId: string
): Promise<ServiceResult<RepaymentSchedule | null>> {
  try {
    const schedule = await prisma.repaymentSchedule.findFirst({
      where: {
        loanId,
        status: { in: ["Pending", "Overdue", "Partial"] },
      },
      orderBy: { installmentNumber: "asc" },
    });
    return { success: true, data: schedule };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

// ============================================================================
// SCHEDULE SUMMARY
// ============================================================================

/**
 * Get schedule summary for a loan
 */
export async function getScheduleSummary(loanId: string): Promise<
  ServiceResult<{
    totalScheduled: number;
    totalPaid: number;
    totalRemaining: number;
    paidInstallments: number;
    pendingInstallments: number;
    overdueInstallments: number;
    nextDueDate: Date | null;
    nextDueAmount: number | null;
  }>
> {
  try {
    const schedules = await prisma.repaymentSchedule.findMany({
      where: { loanId },
      orderBy: { installmentNumber: "asc" },
    });

    if (schedules.length === 0) {
      return {
        success: true,
        data: {
          totalScheduled: 0,
          totalPaid: 0,
          totalRemaining: 0,
          paidInstallments: 0,
          pendingInstallments: 0,
          overdueInstallments: 0,
          nextDueDate: null,
          nextDueAmount: null,
        },
      };
    }

    const totalScheduled = schedules.reduce(
      (sum, s) => sum + Number(s.scheduledPayment),
      0
    );
    const totalPaid = schedules.reduce(
      (sum, s) => sum + Number(s.actualAmountPaid),
      0
    );

    const paidInstallments = schedules.filter((s) => s.status === "Paid").length;
    const pendingInstallments = schedules.filter(
      (s) => s.status === "Pending" || s.status === "Partial"
    ).length;
    const overdueInstallments = schedules.filter(
      (s) => s.status === "Overdue"
    ).length;

    const nextInstallment = schedules.find(
      (s) => s.status === "Pending" || s.status === "Overdue" || s.status === "Partial"
    );

    return {
      success: true,
      data: {
        totalScheduled: Math.round(totalScheduled),
        totalPaid: Math.round(totalPaid),
        totalRemaining: Math.round(totalScheduled - totalPaid),
        paidInstallments,
        pendingInstallments,
        overdueInstallments,
        nextDueDate: nextInstallment?.dueDate || null,
        nextDueAmount: nextInstallment
          ? Number(nextInstallment.scheduledPayment) -
            Number(nextInstallment.actualAmountPaid)
          : null,
      },
    };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}
