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

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <div
        className={`relative flex flex-1 items-center rounded-xl border border-slate-700/60 bg-slate-800/70 backdrop-blur-sm transition-all focus-within:border-blue-500/60 focus-within:ring-1 focus-within:ring-blue-500/30 ${compact ? 'h-10' : 'h-12'}`}
      >
        <Search size={compact ? 15 : 17} className="ml-3 shrink-0 text-slate-500" />
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="City name or lat,lon coordinates…"
          className="flex-1 bg-transparent px-3 text-sm text-slate-100 outline-none placeholder:text-slate-500"
          disabled={loading}
          autoFocus={!compact}
        />
        {loading && <Loader2 size={15} className="mr-3 animate-spin text-blue-400" />}
      </div>

      <button
        type="submit"
        disabled={loading || !value.trim()}
        className={`shrink-0 rounded-xl bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50 ${compact ? 'h-10' : 'h-12'}`}
      >
        Search
      </button>

      <button
        type="button"
        onClick={handleGeolocate}
        disabled={loading}
        title="Use my location"
        className={`shrink-0 rounded-xl border border-slate-700/60 bg-slate-800/70 px-3 text-slate-400 transition-colors hover:border-blue-500/40 hover:text-blue-400 disabled:opacity-50 ${compact ? 'h-10' : 'h-12'}`}
      >
        <MapPin size={16} />
      </button>
    </form>
  );
}
