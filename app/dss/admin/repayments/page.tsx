import {
  getAllRepaymentsAction,
  getDisbursedLoansForRepaymentAction,
} from "@/app/actions/repayment";
import { RepaymentsDashboard } from "@/components/admin/repayments/repayments-dashboard";
import { Card, CardContent } from "@/components/ui/card";
import { CreditCard, Banknote, TrendingUp } from "lucide-react";

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);

export default async function RepaymentsPage() {
  const [repaymentsResult, loansResult] = await Promise.all([
    getAllRepaymentsAction(),
    getDisbursedLoansForRepaymentAction(),
  ]);

  const repayments = repaymentsResult.data || [];
  const loans = loansResult.data || [];

  const totalCollected = repayments.reduce((sum, r) => sum + r.amount, 0);
  const thisMonthRepayments = repayments.filter((r) => {
    const d = new Date(r.paymentDate);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });
  const thisMonthTotal = thisMonthRepayments.reduce((sum, r) => sum + r.amount, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Repayments</h1>
        <p className="text-slate-500">
          Record and track loan repayments manually.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border-slate-200">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50">
              <Banknote className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Total Collected</p>
              <p className="text-xl font-bold text-slate-900">
                {formatCurrency(totalCollected)}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
              <TrendingUp className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">This Month</p>
              <p className="text-xl font-bold text-slate-900">
                {formatCurrency(thisMonthTotal)}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50">
              <CreditCard className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Total Transactions</p>
              <p className="text-xl font-bold text-slate-900">
                {repayments.length}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <RepaymentsDashboard repayments={repayments} loans={loans} />
    </div>
  );
}
