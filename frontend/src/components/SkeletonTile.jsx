export function SkeletonTile({ className, tall }) {
  return (
    <div
      className={`animate-pulse rounded-card border border-hairline bg-surface-soft p-5 backdrop-blur-sm ${tall ? 'min-h-48' : ''} ${className ?? ''}`}
    >
      <div className="mb-4 flex items-center gap-2 border-b border-hairline pb-3">
        <div className="h-3 w-4 rounded bg-hairline-strong" />
        <div className="h-3 w-24 rounded bg-hairline-strong" />
      </div>
      <div className="mb-3 h-9 w-28 rounded bg-hairline-strong" />
      <div className="mb-2 h-3 w-32 rounded bg-hairline" />
      <div className="h-3 w-24 rounded bg-hairline" />
    </div>
  );
}
