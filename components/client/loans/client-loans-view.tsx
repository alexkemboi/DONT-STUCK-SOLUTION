"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  Search,
  ArrowRight,
  Banknote,
  AlertTriangle,
} from "lucide-react";
import type { LoanApplication } from "@/lib/generated/prisma";
import { LoanDetailSheet } from "./loan-detail-sheet";

const statusConfig: Record<
  string,
  { color: string; icon: React.ElementType; label: string }
> = {
  Pending: { color: "bg-amber-100 text-amber-800", icon: Clock, label: "Pending Review" },
  Approved: { color: "bg-emerald-100 text-emerald-800", icon: CheckCircle, label: "Approved" },
  Rejected: { color: "bg-red-100 text-red-800", icon: XCircle, label: "Rejected" },
  Disbursed: { color: "bg-blue-100 text-blue-800", icon: Banknote, label: "Disbursed" },
  Active: { color: "bg-purple-100 text-purple-800", icon: FileText, label: "Active" },
  NPL: { color: "bg-red-100 text-red-800", icon: AlertTriangle, label: "Non-Performing" },
  Closed: { color: "bg-gray-100 text-gray-800", icon: CheckCircle, label: "Closed" },
};

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);

const formatDate = (date: string | Date) =>
  new Date(date).toLocaleDateString("en-KE", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

interface ClientLoansViewProps {
  loans: LoanApplication[];
}

export function ClientLoansView({ loans }: ClientLoansViewProps) {
  const [search, setSearch] = useState("");
  const [selectedLoanId, setSelectedLoanId] = useState<string | null>(null);

  const filteredLoans = loans.filter(
    (loan) =>
      loan.purpose.toLowerCase().includes(search.toLowerCase()) ||
      loan.status.toLowerCase().includes(search.toLowerCase())
  );

  const pendingCount = loans.filter((l) => l.status === "Pending").length;
  const activeCount = loans.filter(
    (l) => l.status === "Approved" || l.status === "Disbursed" || l.status === "Active"
  ).length;
  const totalRequested = loans.reduce(
    (sum, l) => sum + Number(l.amountRequested),
    0
  );

  return (
    <>
      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border-slate-200">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
              <FileText className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Total Applications</p>
              <p className="text-xl font-bold text-slate-900">{loans.length}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50">
              <Clock className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Pending</p>
              <p className="text-xl font-bold text-slate-900">{pendingCount}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50">
              <Banknote className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Total Requested</p>
              <p className="text-xl font-bold text-slate-900">
                {formatCurrency(totalRequested)}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <Input
          type="search"
          placeholder="Search by purpose or status..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Loans list */}
      {filteredLoans.length === 0 ? (
        <Card className="border-slate-200">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <FileText className="h-12 w-12 text-slate-300" />
            <p className="mt-4 text-lg font-medium text-slate-900">
              {loans.length === 0 ? "No loan applications yet" : "No matching loans"}
            </p>
            <p className="mt-1 text-sm text-slate-500">
              {loans.length === 0
                ? "Apply for a loan to get started."
                : "Try adjusting your search."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredLoans.map((loan) => {
            const config = statusConfig[loan.status] || statusConfig.Pending;
            const StatusIcon = config.icon;

            return (
              <Card
                key={loan.id}
                className="border-slate-200 transition-shadow hover:shadow-md cursor-pointer"
                onClick={() => setSelectedLoanId(loan.id)}
              >
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100">
                          <StatusIcon className="h-4 w-4 text-slate-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">
                            {loan.purpose}
                          </p>
                          <p className="text-xs text-slate-500">
                            Applied {formatDate(loan.appliedAt)}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm">
                        <div>
                          <span className="text-slate-500">Requested: </span>
                          <span className="font-medium text-slate-900">
                            {formatCurrency(Number(loan.amountRequested))}
                          </span>
                        </div>
                        {loan.approvedAmount && (
                          <div>
                            <span className="text-slate-500">Approved: </span>
                            <span className="font-medium text-emerald-700">
                              {formatCurrency(Number(loan.approvedAmount))}
                            </span>
                          </div>
                        )}
                        <div>
                          <span className="text-slate-500">Period: </span>
                          <span className="font-medium text-slate-900">
                            {loan.repaymentPeriod} months
                          </span>
                        </div>
                      </div>

                      {loan.rejectionReason && (
                        <p className="text-sm text-red-600 bg-red-50 rounded-md px-3 py-1.5">
                          Reason: {loan.rejectionReason}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <Badge className={config.color}>{config.label}</Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-slate-500 hover:text-slate-900"
                      >
                        Details
                        <ArrowRight className="ml-1 h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Loan detail sheet */}
      <LoanDetailSheet
        loanId={selectedLoanId}
        onClose={() => setSelectedLoanId(null)}
      />
    </>
  );
}
