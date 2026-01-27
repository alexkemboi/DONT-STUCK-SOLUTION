import {
  nplLoans,
  recoveryAgents,
  formatCurrency,
  dashboardStats,
} from "@/lib/data/dummy-data";
import { NPLTable } from "@/components/admin/recovery/npl-table";
import { AgentsList } from "@/components/admin/recovery/agents-list";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertTriangle, Users, TrendingDown, Target } from "lucide-react";

export default function RecoveryPage() {
  const totalNPLAmount = nplLoans.reduce((sum, n) => sum + n.outstandingAmount, 0);
  const totalRecovered = recoveryAgents.reduce(
    (sum, a) => sum + a.recoveredAmount,
    0
  );
  const avgSuccessRate =
    recoveryAgents.reduce((sum, a) => sum + a.successRate, 0) /
    recoveryAgents.length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Recovery & NPL</h1>
        <p className="text-slate-500">
          Manage non-performing loans and track recovery efforts.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-red-700">NPL Count</p>
              <p className="text-xl font-bold text-red-900">{nplLoans.length}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50">
              <TrendingDown className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Outstanding NPL</p>
              <p className="text-lg font-bold text-slate-900">
                {formatCurrency(totalNPLAmount)}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50">
              <Target className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Total Recovered</p>
              <p className="text-lg font-bold text-emerald-600">
                {formatCurrency(totalRecovered)}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Recovery Agents</p>
              <p className="text-xl font-bold text-slate-900">
                {recoveryAgents.length}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recovery Rate Card */}
      <Card className="border-slate-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Overall Recovery Rate
              </p>
              <p className="text-3xl font-bold text-slate-900">
                {dashboardStats.recoveryRate}%
              </p>
            </div>
            <div className="w-48">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Target: 85%</span>
                <span className="font-medium text-emerald-600">
                  {dashboardStats.recoveryRate}%
                </span>
              </div>
              <div className="mt-2 h-3 overflow-hidden rounded-full bg-slate-200">
                <div
                  className="h-full bg-emerald-500 transition-all"
                  style={{ width: `${dashboardStats.recoveryRate}%` }}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="npl" className="space-y-4">
        <TabsList className="bg-slate-100">
          <TabsTrigger value="npl">NPL Loans ({nplLoans.length})</TabsTrigger>
          <TabsTrigger value="agents">
            Recovery Agents ({recoveryAgents.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="npl">
          <NPLTable nplLoans={nplLoans} />
        </TabsContent>

        <TabsContent value="agents">
          <AgentsList agents={recoveryAgents} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
