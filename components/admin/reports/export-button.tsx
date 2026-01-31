"use client";

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { getReports } from "@/app/actions/reports";
import Papa from "papaparse";

export function ExportButton() {
  const handleExport = async () => {
    const reports = await getReports();
    const csv = Papa.unparse([
      {
        "Clients with Outstanding Balances": reports.clientsWithBalances,
        "Overdue Payments": reports.overduePayments,
        "Total Disbursed Amount": reports.totalDisbursed,
      },
    ]);

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "reports.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Button variant="outline" onClick={handleExport}>
      <Download className="mr-2 h-4 w-4" />
      Export All
    </Button>
  );
}
