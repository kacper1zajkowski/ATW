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
      <p className="text-slate-500">{label}</p>
      <p className="font-medium text-slate-200">{value}</p>
    </div>
  );
}

export function WeatherTile({ current, location, index }) {
  const WeatherIcon = CONDITION_ICONS[current.condition.code] ?? Cloud;

  return (
    <BaseTile
      title="Current weather"
      icon={<Thermometer size={14} className="text-blue-400" />}
      accentColor="border-l-blue-500"
      index={index}
    >
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-end gap-1">
            <span className="text-5xl font-bold tabular-nums text-slate-100">{current.temp_c}</span>
            <span className="mb-1 text-2xl text-slate-400">°C</span>
          </div>
          <p className="mt-1 text-sm text-slate-400">Feels like {current.feels_like_c}°C</p>
          <p className="mt-0.5 text-sm font-medium text-slate-300">{current.condition.text}</p>
        </div>
        <WeatherIcon size={52} className="text-blue-400/70" />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 border-t border-slate-700/40 pt-4 text-sm">
        <Stat label="Humidity"   value={`${current.humidity_pct}%`} />
        <Stat label="Wind"       value={`${current.wind_kph} km/h ${windDir(current.wind_deg)}`} />
        <Stat label="Pressure"   value={`${current.pressure_hpa} hPa`} />
        <Stat label="Visibility" value={`${current.visibility_km} km`} />
      </div>

      <p className="mt-3 text-xs text-slate-500">
        {location.lat.toFixed(3)}, {location.lon.toFixed(3)}
      </p>
    </BaseTile>
  );
}
