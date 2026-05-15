"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DataTable } from "@/components/admin/shared/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Loader2,
  Plus,
  Calendar,
  AlertCircle,
  MoreVertical,
  Pencil,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import {
  recordRepaymentAction,
  updateRepaymentAction,
  type SerializedRepayment,
} from "@/app/actions/repayment";
import { getNextInstallmentAction, type SerializedSchedule } from "@/app/actions/schedule";
import type { PaymentMethod, RepaymentCategory } from "@/lib/generated/prisma";

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

interface LoanOption {
  id: string;
  clientName: string;
  purpose: string;
  amountRequested: number;
  approvedAmount: number | null;
}

interface RepaymentsDashboardProps {
  repayments: SerializedRepayment[];
  loans: LoanOption[];
}

export function RepaymentsDashboard({
  repayments,
  loans,
}: RepaymentsDashboardProps) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [methodFilter, setMethodFilter] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editingRepayment, setEditingRepayment] =
  useState<SerializedRepayment | null>(null);

  // Form state
  const [formLoanId, setFormLoanId] = useState("");
  const [formAmount, setFormAmount] = useState("");
  const [formMethod, setFormMethod] = useState<PaymentMethod | "">("");
  const [formDate, setFormDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [formCategory, setFormCategory] = useState<RepaymentCategory | "">("");
  const [formReference, setFormReference] = useState("");

  // Schedule state
  const [nextInstallment, setNextInstallment] = useState<SerializedSchedule | null>(null);
  const [loadingSchedule, setLoadingSchedule] = useState(false);

  // Fetch next installment when loan is selected
  const handleLoanSelect = async (loanId: string) => {
    setFormLoanId(loanId);
    setNextInstallment(null);

    if (loanId) {
      setLoadingSchedule(true);
      const result = await getNextInstallmentAction(loanId);
      if (result.success && result.data) {
        setNextInstallment(result.data);
        // Pre-fill amount with scheduled payment
        setFormAmount(result.data.scheduledPayment.toString());
      }
      setLoadingSchedule(false);
    }
  };

  const filteredRepayments = repayments.filter((r) => {
    const matchesSearch =
      r.clientName.toLowerCase().includes(search.toLowerCase()) ||
      r.loanPurpose.toLowerCase().includes(search.toLowerCase()) ||
      (r.reference || "").toLowerCase().includes(search.toLowerCase());
    const matchesMethod =
      methodFilter === "all" || r.paymentMethod === methodFilter;
    return matchesSearch && matchesMethod;
  });

  const resetForm = () => {
    setFormLoanId("");
    setFormAmount("");
    setFormMethod("");
    setFormDate(new Date().toISOString().split("T")[0]);
    setFormCategory("");
    setFormReference("");
    setNextInstallment(null);
  };


  const handleEditRepayment = (
  repayment: SerializedRepayment
) => {

  setEditingRepayment(repayment);

  setFormLoanId(repayment.loanId || "");

  setFormAmount(repayment.amount.toString());

  setFormMethod(
    repayment.paymentMethod as PaymentMethod
  );

  setFormDate(
    repayment.paymentDate.split("T")[0]
  );

  setFormCategory(
    repayment.category as RepaymentCategory
  );

  setFormReference(repayment.reference || "");

  setDialogOpen(true);
};


  const handleSubmit = async () => {
    if (!formLoanId || !formAmount || !formMethod || !formDate || !formCategory) {
      toast.error("Please fill in all required fields");
      return;
    }

    const amount = parseFloat(formAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    setSubmitting(true);
   const result = editingRepayment

  ? await updateRepaymentAction({
      repaymentId: editingRepayment.id,
      amount,
      paymentMethod: formMethod as PaymentMethod,
      paymentDate: formDate,
      category: formCategory as RepaymentCategory,
      reference: formReference || undefined,
    })

  : await recordRepaymentAction({
      loanId: formLoanId,
      amount,
      paymentMethod: formMethod as PaymentMethod,
      paymentDate: formDate,
      category: formCategory as RepaymentCategory,
      reference: formReference || undefined,
    });

    if (result.success) {
toast.success(
  editingRepayment
    ? "Repayment updated"
    : "Repayment recorded",
{
        description: editingRepayment
  ? `${formatCurrency(amount)} payment updated successfully.`
  : `${formatCurrency(amount)} payment recorded successfully.`,
      });
      setDialogOpen(false);
      resetForm();
      router.refresh();
    } else {
      toast.error(result.error || "Failed to record repayment");
    }
    setSubmitting(false);
  };

  const columns = [
    {
      key: "clientName",
      header: "Client",
      render: (r: SerializedRepayment) => (
        <div>
          <p className="font-medium text-slate-900">{r.clientName}</p>
          <p className="text-xs text-slate-500">{r.loanPurpose}</p>
        </div>
      ),
    },
    {
      key: "amount",
      header: "Amount",
      render: (r: SerializedRepayment) => (
        <span className="font-medium text-slate-900">
          {formatCurrency(r.amount)}
        </span>
      ),
      className: "text-right",
    },
    {
      key: "paymentMethod",
      header: "Method",
      render: (r: SerializedRepayment) => (
        <Badge className={methodColors[r.paymentMethod] || "bg-gray-100 text-gray-800"}>
          {r.paymentMethod}
        </Badge>
      ),
    },
    {
      key: "category",
      header: "Category",
      render: (r: SerializedRepayment) => (
        <span className="text-sm text-slate-600">{r.category}</span>
      ),
    },
    {
      key: "paymentDate",
      header: "Date",
      render: (r: SerializedRepayment) => (
        <span className="text-sm text-slate-500">
          {formatDate(r.paymentDate)}
        </span>
      ),
    },
    {
      key: "reference",
      header: "Reference",
      render: (r: SerializedRepayment) => (
        <span className="text-sm text-slate-500 font-mono">
          {r.reference || "—"}
        </span>
      ),
    },
    {
  key: "reference",
  header: "Reference",
  render: (r: SerializedRepayment) => (
    <div className="flex items-center justify-between gap-2">

      <span className="text-sm text-slate-500 font-mono">
        {r.reference || "—"}
      </span>

      <DropdownMenu>

        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
          >
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">

          <DropdownMenuItem
            onClick={() => handleEditRepayment(r)}
          >
            <Pencil className="mr-2 h-4 w-4" />
            Edit Repayment
          </DropdownMenuItem>

        </DropdownMenuContent>

      </DropdownMenu>

    </div>
  ),
},
  ];

  const selectedLoan = loans.find((l) => l.id === formLoanId);

  return (
    <>
      <DataTable
        data={filteredRepayments}
        columns={columns}
        searchPlaceholder="Search by client, purpose, or reference..."
        searchValue={search}
        onSearchChange={setSearch}
        filterOptions={[
          { label: "All Methods", value: "all" },
          { label: "Cash", value: "Cash" },
          { label: "Bank", value: "Bank" },
          { label: "M-Pesa", value: "Mpesa" },
        ]}
        filterValue={methodFilter}
        onFilterChange={setMethodFilter}
        onAddClick={() => setDialogOpen(true)}
        addButtonLabel="Record Payment"
      />

      {/* Record Payment Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
        <DialogTitle>
  {editingRepayment
    ? "Edit Repayment"
    : "Record Repayments"}
</DialogTitle>
            <DialogDescription>
      {editingRepayment
  ? "Update repayment details."
  : "Record a manual loan repayment from a client."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Loan Selection */}
            <div className="space-y-2">
              <Label>Loan *</Label>
              <Select value={formLoanId} onValueChange={handleLoanSelect}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a loan" />
                </SelectTrigger>
                <SelectContent>
                  {loans.map((loan) => (
                    <SelectItem key={loan.id} value={loan.id}>
                      {loan.clientName} — {loan.purpose} (
                      {formatCurrency(loan.approvedAmount || loan.amountRequested)})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedLoan && (
                <p className="text-xs text-slate-500">
                  Loan amount: {formatCurrency(selectedLoan.approvedAmount || selectedLoan.amountRequested)}
                </p>
              )}
              {loadingSchedule && (
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Loading schedule...
                </div>
              )}
              {nextInstallment && !loadingSchedule && (
                <div className="mt-2 p-3 rounded-lg bg-blue-50 border border-blue-200">
                  <div className="flex items-start gap-2">
                    <Calendar className="h-4 w-4 text-blue-600 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium text-blue-900">
                        Installment #{nextInstallment.installmentNumber}
                      </p>
                      <p className="text-blue-700">
                        Due: {formatDate(nextInstallment.dueDate)} — {formatCurrency(nextInstallment.scheduledPayment)}
                      </p>
                      {nextInstallment.status === "Overdue" && (
                        <div className="flex items-center gap-1 mt-1 text-red-600">
                          <AlertCircle className="h-3 w-3" />
                          <span className="text-xs font-medium">Overdue</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Amount */}
            <div className="space-y-2">
              <Label>Amount (KES) *</Label>
              <Input
                type="number"
                placeholder="e.g. 5000"
                value={formAmount}
                onChange={(e) => setFormAmount(e.target.value)}
                min="1"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Payment Method */}
              <div className="space-y-2">
                <Label>Method *</Label>
                <Select
                  value={formMethod}
                  onValueChange={(v) => setFormMethod(v as PaymentMethod)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Cash">Cash</SelectItem>
                    <SelectItem value="Bank">Bank Transfer</SelectItem>
                    <SelectItem value="Mpesa">M-Pesa</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label>Category *</Label>
                <Select
                  value={formCategory}
                  onValueChange={(v) => setFormCategory(v as RepaymentCategory)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Employment">Employment</SelectItem>
                    <SelectItem value="Business">Business</SelectItem>
                    <SelectItem value="Repeat">Repeat</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Payment Date */}
            <div className="space-y-2">
              <Label>Payment Date *</Label>
              <Input
                type="date"
                value={formDate}
                onChange={(e) => setFormDate(e.target.value)}
              />
            </div>

            {/* Reference */}
            <div className="space-y-2">
              <Label>Reference (optional)</Label>
              <Input
                placeholder="e.g. M-Pesa code, receipt number"
                value={formReference}
                onChange={(e) => setFormReference(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => {
                setDialogOpen(false);
                resetForm();
                setEditingRepayment(null);
              }}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={submitting || !formLoanId || !formAmount || !formMethod || !formCategory}
            >
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Recording...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
              {editingRepayment
  ? "Update Payment"
  : "Record Payment"}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
