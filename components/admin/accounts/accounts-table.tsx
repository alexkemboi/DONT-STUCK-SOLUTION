"use client";
import { formatCurrency } from "@/lib/utils";
import { MoreVertical, Trash2, Edit, Eye } from "lucide-react";
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/react";
// Define the types
export type Balance = {
  gl_account_id: string;
  balance: number;
};

export type Account = {
  gl_account_id: string;
  account_code: string;
  account_name: string;
  account_type: string;
  normal_balance: string;
};

type AccountsTableProps = {
  accounts: Account[];
  balances: Balance[];
};

export default function AccountsTable({ accounts, balances }: AccountsTableProps) {
  const balanceMap = Object.fromEntries(
    balances.map(b => [b.gl_account_id, b.balance])
  );

 // optional for dropdown

return (
  <div className="overflow-x-auto rounded-lg border bg-white shadow-md">
    <table className="min-w-full divide-y divide-gray-200 text-sm">
      <thead className="bg-gray-100">
        <tr>
          <th className="px-6 py-3 text-left font-semibold text-gray-700 uppercase tracking-wide">
            Code
          </th>
          <th className="px-6 py-3 text-left font-semibold text-gray-700 uppercase tracking-wide">
            Name
          </th>
          <th className="px-6 py-3 text-left font-semibold text-gray-700 uppercase tracking-wide">
            Type
          </th>
          <th className="px-6 py-3 text-left font-semibold text-gray-700 uppercase tracking-wide">
            Normal
          </th>
          <th className="px-6 py-3 text-right font-semibold text-gray-700 uppercase tracking-wide">
            Balance
          </th>
          <th className="px-6 py-3 text-right font-semibold text-gray-700 uppercase tracking-wide">
            Actions
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-100">
        {accounts.map(acc => (
         <tr key={acc.gl_account_id} className="hover:bg-gray-50 transition-colors duration-150 group">
  <td className="px-6 py-4 font-medium text-gray-800">{acc.account_code}</td>
  <td className="px-6 py-4 text-gray-700">{acc.account_name}</td>
  <td className="px-6 py-4 text-gray-700">{acc.account_type}</td>
  <td className="px-6 py-4 text-gray-700">{acc.normal_balance}</td>
  <td className="px-6 py-4 text-right font-semibold text-gray-900">
    {formatCurrency(balanceMap[acc.gl_account_id] || 0)}
  </td>

  {/* Action column */}
  <td className="px-6 py-4 text-right flex items-center justify-end space-x-2  group-hover:opacity-100 transition-opacity duration-200">
    <button className="p-1 rounded hover:bg-gray-100" title="View">
      <Eye className="w-4 h-4 text-gray-600" />
    </button>
    <button className="p-1 rounded hover:bg-gray-100" title="Edit">
      <Edit className="w-4 h-4 text-blue-600" />
    </button>
    <button className="p-1 rounded hover:bg-gray-100" title="Delete">
      <Trash2 className="w-4 h-4 text-red-600" />
    </button>

    {/* Kebab menu */}
    <Menu as="div" className="relative">
      <MenuButton className="p-1 rounded hover:bg-gray-100">
        <MoreVertical className="w-4 h-4 text-gray-500" />
      </MenuButton>
      <MenuItems className="absolute right-0 mt-1 w-40 bg-white border rounded shadow-lg py-1 z-10">
        <MenuItem>
          {({ active }) => (
            <button
              className={`w-full text-left px-4 py-2 text-sm ${
                active ? "bg-gray-100" : ""
              }`}
            >
              Download
            </button>
          )}
        </MenuItem>
        <MenuItem>
          {({ active }) => (
            <button
              className={`w-full text-left px-4 py-2 text-sm ${
                active ? "bg-gray-100" : ""
              }`}
            >
              Archive
            </button>
          )}
        </MenuItem>
      </MenuItems>
    </Menu>
  </td>
</tr>

        ))}
      </tbody>
    </table>
  </div>
);


}
