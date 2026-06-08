import { Wind } from 'lucide-react';
import { BaseTile } from './BaseTile';

const SEV = { 1: 'var(--sev-1)', 2: 'var(--sev-2)', 3: 'var(--sev-3)', 4: 'var(--sev-4)', 5: 'var(--sev-5)' };

function Pollutant({ label, value, unit }) {
  return (
    <div>
      <p className="font-mono text-[10px] uppercase tracking-label text-ink-3">{label}</p>
      <p className="mt-0.5 font-medium tabular-nums text-ink">
        {value} <span className="text-xs text-ink-3">{unit}</span>
      </p>
    </div>
  );
}

export function AirQualityTile({ airQuality, index }) {
  const sev = SEV[airQuality.aqi_eu] ?? SEV[3];

  return (
    <BaseTile
      title="Air quality"
      icon={<Wind size={14} className="text-ink-2" />}
      idx={2}
      index={index}
    >
      <div style={{ '--sev': sev }}>
        <div className="flex items-center gap-3">
          <div className="sev-soft sev-text flex h-14 w-14 shrink-0 items-center justify-center rounded-card text-2xl font-bold tabular-nums">
            {airQuality.aqi_eu}
          </div>
          <div>
            <p className="sev-text text-lg font-semibold">{airQuality.category}</p>
            <p className="font-mono text-[10px] uppercase tracking-label text-ink-3">EU AQI index (1–5)</p>
          </div>
        </div>

        <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-hairline">
          <div
            className="sev-bar h-full rounded-full transition-all duration-700"
            style={{ width: `${(airQuality.aqi_eu / 5) * 100}%` }}
          />
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <Pollutant label="PM2.5" value={airQuality.pm2_5}    unit="µg/m³" />
        <Pollutant label="PM10"  value={airQuality.pm10}     unit="µg/m³" />
        <Pollutant label="NO₂"   value={airQuality.no2_ugm3} unit="µg/m³" />
        <Pollutant label="O₃"    value={airQuality.o3_ugm3}  unit="µg/m³" />
      </div>
    </BaseTile>
  );
}
