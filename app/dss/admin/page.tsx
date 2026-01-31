import { getAdminDashboardData } from "@/app/actions/dashboard";
import {
  Users,
  FileText,
  Banknote,
  TrendingUp,
  AlertTriangle,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RecentActivityList } from "@/components/admin/dashboard/recent-activity";
import { LoanStatusChart } from "@/components/admin/dashboard/loan-status-chart";
import { DisbursementChart } from "@/components/admin/dashboard/disbursement-chart";
import { formatCurrency } from "@/lib/utils";

export default async function DashboardPage() {
  const result = await getAdminDashboardData();

  console.log(result, "resul. ")
  const stats = result.data;

  if (!stats) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <p className="text-slate-500">Failed to load dashboard data.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-500">
          Welcome back! Here&apos;s what&apos;s happening with your loan portfolio.
        </p>
      </div>

      {/* Bento Grid Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Clients */}
        <Card className="border-slate-200 bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <Badge variant="secondary" className="bg-blue-50 text-blue-700">
                All Time
              </Badge>
            </div>
            <div className="mt-4">
              <p className="text-sm font-medium text-slate-500">Total Clients</p>
              <p className="text-3xl font-bold text-slate-900">
                {stats.totalClients.toLocaleString()}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Active Loans */}
        <Card className="border-slate-200 bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-50">
                <FileText className="h-6 w-6 text-purple-600" />
              </div>
              <Badge variant="secondary" className="bg-emerald-50 text-emerald-700">
                <ArrowUpRight className="mr-1 h-3 w-3" />
                Active
              </Badge>
            </div>
            <div className="mt-4">
              <p className="text-sm font-medium text-slate-500">Active Loans</p>
              <p className="text-3xl font-bold text-slate-900">
                {stats.activeLoans}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Total Disbursed */}
        <Card className="border-slate-200 bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-50">
                <Banknote className="h-6 w-6 text-emerald-600" />
              </div>
              <Badge variant="secondary" className="bg-emerald-50 text-emerald-700">
                <ArrowUpRight className="mr-1 h-3 w-3" />
                Disbursed
              </Badge>
            </div>
            <div className="mt-4">
              <p className="text-sm font-medium text-slate-500">Total Disbursed</p>
              <p className="text-2xl font-bold text-slate-900">
                {formatCurrency(stats.totalDisbursed)}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Pending Applications */}
        <Card className="border-slate-200 bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-50">
                <Clock className="h-6 w-6 text-amber-600" />
              </div>
              {stats.pendingApplications > 0 ? (
                <Badge variant="secondary" className="bg-amber-50 text-amber-700">
                  Needs Review
                </Badge>
              ) : (
                <Badge variant="secondary" className="bg-slate-50 text-slate-600">
                  Clear
                </Badge>
              )}
            </div>
            <div className="mt-4">
              <p className="text-sm font-medium text-slate-500">Pending Review</p>
              <p className="text-3xl font-bold text-slate-900">
                {stats.pendingApplications}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Second Row - Larger Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Total Repayments */}
        <Card className="border-slate-200 bg-linear-to-br from-emerald-500 to-emerald-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white/20">
                <TrendingUp className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-emerald-100">Total Repayments</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(stats.totalRepayments)}
                </p>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-sm text-emerald-100">
              <ArrowUpRight className="h-4 w-4" />
              <span>Collected across all loans</span>
            </div>
          </CardContent>
        </Card>

        {/* Total Outstanding */}
        <Card className="border-slate-200 bg-linear-to-br from-slate-800 to-slate-900 text-white">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white/10">
                <Wallet className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-300">Total Outstanding</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(stats.totalOutstanding)}
                </p>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-sm text-slate-300">
              <ArrowDownRight className="h-4 w-4" />
              <span>Remaining balance to collect</span>
            </div>
          </CardContent>
        </Card>

        {/* NPL Alert */}
        <Card className={stats.nplCount > 0 ? "border-red-200 bg-red-50" : "border-slate-200 bg-white"}>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${stats.nplCount > 0 ? "bg-red-100" : "bg-slate-100"}`}>
                <AlertTriangle className={`h-6 w-6 ${stats.nplCount > 0 ? "text-red-600" : "text-slate-400"}`} />
              </div>
              <div>
                <p className={`text-sm font-medium ${stats.nplCount > 0 ? "text-red-700" : "text-slate-500"}`}>
                  Non-Performing Loans
                </p>
                <p className={`text-2xl font-bold ${stats.nplCount > 0 ? "text-red-900" : "text-slate-900"}`}>
                  {stats.nplCount}
                </p>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center justify-between text-sm">
                <span className={stats.nplCount > 0 ? "text-red-700" : "text-slate-500"}>
                  Recovery Rate
                </span>
                <span className={`font-semibold ${stats.nplCount > 0 ? "text-red-900" : "text-slate-900"}`}>
                  {stats.recoveryRate}%
                </span>
              </div>
              <div className={`mt-2 h-2 overflow-hidden rounded-full ${stats.nplCount > 0 ? "bg-red-200" : "bg-slate-200"}`}>
                <div
                  className={`h-full transition-all ${stats.nplCount > 0 ? "bg-red-500" : "bg-emerald-500"}`}
                  style={{ width: `${stats.recoveryRate}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Third Row - Charts and Activity */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Loan Status Distribution */}
        <Card className="border-slate-200 bg-white lg:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-slate-900">
              Loan Status Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            {stats.loanStatusDistribution.length > 0 ? (
              <LoanStatusChart data={stats.loanStatusDistribution} />
            ) : (
              <p className="py-8 text-center text-sm text-slate-400">No loan data yet</p>
            )}
          </CardContent>
        </Card>

        {/* Monthly Disbursements */}
        <Card className="border-slate-200 bg-white lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-slate-900">
              Monthly Disbursements
            </CardTitle>
          </CardHeader>
          <CardContent>
            {stats.monthlyDisbursements.length > 0 ? (
              <DisbursementChart data={stats.monthlyDisbursements} />
            ) : (
              <p className="py-8 text-center text-sm text-slate-400">No disbursement data yet</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Fourth Row - Recent Activity */}
      <Card className="border-slate-200 bg-white">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold text-slate-900">
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          {stats.recentActivity.length > 0 ? (
            <RecentActivityList activities={stats.recentActivity} />
          ) : (
            <p className="py-8 text-center text-sm text-slate-400">No activity recorded yet</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
