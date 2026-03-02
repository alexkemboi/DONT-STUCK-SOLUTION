"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Banknote, TrendingUp, Users, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString("en-KE", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

interface DisbursementRow {
  "Disbursement ID": string;
  "Loan ID": string;
  Client: string;
  Amount: number;
  Method: string;
  Reference: string;
  "Disbursed At": string;
}

interface DisbursementReportProps {
  data: Record<string, unknown>[];
}

export function DisbursementReport({ data }: DisbursementReportProps) {
  const rows = data as unknown as DisbursementRow[];

  const totalDisbursed = rows.reduce((sum, r) => sum + r.Amount, 0);
  const averageLoanSize = rows.length > 0 ? totalDisbursed / rows.length : 0;

  const handleDownload = async () => {
    if (rows.length === 0) return;
    try {
      const XLSX = await import("xlsx");
      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Disbursements");
      XLSX.writeFile(workbook, `Disbursements_${new Date().toISOString().split("T")[0]}.xlsx`);
      toast.success("Excel file downloaded");
    } catch {
      toast.error("Failed to generate Excel file");
    }
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-blue-50 p-2">
                <Banknote className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Total Disbursed</p>
                <p className="text-xl font-bold text-slate-900">
                  {formatCurrency(totalDisbursed)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-emerald-50 p-2">
                <Users className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Disbursement Count</p>
                <p className="text-xl font-bold text-slate-900">{rows.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-purple-50 p-2">
                <TrendingUp className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Average Loan Size</p>
                <p className="text-xl font-bold text-slate-900">
                  {formatCurrency(averageLoanSize)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Disbursement Records</CardTitle>
          {rows.length > 0 && (
            <Button variant="outline" size="sm" onClick={handleDownload}>
              <Download className="mr-2 h-4 w-4" />
              Download Excel
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {rows.length === 0 ? (
            <p className="text-sm text-slate-500 text-center py-8">
              No disbursements found.
            </p>
          ) : (
            <div className="rounded-lg border border-slate-200 overflow-hidden overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50">
                    <TableHead>Client</TableHead>
                    <TableHead>Loan ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Reference</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.map((row) => (
                    <TableRow key={row["Disbursement ID"]}>
                      <TableCell className="font-medium">{row.Client}</TableCell>
                      <TableCell className="text-xs font-mono text-slate-500">
                        {row["Loan ID"].slice(0, 12)}…
                      </TableCell>
                      <TableCell>{formatDate(row["Disbursed At"])}</TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(row.Amount)}
                      </TableCell>
                      <TableCell>{row.Method}</TableCell>
                      <TableCell className="text-xs text-slate-500">
                        {row.Reference || "—"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
