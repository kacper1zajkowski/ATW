import { useState } from 'react';
import { Github, ArrowUpRight } from 'lucide-react';
import { useWeatherData } from './hooks/useWeatherData';
import { useTheme } from './hooks/useTheme';
import { Background } from './components/Background';
import { Header } from './components/Header';
import { SearchBar } from './components/SearchBar';
import { Dashboard } from './components/Dashboard';
import { ErrorBanner } from './components/ErrorBanner';

export default function App() {
  const { state, search } = useWeatherData();
  const { theme, toggle } = useTheme();
  const [query, setQuery] = useState('');

  const hasContent =
    state.status === 'loading' ||
    state.status === 'success' ||
    state.status === 'error';

  return (
    <div className="relative min-h-screen bg-bg text-ink">
      <Background />

      <div className="relative z-[1] flex min-h-screen flex-col">
        <Header theme={theme} onToggleTheme={toggle} />

        {!hasContent ? (
          /* ---------- HERO / LANDING ---------- */
          <main className="container mx-auto flex w-full max-w-content flex-1 flex-col items-center justify-center px-gutter py-s6 text-center">
            <div className="mb-s4 flex items-center gap-[14px]">
              <span className="h-px w-14 bg-hairline-strong" />
              <span className="mono">
                <span className="tick">●</span>&nbsp; ATW / ENVIRONMENTAL INTELLIGENCE
              </span>
            </div>

            <h1 className="m-0 font-light leading-[1.06] tracking-tightest text-[clamp(44px,11vw,150px)] lowercase">
              all things
              <br />
              <span className="font-skeletor font-normal tracking-[0.02em] text-ink">
                weather
              </span>
            </h1>

            <p className="mt-s4 max-w-[52ch] text-ink-2 text-[16px] leading-[1.6]">
              Check current conditions, air quality, UV, pollen & a six-day outlook and the moon.
              Search a city, or drop coordinates.
            </p>

            <div className="mt-s5 w-full max-w-xl">
              <SearchBar
                value={query}
                onChange={setQuery}
                onSearch={search}
                loading={false}
                compact={false}
              />
            </div>

            <div className="mt-s4">
              <span className="inline-flex items-center gap-[9px] rounded-pill border border-hairline-strong px-[13px] py-[7px] font-mono text-[11px] uppercase tracking-label text-ink-2">
                <span className="dot-ping h-[7px] w-[7px] rounded-full bg-accent" />
                Live data
              </span>
            </div>
          </main>
        ) : (
          /* ---------- DASHBOARD ---------- */
          <main className="container mx-auto w-full max-w-content flex-1 px-gutter py-s4">
            <div className="mb-s4">
              <SearchBar
                value={query}
                onChange={setQuery}
                onSearch={search}
                loading={state.status === 'loading'}
                compact={true}
              />
            </div>

            {state.status === 'error' && (
              <ErrorBanner message={state.message} code={state.code} />
            )}

            {(state.status === 'loading' || state.status === 'success') && (
              <>
                {state.status === 'success' && (
                  <div className="mb-s3 flex items-baseline gap-3 border-b border-hairline pb-s3">
                    <span className="font-mono text-[11px] uppercase tracking-label text-accent">
                      / location
                    </span>
                    <span className="text-[15px] font-medium text-ink">
                      {state.data.location.name}
                      {state.data.location.country ? `, ${state.data.location.country}` : ''}
                    </span>
                    <a
                      href={`https://www.google.com/maps?q=${state.data.location.lat},${state.data.location.lon}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-auto font-mono text-[11px] tracking-[.04em] text-ink-3 transition-colors hover:text-accent"
                    >
                      {state.data.location.lat.toFixed(3)}, {state.data.location.lon.toFixed(3)}
                    </a>
                  </div>
                )}
                <Dashboard data={state.status === 'success' ? state.data : null} />
              </>
            )}
          </main>
        )}

        {/* ---------- FOOTER ---------- */}
        <footer className="container mx-auto mt-s6 w-full max-w-content px-gutter">
          <div className="flex items-end justify-between gap-s4 border-t border-hairline pt-s4 pb-s4 flex-wrap">
            <span className="ftr-mark select-none font-dotled text-[clamp(34px,7vw,72px)] uppercase leading-[.85] tracking-[.02em]">
              ATW
            </span>
            <div className="flex flex-col items-end gap-2 text-right">
              <a
                href="https://github.com/kacper1zajkowski/ATW"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 rounded-pill border border-hairline-strong px-[14px] py-[9px] font-mono text-[11px] uppercase tracking-[.1em] text-ink-2 transition-all duration-200 hover:-translate-y-0.5 hover:border-ink hover:text-ink"
              >
                <Github size={13} />
                <span>kacper1zajkowski / ATW</span>
                <ArrowUpRight size={13} className="text-ink-3 transition-colors group-hover:text-accent" />
              </a>
              <span className="font-mono text-[10px] uppercase tracking-label text-ink-3">
                zajkowski.cloud — est. 2026
              </span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
