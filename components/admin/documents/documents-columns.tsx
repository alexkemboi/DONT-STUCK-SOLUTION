"use client";

import type { Column } from "@tanstack/react-table";
import { createColumnHelper } from "@tanstack/react-table";
import { ArrowUpDown, ExternalLink, Loader2, MoreHorizontal, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { DataTableFeatures } from "@/components/admin/shared/data-table-features";
import type { SerializedDocument } from "@/app/actions/document";

const typeColors: Record<string, string> = {
  ID: "bg-blue-100 text-blue-800",
  Payslip: "bg-green-100 text-green-800",
  Statement: "bg-purple-100 text-purple-800",
  PassportPhoto: "bg-amber-100 text-amber-800",
  AppointmentLetter: "bg-indigo-100 text-indigo-800",
  BankStatement: "bg-teal-100 text-teal-800",
  KRACertificate: "bg-orange-100 text-orange-800",
  Other: "bg-gray-100 text-gray-800",
};

const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString("en-KE", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

const formatFileSize = (bytes: number | null) => {
  if (!bytes) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const columnHelper = createColumnHelper<DataTableFeatures, SerializedDocument>();

function SortableHeader<TValue>({
  label,
  column,
}: {
  label: string;
  column: Column<DataTableFeatures, SerializedDocument, TValue>;
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

export interface DocumentsColumnActions {
  loadingId: string | null;
  onView: (doc: SerializedDocument) => void;
  onDelete: (doc: SerializedDocument) => void;
}

export function createDocumentsColumns({
  loadingId,
  onView,
  onDelete,
}: DocumentsColumnActions) {
  return columnHelper.columns([
    columnHelper.accessor("fileName", {
      header: ({ column }) => <SortableHeader label="File Name" column={column} />,
      cell: ({ row }) => (
        <div>
          <p className="font-medium text-slate-900 truncate max-w-[200px]">
            {row.original.fileName}
          </p>
          <p className="text-xs text-slate-500">
            {formatFileSize(row.original.fileSize)}
            {row.original.mimeType &&
              ` • ${row.original.mimeType.split("/")[1]?.toUpperCase()}`}
          </p>
        </div>
      ),
    }),
    columnHelper.accessor("documentType", {
      header: "Type",
      cell: ({ getValue }) => (
        <Badge className={typeColors[getValue()] || "bg-gray-100 text-gray-800"}>
          {getValue()}
        </Badge>
      ),
    }),
    columnHelper.accessor("clientName", {
      header: "Client",
      cell: ({ getValue }) => (
        <span className="text-sm text-slate-600">{getValue() || "—"}</span>
      ),
    }),
    columnHelper.accessor("loanPurpose", {
      header: "Loan",
      cell: ({ getValue }) => (
        <span className="text-sm text-slate-600">{getValue() || "—"}</span>
      ),
      enableSorting: false,
    }),
    columnHelper.accessor("uploadedAt", {
      header: ({ column }) => <SortableHeader label="Uploaded" column={column} />,
      cell: ({ getValue }) => (
        <span className="text-sm text-slate-500">{formatDate(getValue())}</span>
      ),
    }),
    columnHelper.display({
      id: "actions",
      cell: ({ row }) => {
        const doc = row.original;
        const isLoading = loadingId === doc.id;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <MoreHorizontal className="h-4 w-4" />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onView(doc)}>
                <ExternalLink className="mr-2 h-4 w-4" />
                View File
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDelete(doc)}
                className="text-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
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
