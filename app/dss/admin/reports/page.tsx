import { getLoanPortfolioSummaryAction, getReportDataAction, getProfitLossAction } from "@/app/actions/reports";
import { PortfolioReport } from "@/components/admin/reports/portfolio-report";
import { ReportsManager } from "@/components/admin/reports/reports-manager";
import { DisbursementReport } from "@/components/admin/reports/disbursement-report";
import { RepaymentReport } from "@/components/admin/reports/repayment-report";
import { PLReport } from "@/components/admin/reports/pl-report";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default async function ReportsPage() {
  const [portfolio, disbursements, repayments, pl] = await Promise.all([
    getLoanPortfolioSummaryAction(),
    getReportDataAction("disbursements"),
    getReportDataAction("repayments"),
    getProfitLossAction(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Reports</h1>
        <p className="text-slate-500">
          Loan portfolio summary, performance metrics, and data export.
        </p>
      </div>

      <Tabs defaultValue="portfolio">
        <TabsList className="mb-4">
          <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
          <TabsTrigger value="disbursements">Disbursements</TabsTrigger>
          <TabsTrigger value="repayments">Repayments</TabsTrigger>
          <TabsTrigger value="pl">P&amp;L</TabsTrigger>
        </TabsList>

        <TabsContent value="portfolio">
          {portfolio.success && portfolio.data ? (
            <div className="space-y-6">
              <PortfolioReport data={portfolio.data} />
              <ReportsManager />
            </div>
          ) : (
            <p className="text-red-500">
              Failed to load portfolio data: {portfolio.error}
            </p>
          )}
        </TabsContent>

        <TabsContent value="disbursements">
          {disbursements.success && disbursements.data ? (
            <DisbursementReport data={disbursements.data} />
          ) : (
            <p className="text-red-500">
              Failed to load disbursement data: {disbursements.error}
            </p>
          )}
        </TabsContent>

        <TabsContent value="repayments">
          {repayments.success && repayments.data ? (
            <RepaymentReport data={repayments.data} />
          ) : (
            <p className="text-red-500">
              Failed to load repayment data: {repayments.error}
            </p>
          )}
        </TabsContent>

        <TabsContent value="pl">
          {pl.success && pl.data ? (
            <PLReport data={pl.data} />
          ) : (
            <p className="text-red-500">
              Failed to load P&amp;L data: {pl.error}
            </p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
