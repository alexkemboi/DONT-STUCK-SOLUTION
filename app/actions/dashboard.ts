"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import prisma from "@/lib/prisma";

// ============================================================================
// ADMIN DASHBOARD
// ============================================================================

export interface AdminDashboardData {
  totalClients: number;
  activeLoans: number;
  pendingApplications: number;
  totalDisbursed: number;
  totalRepayments: number;
  totalOutstanding: number;
  nplCount: number;
  recoveryRate: number;
  loanStatusDistribution: { status: string; count: number; color: string }[];
  monthlyDisbursements: { month: string; amount: number }[];
  recentActivity: {
    id: string;
    type: string;
    title: string;
    description: string;
    timestamp: string;
    user: string;
  }[];
}

const statusColors: Record<string, string> = {
  Pending: "#f59e0b",
  Approved: "#3b82f6",
  Rejected: "#ef4444",
  Disbursed: "#8b5cf6",
  Active: "#10b981",
  NPL: "#dc2626",
  Closed: "#6b7280",
};

const auditActionMap: Record<string, { type: string; title: string }> = {
  CREATE: { type: "client_registered", title: "New Record Created" },
  APPROVE: { type: "loan_approved", title: "Loan Approved" },
  REJECT: { type: "npl_flagged", title: "Loan Rejected" },
  DISBURSE: { type: "disbursement", title: "Loan Disbursed" },
  UPDATE: { type: "repayment", title: "Record Updated" },
  DELETE: { type: "npl_flagged", title: "Record Deleted" },
  REPAYMENT: { type: "repayment", title: "Repayment Recorded" },
};

export async function getAdminDashboardData(): Promise<{
  success: boolean;
  data: AdminDashboardData | null;
  error?: string;
}> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return { success: false, data: null, error: "Unauthorized" };
    }

    // Run all queries in parallel
    const [
      clientCount,
      loanCounts,
      disbursedAggregate,
      repaymentAggregate,
      nplCount,
      nplWithRepayments,
      statusGroups,
      monthlyData,
      auditLogs,
    ] = await Promise.all([
      // Total clients
      prisma.client.count(),

      // Loan counts by status
      prisma.loanApplication.groupBy({
        by: ["status"],
        _count: true,
      }),

      // Total disbursed amount
      prisma.loanApplication.aggregate({
        where: { status: { in: ["Disbursed", "Active", "NPL", "Closed"] } },
        _sum: { approvedAmount: true },
      }),

      // Total repayments
      prisma.repayment.aggregate({
        _sum: { amount: true },
      }),

      // NPL count
      prisma.loanApplication.count({
        where: { status: "NPL" },
      }),

      // NPL recovery: total repaid on NPL loans
      prisma.repayment.aggregate({
        where: { loan: { status: "NPL" } },
        _sum: { amount: true },
      }),

      // Status distribution for chart
      prisma.loanApplication.groupBy({
        by: ["status"],
        _count: true,
      }),

      // Monthly disbursements (last 6 months)
      prisma.$queryRaw<{ month: string; amount: number }[]>`
        SELECT
          TO_CHAR("approved_at", 'Mon') as month,
          COALESCE(SUM("approved_amount"), 0)::float as amount
        FROM "loan_applications"
        WHERE "status" IN ('Disbursed', 'Active', 'NPL', 'Closed')
          AND "approved_at" IS NOT NULL
          AND "approved_at" >= NOW() - INTERVAL '6 months'
        GROUP BY TO_CHAR("approved_at", 'Mon'), EXTRACT(MONTH FROM "approved_at")
        ORDER BY EXTRACT(MONTH FROM "approved_at")
      `,

      // Recent activity from audit log
      prisma.auditLog.findMany({
        take: 10,
        orderBy: { timestamp: "desc" },
        include: {
          user: { select: { name: true } },
        },
      }),
    ]);

    // Compute derived stats
    const activeStatuses = ["Approved", "Disbursed", "Active"];
    const activeLoans = loanCounts
      .filter((g) => activeStatuses.includes(g.status))
      .reduce((sum, g) => sum + g._count, 0);

    const pendingApplications =
      loanCounts.find((g) => g.status === "Pending")?._count || 0;

    const totalDisbursed = Number(disbursedAggregate._sum.approvedAmount || 0);
    const totalRepayments = Number(repaymentAggregate._sum.amount || 0);
    const totalOutstanding = Math.max(0, totalDisbursed - totalRepayments);

    // Recovery rate for NPL loans
    const nplRepaid = Number(nplWithRepayments._sum.amount || 0);
    const recoveryRate =
      nplCount > 0 && totalDisbursed > 0
        ? Math.round((nplRepaid / (totalDisbursed * (nplCount / (loanCounts.reduce((s, g) => s + g._count, 0) || 1)))) * 100)
        : 0;

    // Format status distribution
    const loanStatusDistribution = statusGroups.map((g) => ({
      status: g.status,
      count: g._count,
      color: statusColors[g.status] || "#6b7280",
    }));

    // Format monthly disbursements
    const monthlyDisbursements = monthlyData.map((m) => ({
      month: m.month,
      amount: Number(m.amount),
    }));

    // Format recent activity
    const recentActivity = auditLogs.map((log) => {
      const mapped = auditActionMap[log.action] || {
        type: "repayment",
        title: log.action,
      };
      return {
        id: log.id,
        type: mapped.type,
        title: mapped.title,
        description: `${log.action} on ${log.entity}${log.entityId ? ` #${log.entityId.slice(0, 8)}` : ""}`,
        timestamp: log.timestamp.toISOString(),
        user: log.user?.name || "System",
      };
    });

    return {
      success: true,
      data: {
        totalClients: clientCount,
        activeLoans,
        pendingApplications,
        totalDisbursed,
        totalRepayments,
        totalOutstanding,
        nplCount,
        recoveryRate: Math.min(recoveryRate, 100),
        loanStatusDistribution,
        monthlyDisbursements,
        recentActivity,
      },
    };
  } catch (error) {
    return { success: false, data: null, error: (error as Error).message };
  }
}

