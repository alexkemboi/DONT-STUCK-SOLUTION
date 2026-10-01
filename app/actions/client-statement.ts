"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import prisma from "@/lib/prisma";

const ARREARS_DAILY_RATE = 0.0135; // 1.35% per day, accrued on the outstanding balance past due date
const LOAN_TYPE_LABEL = "E-Loan";

export interface ClientStatementLoan {
  loanRef: string;
  type: string;
  approvedAmount: number;
  interestRate: number;
  dueDate: string;
  status: "PAID" | "ON TRACK" | "OVERDUE";
  paidSoFar: number;
  balance: number;
  arrears: number;
}

export interface ClientStatementData {
  company: {
    name: string;
    tagline: string | null;
    email: string | null;
    phone: string | null;
    address: string | null;
    city: string | null;
    country: string | null;
  };
  client: {
    fullName: string;
    phone: string;
    idPassportNo: string;
  };
  statementDate: string;
  summary: {
    totalDisbursed: number;
    totalRepaid: number;
    arrearsAccrued: number;
    totalOutstanding: number;
  };
  loans: ClientStatementLoan[];
}

function formatLoanRef(loanNumber: number) {
  return `L${String(loanNumber).padStart(4, "0")}`;
}

export async function getClientStatementAction(
  clientId: string
): Promise<{ success: boolean; data?: ClientStatementData; error?: string }> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return { success: false, error: "Unauthorized" };
    }

    const requester = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });

    if (requester?.role !== "Admin") {
      return { success: false, error: "Admin access required" };
    }

    const [client, company] = await Promise.all([
      prisma.client.findUnique({
        where: { id: clientId },
        include: {
          loanApplications: {
            include: {
              repaymentSchedule: {
                orderBy: { installmentNumber: "asc" },
              },
            },
            orderBy: { loanNumber: "asc" },
          },
        },
      }),
      prisma.company.findFirst(),
    ]);

    if (!client) {
      return { success: false, error: "Client not found" };
    }

    const now = new Date();
    const statementDate = now.toISOString();

    const loans: ClientStatementLoan[] = client.loanApplications.map((loan) => {
      const schedule = loan.repaymentSchedule;

      const totalOwed = schedule.reduce(
        (sum, s) => sum + Number(s.scheduledPayment),
        0
      );
      const paidSoFar = schedule.reduce(
        (sum, s) => sum + Number(s.actualAmountPaid),
        0
      );
      const balance = Math.max(0, totalOwed - paidSoFar);

      const allPaid = schedule.length > 0 && schedule.every((s) => s.status === "Paid");
      const unpaidInstallments = schedule.filter((s) => s.status !== "Paid");
      const overdueInstallments = unpaidInstallments.filter(
        (s) => s.status === "Overdue" || (s.dueDate < now && Number(s.remainingPrincipal) + Number(s.remainingInterest) > 0)
      );

      const status: ClientStatementLoan["status"] = allPaid
        ? "PAID"
        : overdueInstallments.length > 0
        ? "OVERDUE"
        : "ON TRACK";

      const dueDate = allPaid
        ? schedule[schedule.length - 1]?.dueDate
        : unpaidInstallments[0]?.dueDate ?? schedule[schedule.length - 1]?.dueDate ?? loan.startDate ?? loan.appliedAt;

      const arrears = overdueInstallments.reduce((sum, s) => {
        const outstanding = Number(s.remainingPrincipal) + Number(s.remainingInterest);
        const daysOverdue = Math.max(
          0,
          Math.floor((now.getTime() - s.dueDate.getTime()) / (1000 * 60 * 60 * 24))
        );
        return sum + outstanding * ARREARS_DAILY_RATE * daysOverdue;
      }, 0);

      return {
        loanRef: formatLoanRef(loan.loanNumber),
        type: LOAN_TYPE_LABEL,
        approvedAmount: Number(loan.approvedAmount || loan.amountRequested),
        interestRate: Number(loan.interestRate),
        dueDate: (dueDate ?? now).toISOString(),
        status,
        paidSoFar: Math.round(paidSoFar),
        balance: Math.round(balance),
        arrears: Math.round(arrears),
      };
    });

    const summary = {
      totalDisbursed: Math.round(
        loans.reduce((sum, l) => sum + l.approvedAmount, 0)
      ),
      totalRepaid: Math.round(loans.reduce((sum, l) => sum + l.paidSoFar, 0)),
      arrearsAccrued: Math.round(loans.reduce((sum, l) => sum + l.arrears, 0)),
      totalOutstanding: Math.round(
        loans.reduce((sum, l) => sum + l.balance + l.arrears, 0)
      ),
    };

    return {
      success: true,
      data: {
        company: {
          name: company?.name ?? "Dont Stuck Solutions",
          tagline: company?.tagline ?? null,
          email: company?.email ?? null,
          phone: company?.phone ?? null,
          address: company?.address ?? null,
          city: company?.city ?? null,
          country: company?.country ?? null,
        },
        client: {
          fullName: `${client.surname} ${client.otherNames}`,
          phone: client.phoneMobile,
          idPassportNo: client.idPassportNo,
        },
        statementDate,
        summary,
        loans,
      },
    };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}
