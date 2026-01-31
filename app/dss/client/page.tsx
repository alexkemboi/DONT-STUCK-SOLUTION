import { getClientDashboardData } from "@/app/actions/dashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  FileText,
  User,
  Handshake,
  ArrowRight,
  FolderOpen,
  Banknote,
  CreditCard,
  TrendingUp,
} from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";

const statusColors: Record<string, string> = {
  Pending: "bg-amber-100 text-amber-800",
  Approved: "bg-blue-100 text-blue-800",
  Rejected: "bg-red-100 text-red-800",
  Disbursed: "bg-purple-100 text-purple-800",
  Active: "bg-emerald-100 text-emerald-800",
  NPL: "bg-red-100 text-red-800",
  Closed: "bg-slate-100 text-slate-800",
};

export default async function ClientDashboardPage() {
  const result = await getClientDashboardData();
  const data = result.data;

  if (!data) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <p className="text-slate-500">Failed to load dashboard data.</p>
      </div>
    );
  }

  const outstandingBalance = Math.max(0, data.totalBorrowed - data.totalRepaid);

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Welcome back, {data.clientName.split(" ")[0]}!
        </h1>
        <p className="text-slate-500">
          Here&apos;s an overview of your account and loan activity.
        </p>
      </div>

      {/* Apply for Loan - Hero Card */}
      <Card className="border-0 bg-linear-to-br from-blue-500 to-blue-600 text-white">
        <CardContent className="flex items-center justify-between p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white/20">
              <Handshake className="h-6 w-6" />
            </div>
            <div>
              <p className="text-lg font-bold">Need funds?</p>
              <p className="text-blue-100">
                Start a new loan application in minutes.
              </p>
            </div>
          </div>
          <Link href="/dss/client/apply">
            <Button variant="secondary" className="group text-blue-600">
              Apply Now
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-slate-200">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Total Loans</p>
                <p className="text-2xl font-bold text-slate-900">{data.totalLoans}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50">
                <TrendingUp className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Active Loans</p>
                <p className="text-2xl font-bold text-slate-900">{data.activeLoans}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50">
                <Banknote className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Total Borrowed</p>
                <p className="text-lg font-bold text-slate-900">{formatCurrency(data.totalBorrowed)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50">
                <CreditCard className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Outstanding</p>
                <p className="text-lg font-bold text-slate-900">{formatCurrency(outstandingBalance)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Applications & Quick Actions */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Recent Applications */}
        <Card className="border-slate-200 lg:col-span-2">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold text-slate-900">
                Recent Applications
              </CardTitle>
              {data.recentApplications.length > 0 && (
                <Link
                  href="/dss/client/loans"
                  className="text-sm font-medium text-blue-600 hover:text-blue-700"
                >
                  View all
                </Link>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {data.recentApplications.length > 0 ? (
              <div className="space-y-3">
                {data.recentApplications.map((loan) => (
                  <div
                    key={loan.id}
                    className="flex items-center justify-between rounded-lg border border-slate-100 p-3"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-slate-900 truncate">
                        {loan.purpose}
                      </p>
                      <p className="text-xs text-slate-500">
                        {formatCurrency(loan.amount)} &middot; {formatDate(loan.appliedAt)}
                      </p>
                    </div>
                    <Badge className={statusColors[loan.status] || "bg-slate-100 text-slate-800"}>
                      {loan.status}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <FileText className="mb-2 h-8 w-8 text-slate-300" />
                <p className="text-sm text-slate-400">
                  No loan applications yet
                </p>
                <Link href="/dss/client/apply">
                  <Button variant="link" size="sm" className="mt-1 text-blue-600">
                    Apply for your first loan
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="border-slate-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold text-slate-900">
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href="/dss/client/loans" className="block">
              <div className="flex items-center gap-3 rounded-lg border border-slate-100 p-3 transition-colors hover:bg-slate-50">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-50">
                  <FolderOpen className="h-4 w-4 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">My Loans</p>
                  <p className="text-xs text-slate-500">View all your loans</p>
                </div>
              </div>
            </Link>
            <Link href="/dss/client/profile" className="block">
              <div className="flex items-center gap-3 rounded-lg border border-slate-100 p-3 transition-colors hover:bg-slate-50">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50">
                  <User className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">Profile</p>
                  <p className="text-xs text-slate-500">Update your details</p>
                </div>
              </div>
            </Link>
            <Link href="/dss/client/apply" className="block">
              <div className="flex items-center gap-3 rounded-lg border border-slate-100 p-3 transition-colors hover:bg-slate-50">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50">
                  <Handshake className="h-4 w-4 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">New Application</p>
                  <p className="text-xs text-slate-500">Apply for a loan</p>
                </div>
              </div>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
