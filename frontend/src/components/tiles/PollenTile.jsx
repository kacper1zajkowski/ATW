import { useState } from 'react';
import { Flower2, X } from 'lucide-react';
import { BaseTile } from './BaseTile';

const RISK_COLOR = {
  'Low':       { badge: 'bg-emerald-400/15 text-emerald-400', dot: 'bg-emerald-400' },
  'Moderate':  { badge: 'bg-amber-400/15  text-amber-400',   dot: 'bg-amber-400'   },
  'High':      { badge: 'bg-orange-400/15 text-orange-400',  dot: 'bg-orange-400'  },
  'Very High': { badge: 'bg-red-400/15    text-red-400',     dot: 'bg-red-400'     },
};

function RiskBadge({ risk }) {
  const cfg = RISK_COLOR[risk] ?? RISK_COLOR['Low'];
  return (
    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${cfg.badge}`}>
      {risk}
    </span>
  );
}

function SpeciesSection({ title, risk, count, species }) {
  const nonZero = Object.entries(species ?? {})
    .filter(([, v]) => v > 0)
    .sort(([, a], [, b]) => b - a);

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm font-semibold text-slate-200">{title}</span>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">{count} grains/m³</span>
          <RiskBadge risk={risk} />
        </div>
      </div>
      {nonZero.length > 0 && (
        <ul className="mt-1.5 space-y-1">
          {nonZero.map(([name, val]) => (
            <li key={name} className="flex items-center justify-between text-sm text-slate-400">
              <span>{name}</span>
              <span className="tabular-nums text-slate-500">{val}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function PollenTile({ pollen, index }) {
  const [open, setOpen] = useState(false);

  if (!pollen) return null;

  const categories = [
    { key: 'grass', label: 'Grass', ...pollen.grass },
    { key: 'tree',  label: 'Tree',  ...pollen.tree  },
    { key: 'weed',  label: 'Weed',  ...pollen.weed  },
  ];

  return (
    <>
      <BaseTile
        title="Pollen"
        icon={<Flower2 size={14} className="text-lime-400" />}
        accentColor="border-l-lime-500"
        index={index}
      >
        <div className="space-y-3">
          {categories.map(({ key, label, risk, count }) => {
            const cfg = RISK_COLOR[risk] ?? RISK_COLOR['Low'];
            return (
              <div key={key} className="flex items-center justify-between">
                <span className="text-sm text-slate-300">{label}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500">{count}</span>
                  <RiskBadge risk={risk} />
                  <div className={`h-2 w-2 rounded-full ${cfg.dot}`} />
                </div>
              </div>
            );
          })}
        </div>

        <button
          onClick={() => setOpen(true)}
          className="mt-4 w-full text-left text-xs text-slate-500 hover:text-slate-300 transition-colors"
        >
          Species breakdown →
        </button>
      </BaseTile>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-2xl border border-slate-700/40 bg-slate-800 p-6 shadow-xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Flower2 size={14} className="text-lime-400" />
                <span className="text-xs font-semibold uppercase tracking-widest text-slate-400">Pollen details</span>
              </div>
              <button onClick={() => setOpen(false)} className="text-slate-500 hover:text-slate-200 transition-colors">
                <X size={16} />
              </button>
            </div>

            <div className="space-y-4">
              <SpeciesSection title="Tree"  risk={pollen.tree.risk}  count={pollen.tree.count}  species={pollen.species.tree}  />
              <SpeciesSection title="Grass" risk={pollen.grass.risk} count={pollen.grass.count} species={pollen.species.grass} />
              <SpeciesSection title="Weed"  risk={pollen.weed.risk}  count={pollen.weed.count}  species={pollen.species.weed}  />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
