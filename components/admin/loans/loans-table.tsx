"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { DataTable } from "@/components/admin/shared/updated-data-table";
import { createLoansColumns } from "@/components/admin/loans/loans-columns";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
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
import { toast } from "sonner";
import {
  approveLoanAction,
  rejectLoanAction,
  disburseLoanAction,
  type SerializedLoan,
} from "@/app/actions/loan";

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);

interface LoansTableProps {
  loans: SerializedLoan[];
}

export function LoansTable({ loans }: LoansTableProps) {
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState<string | null>(null);

  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectingLoan, setRejectingLoan] = useState<SerializedLoan | null>(
    null
  );
  const [rejectionReason, setRejectionReason] = useState("");

  const filteredLoans = useMemo(
    () =>
      statusFilter === "all"
        ? loans
        : loans.filter((loan) => loan.status === statusFilter),
    [loans, statusFilter]
  );

  const handleApprove = async (loan: SerializedLoan) => {
    setLoading(loan.id);
    const result = await approveLoanAction(loan.id);
    if (result.success) {
      toast.success("Loan approved", {
        description: `${formatCurrency(loan.amountRequested)} for ${loan.clientName}`,
      });
      router.refresh();
    } else {
      toast.error(result.error || "Failed to approve loan");
    }
    setLoading(null);
  };

  const openRejectDialog = (loan: SerializedLoan) => {
    setRejectingLoan(loan);
    setRejectionReason("");
    setRejectDialogOpen(true);
  };

  const handleRejectConfirm = async () => {
    if (!rejectingLoan) return;
    if (!rejectionReason.trim()) {
      toast.error("Please provide a reason for rejection");
      return;
    }

    setLoading(rejectingLoan.id);
    const result = await rejectLoanAction(
      rejectingLoan.id,
      rejectionReason.trim()
    );
    if (result.success) {
      toast.success("Loan rejected", {
        description: `Application from ${rejectingLoan.clientName}`,
      });
      router.refresh();
    } else {
      toast.error(result.error || "Failed to reject loan");
    }
    setLoading(null);
    setRejectDialogOpen(false);
    setRejectingLoan(null);
  };

  const handleDisburse = async (loan: SerializedLoan) => {
    setLoading(loan.id);
    const result = await disburseLoanAction(loan.id);
    if (result.success) {
      toast.success("Disbursement initiated", {
        description: `${formatCurrency(loan.approvedAmount || loan.amountRequested)} for ${loan.clientName}`,
      });
      router.refresh();
    } else {
      toast.error(result.error || "Failed to disburse loan");
    }
    setLoading(null);
  };

  const columns = useMemo(
    () =>
      createLoansColumns({
        loadingId: loading,
        onView: (loan) => router.push(`/dss/admin/loans/${loan.id}`),
        onApprove: handleApprove,
        onReject: openRejectDialog,
        onDisburse: handleDisburse,
      }),
    [loading, router]
  );

  return (
    <>
      <DataTable
        data={filteredLoans}
        columns={columns}
        searchPlaceholder="Search by ID, client name, or purpose..."
        toolbar={
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Filter status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Approved">Approved</SelectItem>
              <SelectItem value="Rejected">Rejected</SelectItem>
              <SelectItem value="Disbursed">Disbursed</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="NPL">NPL</SelectItem>
            </SelectContent>
          </Select>
        }
      />

      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Reject Loan Application</DialogTitle>
            <DialogDescription>
              {rejectingLoan && (
                <>
                  Rejecting{" "}
                  {formatCurrency(rejectingLoan.amountRequested)} application
                  from{" "}
                  <span className="font-medium">
                    {rejectingLoan.clientName}
                  </span>
                  .
                </>
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2">
            <Label htmlFor="rejection-reason">Reason for Rejection</Label>
            <Textarea
              id="rejection-reason"
              placeholder="Provide a clear reason for rejecting this application..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              rows={4}
            />
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setRejectDialogOpen(false)}
              disabled={loading !== null}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleRejectConfirm}
              disabled={loading !== null || !rejectionReason.trim()}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Rejecting...
                </>
              ) : (
                "Reject Application"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
