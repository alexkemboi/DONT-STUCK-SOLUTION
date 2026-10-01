"use client";

import type { Column } from "@tanstack/react-table";
import { createColumnHelper } from "@tanstack/react-table";
import { ArrowUpDown, Eye, MoreHorizontal, SquarePen, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { DataTableFeatures } from "@/components/admin/shared/data-table-features";
import type { Client, User } from "@/lib/generated/prisma";

export interface ClientWithUser extends Client {
  user?: User;
}

const columnHelper = createColumnHelper<DataTableFeatures, ClientWithUser>();

function SortableHeader<TValue>({
  label,
  column,
}: {
  label: string;
  column: Column<DataTableFeatures, ClientWithUser, TValue>;
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

export interface ClientsColumnActions {
  onView: (client: ClientWithUser) => void;
  onDeactivate: (client: ClientWithUser) => void;
  onEdit: (client: ClientWithUser) => void;
}

export function createClientsColumns({
  onView,
  onDeactivate,
  onEdit,
}: ClientsColumnActions) {
  return columnHelper.columns([
    columnHelper.accessor((row) => `${row.surname} ${row.otherNames}`, {
      id: "name",
      header: ({ column }) => <SortableHeader label="Client" column={column} />,
      cell: ({ row }) => (
        <div>
          <p className="font-medium text-slate-900">
            {row.original.surname} {row.original.otherNames}
          </p>
          <p className="text-sm text-slate-500">{row.original.user?.email}</p>
        </div>
      ),
    }),
    columnHelper.accessor("idPassportNo", {
      header: "ID Number",
      cell: ({ getValue }) => (
        <span className="font-mono text-sm text-slate-600">{getValue()}</span>
      ),
    }),
    columnHelper.accessor("status", {
      header: ({ column }) => <SortableHeader label="Status" column={column} />,
      cell: ({ getValue }) => (
        <Badge
          className={
            getValue() === "Active"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }
        >
          {getValue()}
        </Badge>
      ),
    }),
    columnHelper.display({
      id: "totalLoans",
      header: "Loans",
      cell: () => <span className="font-medium text-slate-900">{0}</span>,
      enableSorting: false,
    }),
    columnHelper.display({
      id: "outstandingBalance",
      header: "Outstanding",
      cell: () => (
        <span className="font-medium text-slate-500">{formatCurrency(0)}</span>
      ),
      enableSorting: false,
    }),
    columnHelper.accessor("createdAt", {
      header: ({ column }) => <SortableHeader label="Created At" column={column} />,
      cell: ({ getValue }) => (
        <span className="text-sm text-slate-500">{formatDate(getValue())}</span>
      ),
    }),
    columnHelper.display({
      id: "actions",
      cell: ({ row }) => {
        const client = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onView(client)}>
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDeactivate(client)}>
                <Trash2 className="mr-2 h-4 w-4" />
                Deactivate
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit(client)}>
                <SquarePen className="mr-2 h-4 w-4" />
                Edit
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
