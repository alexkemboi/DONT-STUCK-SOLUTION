"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import prisma from "@/lib/prisma";

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  href: string;
}

export interface NotificationsData {
  count: number;
  items: NotificationItem[];
}

export async function getAdminNotifications(): Promise<NotificationsData> {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const pendingLoans = await prisma.loanApplication.findMany({
      where: {
        status: "Pending",
        appliedAt: { gte: sevenDaysAgo },
      },
      orderBy: { appliedAt: "desc" },
      take: 10,
      select: {
        id: true,
        purpose: true,
        amountRequested: true,
        appliedAt: true,
        client: {
          select: { surname: true, otherNames: true },
        },
      },
    });

    return {
      count: pendingLoans.length,
      items: pendingLoans.map((loan) => ({
        id: loan.id,
        title: "New Loan Application",
        description: `${loan.client.otherNames} ${loan.client.surname} — ${loan.purpose}`,
        timestamp: loan.appliedAt.toISOString(),
        href: "/dss/admin/loans",
      })),
    };
  } catch {
    return { count: 0, items: [] };
  }
}

export async function getClientNotifications(): Promise<NotificationsData> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return { count: 0, items: [] };
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id as string },
      select: { client: { select: { id: true } } },
    });

    if (!user?.client) {
      return { count: 0, items: [] };
    }

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const reviewedLoans = await prisma.loanApplication.findMany({
      where: {
        clientId: user.client.id,
        status: { in: ["Approved", "Rejected", "Disbursed"] },
        reviewedAt: { gte: sevenDaysAgo },
      },
      orderBy: { reviewedAt: "desc" },
      take: 10,
      select: {
        id: true,
        purpose: true,
        status: true,
        reviewedAt: true,
      },
    });

    return {
      count: reviewedLoans.length,
      items: reviewedLoans.map((loan) => ({
        id: loan.id,
        title: `Loan ${loan.status}`,
        description: `Your loan for "${loan.purpose}" has been ${loan.status.toLowerCase()}`,
        timestamp: (loan.reviewedAt || new Date()).toISOString(),
        href: "/dss/client/loans",
      })),
    };
  } catch {
    return { count: 0, items: [] };
  }
}
