export function SkeletonTile({ className, tall }) {
  return (
    <div
      className={`animate-pulse rounded-2xl border border-slate-700/30 bg-slate-800/50 p-5 ${tall ? 'min-h-48' : ''} ${className ?? ''}`}
    >
      <div className="mb-4 flex items-center gap-2">
        <div className="h-4 w-4 rounded bg-slate-700" />
        <div className="h-3 w-20 rounded bg-slate-700" />
      </div>
      <div className="mb-2 h-9 w-28 rounded-lg bg-slate-700" />
      <div className="mb-1 h-3 w-32 rounded bg-slate-700/70" />
      <div className="h-3 w-24 rounded bg-slate-700/50" />
    </div>
  );
}
