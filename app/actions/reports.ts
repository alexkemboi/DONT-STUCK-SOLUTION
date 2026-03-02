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


// ============================================================================
// REPORT DATA EXPORT
// ============================================================================

export type ReportType = "portfolio" | "repayments" | "clients" | "disbursements";

export async function getReportDataAction(
  reportType: ReportType,
  startDate?: string,
  endDate?: string
): Promise<{ success: boolean; data?: Record<string, unknown>[]; error?: string }> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return { success: false, error: "Unauthorized" };
    }

    const adminUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });

    if (adminUser?.role !== "Admin") {
      return { success: false, error: "Admin access required" };
    }

    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;
    if (end) {
      end.setHours(23, 59, 59, 999);
    }

    switch (reportType) {
      case "portfolio": {
        const loans = await prisma.loanApplication.findMany({
          where: {
            ...(start || end
              ? {
                  appliedAt: {
                    ...(start ? { gte: start } : {}),
                    ...(end ? { lte: end } : {}),
                  },
                }
              : {}),
          },
          include: {
            client: {
              select: { surname: true, otherNames: true },
            },
          },
          orderBy: { appliedAt: "desc" },
        });

        return {
          success: true,
          data: loans.map((l) => ({
            "Loan ID": l.id,
            Client: `${l.client.surname} ${l.client.otherNames}`,
            Purpose: l.purpose,
            "Amount Requested": Number(l.amountRequested),
            "Approved Amount": l.approvedAmount ? Number(l.approvedAmount) : "",
            "Interest Rate": Number(l.interestRate),
            "Period (months)": l.repaymentPeriod,
            Status: l.status,
            "Applied At": l.appliedAt.toISOString().split("T")[0],
          })),
        };
      }

      case "repayments": {
        const repayments = await prisma.repayment.findMany({
          where: {
            ...(start || end
              ? {
                  paymentDate: {
                    ...(start ? { gte: start } : {}),
                    ...(end ? { lte: end } : {}),
                  },
                }
              : {}),
          },
          include: {
            loan: {
              select: {
                id: true,
                client: {
                  select: { surname: true, otherNames: true },
                },
              },
            },
          },
          orderBy: { paymentDate: "desc" },
        });

        return {
          success: true,
          data: repayments.map((r) => ({
            "Repayment ID": r.id,
            "Loan ID": r.loan.id,
            Client: `${r.loan.client.surname} ${r.loan.client.otherNames}`,
            Amount: Number(r.amount),
            Method: r.paymentMethod,
            Category: r.category,
            Reference: r.reference || "",
            "Payment Date": r.paymentDate.toISOString().split("T")[0],
          })),
        };
      }

      case "clients": {
        const clients = await prisma.client.findMany({
          include: {
            loanApplications: {
              select: {
                amountRequested: true,
                status: true,
              },
            },
          },
          orderBy: { surname: "asc" },
        });

        return {
          success: true,
          data: clients.map((c) => ({
            Name: `${c.surname} ${c.otherNames}`,
            Phone: c.phoneMobile,
            Email: c.emailPersonal || "",
            "ID/Passport": c.idPassportNo,
            Status: c.status,
            "Total Loans": c.loanApplications.length,
            "Total Amount": c.loanApplications.reduce(
              (sum: number, l: { amountRequested: unknown }) => sum + Number(l.amountRequested),
              0
            ),
            "Active Loans": c.loanApplications.filter(
              (l: { status: string }) => l.status === "Disbursed" || l.status === "Active"
            ).length,
          })),
        };
      }

      case "disbursements": {
        const disbursements = await prisma.loanDisbursement.findMany({
          where: {
            ...(start || end
              ? {
                  disbursedAt: {
                    ...(start ? { gte: start } : {}),
                    ...(end ? { lte: end } : {}),
                  },
                }
              : {}),
          },
          include: {
            loan: {
              select: {
                id: true,
                client: {
                  select: { surname: true, otherNames: true },
                },
              },
            },
          },
          orderBy: { disbursedAt: "desc" },
        });

        return {
          success: true,
          data: disbursements.map((d) => ({
            "Disbursement ID": d.id,
            "Loan ID": d.loan.id,
            Client: `${d.loan.client.surname} ${d.loan.client.otherNames}`,
            Amount: Number(d.amount),
            Method: d.method,
            Reference: d.reference || "",
            "Disbursed At": d.disbursedAt.toISOString().split("T")[0],
          })),
        };
      }

      default:
        return { success: false, error: "Invalid report type" };
    }
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

// ============================================================================
// PROFIT & LOSS SUMMARY
// ============================================================================

