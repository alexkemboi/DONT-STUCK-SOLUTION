"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TrendingUp, Banknote, AlertTriangle, PiggyBank } from "lucide-react";
import type { ProfitLossSummary } from "@/app/actions/reports";

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);

interface PLReportProps {
  data: ProfitLossSummary;
}

export function PLReport({ data }: PLReportProps) {
  const netPosition = data.totalRepaid - data.totalPrincipalDisbursed;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-emerald-50 p-2">
                <TrendingUp className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Interest Income</p>
                <p className="text-xl font-bold text-slate-900">
                  {formatCurrency(data.totalInterestIncome)}
                </p>
                <p className="text-xs text-slate-400">Collected to date</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-blue-50 p-2">
                <Banknote className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Total Disbursed</p>
                <p className="text-xl font-bold text-slate-900">
                  {formatCurrency(data.totalPrincipalDisbursed)}
                </p>
                <p className="text-xs text-slate-400">Capital out</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-purple-50 p-2">
                <PiggyBank className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Total Recovered</p>
                <p className="text-xl font-bold text-slate-900">
                  {formatCurrency(data.totalRepaid)}
                </p>
                <p className="text-xs text-slate-400">All repayments</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <div
                className={`rounded-lg p-2 ${
                  netPosition >= 0 ? "bg-emerald-50" : "bg-red-50"
                }`}
              >
                <AlertTriangle
                  className={`h-5 w-5 ${
                    netPosition >= 0 ? "text-emerald-600" : "text-red-600"
                  }`}
                />
              </div>
              <div>
                <p className="text-sm text-slate-500">Net Position</p>
                <p
                  className={`text-xl font-bold ${
                    netPosition >= 0 ? "text-emerald-700" : "text-red-700"
                  }`}
                >
                  {formatCurrency(Math.abs(netPosition))}
                </p>
                <p className="text-xs text-slate-400">
                  {netPosition >= 0 ? "Surplus" : "Deficit"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* NPL Card */}
      {data.nplOutstanding > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-red-600 shrink-0" />
              <div>
                <p className="text-sm font-medium text-red-800">
                  Non-Performing Loans (NPL)
                </p>
                <p className="text-lg font-bold text-red-900">
                  {formatCurrency(data.nplOutstanding)} outstanding
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Monthly Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Monthly Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          {data.monthlyBreakdown.every(
            (m) =>
              m.interestCollected === 0 &&
              m.principalRepaid === 0 &&
              m.disbursed === 0
          ) ? (
            <p className="text-sm text-slate-500 text-center py-8">
              No transaction data for the last 6 months.
            </p>
          ) : (
            <div className="rounded-lg border border-slate-200 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50">
                    <TableHead>Month</TableHead>
                    <TableHead className="text-right">Interest Collected</TableHead>
                    <TableHead className="text-right">Principal Repaid</TableHead>
                    <TableHead className="text-right">Disbursed</TableHead>
                    <TableHead className="text-right">Net</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.monthlyBreakdown.map((row) => {
                    const net =
                      row.interestCollected + row.principalRepaid - row.disbursed;
                    return (
                      <TableRow key={row.month}>
                        <TableCell className="font-medium">{row.month}</TableCell>
                        <TableCell className="text-right text-emerald-700">
                          {formatCurrency(row.interestCollected)}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(row.principalRepaid)}
                        </TableCell>
                        <TableCell className="text-right text-blue-700">
                          {formatCurrency(row.disbursed)}
                        </TableCell>
                        <TableCell
                          className={`text-right font-medium ${
                            net >= 0 ? "text-emerald-700" : "text-red-700"
                          }`}
                        >
                          {net >= 0 ? "+" : ""}
                          {formatCurrency(net)}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
