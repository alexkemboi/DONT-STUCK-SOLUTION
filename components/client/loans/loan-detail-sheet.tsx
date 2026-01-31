"use client";

import { useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Loader2, User, Phone, Mail, Shield } from "lucide-react";
import {
  getClientLoanDetailAction,
  type SerializedClientLoan,
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

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("en-KE", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

interface LoanDetailSheetProps {
  loanId: string | null;
  onClose: () => void;
}

export function LoanDetailSheet({ loanId, onClose }: LoanDetailSheetProps) {
  const [loan, setLoan] = useState<SerializedClientLoan | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!loanId) {
      setLoan(null);
      return;
    }

    setLoading(true);
    getClientLoanDetailAction(loanId)
      .then((result) => {
        if (result.success && result.data) {
          setLoan(result.data);
        }
      })
      .finally(() => setLoading(false));
  }, [loanId]);

  // Compute monthly payment using amortization formula
  const computeMonthlyPayment = (loan: SerializedClientLoan) => {
    const principal = loan.approvedAmount || loan.amountRequested;
    const monthlyRate = loan.interestRate / 100 / 12;
    const n = loan.repaymentPeriod;
    if (monthlyRate === 0) return principal / n;
    return (principal * monthlyRate * Math.pow(1 + monthlyRate, n)) /
      (Math.pow(1 + monthlyRate, n) - 1);
  };

  return (
    <Sheet open={!!loanId} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Loan Details</SheetTitle>
          <SheetDescription>
            Full details of your loan application.
          </SheetDescription>
        </SheetHeader>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
          </div>
        ) : loan ? (
          <div className="mt-6 space-y-6 p-6">
            {/* Status & Purpose */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-900">
                  {loan.purpose}
                </h3>
                <Badge className={statusColors[loan.status] || "bg-gray-100 text-gray-800"}>
                  {loan.status}
                </Badge>
              </div>
              <p className="text-sm text-slate-500">
                Applied on {formatDate(loan.appliedAt)}
              </p>
            </div>

            <Separator />

            {/* Financial Details */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-slate-700 uppercase tracking-wider">
                Financial Details
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <DetailItem
                  label="Amount Requested"
                  value={formatCurrency(loan.amountRequested)}
                />
                <DetailItem
                  label="Approved Amount"
                  value={
                    loan.approvedAmount
                      ? formatCurrency(loan.approvedAmount)
                      : "—"
                  }
                />
                <DetailItem
                  label="Interest Rate"
                  value={`${loan.interestRate}% p.a.`}
                />
                <DetailItem
                  label="Repayment Period"
                  value={`${loan.repaymentPeriod} months`}
                />
                <DetailItem
                  label="Monthly Payment"
                  value={formatCurrency(computeMonthlyPayment(loan))}
                />
                <DetailItem
                  label="Total Repayable"
                  value={formatCurrency(
                    computeMonthlyPayment(loan) * loan.repaymentPeriod
                  )}
                />
              </div>
              {loan.qualificationType && (
                <DetailItem
                  label="Qualification Type"
                  value={loan.qualificationType}
                />
              )}
            </div>

            {/* Rejection Reason */}
            {loan.rejectionReason && (
              <>
                <Separator />
                <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                  <p className="text-sm font-medium text-red-800">
                    Rejection Reason
                  </p>
                  <p className="mt-1 text-sm text-red-700">
                    {loan.rejectionReason}
                  </p>
                </div>
              </>
            )}

            <Separator />

            {/* Guarantors */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-slate-700 uppercase tracking-wider">
                Guarantors ({loan.guarantors.length})
              </h4>
              {loan.guarantors.length === 0 ? (
                <p className="text-sm text-slate-500">No guarantors added.</p>
              ) : (
                <div className="space-y-3">
                  {loan.guarantors.map((g) => (
                    <div
                      key={g.id}
                      className="rounded-lg border border-slate-200 bg-slate-50 p-4 space-y-2"
                    >
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-slate-500" />
                        <span className="font-medium text-slate-900">
                          {g.fullName}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                        <span className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {g.phone}
                        </span>
                        {g.email && (
                          <span className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {g.email}
                          </span>
                        )}
                        {g.relationship && (
                          <span className="flex items-center gap-1">
                            <Shield className="h-3 w-3" />
                            {g.relationship}
                          </span>
                        )}
                      </div>
                      <Badge
                        variant="outline"
                        className="text-xs"
                      >
                        {g.confirmationStatus}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-slate-500">{label}</p>
      <p className="text-sm font-medium text-slate-900">{value}</p>
    </div>
  );
}
