import {
  getChartOfAccountsAction,
  getTransactionsAction,
  getAccountBalancesAction,
} from "@/app/actions/accounts";

import { Transaction, TransactionsTable } from "@/components/admin/accounts/transactions-table";
import { Account } from "@/components/admin/accounts/accounts-table";
import { AccountsDashboard, Balance } from "@/components/admin/accounts/accounts-dashboard";
import AccountsTabs from "@/components/admin/accounts/accountstab";
export default async function AccountsPage() {

  const [accountsRes, txRes, balancesRes] = await Promise.all([
    getChartOfAccountsAction(),
    getTransactionsAction(),
    getAccountBalancesAction(),
  ]);

  const accounts = accountsRes.data || [];
  const transactions = txRes.data || [];
  const rawBalances = balancesRes.data;



  

const balances: Balance[] = Array.isArray(rawBalances)
  ? rawBalances.map((b: any) => ({
      gl_account_id: b.gl_account_id || b.id || "", // make sure to provide an id
      account_type: b.account_type,
      balance: b.balance,
    }))
  : [];

//   const formattedAccounts: Account[] = accounts.map(acc => ({
//   gl_account_id: acc.id,
//   account_code: acc.accountCode,
//   account_name: acc.accountName,
//   account_type: acc.accountType,
//   normal_balance: acc.normalBalance,
// }));


// --- Mock Accounts ---
const formattedAccounts: Account[] = [
  {
    gl_account_id: "1",
    account_code: "1001",
    account_name: "Cash",
    account_type: "Asset",
    normal_balance: "Debit",
  },
  {
    gl_account_id: "2",
    account_code: "1002",
    account_name: "Bank",
    account_type: "Asset",
    normal_balance: "Debit",
  },
  {
    gl_account_id: "3",
    account_code: "2001",
    account_name: "Accounts Payable",
    account_type: "Liability",
    normal_balance: "Credit",
  },
  {
    gl_account_id: "4",
    account_code: "3001",
    account_name: "Equity",
    account_type: "Liability",
    normal_balance: "Credit",
  },
];


// const transactionss: Transaction[] = Array.isArray(transactions)
//   ? transactions.map((tx: any) => ({
//       transaction_id: tx.id,
//       transaction_date: tx.createdAt.toISOString(), // or tx.transactionDate if exists
//       transaction_code: tx.transactionCode,
//       transaction_type: tx.transactionType,
//       debit_account: tx.debitAccount,
//       credit_account: tx.creditAccount,
//       amount: tx.amount,
//       status: tx.status,
//     }))
//   : [
//       // fallback mock data
//       {
//         transaction_id: "t1",
//         transaction_date: new Date().toISOString(),
//         transaction_code: "TRX-001",
//         transaction_type: "Payment",
//         debit_account: "Cash",
//         credit_account: "Revenue",
//         amount: 5000,
//         status: "Completed",
//       },
//     ];


const transactionss: Transaction[] =
 [
      // fallback mock data
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
    ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Accounts</h1>
        <p className="text-slate-500">
          Manage chart of accounts, transactions, and balances.
        </p>
      </div>

      <AccountsDashboard balances={balances} />
      <AccountsTabs formattedAccounts={formattedAccounts} balances={balances} transactionss={transactionss}/>
    </div>
  );
}