// ============================================================================
// CLIENT DASHBOARD
// ============================================================================

export interface ClientDashboardData {
  clientName: string;
  totalLoans: number;
  activeLoans: number;
  totalBorrowed: number;
  totalRepaid: number;
  recentApplications: {
    id: string;
    purpose: string;
    amount: number;
    status: string;
    appliedAt: string;
  }[];
}

export async function getClientDashboardData(): Promise<{
  success: boolean;
  data: ClientDashboardData | null;
  error?: string;
}> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return { success: false, data: null, error: "Unauthorized" };
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id as string },
      select: {
        name: true,
        client: { select: { id: true, surname: true, otherNames: true } },
      },
    });

    if (!user?.client) {
      return {
        success: true,
        data: {
          clientName: user?.name || "Client",
          totalLoans: 0,
          activeLoans: 0,
          totalBorrowed: 0,
          totalRepaid: 0,
          recentApplications: [],
        },
      };
    }

    const clientId = user.client.id;

    const [loans, repaymentAggregate] = await Promise.all([
      prisma.loanApplication.findMany({
        where: { clientId },
        orderBy: { appliedAt: "desc" },
        select: {
          id: true,
          purpose: true,
          amountRequested: true,
          approvedAmount: true,
          status: true,
          appliedAt: true,
        },
      }),
      prisma.repayment.aggregate({
        where: { loan: { clientId } },
        _sum: { amount: true },
      }),
    ]);

    const activeStatuses = ["Approved", "Disbursed", "Active"];
    const activeLoans = loans.filter((l) =>
      activeStatuses.includes(l.status)
    ).length;

    const totalBorrowed = loans
      .filter((l) => ["Disbursed", "Active", "NPL", "Closed"].includes(l.status))
      .reduce((sum, l) => sum + Number(l.approvedAmount || l.amountRequested), 0);

    const totalRepaid = Number(repaymentAggregate._sum.amount || 0);

    const recentApplications = loans.slice(0, 5).map((l) => ({
      id: l.id,
      purpose: l.purpose,
      amount: Number(l.amountRequested),
      status: l.status,
      appliedAt: l.appliedAt.toISOString(),
    }));

    return {
      success: true,
      data: {
        clientName: `${user.client.otherNames} ${user.client.surname}`,
        totalLoans: loans.length,
        activeLoans,
        totalBorrowed,
        totalRepaid,
        recentApplications,
      },
    };
  } catch (error) {
    return { success: false, data: null, error: (error as Error).message };
  }
}
