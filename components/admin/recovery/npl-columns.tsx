"use client";

import type { Column } from "@tanstack/react-table";
import { createColumnHelper } from "@tanstack/react-table";
import { ArrowUpDown, MapPin, MessageSquare, MoreHorizontal, Phone } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatCurrency, formatDate } from "@/lib/utils";
import { toast } from "sonner";
import type { DataTableFeatures } from "@/components/admin/shared/data-table-features";

export interface NPLLoan {
  id: string;
  loanId: string;
  clientName: string;
  clientPhone: string;
  originalAmount: number;
  outstandingAmount: number;
  daysOverdue: number;
  assignedAgent: string;
  lastAction: string;
  lastActionDate: string;
  flaggedAt: string;
}

const columnHelper = createColumnHelper<DataTableFeatures, NPLLoan>();

function SortableHeader<TValue>({
  label,
  column,
}: {
  label: string;
  column: Column<DataTableFeatures, NPLLoan, TValue>;
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

const getOverdueBadge = (days: number) => {
  if (days >= 90) return "bg-red-100 text-red-800";
  if (days >= 60) return "bg-amber-100 text-amber-800";
  return "bg-yellow-100 text-yellow-800";
};

export function createNplColumns() {
  return columnHelper.columns([
    columnHelper.accessor("loanId", {
      header: "Loan ID",
      cell: ({ getValue }) => (
        <span className="font-mono text-sm font-medium text-slate-900">
          {getValue()}
        </span>
      ),
    }),
    columnHelper.accessor("clientName", {
      header: ({ column }) => <SortableHeader label="Client" column={column} />,
      cell: ({ row }) => (
        <div>
          <p className="font-medium text-slate-900">{row.original.clientName}</p>
          <p className="text-xs text-slate-500">{row.original.clientPhone}</p>
        </div>
      ),
    }),
    columnHelper.accessor("outstandingAmount", {
      header: ({ column }) => <SortableHeader label="Outstanding" column={column} />,
      cell: ({ row }) => (
        <div>
          <p className="font-semibold text-red-600">
            {formatCurrency(row.original.outstandingAmount)}
          </p>
          <p className="text-xs text-slate-500">
            of {formatCurrency(row.original.originalAmount)}
          </p>
        </div>
      ),
    }),
    columnHelper.accessor("daysOverdue", {
      header: ({ column }) => <SortableHeader label="Days Overdue" column={column} />,
      cell: ({ getValue }) => (
        <Badge className={getOverdueBadge(getValue())}>{getValue()} days</Badge>
      ),
    }),
    columnHelper.accessor("assignedAgent", {
      header: "Assigned To",
      cell: ({ getValue }) => (
        <span className="text-sm font-medium text-slate-700">{getValue()}</span>
      ),
    }),
    columnHelper.accessor("lastAction", {
      header: "Last Action",
      cell: ({ row }) => (
        <div>
          <p className="text-sm text-slate-600">{row.original.lastAction}</p>
          <p className="text-xs text-slate-400">
            {formatDate(row.original.lastActionDate)}
          </p>
        </div>
      ),
      enableSorting: false,
    }),
    columnHelper.display({
      id: "actions",
      cell: ({ row }) => {
        const loan = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() =>
                  toast.info(`Calling ${loan.clientName}`, {
                    description: loan.clientPhone,
                  })
                }
              >
                <Phone className="mr-2 h-4 w-4" />
                Call Client
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => toast.info(`Sending SMS to ${loan.clientName}`)}
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                Send SMS
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => toast.info(`Scheduling visit for ${loan.clientName}`)}
              >
                <MapPin className="mr-2 h-4 w-4" />
                Schedule Visit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => toast.info(`Recording action for ${loan.loanId}`)}
              >
                Record Action
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => toast.info(`Reassigning ${loan.loanId}`)}
              >
                Reassign Agent
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
