"use client";

import { useEffect, useState } from "react";
import { AccountsDashboard, Balance } from "@/components/admin/accounts/accounts-dashboard";
import AccountsTabs from "@/components/admin/accounts/accountstab";

type Account = {
  gl_account_id: string;
  account_code: string;
  account_name: string;
  account_type: string;
  normal_balance: string;
};

export type Transaction = {
  transaction_id: string;        // Unique ID for the transaction
  transaction_date: string;      // ISO date string
  transaction_code: string;      // Transaction code
  transaction_type: string;      // e.g., Payment, Invoice, Refund
  debit_account: string;         // Name of debit account
  credit_account: string;        // Name of credit account
  amount: number;                // Transaction amount
  status: string;                // e.g., Completed, Pending
};

export default function AccountsPage() {
  const [formattedAccounts, setFormattedAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);

  const mockTransactions: Transaction[] = [
  {
    transaction_id: "t1",
    transaction_date: new Date().toISOString(),
    transaction_code: "TRX-001",
    transaction_type: "Payment",
    debit_account: "Cash",
    credit_account: "Revenue",
    amount: 5000,
    status: "Completed",
  },
  {
    transaction_id: "t2",
    transaction_date: new Date().toISOString(),
    transaction_code: "TRX-002",
    transaction_type: "Invoice",
    debit_account: "Accounts Receivable",
    credit_account: "Revenue",
    amount: 1200,
    status: "Pending",
  },
  {
    transaction_id: "t3",
    transaction_date: new Date().toISOString(),
    transaction_code: "TRX-003",
    transaction_type: "Refund",
    debit_account: "Revenue",
    credit_account: "Cash",
    amount: 800,
    status: "Completed",
  },
];

  useEffect(() => {
    async function fetchAccounts() {
      try {
        const res = await fetch("/api/auth/chart-of-accounts");
        if (!res.ok) throw new Error("Failed to fetch accounts");

        const data = await res.json();
        const accounts = data.map((acc: any) => ({
          gl_account_id: acc.id,
          account_code: acc.accountCode,
          account_name: acc.accountName,
          account_type: acc.accountType,
          normal_balance: acc.normalBalance,
        }));

        setFormattedAccounts(accounts);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchAccounts();
  }, []);

  const balances: Balance[] = []; // mock for now
  const transactionss: any[] = []; // mock for now

  if (loading) return <p>Loading accounts...</p>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Accounts</h1>
      <p className="text-slate-500">Manage chart of accounts, transactions, and balances.</p>

      <AccountsDashboard balances={balances} />
      <AccountsTabs
        formattedAccounts={formattedAccounts}
        balances={balances}
        transactionss={mockTransactions}
      />
    </div>
  );
}