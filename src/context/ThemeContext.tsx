// src/context/ThemeContext.tsx
// Provides dark/light theme with persistence, no FOUC (paired with index.html inline script)
import { createContext, useContext, useEffect, useMemo, useState } from 'react';

type Theme = 'light' | 'dark';
type ThemeCtx = { theme: Theme; toggle: () => void; setTheme: (t: Theme) => void };

const ThemeContext = createContext<ThemeCtx | null>(null);

function applyThemeClass(theme: Theme) {
  const root = document.documentElement;
  if (theme === 'dark') root.classList.add('dark');
  else root.classList.remove('dark');
  root.dataset.theme = theme; // helpful for CSS or tests
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    try {
      // hydrate from localStorage or media query
      const saved = localStorage.getItem('theme') as Theme | null;
      if (saved === 'dark' || saved === 'light') return saved;
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      return prefersDark ? 'dark' : 'light';
    } catch { return 'dark'; }
  });

  useEffect(() => {
    applyThemeClass(theme);
    try { localStorage.setItem('theme', theme); } catch {}
  }, [theme]);

  const value = useMemo<ThemeCtx>(() => ({
    theme,
    toggle: () => setThemeState(t => (t === 'dark' ? 'light' : 'dark')),
    setTheme: (t) => setThemeState(t)
  }), [theme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
