import { Sun, Sunrise, Sunset } from 'lucide-react';
import { BaseTile } from './BaseTile';

const UV_CONFIG = {
  'Low':       { color: 'text-green-400',  bar: 'bg-green-400',  bg: 'bg-green-400/10'  },
  'Moderate':  { color: 'text-yellow-400', bar: 'bg-yellow-400', bg: 'bg-yellow-400/10' },
  'High':      { color: 'text-orange-400', bar: 'bg-orange-400', bg: 'bg-orange-400/10' },
  'Very High': { color: 'text-red-400',    bar: 'bg-red-400',    bg: 'bg-red-400/10'    },
  'Extreme':   { color: 'text-violet-400', bar: 'bg-violet-400', bg: 'bg-violet-400/10' },
};

export function UVTile({ uv, index }) {
  const cfg = UV_CONFIG[uv.category] ?? UV_CONFIG['Moderate'];
  const pct = Math.min(100, (uv.index / 11) * 100);

  return (
    <BaseTile
      title="UV & sunshine"
      icon={<Sun size={14} className="text-amber-400" />}
      accentColor="border-l-amber-500"
      index={index}
    >
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-end gap-1">
            <span className="text-5xl font-bold tabular-nums text-slate-100">{uv.index}</span>
            <span className="mb-1 text-sm text-slate-500">/ 11</span>
          </div>
          <p className={`mt-1 text-sm font-semibold ${cfg.color}`}>{uv.category}</p>
          <p className="text-xs text-slate-500">Max today: {uv.max_today}</p>
        </div>
        <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${cfg.bg}`}>
          <Sun size={28} className={cfg.color} />
        </div>
      </div>

      <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-slate-700">
        <div
          className={`h-full rounded-full transition-all duration-700 ${cfg.bar}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="mt-1 flex justify-between text-xs text-slate-600">
        <span>0</span><span>3</span><span>6</span><span>8</span><span>11+</span>
      </div>

      <div className="mt-4 flex items-center gap-4 text-sm text-slate-400">
        <span className="flex items-center gap-1">
          <Sunrise size={13} className="text-amber-500" />{uv.sunrise}
        </span>
        <span className="flex items-center gap-1">
          <Sunset size={13} className="text-orange-500" />{uv.sunset}
        </span>
      </div>
    </BaseTile>
  );
}
