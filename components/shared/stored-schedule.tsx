"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Calendar,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Clock,
  AlertCircle,
  CircleDashed,
  Banknote,
  TrendingUp,
  PiggyBank,
  FileDown,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import type { SerializedSchedule } from "@/app/actions/schedule";

interface StoredScheduleProps {
  schedule: SerializedSchedule[];
  summary?: {
    totalScheduled: number;
    totalPaid: number;
    totalRemaining: number;
    paidInstallments: number;
    pendingInstallments: number;
    overdueInstallments: number;
    nextDueDate: string | null;
    nextDueAmount: number | null;
  };
  compact?: boolean;
  className?: string;
  onExport?: () => void;
  loanId?: string;
  clientName?: string;
}

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

const statusConfig = {
  Pending: {
    color: "bg-slate-100 text-slate-700",
    icon: CircleDashed,
    label: "Pending",
  },
  Paid: {
    color: "bg-emerald-100 text-emerald-700",
    icon: CheckCircle2,
    label: "Paid",
  },
  Partial: {
    color: "bg-amber-100 text-amber-700",
    icon: Clock,
    label: "Partial",
  },
  Overdue: {
    color: "bg-red-100 text-red-700",
    icon: AlertCircle,
    label: "Overdue",
  },
};

export function StoredSchedule({
  schedule,
  summary,
  compact = false,
  className,
  onExport,
  loanId,
  clientName,
}: StoredScheduleProps) {
  const [expanded, setExpanded] = useState(false);
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    if (onExport) {
      onExport();
      return;
    }

    setExporting(true);
    try {
      const XLSX = await import("xlsx");

      // Prepare data for export
      const exportData = schedule.map((row) => ({
        "Installment #": row.installmentNumber,
        "Due Date": formatDate(row.dueDate),
        "Scheduled Payment (KES)": row.scheduledPayment,
        "Principal (KES)": row.principalPortion,
        "Interest (KES)": row.interestPortion,
        "Expected Balance (KES)": row.expectedBalance,
        "Paid (KES)": row.actualAmountPaid,
        "Payment Date": row.actualPaymentDate ? formatDate(row.actualPaymentDate) : "-",
        "Status": row.status,
      }));

      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Repayment Schedule");

      const filename = `Repayment_Schedule${loanId ? `_${loanId.slice(0, 8)}` : ""}${clientName ? `_${clientName.replace(/\s+/g, "_")}` : ""}.xlsx`;
      XLSX.writeFile(workbook, filename);
      toast.success("Schedule exported successfully");
    } catch {
      toast.error("Failed to export schedule");
    } finally {
      setExporting(false);
    }
  };

  if (!schedule || schedule.length === 0) {
    return (
      <Card className={cn("border-slate-200", className)}>
        <CardContent className="py-8 text-center text-sm text-slate-500">
          No repayment schedule found. Schedule is generated when the loan is disbursed.
        </CardContent>
      </Card>
    );
  }

  const visibleSchedule = expanded ? schedule : schedule.slice(0, 3);

  return (
    <div className={cn("space-y-4", className)}>
      {/* Summary Cards */}
      {summary && (
        <div className={cn("grid gap-3", compact ? "grid-cols-2" : "grid-cols-2 lg:grid-cols-4")}>
          <SummaryCard
            icon={Banknote}
            label="Total Scheduled"
            value={formatCurrency(summary.totalScheduled)}
            color="blue"
            compact={compact}
          />
          <SummaryCard
            icon={CheckCircle2}
            label="Total Paid"
            value={formatCurrency(summary.totalPaid)}
            subtext={`${summary.paidInstallments} of ${schedule.length} installments`}
            color="emerald"
            compact={compact}
          />
          <SummaryCard
            icon={TrendingUp}
            label="Remaining"
            value={formatCurrency(summary.totalRemaining)}
            subtext={summary.overdueInstallments > 0 ? `${summary.overdueInstallments} overdue` : undefined}
            color={summary.overdueInstallments > 0 ? "red" : "amber"}
            compact={compact}
          />
          <SummaryCard
            icon={PiggyBank}
            label="Next Due"
            value={summary.nextDueAmount ? formatCurrency(summary.nextDueAmount) : "N/A"}
            subtext={summary.nextDueDate ? formatDate(summary.nextDueDate) : "All paid"}
            color="purple"
            compact={compact}
          />
        </div>
      )}

      {/* Schedule Table */}
      <Card className="border-slate-200">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <Calendar className="h-4 w-4 text-slate-500" />
                Repayment Schedule
              </CardTitle>
              <CardDescription>
                {schedule.length} installments
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={handleExport} disabled={exporting}>
              {exporting ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <FileDown className="h-4 w-4 mr-2" />
              )}
              Export
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-slate-200 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50">
                  <TableHead className="w-16">#</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead className="text-right">Scheduled</TableHead>
                  <TableHead className="text-right">Paid</TableHead>
                  <TableHead className="text-right">Balance</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visibleSchedule.map((row) => {
                  const config = statusConfig[row.status as keyof typeof statusConfig] || statusConfig.Pending;
                  const StatusIcon = config.icon;
                  const remaining = row.scheduledPayment - row.actualAmountPaid;

                  return (
                    <TableRow key={row.id}>
                      <TableCell>
                        <Badge variant="outline" className="font-mono">
                          {row.installmentNumber}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-slate-600">
                        {formatDate(row.dueDate)}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(row.scheduledPayment)}
                      </TableCell>
                      <TableCell className="text-right text-emerald-600">
                        {formatCurrency(row.actualAmountPaid)}
                      </TableCell>
                      <TableCell className="text-right text-slate-600">
                        {formatCurrency(row.expectedBalance)}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge className={cn("gap-1", config.color)}>
                          <StatusIcon className="h-3 w-3" />
                          {config.label}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          {schedule.length > 3 && (
            <Button
              variant="ghost"
              size="sm"
              className="w-full mt-3"
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? (
                <>
                  <ChevronUp className="mr-2 h-4 w-4" />
                  Show Less
                </>
              ) : (
                <>
                  <ChevronDown className="mr-2 h-4 w-4" />
                  Show All {schedule.length} Installments
                </>
              )}
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

interface SummaryCardProps {
  icon: React.ElementType;
  label: string;
  value: string;
  subtext?: string;
  color: "emerald" | "blue" | "amber" | "purple" | "red";
  compact?: boolean;
}

const colorClasses = {
  emerald: "bg-emerald-50 text-emerald-600",
  blue: "bg-blue-50 text-blue-600",
  amber: "bg-amber-50 text-amber-600",
  purple: "bg-purple-50 text-purple-600",
  red: "bg-red-50 text-red-600",
};

function SummaryCard({ icon: Icon, label, value, subtext, color, compact }: SummaryCardProps) {
  return (
    <div className={cn(
      "rounded-lg border border-slate-200 bg-white",
      compact ? "p-3" : "p-4"
    )}>
      <div className="flex items-start gap-3">
        <div className={cn("rounded-lg p-2", colorClasses[color])}>
          <Icon className="h-4 w-4" />
        </div>
        <div className="min-w-0 flex-1">
          <p className={cn(
            "text-slate-500 truncate",
            compact ? "text-xs" : "text-xs"
          )}>
            {label}
          </p>
          <p className={cn(
            "font-semibold text-slate-900",
            compact ? "text-sm" : "text-lg"
          )}>
            {value}
          </p>
          {subtext && !compact && (
            <p className="text-xs text-slate-400 mt-0.5">{subtext}</p>
          )}
        </div>
      </div>
    </div>
  );
}
