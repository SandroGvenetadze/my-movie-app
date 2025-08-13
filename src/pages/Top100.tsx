// src/pages/Top100.tsx
import { useMemo, useState } from "react";
import { useTop100 } from "@/hooks/useTop100";
import MovieCard from "@/components/MovieCard";
import SearchBar from "@/components/SearchBar";
import SkeletonCard from "@/components/SkeletonCard";
import { useFavorites } from "@/hooks/useFavorites";
import NavBar from "@/components/NavBar";

export default function Top100() {
  const { movies, loading, source } = useTop100();
  const { isFav, toggle } = useFavorites();
  const [query, setQuery] = useState("");
  const [year, setYear] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const y = year.trim();
    return movies.filter((m) => {
      const matchQ = !q || (m.title || m.name || "").toLowerCase().includes(q);
      const movieYear =
        m.year ?? (m.release_date ? new Date(m.release_date).getFullYear() : undefined);
      const matchY = !y || String(movieYear) === y;
      return matchQ && matchY;
    });
  }, [movies, query, year]);

  return (
    <div>
      <NavBar />
      <main className="page-fade">
        <div className="mx-auto max-w-7xl px-3 sm:px-4 lg:px-6 py-6">
          <div className="mb-4 flex items-center justify-between">
            <div className="rounded-full border border-black/5 bg-emerald-500/10 px-2 py-1 text-xs text-emerald-600 dark:border-white/10 dark:text-emerald-400 sm:text-sm">
              Source: {source}
            </div>
            <div className="text-xs text-zinc-500">Total: {filtered.length}</div>
          </div>

          <div className="mb-4">
            <SearchBar query={query} setQuery={setQuery} year={year} setYear={setYear} />
          </div>

          {loading ? (
            <div className="grid grid-animate gap-4 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
              {Array.from({ length: 12 }).map((_, i) => (
                <div
                  key={i}
                  className="cv-auto h-full animate-fade-in"
                  style={{ animationDelay: `${i * 40}ms` }}
                >
                  <SkeletonCard />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-animate gap-4 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
              {filtered.map((m, i) => (
                <div
                  key={m.id}
                  className="cv-auto h-full animate-fade-in"
                  style={{ animationDelay: `${i * 40}ms` }}
                >
                  <MovieCard movie={m} isFav={isFav(m.id)} onToggle={toggle} />
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
