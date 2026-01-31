"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import prisma from "@/lib/prisma";

// ============================================================================
// LOAN PORTFOLIO SUMMARY
// ============================================================================

export interface LoanPortfolioSummary {
  // By status
  statusBreakdown: {
    status: string;
    count: number;
    totalAmount: number;
  }[];
  // Totals
  totalLoans: number;
  totalDisbursed: number;
  totalOutstanding: number;
  totalRepaid: number;
  approvalRate: number;
  averageLoanSize: number;
  averageInterestRate: number;
  // Recent trends
  monthlyApplications: {
    month: string;
    count: number;
    amount: number;
  }[];
  monthlyRepayments: {
    month: string;
    amount: number;
  }[];
}

export async function getLoanPortfolioSummaryAction(): Promise<{
  success: boolean;
  data?: LoanPortfolioSummary;
  error?: string;
}> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return { success: false, error: "Unauthorized" };
    }

    // All loans
    const loans = await prisma.loanApplication.findMany({
      select: {
        id: true,
        amountRequested: true,
        approvedAmount: true,
        interestRate: true,
        repaymentPeriod: true,
        status: true,
        appliedAt: true,
      },
    });

    // Status breakdown
    const statusMap = new Map<string, { count: number; totalAmount: number }>();
    for (const loan of loans) {
      const entry = statusMap.get(loan.status) || { count: 0, totalAmount: 0 };
      entry.count++;
      entry.totalAmount += Number(loan.amountRequested);
      statusMap.set(loan.status, entry);
    }
    const statusBreakdown = Array.from(statusMap.entries()).map(
      ([status, data]) => ({
        status,
        count: data.count,
        totalAmount: data.totalAmount,
      })
    );

    // Totals
    const totalLoans = loans.length;
    const disbursedLoans = loans.filter(
      (l) =>
        l.status === "Disbursed" || l.status === "Active" || l.status === "Closed"
    );
    const totalDisbursed = disbursedLoans.reduce(
      (sum, l) => sum + Number(l.approvedAmount || l.amountRequested),
      0
    );

    const approvedOrDisbursed = loans.filter(
      (l) =>
        l.status === "Approved" ||
        l.status === "Disbursed" ||
        l.status === "Active" ||
        l.status === "Closed"
    );
    const approvalRate =
      totalLoans > 0
        ? Math.round((approvedOrDisbursed.length / totalLoans) * 100)
        : 0;
    const averageLoanSize =
      totalLoans > 0
        ? loans.reduce((sum, l) => sum + Number(l.amountRequested), 0) /
          totalLoans
        : 0;
    const averageInterestRate =
      totalLoans > 0
        ? loans.reduce((sum, l) => sum + Number(l.interestRate), 0) /
          totalLoans
        : 0;

    // Total repaid
    const repaymentAgg = await prisma.repayment.aggregate({
      _sum: { amount: true },
    });
    const totalRepaid = Number(repaymentAgg._sum.amount || 0);

    // Outstanding = totalDisbursed - totalRepaid (simplified)
    const totalOutstanding = Math.max(0, totalDisbursed - totalRepaid);

    // Monthly applications (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);
    sixMonthsAgo.setHours(0, 0, 0, 0);

    const recentLoans = loans.filter(
      (l) => new Date(l.appliedAt) >= sixMonthsAgo
    );
    const monthlyAppMap = new Map<string, { count: number; amount: number }>();

    for (let i = 0; i < 6; i++) {
      const d = new Date();
      d.setMonth(d.getMonth() - (5 - i));
      const key = d.toLocaleDateString("en-KE", {
        month: "short",
        year: "2-digit",
      });
      monthlyAppMap.set(key, { count: 0, amount: 0 });
    }

    for (const loan of recentLoans) {
      const d = new Date(loan.appliedAt);
      const key = d.toLocaleDateString("en-KE", {
        month: "short",
        year: "2-digit",
      });
      const entry = monthlyAppMap.get(key);
      if (entry) {
        entry.count++;
        entry.amount += Number(loan.amountRequested);
      }
    }

    const monthlyApplications = Array.from(monthlyAppMap.entries()).map(
      ([month, data]) => ({
        month,
        count: data.count,
        amount: data.amount,
      })
    );

    // Monthly repayments (last 6 months)
    const repayments = await prisma.repayment.findMany({
      where: { paymentDate: { gte: sixMonthsAgo } },
      select: { amount: true, paymentDate: true },
    });

    const monthlyRepMap = new Map<string, number>();
    for (const [key] of monthlyAppMap) {
      monthlyRepMap.set(key, 0);
    }

    for (const rep of repayments) {
      const d = new Date(rep.paymentDate);
      const key = d.toLocaleDateString("en-KE", {
        month: "short",
        year: "2-digit",
      });
      const current = monthlyRepMap.get(key) || 0;
      monthlyRepMap.set(key, current + Number(rep.amount));
    }

    const monthlyRepayments = Array.from(monthlyRepMap.entries()).map(
      ([month, amount]) => ({ month, amount })
    );

    return {
      success: true,
      data: {
        statusBreakdown,
        totalLoans,
        totalDisbursed,
        totalOutstanding,
        totalRepaid,
        approvalRate,
        averageLoanSize,
        averageInterestRate,
        monthlyApplications,
        monthlyRepayments,
      },
    };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}
