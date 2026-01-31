"use server";

import { Allocation, AvailableLoan } from "@/lib/types";
import { neon } from "@neondatabase/serverless";
import prisma from "@/lib/prisma";

const sql = neon(process.env.DATABASE_URL!);

export async function getInvestorStats(investorId: string) {
  try {
    // Get portfolio stats
    const [portfolio] = await sql`
      SELECT * FROM investor_portfolios WHERE investor_id = ${investorId}
    `;

    if (!portfolio) {
      // Create a demo portfolio for display
      return {
        totalInvested: 125000,
        totalReturns: 18750,
        activeInvestments: 8,
        averageReturn: 15.0,
        portfolioValue: 143750,
      };
    }

    const averageReturn =
      portfolio.total_invested > 0
        ? (portfolio.total_returns / portfolio.total_invested) * 100
        : 0;

    return {
      totalInvested: Number(portfolio.total_invested),
      totalReturns: Number(portfolio.total_returns),
      activeInvestments: Number(portfolio.active_investments),
      averageReturn,
      portfolioValue:
        Number(portfolio.total_invested) + Number(portfolio.total_returns),
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
        la.id,
        la.loan_application_id,
        la.allocated_amount,
        la.expected_return,
        la.actual_return,
        la.status,
        la.created_at,
        loan.loan_type,
        loan.requested_amount,
        loan.approved_amount,
        loan.interest_rate,
        loan.tenure_months,
        loan.status as loan_status,
        u.full_name as borrower_name
      FROM loan_allocations la
      JOIN loan_applications loan ON la.loan_application_id = loan.id
      JOIN applicants a ON loan.applicant_id = a.id
      JOIN users u ON a.user_id = u.id
      JOIN investor_portfolios ip ON la.investor_portfolio_id = ip.id
      WHERE ip.investor_id = ${investorId}
      ORDER BY la.created_at DESC
    `;

    return allocations as unknown as Allocation[];
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
        la.loan_type,
        la.approved_amount,
        la.interest_rate,
        la.tenure_months,
        la.purpose,
        la.status,
        la.created_at,
        u.full_name as borrower_name,
        a.city,
        a.state,
        ed.employment_status,
        ed.monthly_income,
        COALESCE(SUM(alloc.allocated_amount), 0) as already_funded
      FROM loan_applications la
      JOIN applicants a ON la.applicant_id = a.id
      JOIN users u ON a.user_id = u.id
      LEFT JOIN employment_details ed ON a.id = ed.applicant_id
      LEFT JOIN loan_allocations alloc ON la.id = alloc.loan_application_id
      WHERE la.status IN ('approved', 'disbursed')
      GROUP BY la.id, u.full_name, a.city, a.state, ed.employment_status, ed.monthly_income
      HAVING COALESCE(SUM(alloc.allocated_amount), 0) < la.approved_amount
      ORDER BY la.created_at DESC
    `;

    return loans as unknown as AvailableLoan[];
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
    // Get or create investor portfolio
    let [portfolio] = await sql`
      SELECT * FROM investor_portfolios WHERE investor_id = ${investorId}
    `;

    if (!portfolio) {
      [portfolio] = await sql`
        INSERT INTO investor_portfolios (investor_id, total_invested, total_returns, active_investments)
        VALUES (${investorId}, 0, 0, 0)
        RETURNING *
      `;
    }

    // Get loan details
    const [loan] = await sql`
      SELECT * FROM loan_applications WHERE id = ${loanApplicationId}
    `;

    if (!loan) {
      return { success: false, message: "Loan not found" };
    }

    // Calculate expected return
    const expectedReturn =
      (amount * (loan.interest_rate / 100) * loan.tenure_months) / 12;

    // Create allocation
    await sql`
      INSERT INTO loan_allocations (
        loan_application_id, investor_portfolio_id, allocated_amount, expected_return, status
      )
      VALUES (${loanApplicationId}, ${portfolio.id}, ${amount}, ${expectedReturn}, 'active')
    `;

    // Update portfolio stats
    await sql`
      UPDATE investor_portfolios
      SET 
        total_invested = total_invested + ${amount},
        active_investments = active_investments + 1,
        updated_at = NOW()
      WHERE id = ${portfolio.id}
    `;

    await prisma.auditLog.create({
      data: {
        userId: investorId,
        action: "INVEST",
        entity: "LoanAllocation",
        entityId: loanApplicationId,
        newValue: { amount, expectedReturn, loanApplicationId },
      },
    }).catch(() => {});

    return {
      success: true,
      message: `Successfully invested $${amount.toLocaleString()} in this loan.`,
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
