"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Wallet, TrendingUp, TrendingDown } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export type Transaction = {
  transaction_id: string;
  transactionDate: string;
  transactionCode: string;
  transactionType: string;
  referenceType: string;
  referenceId: string;
  debitAccount: string;
  creditAccount: string;
  amount: number;
  paymentMethod: string;
  description: string;
  status: string;
};

type TransactionSummary = {
  type: string;
  total: number;
};

type TransactionsDashboardProps = {
  transactions: Transaction[];
};

export function TransactionsDashboard({ transactions }: TransactionsDashboardProps) {
  // List of types to display
  const types = [
    "Disbursement",
    "Repayment",
    "Provision",
    "Penalty",
    "Expense",
    "Recovery",
    "Invest",
  ];

  // Compute totals per transaction type safely
const summary: TransactionSummary[] = types.map((t) => ({
  type: t,
  total: transactions
    .filter((tx) => tx.transactionType === t)
    .reduce((sum, tx) => sum + Number(tx.amount || 0), 0), // convert to number
}));

  return (
    <div className="grid gap-4 sm:grid-cols-3 md:grid-cols-4">
      {summary.map((s) => (
        // <Card key={s.type}>
        //   <CardContent className="flex gap-4 p-4 items-center">
        //     <Wallet />
        //     <div>
        //       <p className="text-sm text-slate-500">{s.type}</p>
        //       <p className="text-xl font-bold">{formatCurrency(s.total)}</p>
        //     </div>
        //   </CardContent>
        // </Card>

        <Card
  key={s.type}
  className="border-0 bg-gradient-to-br from-[#400000] to-[#5a0000] shadow-lg rounded-2xl overflow-hidden"
>
  <CardContent className="flex items-center gap-4 p-5">
    
    {/* Icon Container */}
    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FFCC00]/15 border border-[#FFD700]/30">
      <Wallet className="h-7 w-7 text-[#FFD700]" />
    </div>

    {/* Content */}
    <div className="flex flex-col">
      <p className="text-sm font-medium tracking-wide text-[#EDEDED]/80">
        {s.type}
      </p>

      <p className="text-2xl font-bold text-[#FFCC00]">
        {formatCurrency(s.total)}
      </p>
    </div>
  </CardContent>
</Card>
      ))}
    </div>
  );
}


export  function AccountsDashboard() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    async function fetchTransactions() {
      const res = await fetch("/api/auth/transactions");
      const data = await res.json();
      setTransactions(data);
    }
    fetchTransactions();
  }, []);

  return (
    <div className="space-y-6 p-4">
      <h1 className="text-2xl font-bold">Transactions Dashboard</h1>
      <TransactionsDashboard transactions={transactions} />
    </div>
  );
}