// app/actions/accounts.ts
"use server";

import { prisma } from "@/lib/prisma";

export async function getChartOfAccountsAction() {
  try {
    const accounts = await prisma.chartOfAccount.findMany({
      where: { isActive: true },
      orderBy: { accountCode: "asc" },
    });
    return { data: accounts };
  } catch (error) {
    return { error: "Failed to load chart of accounts" };
  }
}

export async function getTransactionsAction() {
  try {
    const transactions = await prisma.transaction.findMany({
      orderBy: { transactionDate: "desc" },
    });
    return { data: transactions };
  } catch (error) {
    return { error: "Failed to load transactions" };
  }
}

export async function getAccountBalancesAction() {
  try {
    const balances = await prisma.$queryRaw`
      SELECT 
        account_code,
        account_name,
        account_type,
        SUM(
          CASE 
            WHEN debit_account = account_code THEN amount
            WHEN credit_account = account_code THEN -amount
            ELSE 0
          END
        ) AS balance
      FROM transactions t
      JOIN chart_of_accounts coa 
        ON coa.account_code IN (t.debit_account, t.credit_account)
      GROUP BY account_code, account_name, account_type
    `;
    return { data: balances };
  } catch (error) {
    return { error: "Failed to calculate balances" };
  }
}
