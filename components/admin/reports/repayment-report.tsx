"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Banknote, CheckCircle, TrendingUp, Download } from "lucide-react";
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

interface RepaymentRow {
  "Repayment ID": string;
  "Loan ID": string;
  Client: string;
  Amount: number;
  Method: string;
  Category: string;
  Reference: string;
  "Payment Date": string;
}

interface RepaymentReportProps {
  data: Record<string, unknown>[];
}

export function RepaymentReport({ data }: RepaymentReportProps) {
  const rows = data as unknown as RepaymentRow[];

  const totalCollected = rows.reduce((sum, r) => sum + r.Amount, 0);
  const interestRows = rows.filter((r) => r.Category === "Interest");
  const principalRows = rows.filter((r) => r.Category === "Principal");

  const handleDownload = async () => {
    if (rows.length === 0) return;
    try {
      const XLSX = await import("xlsx");
      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Repayments");
      XLSX.writeFile(workbook, `Repayments_${new Date().toISOString().split("T")[0]}.xlsx`);
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
              <div className="rounded-lg bg-emerald-50 p-2">
                <Banknote className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Total Collected</p>
                <p className="text-xl font-bold text-slate-900">
                  {formatCurrency(totalCollected)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-blue-50 p-2">
                <CheckCircle className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-slate-500">Interest Payments</p>
                <p className="text-xl font-bold text-slate-900">
                  {formatCurrency(
                    interestRows.reduce((s, r) => s + r.Amount, 0)
                  )}
                </p>
                <p className="text-xs text-slate-400">{interestRows.length} records</p>
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
                <p className="text-sm text-slate-500">Principal Payments</p>
                <p className="text-xl font-bold text-slate-900">
                  {formatCurrency(
                    principalRows.reduce((s, r) => s + r.Amount, 0)
                  )}
                </p>
                <p className="text-xs text-slate-400">{principalRows.length} records</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Repayment Records</CardTitle>
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
              No repayments found.
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
                    <TableHead>Category</TableHead>
                    <TableHead>Reference</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.map((row) => (
                    <TableRow key={row["Repayment ID"]}>
                      <TableCell className="font-medium">{row.Client}</TableCell>
                      <TableCell className="text-xs font-mono text-slate-500">
                        {row["Loan ID"].slice(0, 12)}…
                      </TableCell>
                      <TableCell>{formatDate(row["Payment Date"])}</TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(row.Amount)}
                      </TableCell>
                      <TableCell>{row.Method}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{row.Category}</Badge>
                      </TableCell>
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
