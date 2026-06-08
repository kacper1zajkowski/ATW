import { useState, useEffect, useRef } from 'react';
import { Cloud, CloudRain, CloudSnow, CloudLightning, CloudSun, Sun, Droplets } from 'lucide-react';
import { BaseTile } from './BaseTile';

function TypewriterText({ text, speed = 18 }) {
  const [displayed, setDisplayed] = useState('');
  const indexRef = useRef(0);

  useEffect(() => {
    setDisplayed('');
    indexRef.current = 0;
    const id = setInterval(() => {
      indexRef.current += 1;
      setDisplayed(text.slice(0, indexRef.current));
      if (indexRef.current >= text.length) clearInterval(id);
    }, speed);
    return () => clearInterval(id);
  }, [text, speed]);

  return (
    <>
      {displayed}
      {displayed.length < text.length && (
        <span className="ml-0.5 inline-block h-3.5 w-0.5 bg-accent align-middle animate-pulse" />
      )}
    </>
  );
}

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

export function ForecastTile({ forecast, summary, index }) {
  return (
    <BaseTile
      title="6-day forecast"
      icon={<CloudSun size={14} className="text-ink-2" />}
      idx={4}
      index={index}
    >
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
        {forecast.slice(0, 6).map((day) => {
          const Icon = CONDITION_ICONS[day.condition.code] ?? Cloud;
          return (
            <div
              key={day.date}
              className="flex flex-col items-center gap-1.5 rounded-card border border-hairline bg-surface-soft px-2 py-3 text-center text-sm transition-colors duration-200 hover:border-hairline-strong"
            >
              <span className="font-mono text-[10px] uppercase tracking-label text-ink-3">{shortDay(day.date)}</span>
              <Icon size={20} className="text-ink-2" strokeWidth={1.5} />
              <div className="mt-0.5 tabular-nums">
                <span className="font-semibold text-ink">{day.temp_max_c}°</span>
                <span className="text-ink-3"> / {day.temp_min_c}°</span>
              </div>
              <span className="flex items-center gap-0.5 font-mono text-[10px] text-ink-2">
                <Droplets size={10} className="text-ink-3" />{day.precipitation_prob_pct}%
              </span>
            </div>
          );
        })}
      </div>

      {summary && (
        <p className="mt-4 border-t border-hairline pt-4 text-sm leading-relaxed text-ink-2">
          <TypewriterText text={summary} />
        </p>
      )}
    </BaseTile>
  );
}
