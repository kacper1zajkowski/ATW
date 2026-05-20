import { AlertTriangle, ServerCrash, WifiOff } from 'lucide-react';

const ERROR_CONFIGS = {
  400: { Icon: AlertTriangle, label: 'Bad request',        color: 'text-amber-400 border-amber-500/30 bg-amber-500/10'  },
  404: { Icon: AlertTriangle, label: 'Location not found', color: 'text-amber-400 border-amber-500/30 bg-amber-500/10'  },
  429: { Icon: ServerCrash,   label: 'Rate limit reached', color: 'text-orange-400 border-orange-500/30 bg-orange-500/10' },
  500: { Icon: ServerCrash,   label: 'Server error',       color: 'text-red-400 border-red-500/30 bg-red-500/10'        },
};

export function ErrorBanner({ message, code }) {
  const config = code ? ERROR_CONFIGS[code] : undefined;
  const Icon = config?.Icon ?? WifiOff;
  const colorClass = config?.color ?? 'text-red-400 border-red-500/30 bg-red-500/10';

  return (
    <div className={`flex items-start gap-3 rounded-xl border px-4 py-3 text-sm ${colorClass}`}>
      <Icon size={16} className="mt-0.5 shrink-0" />
      <div>
        {config?.label && <span className="font-medium">{config.label} — </span>}
        <span className="opacity-90">{message}</span>
        {code === 429 && (
          <p className="mt-1 opacity-70">The API gateway rate limit was exceeded. Try again in a moment.</p>
        )}
      </div>
    </div>
  );
}
