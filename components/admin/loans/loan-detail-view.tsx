"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
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
  AlertTriangle,
  CheckCircle,
  XCircle,
  Banknote,
  User,
  Phone,
  Mail,
  CreditCard,
  FileText,
  Shield,
  Loader2,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";
import {
  approveLoanAction,
  rejectLoanAction,
  disburseLoanAction,
  updateGuarantorStatusAction,
  type SerializedLoanDetail,
} from "@/app/actions/loan";
import Link from "next/link";
import { AmortizationSchedule } from "@/components/shared/amortization-schedule";
import { StoredSchedule } from "@/components/shared/stored-schedule";
import type { SerializedSchedule } from "@/app/actions/schedule";

const statusColors: Record<string, string> = {
  Pending: "bg-amber-100 text-amber-800",
  Approved: "bg-emerald-100 text-emerald-800",
  Rejected: "bg-red-100 text-red-800",
  Disbursed: "bg-blue-100 text-blue-800",
  Active: "bg-purple-100 text-purple-800",
  NPL: "bg-red-100 text-red-800",
  Closed: "bg-gray-100 text-gray-800",
};

const guarantorStatusColors: Record<string, string> = {
  Pending: "bg-amber-100 text-amber-800",
  Confirmed: "bg-emerald-100 text-emerald-800",
  Declined: "bg-red-100 text-red-800",
};

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);

