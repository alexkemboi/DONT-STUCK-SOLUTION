"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DataTable } from "@/components/admin/shared/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ExternalLink,
  MoreHorizontal,
  Trash2,
  Loader2,
  Eye,
} from "lucide-react";
import { toast } from "sonner";
import {
  deleteDocumentAction,
  type SerializedDocument,
} from "@/app/actions/document";

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

interface DocumentsManagerProps {
  documents: SerializedDocument[];
}

export function DocumentsManager({ documents }: DocumentsManagerProps) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [loading, setLoading] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingDoc, setDeletingDoc] = useState<SerializedDocument | null>(
    null
  );

  const filteredDocs = documents.filter((doc) => {
    const matchesSearch =
      doc.fileName.toLowerCase().includes(search.toLowerCase()) ||
      (doc.clientName || "").toLowerCase().includes(search.toLowerCase()) ||
      doc.documentType.toLowerCase().includes(search.toLowerCase());
    const matchesType =
      typeFilter === "all" || doc.documentType === typeFilter;
    return matchesSearch && matchesType;
  });

  const handleDelete = async () => {
    if (!deletingDoc) return;
    setLoading(deletingDoc.id);
    const result = await deleteDocumentAction(deletingDoc.id);
    if (result.success) {
      toast.success("Document deleted", {
        description: `${deletingDoc.fileName} has been removed.`,
      });
      router.refresh();
    } else {
      toast.error(result.error || "Failed to delete document");
    }
    setLoading(null);
    setDeleteDialogOpen(false);
    setDeletingDoc(null);
  };

  const columns = [
    {
      key: "fileName",
      header: "File Name",
      render: (doc: SerializedDocument) => (
        <div>
          <p className="font-medium text-slate-900 truncate max-w-[200px]">
            {doc.fileName}
          </p>
          <p className="text-xs text-slate-500">
            {formatFileSize(doc.fileSize)}
            {doc.mimeType && ` • ${doc.mimeType.split("/")[1]?.toUpperCase()}`}
          </p>
        </div>
      ),
    },
    {
      key: "documentType",
      header: "Type",
      render: (doc: SerializedDocument) => (
        <Badge
          className={
            typeColors[doc.documentType] || "bg-gray-100 text-gray-800"
          }
        >
          {doc.documentType}
        </Badge>
      ),
    },
    {
      key: "clientName",
      header: "Client",
      render: (doc: SerializedDocument) => (
        <span className="text-sm text-slate-600">
          {doc.clientName || "—"}
        </span>
      ),
    },
    {
      key: "loanPurpose",
      header: "Loan",
      render: (doc: SerializedDocument) => (
        <span className="text-sm text-slate-600">
          {doc.loanPurpose || "—"}
        </span>
      ),
    },
    {
      key: "uploadedAt",
      header: "Uploaded",
      render: (doc: SerializedDocument) => (
        <span className="text-sm text-slate-500">
          {formatDate(doc.uploadedAt)}
        </span>
      ),
    },
    {
      key: "actions",
      header: "",
      render: (doc: SerializedDocument) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              disabled={loading === doc.id}
            >
              {loading === doc.id ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <MoreHorizontal className="h-4 w-4" />
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => window.open(doc.filePath, "_blank")}
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              View File
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                setDeletingDoc(doc);
                setDeleteDialogOpen(true);
              }}
              className="text-red-600"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
      className: "w-12",
    },
  ];

  // Get unique document types for filter
  const uniqueTypes = Array.from(
    new Set(documents.map((d) => d.documentType))
  );

  return (
    <>
      <DataTable
        data={filteredDocs}
        columns={columns}
        searchPlaceholder="Search by file name, client, or type..."
        searchValue={search}
        onSearchChange={setSearch}
        filterOptions={[
          { label: "All Types", value: "all" },
          ...uniqueTypes.map((t) => ({ label: t, value: t })),
        ]}
        filterValue={typeFilter}
        onFilterChange={setTypeFilter}
      />

      {/* Delete confirmation */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Document</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-medium">{deletingDoc?.fileName}</span>?
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={loading !== null}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={loading !== null}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
