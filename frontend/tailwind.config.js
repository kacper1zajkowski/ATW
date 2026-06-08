/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  // align Tailwind's `dark:` variant with data-theme (theme is var-driven anyway)
  darkMode: ['selector', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)',
        'bg-2': 'var(--bg-2)',
        surface: 'var(--surface)',
        'surface-soft': 'var(--surface-soft)',
        ink: 'var(--ink)',
        'ink-2': 'var(--ink-2)',
        'ink-3': 'var(--ink-3)',
        accent: 'var(--accent)',
        'accent-soft': 'var(--accent-soft)',
        'on-accent': 'var(--on-accent)',
        hairline: 'var(--hairline)',
        'hairline-strong': 'var(--hairline-strong)',
        harsh: 'var(--harsh)',
      },
      fontFamily: {
        sans: ['Archivo', 'system-ui', 'sans-serif'],
        mono: ['"Space Mono"', 'ui-monospace', 'monospace'],
        serif: ['"Instrument Serif"', 'Georgia', 'serif'],
        dotled: ['DOTLED', 'Archivo', 'sans-serif'],
        skeletor: ['"Skeletor Stance"', 'Archivo', 'sans-serif'],
      },
      spacing: {
        s1: '8px',
        s2: '13px',
        s3: '21px',
        s4: '34px',
        s5: '55px',
        s6: '89px',
        s7: '144px',
        gutter: 'var(--gutter)',
      },
      maxWidth: { content: '1240px' },
      borderColor: { DEFAULT: 'var(--hairline)' },
      borderRadius: { pill: '999px', card: '14px' },
      transitionTimingFunction: { signature: 'cubic-bezier(.2, .7, .3, 1)' },
      letterSpacing: {
        tightest: '-0.03em', // slogan
        tighter: '-0.02em', // titles
        label: '0.12em', // mono labels
        wide: '0.22em', // wordmark
      },
      animation: {
        'tile-in': 'tileIn 0.5s cubic-bezier(.2,.7,.3,1) both',
      },
    },
  },
  plugins: [],
};
