"use client";
import { formatCurrency } from "@/lib/utils";
import { MoreVertical, Trash2, Edit, Eye } from "lucide-react";
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/react";

import { useEffect, useState } from "react";
import { toast } from "sonner";


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
  parent_account_id?: string;
  opening_balance?: number;
  is_active?: boolean;
  created_at?: string;
};
type AccountsTableProps = {
  accounts: Account[];
  balances: Balance[];
};

export default function AccountsTable({ accounts, balances }: AccountsTableProps) {

const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);

const [isEditMode, setIsEditMode] = useState(false);

const [openViewModal, setOpenViewModal] = useState(false);

const [openDeleteModal, setOpenDeleteModal] = useState(false);

const [loading, setLoading] = useState(false);
const [tableAccounts, setTableAccounts] = useState<Account[]>(accounts);
const fetchAccounts = async () => {
  try {

    setLoading(true);

    const res = await fetch(
      "/api/auth/chart-of-accounts"
    );

    if (!res.ok) {
      throw new Error("Failed to fetch accounts");
    }

    const data = await res.json();

    setTableAccounts(data);

  } catch (error) {

    console.error(error);

    toast.error("Failed to load accounts");

  } finally {

    setLoading(false);
  }
};



useEffect(() => {
  fetchAccounts();
}, []);




  const balanceMap = Object.fromEntries(
    balances.map(b => [b.gl_account_id, b.balance])
  );

  const parentAccounts = accounts.map(acc => ({
    id: acc.gl_account_id,
    accountName: acc.account_name
  }));

const [openModal, setOpenModal] = useState(false);
 // optional for dropdown
const [formData, setFormData] = useState({
  account_code: "",
  account_name: "",
  account_type: "",
  parent_account_id: "",
  normal_balance: "",
  opening_balance: 0,
  is_active: true
});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };
const handleView = async (account: Account) => {
  try {
    setLoading(true);

    const res = await fetch(
      `/api/auth/chart-of-accounts/${account.gl_account_id}`
    );

    if (!res.ok) {
      throw new Error("Failed to fetch account");
    }

    const data = await res.json();

    setSelectedAccount(data);

    setOpenViewModal(true);
  } catch (error) {
    console.error(error);

    toast.error("Failed to load account details");
  } finally {
    setLoading(false);
  }
};


const handleEdit = (account: Account) => {

  setIsEditMode(true);

  setSelectedAccount(account);

  setFormData({
    account_code: account.account_code || "",
    account_name: account.account_name || "",
    account_type: account.account_type || "",
    parent_account_id: account.parent_account_id || "",
    normal_balance: account.normal_balance || "",
    opening_balance: account.opening_balance || 0,
    is_active: account.is_active ?? true,
  });

  setOpenModal(true);
};

