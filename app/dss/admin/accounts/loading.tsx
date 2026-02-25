export default function Loading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header skeleton */}
      <div className="space-y-2">
        <div className="h-7 w-48 rounded-md bg-slate-200" />
        <div className="h-4 w-72 rounded-md bg-slate-100" />
      </div>

      {/* Tabs skeleton */}
      <div className="flex gap-2 border-b border-slate-200 pb-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-9 w-24 rounded-md bg-slate-100" />
        ))}
      </div>

      {/* Card skeleton */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-6">
        {/* Form fields grid */}
        <div className="grid gap-6 sm:grid-cols-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 w-24 rounded bg-slate-100" />
              <div className="h-10 w-full rounded-md bg-slate-100" />
            </div>
          ))}
        </div>

        {/* Button skeleton */}
        <div className="flex justify-end">
          <div className="h-10 w-32 rounded-md bg-slate-200" />
        </div>
      </div>
    </div>
  );
}
