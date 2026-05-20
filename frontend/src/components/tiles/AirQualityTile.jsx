import { Wind } from 'lucide-react';
import { BaseTile } from './BaseTile';

const AQI_CONFIG = {
  1: { color: 'text-emerald-400', bar: 'bg-emerald-400', bg: 'bg-emerald-400/10' },
  2: { color: 'text-lime-400',    bar: 'bg-lime-400',    bg: 'bg-lime-400/10'    },
  3: { color: 'text-amber-400',   bar: 'bg-amber-400',   bg: 'bg-amber-400/10'   },
  4: { color: 'text-orange-400',  bar: 'bg-orange-400',  bg: 'bg-orange-400/10'  },
  5: { color: 'text-red-400',     bar: 'bg-red-400',     bg: 'bg-red-400/10'     },
};

function Pollutant({ label, value, unit }) {
  return (
    <div>
      <p className="text-slate-500">{label}</p>
      <p className="font-medium text-slate-200">
        {value} <span className="text-xs text-slate-500">{unit}</span>
      </p>
    </div>
  );
}

export function AirQualityTile({ airQuality, index }) {
  const cfg = AQI_CONFIG[airQuality.aqi_eu] ?? AQI_CONFIG[3];

  return (
    <BaseTile
      title="Air quality"
      icon={<Wind size={14} className="text-emerald-400" />}
      accentColor="border-l-emerald-500"
      index={index}
    >
      <div className="flex items-center gap-3">
        <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-2xl font-bold ${cfg.bg} ${cfg.color}`}>
          {airQuality.aqi_eu}
        </div>
        <div>
          <p className={`text-lg font-semibold ${cfg.color}`}>{airQuality.category}</p>
          <p className="text-xs text-slate-500">EU AQI index (1–5)</p>
        </div>
      </div>

      <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-slate-700">
        <div
          className={`h-full rounded-full transition-all duration-700 ${cfg.bar}`}
          style={{ width: `${(airQuality.aqi_eu / 5) * 100}%` }}
        />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
        <Pollutant label="PM2.5" value={airQuality.pm2_5}    unit="µg/m³" />
        <Pollutant label="PM10"  value={airQuality.pm10}     unit="µg/m³" />
        <Pollutant label="NO₂"   value={airQuality.no2_ugm3} unit="µg/m³" />
        <Pollutant label="O₃"    value={airQuality.o3_ugm3}  unit="µg/m³" />
      </div>
    </BaseTile>
  );
}
