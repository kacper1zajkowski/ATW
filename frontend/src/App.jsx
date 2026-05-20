import { useState } from 'react';
import { useWeatherData } from './hooks/useWeatherData';
import { SearchBar } from './components/SearchBar';
import { Dashboard } from './components/Dashboard';
import { ErrorBanner } from './components/ErrorBanner';

export default function App() {
  const { state, search } = useWeatherData();
  const [query, setQuery] = useState('');

  const hasContent =
    state.status === 'loading' ||
    state.status === 'success' ||
    state.status === 'error';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950" />

      <div
        className={
          hasContent
            ? 'px-4 py-6 max-w-6xl mx-auto'
            : 'flex min-h-screen flex-col items-center justify-center px-4'
        }
      >
        {!hasContent && (
          <div className="mb-8 text-center">
            <h1 className="mb-1 text-5xl font-bold tracking-tight text-white">ATW</h1>
            <p className="text-slate-400">Environmental dashboard</p>
          </div>
        )}

        <div className={hasContent ? '' : 'w-full max-w-xl'}>
          <SearchBar
            value={query}
            onChange={setQuery}
            onSearch={search}
            loading={state.status === 'loading'}
            compact={hasContent}
          />
        </div>

        {state.status === 'error' && (
          <div className="mt-4">
            <ErrorBanner message={state.message} code={state.code} />
          </div>
        )}

        {(state.status === 'loading' || state.status === 'success') && (
          <div className="mt-6">
            {state.status === 'success' && (
              <div className="mb-4 flex items-center gap-2 text-sm text-slate-400">
                <span className="font-medium text-slate-200">
                  {state.data.location.name}
                  {state.data.location.country ? `, ${state.data.location.country}` : ''}
                </span>
                <span>·</span>
                <span>
                  {state.data.location.lat.toFixed(3)}, {state.data.location.lon.toFixed(3)}
                </span>
                {state.data._meta.source === 'mock' && (
                  <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-xs text-amber-400">
                    mock data
                  </span>
                )}
              </div>
            )}
            <Dashboard data={state.status === 'success' ? state.data : null} />
          </div>
        )}
      </div>
    </div>
  );
}
