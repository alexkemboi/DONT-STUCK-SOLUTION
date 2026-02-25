"use client";

import { useState } from "react";
import  AccountsTable, { Account, Balance }  from "@/components/admin/accounts/accounts-table";
import { Transaction, TransactionsTable } from "@/components/admin/accounts/transactions-table";

export default function AccountsTabs({
  formattedAccounts,
  balances,
  transactionss,
}: {
  formattedAccounts: Account[];
  balances: Balance[];
  transactionss: Transaction[];
}) {
  const [activeTab, setActiveTab] = useState<"accounts" | "transactions">(
    "accounts"
  );

  return (
    <div className="bg-white rounded-lg border shadow-sm">
      {/* Tabs header */}
      <div className="border-b px-6">
        <nav className="flex gap-6">
          <button
            onClick={() => setActiveTab("accounts")}
            className={`py-4 text-sm font-medium border-b-2 transition ${
              activeTab === "accounts"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Accounts
          </button>

          <button
            onClick={() => setActiveTab("transactions")}
            className={`py-4 text-sm font-medium border-b-2 transition ${
              activeTab === "transactions"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            Transactions
          </button>
        </nav>
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === "accounts" && (
          <AccountsTable
            accounts={formattedAccounts}
            balances={balances}
          />
        )}

        {activeTab === "transactions" && (
          <TransactionsTable transactions={transactionss} />
        )}
      </div>
    </div>
  );
}
