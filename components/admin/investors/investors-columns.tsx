"use client";

import type { Column } from "@tanstack/react-table";
import { createColumnHelper } from "@tanstack/react-table";
import { ArrowUpDown, Eye, MoreHorizontal, TrendingUp } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatCurrency, formatDate } from "@/lib/utils";
import { toast } from "sonner";
import type { DataTableFeatures } from "@/components/admin/shared/data-table-features";

export interface Investor {
  id: string;
  name: string;
  email: string;
  phone: string;
  investedAmount: number;
  activeAllocations: number;
  totalReturns: number;
  joinedAt: string;
}

const columnHelper = createColumnHelper<DataTableFeatures, Investor>();

function SortableHeader<TValue>({
  label,
  column,
}: {
  label: string;
  column: Column<DataTableFeatures, Investor, TValue>;
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

export function createInvestorsColumns() {
  return columnHelper.columns([
    columnHelper.accessor("name", {
      header: ({ column }) => <SortableHeader label="Investor" column={column} />,
      cell: ({ row }) => (
        <div>
          <p className="font-medium text-slate-900">{row.original.name}</p>
          <p className="text-sm text-slate-500">{row.original.email}</p>
        </div>
      ),
    }),
    columnHelper.accessor("phone", {
      header: "Phone",
      cell: ({ getValue }) => (
        <span className="text-sm text-slate-600">{getValue()}</span>
      ),
      enableSorting: false,
    }),
    columnHelper.accessor("investedAmount", {
      header: ({ column }) => <SortableHeader label="Invested" column={column} />,
      cell: ({ getValue }) => (
        <span className="font-semibold text-slate-900">
          {formatCurrency(getValue())}
        </span>
      ),
    }),
    columnHelper.accessor("activeAllocations", {
      header: ({ column }) => <SortableHeader label="Active Loans" column={column} />,
      cell: ({ getValue }) => (
        <span className="font-medium text-slate-900">{getValue()}</span>
      ),
    }),
    columnHelper.accessor("totalReturns", {
      header: ({ column }) => <SortableHeader label="Returns" column={column} />,
      cell: ({ getValue }) => (
        <div className="flex items-center gap-1">
          <TrendingUp className="h-4 w-4 text-emerald-500" />
          <span className="font-semibold text-emerald-600">
            {formatCurrency(getValue())}
          </span>
        </div>
      ),
    }),
    columnHelper.display({
      id: "returnRate",
      header: "Return Rate",
      cell: ({ row }) => {
        const { totalReturns, investedAmount } = row.original;
        const rate = investedAmount ? (totalReturns / investedAmount) * 100 : 0;
        return (
          <span className="font-medium text-emerald-600">{rate.toFixed(1)}%</span>
        );
      },
      enableSorting: false,
    }),
    columnHelper.accessor("joinedAt", {
      header: ({ column }) => <SortableHeader label="Joined" column={column} />,
      cell: ({ getValue }) => (
        <span className="text-sm text-slate-500">{formatDate(getValue())}</span>
      ),
    }),
    columnHelper.display({
      id: "actions",
      cell: ({ row }) => {
        const investor = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => toast.info(`Viewing ${investor.name}'s portfolio`)}
              >
                <Eye className="mr-2 h-4 w-4" />
                View Portfolio
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => toast.info(`Viewing ${investor.name}'s allocations`)}
              >
                View Allocations
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => toast.info(`Recording payout for ${investor.name}`)}
              >
                Record Payout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
      enableSorting: false,
      enableHiding: false,
    }),
  ]);
}
