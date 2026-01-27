"use client";

import { formatCurrency } from "@/lib/data/dummy-data";

interface DisbursementData {
  month: string;
  amount: number;
}

interface DisbursementChartProps {
  data: DisbursementData[];
}

export function DisbursementChart({ data }: DisbursementChartProps) {
  const maxAmount = Math.max(...data.map((d) => d.amount));

  return (
    <div className="space-y-4">
      {/* Bar chart */}
      <div className="flex h-48 items-end gap-2">
        {data.map((item) => {
          const height = (item.amount / maxAmount) * 100;
          return (
            <div
              key={item.month}
              className="group relative flex flex-1 flex-col items-center"
            >
              {/* Tooltip */}
              <div className="absolute -top-8 hidden rounded bg-slate-900 px-2 py-1 text-xs text-white group-hover:block">
                {formatCurrency(item.amount)}
              </div>
              {/* Bar */}
              <div
                className="w-full rounded-t-md bg-emerald-500 transition-all group-hover:bg-emerald-600"
                style={{ height: `${height}%` }}
              />
              {/* Label */}
              <span className="mt-2 text-xs font-medium text-slate-500">
                {item.month}
              </span>
            </div>
          );
        })}
      </div>

      {/* Summary */}
      <div className="flex items-center justify-between border-t border-slate-100 pt-4">
        <div>
          <p className="text-sm text-slate-500">Total (6 months)</p>
          <p className="text-lg font-semibold text-slate-900">
            {formatCurrency(data.reduce((sum, d) => sum + d.amount, 0))}
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-slate-500">Monthly Average</p>
          <p className="text-lg font-semibold text-slate-900">
            {formatCurrency(
              data.reduce((sum, d) => sum + d.amount, 0) / data.length
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
