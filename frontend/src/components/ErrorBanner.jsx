import { AlertTriangle, ServerCrash, WifiOff } from 'lucide-react';

const ERROR_CONFIGS = {
  400: { Icon: AlertTriangle, label: 'Bad request',        sev: 'var(--sev-3)' },
  404: { Icon: AlertTriangle, label: 'Location not found', sev: 'var(--sev-3)' },
  429: { Icon: ServerCrash,   label: 'Rate limit reached', sev: 'var(--sev-4)' },
  500: { Icon: ServerCrash,   label: 'Server error',       sev: 'var(--sev-5)' },
};

export function ErrorBanner({ message, code }) {
  const config = code ? ERROR_CONFIGS[code] : undefined;
  const Icon = config?.Icon ?? WifiOff;
  const sev = config?.sev ?? 'var(--sev-5)';

  return (
    <div
      className="flex items-start gap-3 rounded-card border border-hairline sev-soft px-4 py-3 text-sm"
      style={{ '--sev': sev }}
    >
      <Icon size={16} className="sev-text mt-0.5 shrink-0" />
      <div>
        {config?.label && (
          <span className="font-mono text-[11px] uppercase tracking-label sev-text">
            {config.label} —{' '}
          </span>
        )}
        <span className="text-ink-2">{message}</span>
        {code === 429 && (
          <p className="mt-1 text-ink-3">The API gateway rate limit was exceeded. Try again in a moment.</p>
        )}
      </div>
    </div>
  );
}
