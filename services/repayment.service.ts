"use server";

import { ServiceResult } from "./base.service";
import type {
  Repayment,
  PaymentMethod,
  RepaymentCategory,
  Prisma,
} from "../lib/generated/prisma";
import prisma from "@/lib/prisma";

// ============================================================================
// TYPES
// ============================================================================

export interface CreateRepaymentInput {
  loanId: string;
  amount: number;
  paymentMethod: PaymentMethod;
  paymentDate: Date;
  category: RepaymentCategory;
  reference?: string;
}

type RepaymentFindManyResult = Prisma.RepaymentGetPayload<{
  include: {
    loan: {
      select: {
        id: true;
        purpose: true;
        amountRequested: true;
        approvedAmount: true;
        status: true;
        client: {
          select: {
            surname: true;
            otherNames: true;
            phoneMobile: true;
          };
        };
      };
    };
  };
}>;

export type RepaymentWithLoan = RepaymentFindManyResult;

// ============================================================================
// REPAYMENT CRUD
// ============================================================================

export async function createRepayment(
  data: CreateRepaymentInput
): Promise<ServiceResult<Repayment>> {
  try {
    const repayment = await prisma.repayment.create({
      data: {
        loanId: data.loanId,
        amount: data.amount,
        paymentMethod: data.paymentMethod,
        paymentDate: data.paymentDate,
        category: data.category,
        reference: data.reference || null,
      },
    });
    return { success: true, data: repayment };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

export async function getRepaymentsByLoanId(
  loanId: string
): Promise<ServiceResult<Repayment[]>> {
  try {
    const repayments = await prisma.repayment.findMany({
      where: { loanId },
      orderBy: { paymentDate: "desc" },
    });
    return { success: true, data: repayments };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

export async function getAllRepayments(): Promise<
  ServiceResult<RepaymentWithLoan[]>
> {
  try {
    const repayments = await prisma.repayment.findMany({
      include: {
        loan: {
          select: {
            id: true,
            purpose: true,
            amountRequested: true,
            approvedAmount: true,
            status: true,
            client: {
              select: {
                surname: true,
                otherNames: true,
                phoneMobile: true,
              },
            },
          },
        },
      },
      orderBy: { paymentDate: "desc" },
    });
    return { success: true, data: repayments };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

// ============================================================================
// LOAN REPAYMENT SUMMARY
// ============================================================================

export async function getLoanRepaymentSummary(loanId: string): Promise<
  ServiceResult<{
    totalPaid: number;
    totalOwed: number;
    repaymentCount: number;
  }>
> {
  try {
    const loan = await prisma.loanApplication.findUnique({
      where: { id: loanId },
      select: { amountRequested: true, approvedAmount: true, interestRate: true, repaymentPeriod: true },
    });

    if (!loan) {
      return { success: false, error: "Loan not found" };
    }

    const principal = Number(loan.approvedAmount || loan.amountRequested);
    const monthlyRate = Number(loan.interestRate) / 100 / 12;
    const n = loan.repaymentPeriod;
    const monthlyPayment =
      monthlyRate === 0
        ? principal / n
        : (principal * monthlyRate * Math.pow(1 + monthlyRate, n)) /
          (Math.pow(1 + monthlyRate, n) - 1);
    const totalOwed = monthlyPayment * n;

    const aggregate = await prisma.repayment.aggregate({
      where: { loanId },
      _sum: { amount: true },
      _count: true,
    });

    return {
      success: true,
      data: {
        totalPaid: Number(aggregate._sum.amount || 0),
        totalOwed,
        repaymentCount: aggregate._count,
      },
    };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}
