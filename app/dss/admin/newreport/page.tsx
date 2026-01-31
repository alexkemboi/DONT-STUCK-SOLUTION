import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExportButton } from "@/components/admin/reports/export-button";
import { getReports } from "@/app/actions/reports";

export default async function NewReportPage() {
  const reports = await getReports();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">New Reports</h1>
        <ExportButton />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Clients with Outstanding Balances</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{reports.clientsWithBalances}</div>
            <p className="text-sm text-muted-foreground">
              Total clients with an outstanding loan balance.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Overdue Payments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{reports.overduePayments}</div>
            <p className="text-sm text-muted-foreground">
              Clients with at least one overdue payment.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Disbursed Amount</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">${reports.totalDisbursed.toLocaleString()}</div>
            <p className="text-sm text-muted-foreground">
              Total amount disbursed across all loans.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
