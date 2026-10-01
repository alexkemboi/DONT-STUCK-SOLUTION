"use client";

import type { Column } from "@tanstack/react-table";
import { createColumnHelper } from "@tanstack/react-table";
import { ArrowUpDown, MoreVertical, Pencil } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { DataTableFeatures } from "@/components/admin/shared/data-table-features";
import type { SerializedRepayment } from "@/app/actions/repayment";

const columnHelper = createColumnHelper<DataTableFeatures, SerializedRepayment>();

const methodColors: Record<string, string> = {
  Cash: "bg-green-100 text-green-800",
  Bank: "bg-blue-100 text-blue-800",
  Mpesa: "bg-emerald-100 text-emerald-800",
};

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);

const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString("en-KE", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

function SortableHeader<TValue>({
  label,
  column,
}: {
  label: string;
  column: Column<DataTableFeatures, SerializedRepayment, TValue>;
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

export interface RepaymentsColumnActions {
  onEdit: (repayment: SerializedRepayment) => void;
}

export function createRepaymentsColumns({ onEdit }: RepaymentsColumnActions) {
  return columnHelper.columns([
    columnHelper.accessor("clientName", {
      header: ({ column }) => <SortableHeader label="Client" column={column} />,
      cell: ({ row }) => (
        <div>
          <p className="font-medium text-slate-900">{row.original.clientName}</p>
          <p className="text-xs text-slate-500">{row.original.loanPurpose}</p>
        </div>
      ),
    }),
    columnHelper.accessor("amount", {
      header: ({ column }) => <SortableHeader label="Amount" column={column} />,
      cell: ({ getValue }) => (
        <span className="font-medium text-slate-900">
          {formatCurrency(getValue())}
        </span>
      ),
    }),
    columnHelper.accessor("paymentMethod", {
      header: "Method",
      cell: ({ getValue }) => (
        <Badge className={methodColors[getValue()] || "bg-gray-100 text-gray-800"}>
          {getValue()}
        </Badge>
      ),
    }),
    columnHelper.accessor("category", {
      header: "Category",
      cell: ({ getValue }) => (
        <span className="text-sm text-slate-600">{getValue()}</span>
      ),
    }),
    columnHelper.accessor("paymentDate", {
      header: ({ column }) => <SortableHeader label="Date" column={column} />,
      cell: ({ getValue }) => (
        <span className="text-sm text-slate-500">{formatDate(getValue())}</span>
      ),
    }),
    columnHelper.accessor("reference", {
      header: "Reference",
      cell: ({ getValue }) => (
        <span className="text-sm text-slate-500 font-mono">
          {getValue() || "—"}
        </span>
      ),
      enableSorting: false,
    }),
    columnHelper.display({
      id: "actions",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(row.original)}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit Repayment
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
      enableSorting: false,
      enableHiding: false,
    }),
  ]);
}