const formatDate = (dateString: string | null) => {
  if (!dateString) return "—";
  return new Date(dateString).toLocaleDateString("en-KE", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

interface LoanDetailViewProps {
  loan: SerializedLoanDetail;
  schedule?: SerializedSchedule[];
  scheduleSummary?: {
    totalScheduled: number;
    totalPaid: number;
    totalRemaining: number;
    paidInstallments: number;
    pendingInstallments: number;
    overdueInstallments: number;
    nextDueDate: string | null;
    nextDueAmount: number | null;
  };
}

export function LoanDetailView({ loan, schedule, scheduleSummary }: LoanDetailViewProps) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  const hasDeclinedGuarantor = loan.guarantors.some(
    (g) => g.confirmationStatus === "Declined"
  );
  const hasPendingGuarantor = loan.guarantors.some(
    (g) => g.confirmationStatus === "Pending"
  );
  const canApproveLoan =
    loan.status === "Pending" && !hasDeclinedGuarantor;

  const handleGuarantorAction = async (
    guarantorId: string,
    status: "Confirmed" | "Declined"
  ) => {
    setLoading(guarantorId);
    const result = await updateGuarantorStatusAction(guarantorId, status);
    if (result.success) {
      toast.success(
        `Guarantor ${status === "Confirmed" ? "confirmed" : "declined"}`
      );
      router.refresh();
    } else {
      toast.error(result.error || "Failed to update guarantor");
    }
    setLoading(null);
  };

  const handleApprove = async () => {
    setLoading("approve");
    const result = await approveLoanAction(loan.id);
    if (result.success) {
      toast.success("Loan approved successfully");
      router.refresh();
    } else {
      toast.error(result.error || "Failed to approve loan");
    }
    setLoading(null);
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      toast.error("Please provide a reason for rejection");
      return;
    }
    setLoading("reject");
    const result = await rejectLoanAction(loan.id, rejectionReason.trim());
    if (result.success) {
      toast.success("Loan rejected");
      router.refresh();
    } else {
      toast.error(result.error || "Failed to reject loan");
    }
    setLoading(null);
    setRejectDialogOpen(false);
  };

  const handleDisburse = async () => {
    setLoading("disburse");
    const result = await disburseLoanAction(loan.id);
    if (result.success) {
      toast.success("Loan disbursed successfully");
      router.refresh();
    } else {
      toast.error(result.error || "Failed to disburse loan");
    }
    setLoading(null);
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Loan Details</h1>
          <p className="text-slate-500 text-sm mt-1">
            Application #{loan.id.slice(0, 12)}
          </p>
        </div>
        <Badge className={`text-sm ${statusColors[loan.status] || "bg-gray-100 text-gray-800"}`}>
          {loan.status}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Loan Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Loan Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <InfoItem label="Purpose" value={loan.purpose} />
                <InfoItem
                  label="Amount Requested"
                  value={formatCurrency(loan.amountRequested)}
                />
                <InfoItem
                  label="Approved Amount"
                  value={
                    loan.approvedAmount
                      ? formatCurrency(loan.approvedAmount)
                      : "—"
                  }
                />
                <InfoItem
                  label="Interest Rate"
                  value={`${loan.interestRate}%`}
                />
                <InfoItem
                  label="Repayment Period"
                  value={`${loan.repaymentPeriod} months`}
                />
                <InfoItem
                  label="Qualification"
                  value={loan.qualificationType || "—"}
                />
                <InfoItem label="Applied" value={formatDate(loan.appliedAt)} />
                <InfoItem
                  label="Start Date"
                  value={formatDate(loan.startDate)}
                />
                <InfoItem
                  label="Reviewed By"
                  value={loan.reviewedBy || "—"}
                />
                <InfoItem
                  label="Approved By"
                  value={loan.approvedBy || "—"}
                />
              </div>
              {loan.rejectionReason && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm font-medium text-red-800">
                    Rejection Reason
                  </p>
                  <p className="text-sm text-red-600 mt-1">
                    {loan.rejectionReason}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Repayment Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Repayment Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              {schedule && schedule.length > 0 ? (
                <StoredSchedule
                  schedule={schedule}
                  summary={scheduleSummary}
                  compact={false}
                />
              ) : (
                <AmortizationSchedule
                  principal={loan.approvedAmount || loan.amountRequested}
                  monthlyInterestRate={loan.interestRate}
                  periodMonths={loan.repaymentPeriod}
                  showFullSchedule={true}
                  compact={false}
                />
              )}
            </CardContent>
          </Card>

          {/* Client Information */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Client Information</CardTitle>
                <Link
                  href={`/dss/admin/clients/${loan.client.id}`}
                  className="text-sm text-blue-600 hover:text-blue-800 inline-flex items-center gap-1"
                >
                  View Profile <ExternalLink className="h-3 w-3" />
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-slate-400" />
                  <div>
                    <p className="text-xs text-slate-500">Full Name</p>
                    <p className="text-sm font-medium">
                      {loan.client.surname} {loan.client.otherNames}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-slate-400" />
                  <div>
                    <p className="text-xs text-slate-500">Phone</p>
                    <p className="text-sm font-medium">
                      {loan.client.phoneMobile}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-slate-400" />
                  <div>
                    <p className="text-xs text-slate-500">Email</p>
                    <p className="text-sm font-medium">
                      {loan.client.emailPersonal || "—"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-slate-400" />
                  <div>
                    <p className="text-xs text-slate-500">ID/Passport</p>
                    <p className="text-sm font-medium">
                      {loan.client.idPassportNo}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Guarantors */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                Guarantors ({loan.guarantors.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {hasDeclinedGuarantor && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 shrink-0" />
                  <p className="text-sm text-red-700">
                    This loan cannot be approved because one or more guarantors
                    have been declined.
                  </p>
                </div>
              )}
              {hasPendingGuarantor && !hasDeclinedGuarantor && (
                <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
                  <p className="text-sm text-amber-700">
                    Some guarantors have not yet been confirmed. Review all
                    guarantors before approving.
                  </p>
                </div>
              )}
              {loan.guarantors.length === 0 ? (
                <p className="text-sm text-slate-500 text-center py-4">
                  No guarantors added for this loan.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider border-b">
                        <th className="pb-3 pr-4">Name</th>
                        <th className="pb-3 pr-4">Phone</th>
                        <th className="pb-3 pr-4">ID Number</th>
                        <th className="pb-3 pr-4">Relationship</th>
                        <th className="pb-3 pr-4">Status</th>
                        <th className="pb-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {loan.guarantors.map((g) => (
                        <tr key={g.id} className="text-sm">
                          <td className="py-3 pr-4 font-medium text-slate-900">
                            {g.fullName}
                          </td>
                          <td className="py-3 pr-4 text-slate-600">
                            {g.phone}
                          </td>
                          <td className="py-3 pr-4 text-slate-600">
                            {g.idNumber || "—"}
                          </td>
                          <td className="py-3 pr-4 text-slate-600">
                            {g.relationship || "—"}
                          </td>
                          <td className="py-3 pr-4">
                            <Badge
                              className={
                                guarantorStatusColors[g.confirmationStatus] ||
                                "bg-gray-100 text-gray-800"
                              }
                            >
                              {g.confirmationStatus}
                            </Badge>
                          </td>
                          <td className="py-3">
                            {g.confirmationStatus === "Pending" ? (
                              <div className="flex items-center gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-emerald-600 border-emerald-200 hover:bg-emerald-50"
                                  onClick={() =>
                                    handleGuarantorAction(g.id, "Confirmed")
                                  }
                                  disabled={loading === g.id}
                                >
                                  {loading === g.id ? (
                                    <Loader2 className="h-3 w-3 animate-spin" />
                                  ) : (
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                  )}
                                  Confirm
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-red-600 border-red-200 hover:bg-red-50"
                                  onClick={() =>
                                    handleGuarantorAction(g.id, "Declined")
                                  }
                                  disabled={loading === g.id}
                                >
                                  {loading === g.id ? (
                                    <Loader2 className="h-3 w-3 animate-spin" />
                                  ) : (
                                    <XCircle className="h-3 w-3 mr-1" />
                                  )}
                                  Decline
                                </Button>
                              </div>
                            ) : (
                              <span className="text-xs text-slate-400">
                                {g.confirmedAt
                                  ? formatDate(g.confirmedAt)
                                  : "—"}
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Repayments */}
          {loan.repayments.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  Repayments ({loan.repayments.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider border-b">
                        <th className="pb-3 pr-4">Amount</th>
                        <th className="pb-3 pr-4">Method</th>
                        <th className="pb-3 pr-4">Date</th>
                        <th className="pb-3 pr-4">Category</th>
                        <th className="pb-3">Reference</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {loan.repayments.map((r) => (
                        <tr key={r.id} className="text-sm">
                          <td className="py-3 pr-4 font-medium text-slate-900">
                            {formatCurrency(r.amount)}
                          </td>
                          <td className="py-3 pr-4 text-slate-600">
                            {r.paymentMethod}
                          </td>
                          <td className="py-3 pr-4 text-slate-600">
                            {formatDate(r.paymentDate)}
                          </td>
                          <td className="py-3 pr-4">
                            <Badge variant="secondary">{r.category}</Badge>
                          </td>
                          <td className="py-3 text-slate-500 text-xs font-mono">
                            {r.reference || "—"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Loan Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {loan.status === "Pending" && (
                <>
                  <Button
                    className="w-full bg-emerald-600 hover:bg-emerald-700"
                    onClick={handleApprove}
                    disabled={!canApproveLoan || loading !== null}
                  >
                    {loading === "approve" ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <CheckCircle className="mr-2 h-4 w-4" />
                    )}
                    Approve Loan
                  </Button>
                  <Button
                    variant="destructive"
                    className="w-full"
                    onClick={() => setRejectDialogOpen(true)}
                    disabled={loading !== null}
                  >
                    <XCircle className="mr-2 h-4 w-4" />
                    Reject Loan
                  </Button>
                </>
              )}
              {loan.status === "Approved" && (
                <Button
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  onClick={handleDisburse}
                  disabled={loading !== null}
                >
                  {loading === "disburse" ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Banknote className="mr-2 h-4 w-4" />
                  )}
                  Disburse Loan
                </Button>
              )}
              {!["Pending", "Approved"].includes(loan.status) && (
                <p className="text-sm text-slate-500 text-center py-2">
                  No actions available for {loan.status.toLowerCase()} loans.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Financial Details */}
          {loan.financials && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  Financials
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <InfoItem
                  label="Processing Fee"
                  value={formatCurrency(loan.financials.processingFee)}
                />
                <InfoItem
                  label="Legal Fee"
                  value={formatCurrency(loan.financials.legalFee)}
                />
                <InfoItem
                  label="Penalty Fee"
                  value={formatCurrency(loan.financials.penaltyFee)}
                />
                <InfoItem
                  label="Interest Amount"
                  value={formatCurrency(loan.financials.interestAmount)}
                />
              </CardContent>
            </Card>
          )}

          {/* Disbursement */}
          {loan.disbursement && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Banknote className="h-4 w-4" />
                  Disbursement
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <InfoItem
                  label="Amount"
                  value={formatCurrency(loan.disbursement.amount)}
                />
                <InfoItem label="Method" value={loan.disbursement.method} />
                <InfoItem
                  label="Reference"
                  value={loan.disbursement.reference || "—"}
                />
                <InfoItem
                  label="Disbursed"
                  value={formatDate(loan.disbursement.disbursedAt)}
                />
              </CardContent>
            </Card>
          )}

          {/* Security */}
          {loan.security && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Security Documents
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <SecurityCheck label="ID Copy" checked={loan.security.idCopy} />
                <SecurityCheck
                  label="Passport Photo"
                  checked={loan.security.passportPhoto}
                />
                <SecurityCheck
                  label="Appointment Letter"
                  checked={loan.security.appointmentLetter}
                />
                <SecurityCheck
                  label="Payslips"
                  checked={loan.security.payslips}
                />
                <SecurityCheck
                  label="Bank Statement"
                  checked={loan.security.bankStatement}
                />
                {loan.security.chequeLeafNo && (
                  <InfoItem
                    label="Cheque Leaf No"
                    value={loan.security.chequeLeafNo}
                  />
                )}
              </CardContent>
            </Card>
          )}

          {/* Documents */}
          {loan.documents.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Documents ({loan.documents.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {loan.documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between p-2 rounded-lg bg-slate-50"
                  >
                    <div>
                      <p className="text-sm font-medium text-slate-900">
                        {doc.fileName}
                      </p>
                      <p className="text-xs text-slate-500">
                        {doc.documentType} — {formatDate(doc.uploadedAt)}
                      </p>
                    </div>
                    <a
                      href={doc.filePath}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Reject Dialog */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Reject Loan Application</DialogTitle>
            <DialogDescription>
              Rejecting {formatCurrency(loan.amountRequested)} application from{" "}
              <span className="font-medium">
                {loan.client.surname} {loan.client.otherNames}
              </span>
              .
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
              onClick={handleReject}
              disabled={loading !== null || !rejectionReason.trim()}
            >
              {loading === "reject" ? (
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

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-slate-500">{label}</p>
      <p className="text-sm font-medium text-slate-900">{value}</p>
    </div>
  );
}

function SecurityCheck({
  label,
  checked,
}: {
  label: string;
  checked: boolean;
}) {
  return (
    <div className="flex items-center gap-2">
      {checked ? (
        <CheckCircle className="h-4 w-4 text-emerald-500" />
      ) : (
        <XCircle className="h-4 w-4 text-slate-300" />
      )}
      <span className={`text-sm ${checked ? "text-slate-900" : "text-slate-400"}`}>
        {label}
      </span>
    </div>
  );
}
