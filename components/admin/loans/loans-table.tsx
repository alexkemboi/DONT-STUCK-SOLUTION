"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DataTable } from "@/components/admin/shared/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Eye,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  Banknote,
  Loader2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
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
import { toast } from "sonner";
import {
  approveLoanAction,
  rejectLoanAction,
  disburseLoanAction,
  type SerializedLoan,
} from "@/app/actions/loan";

const statusColors: Record<string, string> = {
  Pending: "bg-amber-100 text-amber-800",
  Approved: "bg-emerald-100 text-emerald-800",
  Rejected: "bg-red-100 text-red-800",
  Disbursed: "bg-blue-100 text-blue-800",
  Active: "bg-purple-100 text-purple-800",
  NPL: "bg-red-100 text-red-800",
  Closed: "bg-gray-100 text-gray-800",
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

interface LoansTableProps {
  loans: SerializedLoan[];
}

export function LoansTable({ loans }: LoansTableProps) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState<string | null>(null);

  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectingLoan, setRejectingLoan] = useState<SerializedLoan | null>(
    null
  );
  const [rejectionReason, setRejectionReason] = useState("");

  const filteredLoans = loans.filter((loan) => {
    const matchesSearch =
      loan.id.toLowerCase().includes(search.toLowerCase()) ||
      loan.clientName.toLowerCase().includes(search.toLowerCase()) ||
      loan.purpose.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || loan.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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

  const columns = [
    {
      key: "id",
      header: "Loan ID",
      render: (loan: SerializedLoan) => (
        <span className="font-mono text-sm font-medium text-slate-900">
          {loan.id.slice(0, 12)}...
        </span>
      ),
    },
    {
      key: "clientName",
      header: "Client",
      render: (loan: SerializedLoan) => (
        <div>
          <p className="font-medium text-slate-900">{loan.clientName}</p>
          <p className="text-xs text-slate-500">{loan.clientPhone}</p>
        </div>
      ),
    },
    {
      key: "amountRequested",
      header: "Amount",
      render: (loan: SerializedLoan) => (
        <div>
          <p className="font-medium text-slate-900">
            {formatCurrency(loan.amountRequested)}
          </p>
          {loan.approvedAmount &&
            loan.approvedAmount !== loan.amountRequested && (
              <p className="text-xs text-emerald-600">
                Approved: {formatCurrency(loan.approvedAmount)}
              </p>
            )}
        </div>
      ),
      className: "text-right",
    },
    {
      key: "repaymentPeriod",
      header: "Tenure",
      render: (loan: SerializedLoan) => (
        <span className="text-sm text-slate-600">
          {loan.repaymentPeriod} months
        </span>
      ),
      className: "text-center",
    },
    {
      key: "status",
      header: "Status",
      render: (loan: SerializedLoan) => (
        <Badge
          className={statusColors[loan.status] || "bg-gray-100 text-gray-800"}
        >
          {loan.status}
        </Badge>
      ),
    },
    {
      key: "appliedAt",
      header: "Applied",
      render: (loan: SerializedLoan) => (
        <span className="text-sm text-slate-500">
          {formatDate(loan.appliedAt)}
        </span>
      ),
    },
    {
      key: "actions",
      header: "",
      render: (loan: SerializedLoan) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              disabled={loading === loan.id}
            >
              {loading === loan.id ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <MoreHorizontal className="h-4 w-4" />
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => toast.info(`Viewing ${loan.id}`)}
            >
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {loan.status === "Pending" && (
              <>
                <DropdownMenuItem
                  onClick={() => handleApprove(loan)}
                  className="text-emerald-600"
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Approve
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => openRejectDialog(loan)}
                  className="text-red-600"
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  Reject
                </DropdownMenuItem>
              </>
            )}
            {loan.status === "Approved" && (
              <DropdownMenuItem
                onClick={() => handleDisburse(loan)}
                className="text-blue-600"
              >
                <Banknote className="mr-2 h-4 w-4" />
                Disburse
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      ),
      className: "w-12",
    },
  ];

  return (
    <>
      <DataTable
        data={filteredLoans}
        columns={columns}
        searchPlaceholder="Search by ID, client name, or purpose..."
        searchValue={search}
        onSearchChange={setSearch}
        filterOptions={[
          { label: "All Statuses", value: "all" },
          { label: "Pending", value: "Pending" },
          { label: "Approved", value: "Approved" },
          { label: "Rejected", value: "Rejected" },
          { label: "Disbursed", value: "Disbursed" },
          { label: "Active", value: "Active" },
          { label: "NPL", value: "NPL" },
        ]}
        filterValue={statusFilter}
        onFilterChange={setStatusFilter}
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
