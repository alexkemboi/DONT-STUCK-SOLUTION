"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { DataTable } from "@/components/admin/shared/updated-data-table";
import { createDocumentsColumns } from "@/components/admin/documents/documents-columns";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  deleteDocumentAction,
  type SerializedDocument,
} from "@/app/actions/document";

interface DocumentsManagerProps {
  documents: SerializedDocument[];
}

export function DocumentsManager({ documents }: DocumentsManagerProps) {
  const router = useRouter();
  const [typeFilter, setTypeFilter] = useState("all");
  const [loading, setLoading] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingDoc, setDeletingDoc] = useState<SerializedDocument | null>(
    null
  );

  const filteredDocs = useMemo(
    () =>
      typeFilter === "all"
        ? documents
        : documents.filter((doc) => doc.documentType === typeFilter),
    [documents, typeFilter]
  );

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

  const columns = useMemo(
    () =>
      createDocumentsColumns({
        loadingId: loading,
        onView: (doc) => window.open(doc.filePath, "_blank"),
        onDelete: (doc) => {
          setDeletingDoc(doc);
          setDeleteDialogOpen(true);
        },
      }),
    [loading]
  );

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
        toolbar={
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full sm:w-44">
              <SelectValue placeholder="Filter type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {uniqueTypes.map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        }
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
