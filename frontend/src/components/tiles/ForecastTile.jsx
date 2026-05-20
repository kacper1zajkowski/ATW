import { Cloud, CloudRain, CloudSnow, CloudLightning, CloudSun, Sun, Droplets } from 'lucide-react';
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

function shortDay(dateStr) {
  return new Date(dateStr + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'short' });
}

export function ForecastTile({ forecast, index }) {
  return (
    <BaseTile
      title="6-day forecast"
      icon={<CloudSun size={14} className="text-sky-400" />}
      accentColor="border-l-sky-500"
      index={index}
    >
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
        {forecast.slice(0, 6).map((day) => {
          const Icon = CONDITION_ICONS[day.condition.code] ?? Cloud;
          return (
            <div
              key={day.date}
              className="flex flex-col items-center gap-1 rounded-xl bg-slate-700/30 px-2 py-3 text-center text-sm"
            >
              <span className="text-xs font-medium text-slate-400">{shortDay(day.date)}</span>
              <Icon size={20} className="text-sky-400" />
              <div className="mt-0.5">
                <span className="font-semibold text-slate-100">{day.temp_max_c}°</span>
                <span className="text-slate-500"> / {day.temp_min_c}°</span>
              </div>
              <span className="flex items-center gap-0.5 text-xs text-blue-400">
                <Droplets size={10} />{day.precipitation_prob_pct}%
              </span>
            </div>
          );
        })}
      </div>
    </BaseTile>
  );
}
