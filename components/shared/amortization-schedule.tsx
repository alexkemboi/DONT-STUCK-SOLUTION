"use client";

import { useMemo, useState } from "react";
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
  Calculator,
  TrendingUp,
  Calendar,
  ChevronDown,
  ChevronUp,
  Banknote,
  PiggyBank,
  Percent,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AmortizationScheduleProps {
  principal: number;
  monthlyInterestRate: number;
  periodMonths: number;
  frequency?: "MONTHLY" | "WEEKLY";
  showFullSchedule?: boolean;
  compact?: boolean;
  className?: string;
}

interface ScheduleRow {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
  cumulativeInterest: number;
  cumulativePrincipal: number;
}

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);

export function AmortizationSchedule({
  principal,
  monthlyInterestRate,
  periodMonths,
  frequency = "MONTHLY",
  showFullSchedule = true,
  compact = false,
  className,
}: AmortizationScheduleProps) {
  const [expanded, setExpanded] = useState(false);

  const isWeekly = frequency === "WEEKLY";

  const { schedule, summary } = useMemo(() => {
    if (!principal || principal <= 0 || !periodMonths || periodMonths <= 0) {
      return { schedule: [], summary: null };
    }

    // Derive period rate and number of installments from frequency
    let pRate: number;
    let pCount: number;
    if (isWeekly) {
      const annualRate = (monthlyInterestRate / 100) * 12;
      pRate = annualRate / 52;
      pCount = Math.round(periodMonths * 52 / 12);
    } else {
      pRate = monthlyInterestRate / 100;
      pCount = periodMonths;
    }

    const installmentPayment =
      pRate === 0
        ? principal / pCount
        : (principal * pRate * Math.pow(1 + pRate, pCount)) /
          (Math.pow(1 + pRate, pCount) - 1);

    const rows: ScheduleRow[] = [];
    let balance = principal;
    let cumulativeInterest = 0;
    let cumulativePrincipal = 0;

    for (let i = 1; i <= pCount; i++) {
      const interestPayment = balance * pRate;
      const principalPayment = installmentPayment - interestPayment;
      balance = Math.max(0, balance - principalPayment);
      cumulativeInterest += interestPayment;
      cumulativePrincipal += principalPayment;

      rows.push({
        month: i,
        payment: installmentPayment,
        principal: principalPayment,
        interest: interestPayment,
        balance,
        cumulativeInterest,
        cumulativePrincipal,
      });
    }

    const totalInterest = cumulativeInterest;
    const totalRepayable = principal + totalInterest;

    return {
      schedule: rows,
      summary: {
        monthlyPayment: Math.round(installmentPayment),
        totalInterest: Math.round(totalInterest),
        totalRepayable: Math.round(totalRepayable),
        effectiveRate: ((totalInterest / principal) * 100).toFixed(1),
        periods: pCount,
      },
    };
  }, [principal, monthlyInterestRate, periodMonths, isWeekly]);

  if (!summary) {
    return (
      <Card className={cn("border-slate-200", className)}>
        <CardContent className="py-8 text-center text-sm text-slate-500">
          Enter loan details to see the repayment breakdown.
        </CardContent>
      </Card>
    );
  }

  const visibleSchedule = expanded ? schedule : schedule.slice(0, 3);

  return (
    <div className={cn("space-y-4", className)}>
      {/* Summary Cards */}
      <div className={cn("grid gap-3", compact ? "grid-cols-2" : "grid-cols-2 lg:grid-cols-4")}>
        <SummaryCard
          icon={Banknote}
          label={isWeekly ? "Weekly Payment" : "Monthly Payment"}
          value={formatCurrency(summary.monthlyPayment)}
          color="emerald"
          compact={compact}
        />
        <SummaryCard
          icon={Percent}
          label="Interest Rate"
          value={`${monthlyInterestRate}% per month`}
          color="blue"
          compact={compact}
        />
        <SummaryCard
          icon={TrendingUp}
          label="Total Interest"
          value={formatCurrency(summary.totalInterest)}
          subtext={`${summary.effectiveRate}% of principal`}
          color="amber"
          compact={compact}
        />
        <SummaryCard
          icon={PiggyBank}
          label="Total Repayable"
          value={formatCurrency(summary.totalRepayable)}
          subtext={isWeekly ? `Over ${summary.periods} weeks` : `Over ${periodMonths} months`}
          color="purple"
          compact={compact}
        />
      </div>

      {/* Loan Breakdown Visual */}
      <Card className="border-slate-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Calculator className="h-4 w-4 text-slate-500" />
            Payment Breakdown
          </CardTitle>
          <CardDescription>
            Principal vs Interest distribution over {isWeekly ? `${summary.periods} weeks` : `${periodMonths} months`}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Visual breakdown bar */}
          <div className="space-y-2">
            <div className="flex h-8 w-full overflow-hidden rounded-lg">
              <div
                className="bg-emerald-500 flex items-center justify-center text-xs font-medium text-white"
                style={{ width: `${(principal / summary.totalRepayable) * 100}%` }}
              >
                {((principal / summary.totalRepayable) * 100).toFixed(0)}%
              </div>
              <div
                className="bg-amber-500 flex items-center justify-center text-xs font-medium text-white"
                style={{ width: `${(summary.totalInterest / summary.totalRepayable) * 100}%` }}
              >
                {((summary.totalInterest / summary.totalRepayable) * 100).toFixed(0)}%
              </div>
            </div>
            <div className="flex justify-between text-xs text-slate-500">
              <div className="flex items-center gap-1.5">
                <div className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                Principal: {formatCurrency(principal)}
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-2.5 w-2.5 rounded-full bg-amber-500" />
                Interest: {formatCurrency(summary.totalInterest)}
              </div>
            </div>
          </div>

          {/* Period interest breakdown */}
          <div className="rounded-lg bg-slate-50 p-4 space-y-2">
            <p className="text-sm font-medium text-slate-700">{isWeekly ? "Weekly" : "Monthly"} Interest Calculation</p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-slate-500">First {isWeekly ? "Week" : "Month"} Interest</p>
                <p className="font-medium text-slate-900">
                  {formatCurrency(schedule[0]?.interest || 0)}
                </p>
              </div>
              <div>
                <p className="text-slate-500">Last {isWeekly ? "Week" : "Month"} Interest</p>
                <p className="font-medium text-slate-900">
                  {formatCurrency(schedule[schedule.length - 1]?.interest || 0)}
                </p>
              </div>
            </div>
            <p className="text-xs text-slate-500 pt-2">
              Interest decreases each month as the principal balance reduces.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Amortization Schedule Table */}
      {showFullSchedule && (
        <Card className="border-slate-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Calendar className="h-4 w-4 text-slate-500" />
              {isWeekly ? "Weekly" : "Monthly"} Repayment Schedule
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border border-slate-200 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50">
                    <TableHead className="w-16">{isWeekly ? "Week" : "Month"}</TableHead>
                    <TableHead className="text-right">Payment</TableHead>
                    <TableHead className="text-right">Principal</TableHead>
                    <TableHead className="text-right">Interest</TableHead>
                    <TableHead className="text-right">Balance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {visibleSchedule.map((row) => (
                    <TableRow key={row.month}>
                      <TableCell>
                        <Badge variant="outline" className="font-mono">
                          {row.month}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(row.payment)}
                      </TableCell>
                      <TableCell className="text-right text-emerald-600">
                        {formatCurrency(row.principal)}
                      </TableCell>
                      <TableCell className="text-right text-amber-600">
                        {formatCurrency(row.interest)}
                      </TableCell>
                      <TableCell className="text-right text-slate-600">
                        {formatCurrency(row.balance)}
                      </TableCell>
                    </TableRow>
                  ))}
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
                    Show All {schedule.length} Months
                  </>
                )}
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

interface SummaryCardProps {
  icon: React.ElementType;
  label: string;
  value: string;
  subtext?: string;
  color: "emerald" | "blue" | "amber" | "purple";
  compact?: boolean;
}

const colorClasses = {
  emerald: "bg-emerald-50 text-emerald-600",
  blue: "bg-blue-50 text-blue-600",
  amber: "bg-amber-50 text-amber-600",
  purple: "bg-purple-50 text-purple-600",
};

function SummaryCard({ icon: Icon, label, value, subtext, color, compact }: SummaryCardProps) {
  return (
    <div className={cn(
      "rounded-lg border border-slate-200 bg-white",
      compact ? "p-3" : "p-4"
    )}>
      <div className="flex items-start flex-col gap-3">
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
