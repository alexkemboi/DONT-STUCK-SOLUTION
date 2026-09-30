"use client"

import type { Column } from "@tanstack/react-table"
import { createColumnHelper } from "@tanstack/react-table"
import {
  ArrowUpDown,
  Banknote,
  CheckCircle,
  Eye,
  Loader2,
  MoreHorizontal,
  XCircle,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { DataTableFeatures } from "@/components/admin/shared/data-table-features"
import type { SerializedLoan } from "@/app/actions/loan"

const columnHelper = createColumnHelper<DataTableFeatures, SerializedLoan>()

const statusColors: Record<string, string> = {
  Pending: "bg-amber-100 text-amber-800",
  Approved: "bg-emerald-100 text-emerald-800",
  Rejected: "bg-red-100 text-red-800",
  Disbursed: "bg-blue-100 text-blue-800",
  Active: "bg-purple-100 text-purple-800",
  NPL: "bg-red-100 text-red-800",
  Closed: "bg-gray-100 text-gray-800",
}

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)

const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString("en-KE", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })

function SortableHeader<TValue>({
  label,
  column,
}: {
  label: string
  column: Column<DataTableFeatures, SerializedLoan, TValue>
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
  )
}

export interface LoansColumnActions {
  loadingId: string | null
  onView: (loan: SerializedLoan) => void
  onApprove: (loan: SerializedLoan) => void
  onReject: (loan: SerializedLoan) => void
  onDisburse: (loan: SerializedLoan) => void
}

export function createLoansColumns({
  loadingId,
  onView,
  onApprove,
  onReject,
  onDisburse,
}: LoansColumnActions) {
  return columnHelper.columns([
    columnHelper.accessor("id", {
      header: "Loan ID",
      cell: ({ getValue }) => (
        <span className="font-mono text-sm font-medium text-slate-900">
          {getValue().slice(0, 12)}...
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
    columnHelper.accessor("amountRequested", {
      header: ({ column }) => <SortableHeader label="Amount" column={column} />,
      cell: ({ row }) => (
        <div>
          <p className="font-medium text-slate-900">
            {formatCurrency(row.original.amountRequested)}
          </p>
          {row.original.approvedAmount &&
            row.original.approvedAmount !== row.original.amountRequested && (
              <p className="text-xs text-emerald-600">
                Approved: {formatCurrency(row.original.approvedAmount)}
              </p>
            )}
        </div>
      ),
    }),
    columnHelper.accessor("repaymentPeriod", {
      header: "Tenure",
      cell: ({ getValue }) => (
        <span className="text-sm text-slate-600">{getValue()} months</span>
      ),
      enableSorting: false,
    }),
    columnHelper.accessor("status", {
      header: ({ column }) => <SortableHeader label="Status" column={column} />,
      cell: ({ getValue }) => (
        <Badge className={statusColors[getValue()] || "bg-gray-100 text-gray-800"}>
          {getValue()}
        </Badge>
      ),
    }),
    columnHelper.accessor("appliedAt", {
      header: ({ column }) => <SortableHeader label="Applied" column={column} />,
      cell: ({ getValue }) => (
        <span className="text-sm text-slate-500">{formatDate(getValue())}</span>
      ),
    }),
    columnHelper.display({
      id: "actions",
      cell: ({ row }) => {
        const loan = row.original
        const isLoading = loadingId === loan.id

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                disabled={isLoading}
              >
                <span className="sr-only">Open menu</span>
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <MoreHorizontal className="h-4 w-4" />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onView(loan)}>
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {loan.status === "Pending" && (
                <>
                  <DropdownMenuItem
                    onClick={() => onApprove(loan)}
                    className="text-emerald-600"
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Approve
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => onReject(loan)}
                    className="text-red-600"
                  >
                    <XCircle className="mr-2 h-4 w-4" />
                    Reject
                  </DropdownMenuItem>
                </>
              )}
              {loan.status === "Approved" && (
                <DropdownMenuItem
                  onClick={() => onDisburse(loan)}
                  className="text-blue-600"
                >
                  <Banknote className="mr-2 h-4 w-4" />
                  Disburse
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
      enableSorting: false,
      enableHiding: false,
    }),
  ])
}