export interface ProfitLossSummary {
  totalInterestIncome: number;
  totalPrincipalDisbursed: number;
  totalRepaid: number;
  totalPrincipalRepaid: number;
  netInterestCollected: number;
  nplOutstanding: number;
  monthlyBreakdown: {
    month: string;
    interestCollected: number;
    principalRepaid: number;
    disbursed: number;
  }[];
}

export async function getProfitLossAction(): Promise<{
  success: boolean;
  data?: ProfitLossSummary;
  error?: string;
}> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return { success: false, error: "Unauthorized" };
    }

    // Total interest income from schedule (actual interest paid)
    const scheduleAgg = await prisma.repaymentSchedule.aggregate({
      _sum: { actualInterestPaid: true, actualPrincipalPaid: true },
    });
    const totalInterestIncome = Number(scheduleAgg._sum.actualInterestPaid || 0);
    const totalPrincipalRepaid = Number(scheduleAgg._sum.actualPrincipalPaid || 0);

    // Total disbursed
    const disbursementAgg = await prisma.loanDisbursement.aggregate({
      _sum: { amount: true },
    });
    const totalPrincipalDisbursed = Number(disbursementAgg._sum.amount || 0);

    // Total repaid (all repayment records)
    const repaymentAgg = await prisma.repayment.aggregate({
      _sum: { amount: true },
    });
    const totalRepaid = Number(repaymentAgg._sum.amount || 0);

    const netInterestCollected = totalInterestIncome;

    // NPL outstanding
    const nplAgg = await prisma.nonPerformingLoan.aggregate({
      _sum: { capitalizedAmount: true },
    });
    const nplOutstanding = Number(nplAgg._sum.capitalizedAmount || 0);

    // Monthly breakdown (last 6 months) from repayment schedules
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);
    sixMonthsAgo.setHours(0, 0, 0, 0);

    const recentScheduleItems = await prisma.repaymentSchedule.findMany({
      where: {
        actualPaymentDate: { gte: sixMonthsAgo },
        status: "Paid",
      },
      select: {
        actualPaymentDate: true,
        actualInterestPaid: true,
        actualPrincipalPaid: true,
      },
    });

    const recentDisbursements = await prisma.loanDisbursement.findMany({
      where: { disbursedAt: { gte: sixMonthsAgo } },
      select: { disbursedAt: true, amount: true },
    });

    const monthKeys: string[] = [];
    for (let i = 0; i < 6; i++) {
      const d = new Date();
      d.setMonth(d.getMonth() - (5 - i));
      monthKeys.push(
        d.toLocaleDateString("en-KE", { month: "short", year: "2-digit" })
      );
    }

    const monthMap = new Map<
      string,
      { interestCollected: number; principalRepaid: number; disbursed: number }
    >();
    for (const key of monthKeys) {
      monthMap.set(key, { interestCollected: 0, principalRepaid: 0, disbursed: 0 });
    }

    for (const item of recentScheduleItems) {
      if (!item.actualPaymentDate) continue;
      const key = new Date(item.actualPaymentDate).toLocaleDateString("en-KE", {
        month: "short",
        year: "2-digit",
      });
      const entry = monthMap.get(key);
      if (entry) {
        entry.interestCollected += Number(item.actualInterestPaid);
        entry.principalRepaid += Number(item.actualPrincipalPaid);
      }
    }

    for (const d of recentDisbursements) {
      const key = new Date(d.disbursedAt).toLocaleDateString("en-KE", {
        month: "short",
        year: "2-digit",
      });
      const entry = monthMap.get(key);
      if (entry) {
        entry.disbursed += Number(d.amount);
      }
    }

    const monthlyBreakdown = Array.from(monthMap.entries()).map(
      ([month, data]) => ({ month, ...data })
    );

    return {
      success: true,
      data: {
        totalInterestIncome,
        totalPrincipalDisbursed,
        totalRepaid,
        totalPrincipalRepaid,
        netInterestCollected,
        nplOutstanding,
        monthlyBreakdown,
      },
    };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

export async function getReports() {
  const clientsWithBalances = await prisma.loanApplication.count({
    where: {
      status: {
        in: ["Disbursed", "Active"],
      },
    },
  });

  const overduePayments = await prisma.repayment.count({
    where: {
    },
  });

  const totalDisbursed = await prisma.loanApplication.aggregate({
    _sum: {
      approvedAmount: true,
    },
    where: {
      status: {
        in: ["Disbursed", "Active", "Closed"],
      },
    },
  });

  return {
    clientsWithBalances,
    overduePayments,
    totalDisbursed: totalDisbursed._sum.approvedAmount || 0,
  };
}