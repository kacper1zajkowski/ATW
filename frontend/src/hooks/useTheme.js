import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'atw-theme';

function initialTheme() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved === 'light' || saved === 'dark') return saved;
  // default to light regardless of OS preference (don't follow prefers-color-scheme)
  return 'light';
}

/**
 * Theme toggle with the one-frame transition kill (see .switching in index.css):
 * a bare var() colour change won't animate, so we suppress transitions for a
 * single frame while flipping data-theme to avoid weird mid-swap tweening.
 */
export function useTheme() {
  const [theme, setTheme] = useState(() => {
    const t = initialTheme();
    document.documentElement.setAttribute('data-theme', t);
    return t;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  const toggle = useCallback(() => {
    const root = document.documentElement;
    root.classList.add('switching');
    setTheme((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      return next;
    });
    void root.offsetWidth; // force reflow
    requestAnimationFrame(() => root.classList.remove('switching'));
  }, []);

  return { theme, toggle };
}
