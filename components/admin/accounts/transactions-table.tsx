"use client";

import { useState, useEffect } from "react";
import { formatCurrency } from "@/lib/utils";

// Transaction type
export type Transaction = {
  transaction_id: string;
  transaction_date: string; // ISO string
  transaction_code: string;
  transaction_type: string;
  debit_account: string;
  credit_account: string;
  amount: number;
  status: string;
};

// Account type
export type Account = {
  gl_account_id: string;
  account_code: string;
  account_name: string;
  account_type: string;
  normal_balance: string;
};

// TransactionsTable props
type TransactionsTableProps = {
  transactions: Transaction[];
};

// Table component
export function TransactionsTable({ transactions }: TransactionsTableProps) {
  return (
    <div className="overflow-x-auto rounded-lg border bg-white shadow-sm">
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 text-left font-medium text-gray-700">Date</th>
            <th className="px-4 py-2 text-left font-medium text-gray-700">Code</th>
            <th className="px-4 py-2 text-left font-medium text-gray-700">Type</th>
            <th className="px-4 py-2 text-left font-medium text-gray-700">Debit</th>
            <th className="px-4 py-2 text-left font-medium text-gray-700">Credit</th>
            <th className="px-4 py-2 text-right font-medium text-gray-700">Amount</th>
            <th className="px-4 py-2 text-left font-medium text-gray-700">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {transactions.map((tx) => (
            <tr key={tx.transaction_id} className="hover:bg-gray-50 transition-colors duration-150">
              <td className="px-4 py-2">{new Date(tx.transaction_date).toLocaleDateString()}</td>
              <td className="px-4 py-2">{tx.transaction_code}</td>
              <td className="px-4 py-2">{tx.transaction_type}</td>
              <td className="px-4 py-2">{tx.debit_account}</td>
              <td className="px-4 py-2">{tx.credit_account}</td>
              <td className="px-4 py-2 text-right font-medium text-gray-800">{formatCurrency(tx.amount)}</td>
              <td className="px-4 py-2">
                <span
                  className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                    tx.status.toLowerCase() === "completed"
                      ? "bg-green-100 text-green-800"
                      : tx.status.toLowerCase() === "pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {tx.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Wrapper component with modal
export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [formData, setFormData] = useState({
    transaction_code: "",
    transaction_type: "",
    debit_account: "",
    credit_account: "",
    amount: 0,
  });

  // Fetch chart of accounts
  useEffect(() => {
    async function fetchAccounts() {
      try {
        const res = await fetch("/api/auth/chart-of-accounts");
        const data = await res.json();
        const accountsData: Account[] = data.map((acc: any) => ({
          gl_account_id: acc.id,
          account_code: acc.accountCode,
          account_name: acc.accountName,
          account_type: acc.accountType,
          normal_balance: acc.normalBalance,
        }));
        setAccounts(accountsData);
      } catch (err) {
        console.error(err);
      }
    }
    fetchAccounts();
  }, []);

  // Handle submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newTransaction: Transaction = {
      transaction_id: "t" + (transactions.length + 1),
      transaction_date: new Date().toISOString(),
      transaction_code: formData.transaction_code,
      transaction_type: formData.transaction_type,
      debit_account: formData.debit_account,
      credit_account: formData.credit_account,
      amount: formData.amount,
      status: "Pending",
    };
    setTransactions([...transactions, newTransaction]);
    setOpenModal(false);
    setFormData({ transaction_code: "", transaction_type: "", debit_account: "", credit_account: "", amount: 0 });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Transactions</h1>

      <button
        onClick={() => setOpenModal(true)}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium shadow"
      >
        + Add Transaction
      </button>

      {/* Modal */}
      {openModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
            <h2 className="text-lg font-bold mb-4">Add Transaction</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Transaction Code"
                value={formData.transaction_code}
                onChange={(e) => setFormData({ ...formData, transaction_code: e.target.value })}
                className="w-full border px-3 py-2 rounded-md"
                required
              />
              <input
                type="text"
                placeholder="Transaction Type"
                value={formData.transaction_type}
                onChange={(e) => setFormData({ ...formData, transaction_type: e.target.value })}
                className="w-full border px-3 py-2 rounded-md"
                required
              />
              <select
                value={formData.debit_account}
                onChange={(e) => setFormData({ ...formData, debit_account: e.target.value })}
                className="w-full border px-3 py-2 rounded-md"
                required
              >
                <option value="">Select Debit Account</option>
                {accounts.map((acc) => (
                  <option key={acc.gl_account_id} value={acc.account_name}>
                    {acc.account_name} ({acc.account_code})
                  </option>
                ))}
              </select>
              <select
                value={formData.credit_account}
                onChange={(e) => setFormData({ ...formData, credit_account: e.target.value })}
                className="w-full border px-3 py-2 rounded-md"
                required
              >
                <option value="">Select Credit Account</option>
                {accounts.map((acc) => (
                  <option key={acc.gl_account_id} value={acc.account_name}>
                    {acc.account_name} ({acc.account_code})
                  </option>
                ))}
              </select>
              <input
                type="number"
                placeholder="Amount"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                className="w-full border px-3 py-2 rounded-md"
                required
              />
              <div className="flex justify-end space-x-2">
                <button type="button" onClick={() => setOpenModal(false)} className="px-4 py-2 rounded-md border">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700">
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <TransactionsTable transactions={transactions} />
    </div>
  );
}