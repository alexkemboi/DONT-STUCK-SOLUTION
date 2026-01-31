import { getLoanPortfolioSummaryAction } from "@/app/actions/reports";
import { PortfolioReport } from "@/components/admin/reports/portfolio-report";

export default async function ReportsPage() {
  const result = await getLoanPortfolioSummaryAction();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Reports</h1>
        <p className="text-slate-500">
          Loan portfolio summary and performance metrics.
        </p>
      </div>

      {result.success && result.data ? (
        <PortfolioReport data={result.data} />
      ) : (
        <p className="text-red-500">
          Failed to load report data: {result.error}
        </p>
      )}
    </div>
  );
}
