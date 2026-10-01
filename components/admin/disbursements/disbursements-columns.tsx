"use client";

import type { Column } from "@tanstack/react-table";
import { createColumnHelper } from "@tanstack/react-table";
import { ArrowUpDown, Building2, Smartphone } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import type { DataTableFeatures } from "@/components/admin/shared/data-table-features";

export interface Disbursement {
  id: string;
  loanId: string;
  clientName: string;
  amount: number;
  method: string;
  reference: string;
  disbursedAt: string;
  status: string;
}

const statusColors: Record<string, string> = {
  Pending: "bg-amber-100 text-amber-800",
  Completed: "bg-emerald-100 text-emerald-800",
  Processing: "bg-blue-100 text-blue-800",
  Failed: "bg-red-100 text-red-800",
};

const columnHelper = createColumnHelper<DataTableFeatures, Disbursement>();

function SortableHeader<TValue>({
  label,
  column,
}: {
  label: string;
  column: Column<DataTableFeatures, Disbursement, TValue>;
}) {
  return (
    <Button
      variant="ghost"
      className="-ml-3 h-8"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    >
      {label}
      <ArrowUpDown className="ml-2 h-4 w-4" />
    </Button>
  );
}

export function createDisbursementsColumns() {
  return columnHelper.columns([
    columnHelper.accessor("id", {
      header: "Reference",
      cell: ({ getValue }) => (
        <span className="font-mono text-sm font-medium text-slate-900">
          {getValue()}
        </span>
      ),
    }),
    columnHelper.accessor("loanId", {
      header: "Loan ID",
      cell: ({ getValue }) => (
        <span className="font-mono text-sm text-slate-600">{getValue()}</span>
      ),
    }),
    columnHelper.accessor("clientName", {
      header: ({ column }) => <SortableHeader label="Client" column={column} />,
      cell: ({ getValue }) => (
        <span className="font-medium text-slate-900">{getValue()}</span>
      ),
    }),
    columnHelper.accessor("amount", {
      header: ({ column }) => <SortableHeader label="Amount" column={column} />,
      cell: ({ getValue }) => (
        <span className="font-semibold text-emerald-600">
          {formatCurrency(getValue())}
        </span>
      ),
    }),
    columnHelper.accessor("method", {
      header: "Method",
      cell: ({ getValue }) => (
        <div className="flex items-center gap-2">
          {getValue() === "M-Pesa" ? (
            <Smartphone className="h-4 w-4 text-green-600" />
          ) : (
            <Building2 className="h-4 w-4 text-blue-600" />
          )}
          <span className="text-sm">{getValue()}</span>
        </div>
      ),
    }),
    columnHelper.accessor("reference", {
      header: "Txn Reference",
      cell: ({ getValue }) => (
        <span className="font-mono text-xs text-slate-500">{getValue()}</span>
      ),
      enableSorting: false,
    }),
    columnHelper.accessor("status", {
      header: "Status",
      cell: ({ getValue }) => (
        <Badge className={statusColors[getValue()]}>{getValue()}</Badge>
      ),
    }),
    columnHelper.accessor("disbursedAt", {
      header: ({ column }) => <SortableHeader label="Date & Time" column={column} />,
      cell: ({ getValue }) => (
        <span className="text-sm text-slate-500">{formatDateTime(getValue())}</span>
      ),
    }),
  ]);
}
