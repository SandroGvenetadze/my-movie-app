// src/pages/Top100.tsx
import { useMemo, useState } from 'react';
import { useTop100 } from '@/hooks/useTop100';
import MovieCard from '@/components/MovieCard';
import SearchBar from '@/components/SearchBar';
import SkeletonCard from '@/components/SkeletonCard';
import { useFavorites } from '@/hooks/useFavorites';
import NavBar from '@/components/NavBar';

export default function Top100() {
  const { movies, loading, source } = useTop100();
  const { isFav, toggle } = useFavorites();
  const [query, setQuery] = useState('');
  const [year, setYear] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const y = year.trim();
    return movies.filter((m) => {
      const matchQ = !q || m.title.toLowerCase().includes(q);
      const matchY = !y || String(m.year) === y;
      return matchQ && matchY;
    });
  }, [movies, query, year]);

  return (
    <div>
      <NavBar />
      <main className="container mx-auto px-4 lg:px-6 py-6 page-fade">
        <div className="flex items-center justify-between mb-4">
          <div
            className="text-xs sm:text-sm px-2 py-1 rounded-full border
                       border-black/5 dark:border-white/10
                       bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
          >
            Source: {source}
          </div>
          <div className="text-xs text-zinc-500">Total: {filtered.length}</div>
        </div>

        <div className="mb-4">
          <SearchBar query={query} setQuery={setQuery} year={year} setYear={setYear} />
        </div>

        {loading ? (
          <div className="grid grid-animate gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="animate-fade-in cv-auto" style={{ animationDelay: `${i * 40}ms` }}>
                <SkeletonCard />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-animate gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {filtered.map((m, i) => (
              <div key={m.id} className="animate-fade-in cv-auto" style={{ animationDelay: `${i * 40}ms` }}>
                <MovieCard movie={m} isFav={isFav(m.id)} onToggle={toggle} />
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
