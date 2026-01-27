import { investors, formatCurrency } from "@/lib/data/dummy-data";
import { InvestorsTable } from "@/components/admin/investors/investors-table";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, Users, Wallet, PiggyBank } from "lucide-react";

export default function InvestorsPage() {
  const totalInvested = investors.reduce((sum, i) => sum + i.investedAmount, 0);
  const totalReturns = investors.reduce((sum, i) => sum + i.totalReturns, 0);
  const totalAllocations = investors.reduce(
    (sum, i) => sum + i.activeAllocations,
    0
  );
  const avgReturn = (totalReturns / totalInvested) * 100;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Investors</h1>
        <p className="text-slate-500">
          Manage investor profiles, allocations, and track returns.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-slate-200">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Total Investors</p>
              <p className="text-xl font-bold text-slate-900">{investors.length}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-emerald-200 bg-emerald-50">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100">
              <Wallet className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm text-emerald-700">Total Invested</p>
              <p className="text-lg font-bold text-emerald-900">
                {formatCurrency(totalInvested)}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50">
              <TrendingUp className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Total Returns</p>
              <p className="text-lg font-bold text-slate-900">
                {formatCurrency(totalReturns)}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50">
              <PiggyBank className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Avg. Return Rate</p>
              <p className="text-xl font-bold text-slate-900">
                {avgReturn.toFixed(1)}%
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Portfolio Summary */}
      <Card className="border-slate-200 bg-gradient-to-r from-slate-800 to-slate-900">
        <CardContent className="p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-slate-400">Active Allocations</p>
              <p className="text-2xl font-bold text-white">{totalAllocations}</p>
            </div>
            <div className="h-px w-full bg-slate-700 sm:h-12 sm:w-px" />
            <div>
              <p className="text-sm text-slate-400">Average Investment</p>
              <p className="text-2xl font-bold text-white">
                {formatCurrency(totalInvested / investors.length)}
              </p>
            </div>
            <div className="h-px w-full bg-slate-700 sm:h-12 sm:w-px" />
            <div>
              <p className="text-sm text-slate-400">Portfolio Health</p>
              <p className="text-2xl font-bold text-emerald-400">Excellent</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Investors Table */}
      <InvestorsTable investors={investors} />
    </div>
  );
}
