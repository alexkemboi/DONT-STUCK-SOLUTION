export default function Loading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header skeleton */}
      <div className="space-y-2">
        <div className="h-8 w-52 rounded-md bg-slate-200" />
        <div className="h-4 w-72 rounded-md bg-slate-100" />
      </div>

      {/* Stats cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-slate-200 bg-white p-5 space-y-3"
          >
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-slate-100" />
              <div className="space-y-1.5 flex-1">
                <div className="h-3 w-20 rounded bg-slate-100" />
                <div className="h-6 w-16 rounded bg-slate-200" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Content cards */}
      <div className="grid gap-4 sm:grid-cols-2">
        {Array.from({ length: 2 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-slate-200 bg-white p-6 space-y-4"
          >
            <div className="h-5 w-36 rounded bg-slate-200" />
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, j) => (
                <div key={j} className="h-4 w-full rounded bg-slate-100" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
