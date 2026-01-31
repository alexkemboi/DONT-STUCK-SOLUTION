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
import { Loader2, Plus } from "lucide-react";
import { toast } from "sonner";
import {
  recordRepaymentAction,
  type SerializedRepayment,
} from "@/app/actions/repayment";
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

  // Form state
  const [formLoanId, setFormLoanId] = useState("");
  const [formAmount, setFormAmount] = useState("");
  const [formMethod, setFormMethod] = useState<PaymentMethod | "">("");
  const [formDate, setFormDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [formCategory, setFormCategory] = useState<RepaymentCategory | "">("");
  const [formReference, setFormReference] = useState("");

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
    const result = await recordRepaymentAction({
      loanId: formLoanId,
      amount,
      paymentMethod: formMethod as PaymentMethod,
      paymentDate: formDate,
      category: formCategory as RepaymentCategory,
      reference: formReference || undefined,
    });

    if (result.success) {
      toast.success("Repayment recorded", {
        description: `${formatCurrency(amount)} payment recorded successfully.`,
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
            <DialogTitle>Record Repayment</DialogTitle>
            <DialogDescription>
              Record a manual loan repayment from a client.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Loan Selection */}
            <div className="space-y-2">
              <Label>Loan *</Label>
              <Select value={formLoanId} onValueChange={setFormLoanId}>
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
                  Record Payment
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
