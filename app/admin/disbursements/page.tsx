import { disbursements, formatCurrency } from "@/lib/data/dummy-data";
import { DisbursementsTable } from "@/components/admin/disbursements/disbursements-table";
import { Card, CardContent } from "@/components/ui/card";
import { Banknote, Smartphone, Building2, TrendingUp } from "lucide-react";

export default function DisbursementsPage() {
  const totalDisbursed = disbursements.reduce((sum, d) => sum + d.amount, 0);
  const mpesaCount = disbursements.filter((d) => d.method === "M-Pesa").length;
  const bankCount = disbursements.filter((d) => d.method === "Bank").length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Disbursements</h1>
        <p className="text-slate-500">
          Track and manage loan disbursements via M-Pesa and bank transfer.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-slate-200">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50">
              <Banknote className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Total Disbursed</p>
              <p className="text-lg font-bold text-slate-900">
                {formatCurrency(totalDisbursed)}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50">
              <Smartphone className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Via M-Pesa</p>
              <p className="text-xl font-bold text-slate-900">{mpesaCount}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
              <Building2 className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Via Bank</p>
              <p className="text-xl font-bold text-slate-900">{bankCount}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50">
              <TrendingUp className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">This Month</p>
              <p className="text-xl font-bold text-slate-900">
                {disbursements.length}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Disbursements Table */}
      <DisbursementsTable disbursements={disbursements} />
    </div>
  );
}
