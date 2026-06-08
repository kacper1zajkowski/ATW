import { useRef } from 'react';
import { Search, MapPin, Loader2 } from 'lucide-react';

export function SearchBar({ value, onChange, onSearch, loading, compact }) {
  const inputRef = useRef(null);

  function handleSubmit(e) {
    e.preventDefault();
    onSearch(value);
  }

  function handleGeolocate() {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const loc = `${coords.latitude.toFixed(5)},${coords.longitude.toFixed(5)}`;
        onChange(loc);
        onSearch(loc);
      },
      () => alert('Geolocation unavailable or denied.'),
    );
  }

  const h = compact ? 'h-10' : 'h-12';

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <div
        className={`relative flex flex-1 items-center rounded-pill border border-hairline-strong bg-surface-soft backdrop-blur-sm transition-colors duration-200 focus-within:border-accent ${h}`}
      >
        <Search size={compact ? 15 : 17} className="ml-4 shrink-0 text-ink-3" />
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="City name or lat,lon coordinates…"
          className="flex-1 bg-transparent px-3 text-base text-ink outline-none placeholder:text-ink-3 sm:text-sm"
          disabled={loading}
          autoFocus={!compact}
        />
        {loading && <Loader2 size={15} className="mr-4 animate-spin text-accent" />}
      </div>

      <button
        type="submit"
        disabled={loading || !value.trim()}
        className={`shrink-0 rounded-pill bg-ink px-5 font-mono text-[11px] uppercase tracking-label text-bg transition-opacity duration-200 hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-40 ${h}`}
      >
        Search
      </button>

      <button
        type="button"
        onClick={handleGeolocate}
        disabled={loading}
        title="Use my location"
        className={`group shrink-0 rounded-pill border border-hairline-strong px-3 text-ink-2 transition-colors duration-200 hover:border-ink hover:text-accent disabled:opacity-40 ${h}`}
      >
        <MapPin size={16} />
      </button>
    </form>
  );
}