const handleDelete = async () => {

  if (!selectedAccount) return;

  try {

    setLoading(true);

    const res = await fetch(
      `/api/auth/chart-of-accounts/${selectedAccount.gl_account_id}`,
      {
        method: "DELETE",
      }
    );

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Delete failed");
    }

   await fetchAccounts();

    toast.success("Account deleted successfully");

    setOpenDeleteModal(false);

    setSelectedAccount(null);

  } catch (error: any) {

    toast.error(error.message || "Failed to delete account");

  } finally {

    setLoading(false);
  }
};
const handleSubmit = async (e: React.FormEvent) => {

  e.preventDefault();

  try {

    setLoading(true);

    const url = isEditMode
      ? `/api/auth/chart-of-accounts/${selectedAccount?.gl_account_id}`
      : "/api/auth/chart-of-accounts";

    const method = isEditMode ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Failed to save");
    }

    if (isEditMode) {

  await fetchAccounts();

      toast.success("Account updated successfully");

    } else {
     await fetchAccounts();

      toast.success("Account created successfully");
    }

    setOpenModal(false);

    setIsEditMode(false);

    setSelectedAccount(null);

    setFormData({
      account_code: "",
      account_name: "",
      account_type: "",
      parent_account_id: "",
      normal_balance: "",
      opening_balance: 0,
      is_active: true,
    });

  } catch (error: any) {

    console.error(error);

    toast.error(error.message || "Operation failed");

  } finally {

    setLoading(false);
  }
};
return (
  <div className="overflow-x-auto rounded-lg border bg-white shadow-md">
      {/* Top Bar */}
  <div className="flex justify-between items-center p-5">
    <h2 className="text-lg font-semibold text-gray-800">
      Chart of Accounts
    </h2>

    <button
      onClick={() => setOpenModal(true)}
      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium shadow"
    >
      + Add Account
    </button>
  </div>
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
        {tableAccounts.map(acc => (
      <tr
      key={acc.gl_account_id}
      className="hover:bg-gray-50 transition-colors duration-150 group"
    >
      <td className="px-6 py-4 font-medium text-gray-800">{acc.account_code}</td>
      <td className="px-6 py-4 text-gray-700">{acc.account_name}</td>
      <td className="px-6 py-4 text-gray-700">{acc.account_type}</td>
      <td className="px-6 py-4 text-gray-700">{acc.normal_balance}</td>
      <td className="px-6 py-4 text-right font-semibold text-gray-900">
        {formatCurrency(balanceMap[acc.gl_account_id] || 0)}
      </td>

  {/* Action column */}
  <td className="px-6 py-4 text-right flex items-center justify-end space-x-2  group-hover:opacity-100 transition-opacity duration-200">
    <button
  onClick={() => handleView(acc)}
  className="p-1 rounded hover:bg-gray-100"
  title="View"
>
  <Eye className="w-4 h-4 text-gray-600" />
</button>

<button
  onClick={() => handleEdit(acc)}
  className="p-1 rounded hover:bg-gray-100"
  title="Edit"
>
  <Edit className="w-4 h-4 text-blue-600" />
</button>

<button
  disabled={acc.account_code === "1000"}
  onClick={() => {
    setSelectedAccount(acc);
    setOpenDeleteModal(true);
  }}
  className="p-1 rounded hover:bg-gray-100 disabled:opacity-40"
  title="Delete"
>
  <Trash2 className="w-4 h-4 text-red-600" />
</button>

    {/* Kebab menu */}
    {/* <Menu as="div" className="relative">
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
    </Menu> */}
  </td>
</tr>

        ))}
      </tbody>
    </table>
    {openModal && (
  <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
    
    <div className="bg-white rounded-lg shadow-lg w-[420px] p-6">

      <h2 className="text-lg font-semibold mb-4">
    {isEditMode ? "Edit Account" : "Add New Account"}
      </h2>

       <form onSubmit={handleSubmit} className="space-y-4">

{/* Account Code */}
<div>
<label className="block text-sm font-medium text-gray-700">
Account Code
</label>
<input
name="account_code"
value={formData.account_code}
onChange={handleChange}
className="w-full border rounded px-3 py-2 text-sm"
placeholder="e.g 1101"
required
/>
</div>

{/* Account Name */}
<div>
<label className="block text-sm font-medium text-gray-700">
Account Name
</label>
<input
name="account_name"
value={formData.account_name}
onChange={handleChange}
className="w-full border rounded px-3 py-2 text-sm"
placeholder="Cash at Bank"
required
/>
</div>

{/* Account Type */}
<div>
<label className="block text-sm font-medium text-gray-700">
Account Type
</label>
<select
name="account_type"
value={formData.account_type}
onChange={handleChange}
className="w-full border rounded px-3 py-2 text-sm"
required
>
<option value="">Select Type</option>
<option value="ASSET">Asset</option>
<option value="LIABILITY">Liability</option>
<option value="EQUITY">Equity</option>
<option value="INCOME">Income</option>
<option value="EXPENSE">Expense</option>
</select>
</div>

{/* Parent Account */}
{/* <div>
<label className="block text-sm font-medium text-gray-700">
Parent Account
</label>

<select
name="parent_account_id"
value={formData.parent_account_id}
onChange={handleChange}
className="w-full border rounded px-3 py-2 text-sm"
>
<option value="">None</option>

{accounts.map(acc => (
<option
  key={acc.gl_account_id || acc.account_code}
  value={acc.gl_account_id}
>
  {acc.account_code} - {acc.account_name}
</option>
))}
</select>
</div> */}

{/* Normal Balance */}
<div>
<label className="block text-sm font-medium text-gray-700">
Normal Balance
</label>

<select
name="normal_balance"
value={formData.normal_balance}
onChange={handleChange}
className="w-full border rounded px-3 py-2 text-sm"
required
>
<option value="">Select</option>
<option value="DEBIT">Debit</option>
<option value="CREDIT">Credit</option>
</select>

</div>

{/* Opening Balance */}
<div>
<label className="block text-sm font-medium text-gray-700">
Opening Balance
</label>

<input
type="number"
step="0.01"
name="opening_balance"
value={formData.opening_balance}
onChange={handleChange}
className="w-full border rounded px-3 py-2 text-sm"
placeholder="0.00"
/>

</div>

{/* Active */}
<div className="flex items-center gap-2">

<input
type="checkbox"
name="is_active"
checked={formData.is_active}
onChange={handleChange}
/>

<label className="text-sm text-gray-700">
Active Account
</label>

</div>

{/* Buttons */}
<div className="flex justify-end gap-2 pt-3">

<button
type="button"
onClick={() => setOpenModal(false)}
className="px-4 py-2 border rounded text-sm"
>
Cancel
</button>

<button
type="submit"
className="bg-blue-600 text-white px-4 py-2 rounded text-sm"
>
{loading
  ? "Saving..."
  : isEditMode
  ? "Update Account"
  : "Save Account"}
</button>

</div>

</form>

    </div>
  </div>
)}

{openViewModal && selectedAccount && (
  <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">

    <div className="bg-white rounded-xl shadow-xl w-[650px] p-6">

      <div className="flex justify-between items-center mb-6">

        <h2 className="text-xl font-semibold">
          Account Details
        </h2>

        <button
          onClick={() => setOpenViewModal(false)}
          className="text-gray-500 hover:text-black"
        >
          ✕
        </button>

      </div>

      <div className="grid grid-cols-2 gap-5 text-sm">

        <div>
          <p className="text-gray-500">Account Code</p>
          <p className="font-medium">
            {selectedAccount.account_code}
          </p>
        </div>

        <div>
          <p className="text-gray-500">Account Name</p>
          <p className="font-medium">
            {selectedAccount.account_name}
          </p>
        </div>

        <div>
          <p className="text-gray-500">Account Type</p>
          <p className="font-medium">
            {selectedAccount.account_type}
          </p>
        </div>

        <div>
          <p className="text-gray-500">Normal Balance</p>
          <p className="font-medium">
            {selectedAccount.normal_balance}
          </p>
        </div>

        <div>
          <p className="text-gray-500">Opening Balance</p>
          <p className="font-medium">
            {formatCurrency(
              Number(selectedAccount.opening_balance || 0)
            )}
          </p>
        </div>

        <div>
          <p className="text-gray-500">Current Balance</p>
          <p className="font-medium">
            {formatCurrency(
              balanceMap[selectedAccount.gl_account_id] || 0
            )}
          </p>
        </div>

        <div>
          <p className="text-gray-500">Status</p>
          <p className="font-medium">
            {selectedAccount.is_active
              ? "Active"
              : "Inactive"}
          </p>
        </div>

        <div>
          <p className="text-gray-500">Created Date</p>
          <p className="font-medium">
            {selectedAccount.created_at
              ? new Date(
                  selectedAccount.created_at
                ).toLocaleDateString()
              : "-"}
          </p>
        </div>

      </div>

      <div className="flex justify-end mt-6">

        <button
          onClick={() => setOpenViewModal(false)}
          className="px-4 py-2 border rounded-lg"
        >
          Close
        </button>

      </div>

    </div>

  </div>
)}


{openDeleteModal && selectedAccount && (

  <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">

    <div className="bg-white rounded-xl shadow-xl w-[420px] p-6">

      <h2 className="text-lg font-semibold mb-4">
        Delete Account
      </h2>

      <p className="text-sm text-gray-600 mb-6">
        Are you sure you want to delete this account?
      </p>

      <div className="flex justify-end gap-3">

        <button
          onClick={() => setOpenDeleteModal(false)}
          className="px-4 py-2 border rounded-lg"
        >
          Cancel
        </button>

        <button
          onClick={handleDelete}
          disabled={loading}
          className="px-4 py-2 bg-red-600 text-white rounded-lg"
        >
          {loading ? "Deleting..." : "Confirm Delete"}
        </button>

      </div>

    </div>

  </div>
)}

  </div>
);


}
