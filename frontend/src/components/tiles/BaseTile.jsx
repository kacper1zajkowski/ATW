/* Hairline card — surface-tinted, no boxes/shadows. Mono uppercase label over a
   bottom hairline; the index + accent only wake up on hover (one accent at a
   time). Tiles pass their icon already coloured text-ink-2. */
export function BaseTile({ title, icon, idx, meta, children, index = 0, className }) {
  return (
    <div
      className={`group h-full rounded-card border border-hairline bg-surface-soft p-5 backdrop-blur-sm animate-tile-in transition-colors duration-300 hover:border-hairline-strong ${className ?? ''}`}
      style={{ animationDelay: `${index * 70}ms` }}
    >
      <div className="mb-4 flex items-center gap-2 border-b border-hairline pb-3">
        {idx != null && (
          <span className="font-mono text-[11px] tracking-label text-ink-3 transition-colors duration-300 group-hover:text-accent">
            {String(idx).padStart(2, '0')}
          </span>
        )}
        {icon}
        <span className="font-mono text-[11px] uppercase tracking-label text-ink-2">
          {title}
        </span>
        {meta && <span className="ml-auto font-mono text-[10px] uppercase tracking-label text-ink-3">{meta}</span>}
      </div>
      {children}
    </div>
  );
}
