export default function LoanDetailLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-5 w-32 bg-slate-200 rounded" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-4">
            <div className="h-6 w-48 bg-slate-200 rounded" />
            <div className="grid grid-cols-2 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="h-4 w-24 bg-slate-100 rounded" />
                  <div className="h-5 w-32 bg-slate-200 rounded" />
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-4">
            <div className="h-6 w-32 bg-slate-200 rounded" />
            <div className="h-20 bg-slate-100 rounded" />
            <div className="h-20 bg-slate-100 rounded" />
          </div>
        </div>
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-4">
            <div className="h-6 w-24 bg-slate-200 rounded" />
            <div className="h-10 bg-slate-100 rounded" />
            <div className="h-10 bg-slate-100 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}
