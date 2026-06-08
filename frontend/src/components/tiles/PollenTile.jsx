import { useState } from 'react';
import { Flower2, X } from 'lucide-react';
import { BaseTile } from './BaseTile';

const RISK_SEV = {
  'Low':       'var(--sev-1)',
  'Moderate':  'var(--sev-3)',
  'High':      'var(--sev-4)',
  'Very High': 'var(--sev-5)',
};

function RiskBadge({ risk }) {
  const sev = RISK_SEV[risk] ?? RISK_SEV['Low'];
  return (
    <span
      className="sev-badge rounded-pill px-2 py-0.5 font-mono text-[10px] uppercase tracking-label"
      style={{ '--sev': sev }}
    >
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
      <div className="mb-1 flex items-center justify-between">
        <span className="text-sm font-semibold text-ink">{title}</span>
        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] text-ink-3">{count} grains/m³</span>
          <RiskBadge risk={risk} />
        </div>
      </div>
      {nonZero.length > 0 && (
        <ul className="mt-1.5 space-y-1">
          {nonZero.map(([name, val]) => (
            <li key={name} className="flex items-center justify-between text-sm text-ink-2">
              <span>{name}</span>
              <span className="tabular-nums text-ink-3">{val}</span>
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
        icon={<Flower2 size={14} className="text-ink-2" />}
        idx={6}
        index={index}
      >
        <div className="space-y-3">
          {categories.map(({ key, label, risk, count }) => {
            const sev = RISK_SEV[risk] ?? RISK_SEV['Low'];
            return (
              <div key={key} className="flex items-center justify-between">
                <span className="text-sm text-ink">{label}</span>
                <div className="flex items-center gap-2" style={{ '--sev': sev }}>
                  <span className="font-mono text-[10px] text-ink-3">{count}</span>
                  <RiskBadge risk={risk} />
                  <div className="sev-bar h-2 w-2 rounded-full" />
                </div>
              </div>
            );
          })}
        </div>

        {pollen.species && (
          <button
            onClick={() => setOpen(true)}
            className="mt-4 w-full text-left font-mono text-[10px] uppercase tracking-label text-ink-3 transition-colors duration-200 hover:text-accent"
          >
            Species breakdown →
          </button>
        )}
      </BaseTile>

      {open && pollen.species && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-card border border-hairline-strong bg-bg-2 p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between border-b border-hairline pb-3">
              <div className="flex items-center gap-2">
                <Flower2 size={14} className="text-ink-2" />
                <span className="font-mono text-[11px] uppercase tracking-label text-ink-2">Pollen details</span>
              </div>
              <button onClick={() => setOpen(false)} className="text-ink-3 transition-colors hover:text-accent">
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
