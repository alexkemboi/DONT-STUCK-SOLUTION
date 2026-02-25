import { formatCurrency } from "@/lib/utils";


// Define the transaction type
export type Transaction = {
  transaction_id: string;
  transaction_date: string; // ISO date string
  transaction_code: string;
  transaction_type: string;
  debit_account: string;
  credit_account: string;
  amount: number;
  status: string;
};

// Props type
type TransactionsTableProps = {
  transactions: Transaction[];
};

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
        {transactions.map(tx => (
          <tr
            key={tx.transaction_id}
            className="hover:bg-gray-50 transition-colors duration-150"
          >
            <td className="px-4 py-2">{new Date(tx.transaction_date).toLocaleDateString()}</td>
            <td className="px-4 py-2">{tx.transaction_code}</td>
            <td className="px-4 py-2">{tx.transaction_type}</td>
            <td className="px-4 py-2">{tx.debit_account}</td>
            <td className="px-4 py-2">{tx.credit_account}</td>
            <td className="px-4 py-2 text-right font-medium text-gray-800">
              {formatCurrency(tx.amount)}
            </td>
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
