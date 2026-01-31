export default function Loading() {
  return (
    <div className="min-h-screen bg-background animate-pulse">
      <div className="mx-auto max-w-6xl px-4 py-8 space-y-8">
        {/* Header skeleton */}
        <div className="space-y-2">
          <div className="h-8 w-56 rounded-md bg-slate-200" />
          <div className="h-4 w-80 rounded-md bg-slate-100" />
        </div>

        {/* Step indicator skeleton */}
        <div className="flex items-center justify-center gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-full bg-slate-200" />
              <div className="h-4 w-20 rounded bg-slate-100" />
              {i < 2 && <div className="h-0.5 w-16 bg-slate-100" />}
            </div>
          ))}
        </div>

        {/* Content area */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Form skeleton */}
          <div className="lg:col-span-2 rounded-xl border border-slate-200 bg-white p-6 space-y-6">
            <div className="space-y-2">
              <div className="h-6 w-40 rounded bg-slate-200" />
              <div className="h-4 w-64 rounded bg-slate-100" />
            </div>

            <div className="space-y-5">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="h-4 w-28 rounded bg-slate-100" />
                  <div className="h-10 w-full rounded-md bg-slate-100" />
                </div>
              ))}
            </div>

            <div className="flex justify-end">
              <div className="h-10 w-36 rounded-md bg-slate-200" />
            </div>
          </div>

          {/* Calculator sidebar skeleton */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-4">
            <div className="h-6 w-32 rounded bg-slate-200" />
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex justify-between">
                  <div className="h-4 w-28 rounded bg-slate-100" />
                  <div className="h-4 w-20 rounded bg-slate-100" />
                </div>
              ))}
            </div>
            <div className="h-px bg-slate-200" />
            <div className="flex justify-between">
              <div className="h-5 w-32 rounded bg-slate-200" />
              <div className="h-5 w-24 rounded bg-slate-200" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
