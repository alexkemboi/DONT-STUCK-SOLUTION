"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Banknote,
  TrendingUp,
  PieChart,
  ArrowUpRight,
  FileText,
  Percent,
  Calculator,
  Wallet,
} from "lucide-react";
import type { LoanPortfolioSummary } from "@/app/actions/reports";

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

interface PortfolioReportProps {
  data: LoanPortfolioSummary;
}

export function PortfolioReport({ data }: PortfolioReportProps) {
  const maxMonthlyAmount = Math.max(
    ...data.monthlyApplications.map((m) => m.amount),
    1
  );
  const maxMonthlyRepayment = Math.max(
    ...data.monthlyRepayments.map((m) => m.amount),
    1
  );

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KPICard
          icon={FileText}
          iconBg="bg-blue-50"
          iconColor="text-blue-600"
          label="Total Loans"
          value={data.totalLoans.toString()}
        />
        <KPICard
          icon={Banknote}
          iconBg="bg-emerald-50"
          iconColor="text-emerald-600"
          label="Total Disbursed"
          value={formatCurrency(data.totalDisbursed)}
        />
        <KPICard
          icon={Wallet}
          iconBg="bg-amber-50"
          iconColor="text-amber-600"
          label="Outstanding"
          value={formatCurrency(data.totalOutstanding)}
        />
        <KPICard
          icon={TrendingUp}
          iconBg="bg-purple-50"
          iconColor="text-purple-600"
          label="Total Repaid"
          value={formatCurrency(data.totalRepaid)}
        />
      </div>

      {/* Secondary KPIs */}
      <div className="grid gap-4 sm:grid-cols-3">
        <KPICard
          icon={Percent}
          iconBg="bg-emerald-50"
          iconColor="text-emerald-600"
          label="Approval Rate"
          value={`${data.approvalRate}%`}
        />
        <KPICard
          icon={Calculator}
          iconBg="bg-indigo-50"
          iconColor="text-indigo-600"
          label="Avg. Loan Size"
          value={formatCurrency(data.averageLoanSize)}
        />
        <KPICard
          icon={Percent}
          iconBg="bg-slate-100"
          iconColor="text-slate-600"
          label="Avg. Interest Rate"
          value={`${data.averageInterestRate.toFixed(1)}%`}
        />
      </div>

      {/* Status Breakdown & Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Status Breakdown Table */}
        <Card className="border-slate-200">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <PieChart className="h-4 w-4 text-slate-500" />
              Portfolio by Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50 hover:bg-slate-50">
                  <TableHead className="font-semibold text-slate-700">
                    Status
                  </TableHead>
                  <TableHead className="font-semibold text-slate-700 text-center">
                    Count
                  </TableHead>
                  <TableHead className="font-semibold text-slate-700 text-right">
                    Total Amount
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.statusBreakdown.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={3}
                      className="h-16 text-center text-slate-500"
                    >
                      No data available.
                    </TableCell>
                  </TableRow>
                ) : (
                  data.statusBreakdown.map((row) => (
                    <TableRow key={row.status}>
                      <TableCell>
                        <Badge
                          className={
                            statusColors[row.status] ||
                            "bg-gray-100 text-gray-800"
                          }
                        >
                          {row.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center font-medium text-slate-900">
                        {row.count}
                      </TableCell>
                      <TableCell className="text-right font-medium text-slate-900">
                        {formatCurrency(row.totalAmount)}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Visual bar charts (CSS-based) */}
        <div className="space-y-6">
          {/* Monthly Applications */}
          <Card className="border-slate-200">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <ArrowUpRight className="h-4 w-4 text-slate-500" />
                Monthly Applications (6 months)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {data.monthlyApplications.map((m) => (
                  <div key={m.month} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">{m.month}</span>
                      <span className="font-medium text-slate-900">
                        {m.count} loans &middot; {formatCurrency(m.amount)}
                      </span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-slate-100">
                      <div
                        className="h-2 rounded-full bg-blue-500 transition-all"
                        style={{
                          width: `${Math.max((m.amount / maxMonthlyAmount) * 100, 2)}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Monthly Repayments */}
          <Card className="border-slate-200">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Banknote className="h-4 w-4 text-slate-500" />
                Monthly Repayments (6 months)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {data.monthlyRepayments.map((m) => (
                  <div key={m.month} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-600">{m.month}</span>
                      <span className="font-medium text-slate-900">
                        {formatCurrency(m.amount)}
                      </span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-slate-100">
                      <div
                        className="h-2 rounded-full bg-emerald-500 transition-all"
                        style={{
                          width: `${Math.max(
                            (m.amount / maxMonthlyRepayment) * 100,
                            m.amount > 0 ? 2 : 0
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function KPICard({
  icon: Icon,
  iconBg,
  iconColor,
  label,
  value,
}: {
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  label: string;
  value: string;
}) {
  return (
    <Card className="border-slate-200">
      <CardContent className="flex items-center gap-4 p-4">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-lg ${iconBg}`}
        >
          <Icon className={`h-5 w-5 ${iconColor}`} />
        </div>
        <div>
          <p className="text-sm text-slate-500">{label}</p>
          <p className="text-xl font-bold text-slate-900">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}
