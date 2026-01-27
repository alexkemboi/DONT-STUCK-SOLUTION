"use client";

interface StatusData {
  status: string;
  count: number;
  color: string;
}

interface LoanStatusChartProps {
  data: StatusData[];
}

export function LoanStatusChart({ data }: LoanStatusChartProps) {
  const total = data.reduce((sum, item) => sum + item.count, 0);

  return (
    <div className="space-y-4">
      {/* Simple bar representation */}
      <div className="flex h-4 overflow-hidden rounded-full bg-slate-100">
        {data.map((item, index) => (
          <div
            key={item.status}
            className="transition-all"
            style={{
              width: `${(item.count / total) * 100}%`,
              backgroundColor: item.color,
            }}
            title={`${item.status}: ${item.count}`}
          />
        ))}
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 gap-3">
        {data.map((item) => (
          <div key={item.status} className="flex items-center gap-2">
            <div
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-sm text-slate-600">{item.status}</span>
            <span className="ml-auto text-sm font-medium text-slate-900">
              {item.count}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
