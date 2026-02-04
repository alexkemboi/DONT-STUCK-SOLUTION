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
import { getScheduleAction, getScheduleSummaryAction, type SerializedSchedule } from "@/app/actions/schedule";
import { AmortizationSchedule } from "@/components/shared/amortization-schedule";
import { StoredSchedule } from "@/components/shared/stored-schedule";

const statusColors: Record<string, string> = {
  Pending: "bg-amber-100 text-amber-800",
  Approved: "bg-emerald-100 text-emerald-800",
  Rejected: "bg-red-100 text-red-800",
  Disbursed: "bg-blue-100 text-blue-800",
  Active: "bg-purple-100 text-purple-800",
  NPL: "bg-red-100 text-red-800",
  Closed: "bg-gray-100 text-gray-800",
};

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
  const [schedule, setSchedule] = useState<SerializedSchedule[]>([]);
  const [scheduleSummary, setScheduleSummary] = useState<{
    totalScheduled: number;
    totalPaid: number;
    totalRemaining: number;
    paidInstallments: number;
    pendingInstallments: number;
    overdueInstallments: number;
    nextDueDate: string | null;
    nextDueAmount: number | null;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!loanId) {
      setLoan(null);
      setSchedule([]);
      setScheduleSummary(null);
      return;
    }

    setLoading(true);
    Promise.all([
      getClientLoanDetailAction(loanId),
      getScheduleAction(loanId),
      getScheduleSummaryAction(loanId),
    ])
      .then(([loanResult, scheduleResult, summaryResult]) => {
        if (loanResult.success && loanResult.data) {
          setLoan(loanResult.data);
        }
        if (scheduleResult.success && scheduleResult.data) {
          setSchedule(scheduleResult.data);
        }
        if (summaryResult.success && summaryResult.data) {
          setScheduleSummary(summaryResult.data);
        }
      })
      .finally(() => setLoading(false));
  }, [loanId]);

  return (
    <Sheet open={!!loanId} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Loan Details</SheetTitle>
          <SheetDescription>
            Full details of your loan application including repayment breakdown.
          </SheetDescription>
        </SheetHeader>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
          </div>
        ) : loan ? (
          <div className="mt-6 space-y-6 pr-2">
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

            {/* Amortization Schedule */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-slate-700 uppercase tracking-wider">
                Repayment Breakdown
              </h4>
              {schedule.length > 0 ? (
                <StoredSchedule
                  schedule={schedule}
                  summary={scheduleSummary || undefined}
                  compact={true}
                />
              ) : (
                <AmortizationSchedule
                  principal={loan.approvedAmount || loan.amountRequested}
                  monthlyInterestRate={loan.interestRate}
                  periodMonths={loan.repaymentPeriod}
                  showFullSchedule={true}
                  compact={true}
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
