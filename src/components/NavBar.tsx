// src/components/NavBar.tsx
import { NavLink } from 'react-router-dom';
import ThemeToggle from '@/components/ThemeToggle';
import { useState } from 'react';

export default function NavBar() {
  const [open, setOpen] = useState(false);

  return (
    <header
      className="sticky top-0 z-40
                 bg-white/85 dark:bg-zinc-900/85
                 border-b border-black/5 dark:border-white/10"
    >
      <div className="container mx-auto flex items-center justify-between py-3 px-4 lg:px-6">
        <NavLink to="/" className="font-bold text-lg tracking-tight">
          <span className="text-indigo-600 dark:text-indigo-400">Top</span>
          <span className="text-zinc-900 dark:text-white">Movies</span>
        </NavLink>

        <nav className="hidden md:flex items-center gap-4 text-sm">
          <NavLink to="/" className="text-zinc-700 dark:text-zinc-200 hover:text-indigo-600">Top 100</NavLink>
          <NavLink to="/favorites" className="text-zinc-700 dark:text-zinc-200 hover:text-indigo-600">Favorites</NavLink>
          <ThemeToggle />
        </nav>

        <button
          className="md:hidden inline-flex items-center justify-center h-10 w-10 rounded-lg
                     bg-black/5 dark:bg-white/10 border border-black/5 dark:border-white/10"
          onClick={() => setOpen(v => !v)} aria-label="Menu">
          <span className="i">≡</span>
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-black/5 dark:border-white/10 px-4 py-3 space-y-2">
          <NavLink to="/" onClick={() => setOpen(false)} className="block text-zinc-700 dark:text-zinc-200">Top 100</NavLink>
          <NavLink to="/favorites" onClick={() => setOpen(false)} className="block text-zinc-700 dark:text-zinc-200">Favorites</NavLink>
          <ThemeToggle />
        </div>
      )}
    </header>
  );
}
