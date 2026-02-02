"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Download, FileSpreadsheet, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DateRangePicker } from "./date-range-picker";
import {
  getReportDataAction,
  type ReportType,
} from "@/app/actions/reports";

const reportTypes: { value: ReportType; label: string; description: string }[] = [
  { value: "portfolio", label: "Loan Portfolio", description: "All loan applications with client and status info" },
  { value: "repayments", label: "Repayments", description: "Payment records with loan and client details" },
  { value: "clients", label: "Clients", description: "Client list with loan aggregates" },
  { value: "disbursements", label: "Disbursements", description: "Disbursement records with loan details" },
];

export function ReportsManager() {
  const [reportType, setReportType] = useState<ReportType>("portfolio");
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [data, setData] = useState<Record<string, unknown>[] | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleGenerate = () => {
    startTransition(async () => {
      const result = await getReportDataAction(
        reportType,
        startDate?.toISOString(),
        endDate?.toISOString()
      );

      if (result.success && result.data) {
        setData(result.data);
        toast.success(`Generated ${result.data.length} records`);
      } else {
        toast.error(result.error || "Failed to generate report");
        setData(null);
      }
    });
  };

  const handleDownloadExcel = async () => {
    if (!data || data.length === 0) return;

    try {
      const XLSX = await import("xlsx");
      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Report");

      const selectedReport = reportTypes.find((r) => r.value === reportType);
      const dateSuffix = startDate
        ? `_${startDate.toISOString().split("T")[0]}`
        : "";
      const filename = `${selectedReport?.label.replace(/\s+/g, "_") || reportType}${dateSuffix}.xlsx`;

      XLSX.writeFile(workbook, filename);
      toast.success("Excel file downloaded");
    } catch {
      toast.error("Failed to generate Excel file");
    }
  };

  const columns = data && data.length > 0 ? Object.keys(data[0]) : [];

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">
          Export Reports
        </h2>

        <div className="flex flex-wrap items-end gap-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">
              Report Type
            </label>
            <Select
              value={reportType}
              onValueChange={(v) => {
                setReportType(v as ReportType);
                setData(null);
              }}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {reportTypes.map((rt) => (
                  <SelectItem key={rt.value} value={rt.value}>
                    {rt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">
              Date Range
            </label>
            <DateRangePicker
              startDate={startDate}
              endDate={endDate}
              onStartDateChange={setStartDate}
              onEndDateChange={setEndDate}
            />
          </div>

          <Button onClick={handleGenerate} disabled={isPending}>
            {isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <FileSpreadsheet className="mr-2 h-4 w-4" />
            )}
            Generate Report
          </Button>

          {data && data.length > 0 && (
            <Button variant="outline" onClick={handleDownloadExcel}>
              <Download className="mr-2 h-4 w-4" />
              Download Excel
            </Button>
          )}
        </div>

        <p className="mt-2 text-xs text-slate-500">
          {reportTypes.find((r) => r.value === reportType)?.description}
          {reportType !== "clients" && " — leave dates empty to include all records."}
        </p>
      </div>

      {/* Preview table */}
      {data && (
        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-900">
              Preview ({data.length} records)
            </h3>
          </div>

          {data.length === 0 ? (
            <div className="p-8 text-center text-sm text-slate-500">
              No records found for the selected criteria.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    {columns.map((col) => (
                      <th
                        key={col}
                        className="px-4 py-3 text-left font-medium text-slate-600 whitespace-nowrap"
                      >
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.slice(0, 50).map((row, i) => (
                    <tr
                      key={i}
                      className="border-b border-slate-100 hover:bg-slate-50"
                    >
                      {columns.map((col) => (
                        <td
                          key={col}
                          className="px-4 py-2.5 text-slate-700 whitespace-nowrap"
                        >
                          {String(row[col] ?? "")}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              {data.length > 50 && (
                <div className="px-6 py-3 text-center text-xs text-slate-500 border-t border-slate-100">
                  Showing first 50 of {data.length} records. Download the Excel file for the full dataset.
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
