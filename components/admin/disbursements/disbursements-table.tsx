"use client";

import { useState } from "react";
import { DataTable } from "@/components/admin/shared/data-table";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDateTime } from "@/lib/utils";

const statusColors: Record<string, string> = {
  Pending: "bg-amber-100 text-amber-800",
  Completed: "bg-emerald-100 text-emerald-800",
  Processing: "bg-blue-100 text-blue-800",
  Failed: "bg-red-100 text-red-800",
};
import { Smartphone, Building2 } from "lucide-react";

interface Disbursement {
  id: string;
  loanId: string;
  clientName: string;
  amount: number;
  method: string;
  reference: string;
  disbursedAt: string;
  status: string;
}

interface DisbursementsTableProps {
  disbursements: Disbursement[];
}

export function DisbursementsTable({ disbursements }: DisbursementsTableProps) {
  const [search, setSearch] = useState("");
  const [methodFilter, setMethodFilter] = useState("all");

  const filteredDisbursements = disbursements.filter((d) => {
    const matchesSearch =
      d.loanId.toLowerCase().includes(search.toLowerCase()) ||
      d.clientName.toLowerCase().includes(search.toLowerCase()) ||
      d.reference.toLowerCase().includes(search.toLowerCase());
    const matchesMethod = methodFilter === "all" || d.method === methodFilter;
    return matchesSearch && matchesMethod;
  });

  const columns = [
    {
      key: "id",
      header: "Reference",
      render: (d: Disbursement) => (
        <span className="font-mono text-sm font-medium text-slate-900">{d.id}</span>
      ),
    },
    {
      key: "loanId",
      header: "Loan ID",
      render: (d: Disbursement) => (
        <span className="font-mono text-sm text-slate-600">{d.loanId}</span>
      ),
    },
    {
      key: "clientName",
      header: "Client",
      render: (d: Disbursement) => (
        <span className="font-medium text-slate-900">{d.clientName}</span>
      ),
    },
    {
      key: "amount",
      header: "Amount",
      render: (d: Disbursement) => (
        <span className="font-semibold text-emerald-600">
          {formatCurrency(d.amount)}
        </span>
      ),
      className: "text-right",
    },
    {
      key: "method",
      header: "Method",
      render: (d: Disbursement) => (
        <div className="flex items-center gap-2">
          {d.method === "M-Pesa" ? (
            <Smartphone className="h-4 w-4 text-green-600" />
          ) : (
            <Building2 className="h-4 w-4 text-blue-600" />
          )}
          <span className="text-sm">{d.method}</span>
        </div>
      ),
    },
    {
      key: "reference",
      header: "Txn Reference",
      render: (d: Disbursement) => (
        <span className="font-mono text-xs text-slate-500">{d.reference}</span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (d: Disbursement) => (
        <Badge className={statusColors[d.status]}>{d.status}</Badge>
      ),
    },
    {
      key: "disbursedAt",
      header: "Date & Time",
      render: (d: Disbursement) => (
        <span className="text-sm text-slate-500">
          {formatDateTime(d.disbursedAt)}
        </span>
      ),
    },
  ];

  return (
    <DataTable
      data={filteredDisbursements}
      columns={columns}
      searchPlaceholder="Search disbursements..."
      searchValue={search}
      onSearchChange={setSearch}
      filterOptions={[
        { label: "All Methods", value: "all" },
        { label: "M-Pesa", value: "M-Pesa" },
        { label: "Bank", value: "Bank" },
      ]}
      filterValue={methodFilter}
      onFilterChange={setMethodFilter}
    />
  );
}
