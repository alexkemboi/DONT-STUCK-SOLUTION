"use server";

import { Allocation, AvailableLoan } from "@/lib/types";
import { neon } from "@neondatabase/serverless";
import prisma from "@/lib/prisma";

const sql = neon(process.env.DATABASE_URL!);

export async function getInvestorStats(investorId: string) {
  try {
    // Get portfolio stats by aggregating from InvestorAllocation
    const [stats] = await sql`
      SELECT
        SUM(allocated_amount) AS total_invested,
        SUM(actual_return) AS total_returns,
        COUNT(DISTINCT loan_id) AS active_investments
      FROM investor_allocations
      WHERE investor_id = ${investorId}
    `;

    const totalInvested = Number(stats?.total_invested || 0);
    const totalReturns = Number(stats?.total_returns || 0);
    const activeInvestments = Number(stats?.active_investments || 0);

    const averageReturn =
      totalInvested > 0
        ? (totalReturns / totalInvested) * 100
        : 0;

    return {
      totalInvested,
      totalReturns,
      activeInvestments,
      averageReturn,
      portfolioValue: totalInvested + totalReturns,
    };
  } catch (error) {
    console.error("Error fetching investor stats:", error);
    return {
      totalInvested: 0,
      totalReturns: 0,
      activeInvestments: 0,
      averageReturn: 0,
      portfolioValue: 0,
    };
  }
}

export async function getInvestorAllocations(investorId: string): Promise<Allocation[]> {
  try {
    const allocations = await sql`
      SELECT
        ia.id,
        ia.loan_id,
        ia.allocated_amount,
        ia.expected_return,
        ia.actual_return,
        la.status, -- LoanApplication status
        ia.created_at,
        la.purpose,
        la.amount_requested,
        la.approved_amount,
        la.interest_rate,
        la.repayment_period AS tenure_months,
        c.surname || ' ' || c.other_names AS borrower_name
      FROM investor_allocations ia
      JOIN loan_applications la ON ia.loan_id = la.id
      JOIN clients c ON la.client_id = c.id
      WHERE ia.investor_id = ${investorId}
      ORDER BY ia.created_at DESC
    `;

    return allocations.map((alloc: any) => ({
      id: alloc.id,
      loanId: alloc.loan_id,
      allocatedAmount: Number(alloc.allocated_amount),
      expectedReturn: Number(alloc.expected_return),
      actualReturn: Number(alloc.actual_return),
      status: alloc.status,
      createdAt: alloc.created_at,
      loanPurpose: alloc.purpose,
      loanAmountRequested: Number(alloc.amount_requested),
      loanApprovedAmount: Number(alloc.approved_amount),
      loanInterestRate: Number(alloc.interest_rate),
      loanTenureMonths: alloc.tenure_months,
      borrowerName: alloc.borrower_name,
    })) as Allocation[];
  } catch (error) {
    console.error("Error fetching allocations:", error);
    return [];
  }
}

export async function getAvailableLoansForInvestment(): Promise<AvailableLoan[]> {
  try {
    const loans = await sql`
      SELECT
        la.id,
        la.purpose,
        la.approved_amount,
        la.interest_rate,
        la.repayment_period AS tenure_months,
        la.status,
        la.created_at,
        c.surname || ' ' || c.other_names AS borrower_name,
        ca.town_city AS city,
        ca.location AS state,
        ed.employment_type AS employment_status,
        ed.net_salary AS monthly_income,
        COALESCE(SUM(ia.allocated_amount), 0) AS already_funded
      FROM loan_applications la
      JOIN clients c ON la.client_id = c.id
      LEFT JOIN client_addresses ca ON c.id = ca.client_id
      LEFT JOIN employment_details ed ON c.id = ed.client_id
      LEFT JOIN investor_allocations ia ON la.id = ia.loan_id
      WHERE la.status IN ('Approved', 'Disbursed')
      GROUP BY la.id, c.surname, c.other_names, ca.town_city, ca.location, ed.employment_type, ed.net_salary
      HAVING COALESCE(SUM(ia.allocated_amount), 0) < la.approved_amount
      ORDER BY la.created_at DESC
    `;

    return loans.map((loan: any) => ({
      id: loan.id,
      loanType: loan.purpose, // Mapping purpose to loanType for consistency with original type
      approvedAmount: Number(loan.approved_amount),
      interestRate: Number(loan.interest_rate),
      tenureMonths: loan.tenure_months,
      purpose: loan.purpose,
      status: loan.status,
      createdAt: loan.created_at,
      borrowerName: loan.borrower_name,
      city: loan.city,
      state: loan.state,
      employmentStatus: loan.employment_status,
      monthlyIncome: Number(loan.monthly_income),
      alreadyFunded: Number(loan.already_funded),
    })) as AvailableLoan[];
  } catch (error) {
    console.error("Error fetching available loans:", error);
    return [];
  }
}

export async function investInLoan(
  investorId: string,
  loanApplicationId: string,
  amount: number
) {
  try {
    // Get investor details
    const investor = await prisma.investor.findUnique({
      where: { id: investorId },
    });

    if (!investor) {
      return { success: false, message: "Investor not found" };
    }

    // Get loan details
    const loan = await prisma.loanApplication.findUnique({
      where: { id: loanApplicationId },
    });

    if (!loan) {
      return { success: false, message: "Loan not found" };
    }

    // Calculate expected return
    const expectedReturn =
      (amount * (Number(loan.interestRate) / 100) * loan.repaymentPeriod) / 12;

    // Create allocation
    await prisma.investorAllocation.create({
      data: {
        investorId: investor.id,
        loanId: loan.id,
        allocatedAmount: amount,
        expectedReturn: expectedReturn,
        allocationDate: new Date(),
      },
    });

    // Update investor's total invested amount
    await prisma.investor.update({
      where: { id: investor.id },
      data: {
        investedAmount: {
          increment: amount,
        },
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: investor.userId as string, // Assuming investor has a userId
        action: "INVEST",
        entity: "InvestorAllocation",
        entityId: loanApplicationId,
        newValue: { amount, expectedReturn, loanApplicationId },
      },
    }).catch(() => {});

    return {
      success: true,
      message: `Successfully invested ${amount.toLocaleString()} in this loan.`,
    };
  } catch (error) {
    console.error("Error investing in loan:", error);
    return { success: false, message: "Failed to process investment" };
  }
}

// Get monthly performance data for charts
export async function getMonthlyPerformance(investorId: string) {
  // Return demo data for visualization
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const currentMonth = new Date().getMonth();

  return months.slice(0, currentMonth + 1).map((month, index) => ({
    month,
    invested: 10000 + index * 2000 + Math.random() * 5000,
    returns: 1000 + index * 300 + Math.random() * 500,
  }));
}
