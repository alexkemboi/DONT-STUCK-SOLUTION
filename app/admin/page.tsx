import {
  dashboardStats,
  recentActivity,
  loanStatusDistribution,
  monthlyDisbursements,
  formatCurrency,
} from "@/lib/data/dummy-data";
import {
  Users,
  FileText,
  Banknote,
  TrendingUp,
  AlertTriangle,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RecentActivityList } from "@/components/admin/dashboard/recent-activity";
import { LoanStatusChart } from "@/components/admin/dashboard/loan-status-chart";
import { DisbursementChart } from "@/components/admin/dashboard/disbursement-chart";

export default function DashboardPage() {
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
              <Badge variant="secondary" className="bg-emerald-50 text-emerald-700">
                <ArrowUpRight className="mr-1 h-3 w-3" />
                12%
              </Badge>
            </div>
            <div className="mt-4">
              <p className="text-sm font-medium text-slate-500">Total Clients</p>
              <p className="text-3xl font-bold text-slate-900">
                {dashboardStats.totalClients.toLocaleString()}
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
                8%
              </Badge>
            </div>
            <div className="mt-4">
              <p className="text-sm font-medium text-slate-500">Active Loans</p>
              <p className="text-3xl font-bold text-slate-900">
                {dashboardStats.activeLoans}
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
                15%
              </Badge>
            </div>
            <div className="mt-4">
              <p className="text-sm font-medium text-slate-500">Total Disbursed</p>
              <p className="text-2xl font-bold text-slate-900">
                {formatCurrency(dashboardStats.totalDisbursed)}
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
              <Badge variant="secondary" className="bg-amber-50 text-amber-700">
                Needs Review
              </Badge>
            </div>
            <div className="mt-4">
              <p className="text-sm font-medium text-slate-500">Pending Review</p>
              <p className="text-3xl font-bold text-slate-900">
                {dashboardStats.pendingApplications}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Second Row - Larger Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Total Repayments */}
        <Card className="border-slate-200 bg-gradient-to-br from-emerald-500 to-emerald-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white/20">
                <TrendingUp className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-emerald-100">Total Repayments</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(dashboardStats.totalRepayments)}
                </p>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-sm text-emerald-100">
              <ArrowUpRight className="h-4 w-4" />
              <span>18% increase from last month</span>
            </div>
          </CardContent>
        </Card>

        {/* Investor Funds */}
        <Card className="border-slate-200 bg-gradient-to-br from-slate-800 to-slate-900 text-white">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white/10">
                <TrendingUp className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-300">Investor Funds</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(dashboardStats.investorFunds)}
                </p>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-sm text-slate-300">
              <ArrowUpRight className="h-4 w-4" />
              <span>4 new investors this month</span>
            </div>
          </CardContent>
        </Card>

        {/* NPL Alert */}
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-100">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-red-700">Non-Performing Loans</p>
                <p className="text-2xl font-bold text-red-900">
                  {dashboardStats.nplCount}
                </p>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-red-700">Recovery Rate</span>
                <span className="font-semibold text-red-900">
                  {dashboardStats.recoveryRate}%
                </span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-red-200">
                <div
                  className="h-full bg-red-500 transition-all"
                  style={{ width: `${dashboardStats.recoveryRate}%` }}
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
            <LoanStatusChart data={loanStatusDistribution} />
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
            <DisbursementChart data={monthlyDisbursements} />
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
          <RecentActivityList activities={recentActivity} />
        </CardContent>
      </Card>
    </div>
  );
}
