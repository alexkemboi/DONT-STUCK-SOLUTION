import { getLoanPortfolioSummaryAction } from "@/app/actions/reports";
import { PortfolioReport } from "@/components/admin/reports/portfolio-report";
import { ReportsManager } from "@/components/admin/reports/reports-manager";

export default async function ReportsPage() {
  const result = await getLoanPortfolioSummaryAction();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Reports</h1>
        <p className="text-slate-500">
          Loan portfolio summary, performance metrics, and data export.
        </p>
      </div>

      {result.success && result.data ? (
        <PortfolioReport data={result.data} />
      ) : (
        <p className="text-red-500">
          Failed to load report data: {result.error}
        </p>
      )}

      <ReportsManager />
    </div>
  );
}
