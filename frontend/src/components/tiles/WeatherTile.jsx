import { Cloud, CloudRain, CloudSnow, CloudLightning, CloudSun, Sun, Thermometer } from 'lucide-react';
import { BaseTile } from './BaseTile';

const CONDITION_ICONS = {
  sunny:         Sun,
  partly_cloudy: CloudSun,
  cloudy:        Cloud,
  light_rain:    CloudRain,
  heavy_rain:    CloudRain,
  snow:          CloudSnow,
  thunderstorm:  CloudLightning,
};

function windDir(deg) {
  const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  return dirs[Math.round(deg / 45) % 8];
}

function Stat({ label, value }) {
  return (
    <div>
      <p className="font-mono text-[10px] uppercase tracking-label text-ink-3">{label}</p>
      <p className="mt-0.5 font-medium tabular-nums text-ink">{value}</p>
    </div>
  );
}

export function WeatherTile({ current, location, index }) {
  const WeatherIcon = CONDITION_ICONS[current.condition.code] ?? Cloud;

  return (
    <BaseTile
      title="Current weather"
      icon={<Thermometer size={14} className="text-ink-2" />}
      idx={1}
      index={index}
    >
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-start gap-1">
            <span className="text-6xl font-extrabold tabular-nums tracking-tighter text-ink">{current.temp_c}</span>
            <span className="mt-1 text-2xl text-ink-3">°C</span>
          </div>
          <p className="mt-1 text-sm text-ink-2">Feels like {current.feels_like_c}°C</p>
          <p className="mt-0.5 text-sm font-medium text-ink">{current.condition.text}</p>
        </div>
        <WeatherIcon size={50} className="text-ink-3" strokeWidth={1.25} />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 border-t border-hairline pt-4 text-sm">
        <Stat label="Humidity"   value={`${current.humidity_pct}%`} />
        <Stat label="Wind"       value={`${current.wind_kph} km/h ${windDir(current.wind_deg)}`} />
        <Stat label="Pressure"   value={`${current.pressure_hpa} hPa`} />
        <Stat label="Visibility" value={`${current.visibility_km} km`} />
      </div>

      <p className="mt-3 font-mono text-[10px] tracking-[.06em] text-ink-3">
        {location.lat.toFixed(3)}, {location.lon.toFixed(3)}
      </p>
    </BaseTile>
  );
}
