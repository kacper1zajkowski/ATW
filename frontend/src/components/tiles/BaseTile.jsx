export function BaseTile({ title, icon, accentColor, children, index = 0, className }) {
  return (
    <div
      className={`h-full rounded-2xl border border-slate-700/40 border-l-2 ${accentColor} bg-slate-800/60 p-5 backdrop-blur-sm animate-tile-in ${className ?? ''}`}
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <div className="mb-4 flex items-center gap-2">
        {icon}
        <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">
          {title}
        </span>
      </div>
      {children}
    </div>
  );
}
