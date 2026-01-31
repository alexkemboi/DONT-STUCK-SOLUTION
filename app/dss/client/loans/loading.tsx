export default function Loading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="space-y-2">
        <div className="h-7 w-32 rounded-md bg-slate-200" />
        <div className="h-4 w-64 rounded-md bg-slate-100" />
      </div>

      {/* Stats row */}
      <div className="grid gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-slate-100" />
              <div className="space-y-1.5">
                <div className="h-3 w-16 rounded bg-slate-100" />
                <div className="h-5 w-10 rounded bg-slate-200" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Loan cards */}
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-slate-200 bg-white p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="h-5 w-40 rounded bg-slate-200" />
              <div className="h-6 w-20 rounded-full bg-slate-100" />
            </div>
            <div className="flex gap-6">
              <div className="space-y-1">
                <div className="h-3 w-20 rounded bg-slate-100" />
                <div className="h-5 w-28 rounded bg-slate-200" />
              </div>
              <div className="space-y-1">
                <div className="h-3 w-16 rounded bg-slate-100" />
                <div className="h-5 w-20 rounded bg-slate-200" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
