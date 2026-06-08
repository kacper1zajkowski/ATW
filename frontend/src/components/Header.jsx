import { Sun, Moon } from 'lucide-react';

/* Sticky header: family sigil + ATW wordmark on the left, theme toggle right.
   Hairline bottom, blurred translucent bg — matches the zajkowski.cloud system. */
export function Header({ theme, onToggleTheme }) {
  return (
    <header
      className="sticky top-0 z-30 flex items-center justify-between border-b border-hairline px-gutter py-[18px]"
      style={{
        background: 'color-mix(in srgb, var(--bg) 78%, transparent)',
        backdropFilter: 'blur(14px) saturate(140%)',
        WebkitBackdropFilter: 'blur(14px) saturate(140%)',
      }}
    >
      <a href="/" className="group flex items-center gap-3 no-underline">
        <span className="logo-mark h-[26px] w-[26px] group-hover:!text-accent group-hover:[transform:rotate(-4deg)]" />
        <span className="font-mono text-[11px] uppercase tracking-wide text-ink">ATW</span>
        <span className="hidden font-mono text-[11px] uppercase tracking-label text-ink-3 sm:inline">
          all things weather
        </span>
      </a>

      <button
        type="button"
        onClick={onToggleTheme}
        aria-label="Toggle theme"
        className="inline-flex items-center gap-2 rounded-pill border border-hairline-strong px-3 py-[7px] font-mono text-[10px] uppercase tracking-[.14em] text-ink transition-colors duration-200 hover:border-ink"
      >
        {theme === 'dark' ? <Moon size={12} className="text-accent" /> : <Sun size={12} className="text-accent" />}
        <span>{theme}</span>
      </button>
    </header>
  );
}
