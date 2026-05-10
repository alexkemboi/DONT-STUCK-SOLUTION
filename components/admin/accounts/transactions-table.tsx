"use client";

import { useState, useEffect } from "react";
import { formatCurrency } from "@/lib/utils";
import { toast } from "sonner";

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

export type Account = {
  gl_account_id: string;
  account_code: string;
  account_name: string;
  account_type: string;
  normal_balance: string;
};

type TransactionsTableProps = {
  transactions: Transaction[];
};

export function TransactionsTable({ transactions }: TransactionsTableProps) {
  let runningBalance = 0;

  return (
    <div className="overflow-x-auto rounded-lg border bg-white shadow-sm">
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 text-left font-medium text-gray-700">Date</th>
            <th className="px-4 py-2 text-left font-medium text-gray-700">Code</th>
            <th className="px-4 py-2 text-left font-medium text-gray-700">Type</th>
            <th className="px-4 py-2 text-left font-medium text-gray-700">Reference</th>
            <th className="px-4 py-2 text-left font-medium text-gray-700">Debit</th>
            <th className="px-4 py-2 text-left font-medium text-gray-700">Credit</th>
            <th className="px-4 py-2 text-right font-medium text-gray-700">Amount</th>
            <th className="px-4 py-2 text-right font-medium text-gray-700">Balance</th>
            <th className="px-4 py-2 text-left font-medium text-gray-700">Status</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-100">
          {transactions.map((tx) => {
            runningBalance += Number(tx.amount);

            return (
              <tr key={tx.transaction_id} className="hover:bg-gray-50">
                <td className="px-4 py-2">{new Date(tx.transactionDate).toLocaleDateString()}</td>
                <td className="px-4 py-2">{tx.transactionCode}</td>
                <td className="px-4 py-2">{tx.transactionType}</td>
                <td className="px-4 py-2">{`${tx.referenceType} (${tx.referenceId})`}</td>
                <td className="px-4 py-2">{tx.debitAccount}</td>
                <td className="px-4 py-2">{tx.creditAccount}</td>
                <td className="px-4 py-2 text-right font-medium">{formatCurrency(tx.amount)}</td>
                <td className="px-4 py-2 text-right font-semibold text-gray-700">{formatCurrency(runningBalance)}</td>
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
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [loadingAccounts, setLoadingAccounts] = useState(true);

  const [formData, setFormData] = useState({
    transaction_code: "",
    transaction_type: "",
    reference_type: "",
    reference_id: "",
    debit_account: "",
    credit_account: "",
    amount: 0,
    payment_method: "",
    description: "",
  });

  // Fetch accounts
  useEffect(() => {
    async function fetchAccounts() {
      try {
        const res = await fetch("/api/auth/chart-of-accounts");
        const data = await res.json();
        setAccounts(
          data.map((acc: any) => ({
            gl_account_id: acc.id,
            account_code: acc.accountCode,
            account_name: acc.accountName,
            account_type: acc.accountType,
            normal_balance: acc.normalBalance,
          }))
        );
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingAccounts(false);
      }
    }
    fetchAccounts();
  }, []);

  // Fetch transactions
  useEffect(() => {
    async function fetchTransactions() {
      const res = await fetch("/api/auth/transactions");
      const data = await res.json();
      setTransactions(data);
    }
    fetchTransactions();
  }, []);

 const generateCode = () => {
  const now = Date.now();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();

  return `TRX-${now}-${random}`;
};

  const openNewTransaction = () => {
    setFormData({
      transaction_code: generateCode(),
      transaction_type: "",
      reference_type: "",
      reference_id: "",
      debit_account: "",
      credit_account: "",
      amount: 0,
      payment_method: "",
      description: "",
    });
    setOpenModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.transaction_type ||      
      !formData.debit_account ||
      !formData.credit_account ||
      !formData.payment_method
    ) {
      alert("Please fill all required fields.");
      return;
    }

    const newTransaction = {
      transaction_code: formData.transaction_code,
      transaction_type: formData.transaction_type,
      reference_type: 'Loan',
      reference_id:  'DSS',
      debit_account: formData.debit_account,
      credit_account: formData.credit_account,
      amount: Number(formData.amount),
      payment_method: formData.payment_method,
      transaction_date: new Date().toISOString(),
      description: formData.description || "",
      status: "Completed",
      created_by: "admin",
    };

    try {
const promise = fetch("/api/auth/transactions", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(newTransaction),
});

toast.promise(promise, {
  loading: "Saving transaction...",
  success: "Transaction saved successfully",
  error: "Failed to save transaction",
});

const res = await promise;

if (!res.ok) {
  throw new Error("Failed to save transaction");
}

      const saved = await res.json();
      setTransactions([...transactions, saved]);
      setOpenModal(false);

      setFormData({
        transaction_code: "",
        transaction_type: "",
        reference_type: "",
        reference_id: "",
        debit_account: "",
        credit_account: "",
        amount: 0,
        payment_method: "",
        description: "",
      });
    } catch (err) {
      console.error("Error saving transaction:", err);
    }
  };
const transactionTypes = ["Disbursement", "Repayment", "Provision", "Penalty", "Expense", "Recovery", "Invest"] as const;


  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Transactions</h1>

      <button
        onClick={openNewTransaction}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium shadow"
      >
        + Add Transaction
      </button>

      {openModal && (
        <div
          className="fixed inset-0 bg-black/30 flex items-center justify-center"
          onClick={() => setOpenModal(false)}
        >
          <div
            className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-bold mb-4">Add Transaction</h2>
            <form onSubmit={handleSubmit} className="space-y-4">

              <input
                type="text"
                value={formData.transaction_code}
                readOnly
                className="w-full border px-3 py-2 rounded-md bg-gray-50"
              />

              {/* Transaction Type */}
         <select
              value={formData.transaction_type}
              onChange={(e) => setFormData({ ...formData, transaction_type: e.target.value })}
               className="w-full border px-3 py-2 rounded-md"
              required
            >
              <option value="">Select Transaction Type</option>
              {transactionTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>

              {/* Reference Type 
              <select
                value={formData.reference_type}
                onChange={(e) => setFormData({ ...formData, reference_type: e.target.value })}
                className="w-full border px-3 py-2 rounded-md"
                required
              >
                <option value="">Select Reference Type</option>
                <option value="Loan">Loan</option>
                <option value="Client">Client</option>
                <option value="Investor">Investor</option>
                <option value="Expense">Expense</option>
                 <option value="Debtor">Debtor</option>
              </select>*/}

              {/* Reference ID */}
              {/* <input
                type="text"
                placeholder="Reference ID"
                value={formData.reference_id}
                onChange={(e) => setFormData({ ...formData, reference_id: e.target.value })}
                className="w-full border px-3 py-2 rounded-md"
              /> */}

              {/* Debit Account */}
              <select
                value={formData.debit_account}
                onChange={(e) => setFormData({ ...formData, debit_account: e.target.value })}
                className="w-full border px-3 py-2 rounded-md"
                required
              >
                <option value="">Select Debit Account</option>
                {loadingAccounts
                  ? <option>Loading...</option>
                  : accounts.map(acc => (
                    <option key={acc.gl_account_id} value={acc.account_code}>
                      {acc.account_name} ({acc.account_code})
                    </option>
                  ))}
              </select>

              {/* Credit Account */}
              <select
                value={formData.credit_account}
                onChange={(e) => setFormData({ ...formData, credit_account: e.target.value })}
                className="w-full border px-3 py-2 rounded-md"
                required
              >
                <option value="">Select Credit Account</option>
                {accounts.map(acc => (
                  <option key={acc.gl_account_id} value={acc.account_code}>
                    {acc.account_name} ({acc.account_code})
                  </option>
                ))}
              </select>

              {/* Payment Method */}
              <select
                value={formData.payment_method}
                onChange={(e) => setFormData({ ...formData, payment_method: e.target.value })}
                className="w-full border px-3 py-2 rounded-md"
                required
              >
                <option value="">Select Payment Method</option>
                <option value="Cash">Cash</option>
                <option value="Bank">Bank</option>
                <option value="Mpesa">Mpesa</option>
              </select>

              {/* Amount */}
              <input
                type="number"
                placeholder="Amount"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                className="w-full border px-3 py-2 rounded-md"
                required
              />

              {/* Description */}
              <input
                type="text"
                placeholder="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full border px-3 py-2 rounded-md"
              />

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setOpenModal(false)}
                  className="px-4 py-2 rounded-md border"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
                >
                  Save Transaction
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