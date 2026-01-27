import { loans, formatCurrency } from "@/lib/data/dummy-data";
import { LoansTable } from "@/components/admin/loans/loans-table";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Clock, CheckCircle, AlertTriangle } from "lucide-react";

export default function LoansPage() {
  const pendingLoans = loans.filter((l) => l.status === "Pending").length;
  const approvedLoans = loans.filter(
    (l) => l.status === "Approved" || l.status === "Disbursed"
  ).length;
  const nplLoans = loans.filter((l) => l.status === "NPL").length;
  const totalRequested = loans.reduce((sum, l) => sum + l.amount, 0);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Loan Applications</h1>
        <p className="text-slate-500">
          Review, approve, and manage loan applications.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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

        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100">
              <Clock className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-amber-700">Pending Review</p>
              <p className="text-xl font-bold text-amber-900">{pendingLoans}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50">
              <CheckCircle className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Approved/Disbursed</p>
              <p className="text-xl font-bold text-slate-900">{approvedLoans}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-50">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">NPL</p>
              <p className="text-xl font-bold text-slate-900">{nplLoans}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Summary Card */}
      <Card className="border-slate-200 bg-gradient-to-r from-slate-800 to-slate-900">
        <CardContent className="p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-slate-400">Total Amount Requested</p>
              <p className="text-2xl font-bold text-white">
                {formatCurrency(totalRequested)}
              </p>
            </div>
            <div className="h-px w-full bg-slate-700 sm:h-12 sm:w-px" />
            <div>
              <p className="text-sm text-slate-400">Average Loan Size</p>
              <p className="text-2xl font-bold text-white">
                {formatCurrency(totalRequested / loans.length)}
              </p>
            </div>
            <div className="h-px w-full bg-slate-700 sm:h-12 sm:w-px" />
            <div>
              <p className="text-sm text-slate-400">Approval Rate</p>
              <p className="text-2xl font-bold text-emerald-400">
                {Math.round((approvedLoans / loans.length) * 100)}%
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Loans Table */}
      <LoansTable loans={loans} />
    </div>
  );
}
