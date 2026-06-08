import { Sun, Sunrise, Sunset } from 'lucide-react';
import { BaseTile } from './BaseTile';

const UV_SEV = {
  'Low':       'var(--sev-1)',
  'Moderate':  'var(--sev-2)',
  'High':      'var(--sev-3)',
  'Very High': 'var(--sev-4)',
  'Extreme':   'var(--sev-5)',
};

export function UVTile({ uv, index }) {
  const sev = UV_SEV[uv.category] ?? UV_SEV['Moderate'];
  const pct = Math.min(100, (uv.index / 11) * 100);

  return (
    <BaseTile
      title="UV & sunshine"
      icon={<Sun size={14} className="text-ink-2" />}
      idx={3}
      index={index}
    >
      <div style={{ '--sev': sev }}>
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-end gap-1">
              <span className="text-5xl font-extrabold tabular-nums tracking-tighter text-ink">{uv.index}</span>
              <span className="mb-1 font-mono text-xs text-ink-3">/ 11</span>
            </div>
            <p className="sev-text mt-1 text-sm font-semibold">{uv.category}</p>
            <p className="font-mono text-[10px] uppercase tracking-label text-ink-3">Max today: {uv.max_today}</p>
          </div>
          <div className="sev-soft flex h-14 w-14 shrink-0 items-center justify-center rounded-card">
            <Sun size={26} className="sev-text" strokeWidth={1.5} />
          </div>
        </div>

        <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-hairline">
          <div
            className="sev-bar h-full rounded-full transition-all duration-700"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      <div className="mt-1 flex justify-between font-mono text-[10px] text-ink-3">
        <span>0</span><span>3</span><span>6</span><span>8</span><span>11+</span>
      </div>

      <div className="mt-4 flex items-center gap-4 text-sm text-ink-2">
        <span className="flex items-center gap-1.5">
          <Sunrise size={13} className="text-ink-3" />{uv.sunrise}
        </span>
        <span className="flex items-center gap-1.5">
          <Sunset size={13} className="text-ink-3" />{uv.sunset}
        </span>
      </div>
    </BaseTile>
  );
}
