// src/hooks/useTop100.ts
// Fetch Top Rated movies from TMDb (pages 1..5). Fallback to local JSON if API fails.
// Caches to localStorage for perf and to survive rate limits.
import { useEffect, useState } from 'react';

export type Movie = {
  id: string;
  title: string;
  image: string;
  year: number;
  genres: string[];
  rating?: number;
  plot?: string;
};

type Result = { movies: Movie[]; loading: boolean; source: 'TMDB' | 'FALLBACK' };

const CACHE_KEY = 'top100.cache.v2';
const CACHE_AT = 'top100.cacheAt.v2';
const STALE_MS = 1000 * 60 * 60 * 24; // 24h

const IMG_BASE = 'https://image.tmdb.org/t/p/w500';

export function useTop100(): Result {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState<'TMDB' | 'FALLBACK'>('TMDB');

  useEffect(() => {
    let alive = true;
    (async () => {
      // Try cache first
      try {
        const cached = localStorage.getItem(CACHE_KEY);
        const at = Number(localStorage.getItem(CACHE_AT) || 0);
        if (cached && Date.now() - at < STALE_MS) {
          const data = JSON.parse(cached) as Movie[];
          if (alive) { setMovies(data); setLoading(false); setSource('TMDB'); }
          return;
        }
      } catch {}

      // Fetch TMDb top rated pages 1..5 (100 movies)
      try {
        const API_KEY = import.meta.env.VITE_TMDB_API_KEY as string;
        const fetchPage = async (page: number) => {
          const res = await fetch(`https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=${page}&api_key=${API_KEY}`);
          if (!res.ok) throw new Error('TMDb error');
          return res.json();
        };
        const pages = await Promise.all([1,2,3,4,5].map(fetchPage));
        const items = pages.flatMap(p => p.results).slice(0, 100);
        const mapped: Movie[] = items.map((m: any) => ({
          id: String(m.id),
          title: m.title ?? m.name ?? 'Untitled',
          image: m.poster_path ? `${IMG_BASE}${m.poster_path}` : '/placeholder.svg',
          year: m.release_date ? Number(String(m.release_date).slice(0,4)) : 0,
          genres: [], // Could be enriched with genre map if needed
          rating: typeof m.vote_average === 'number' ? Number(m.vote_average.toFixed(1)) : undefined,
          plot: m.overview || undefined,
        }));
        if (!alive) return;
        setMovies(mapped);
        setSource('TMDB');
        try {
          localStorage.setItem(CACHE_KEY, JSON.stringify(mapped));
          localStorage.setItem(CACHE_AT, String(Date.now()));
        } catch {}
      } catch (err) {
        // Fallback to local JSON
        try {
          const res = await fetch('/top100.fallback.json');
          const raw = await res.json();
          const mapped: Movie[] = raw.map((m: any) => ({
            id: String(m.id ?? crypto.randomUUID()),
            title: m.title,
            image: m.image || '/placeholder.svg',
            year: Number(m.year) || 0,
            genres: (m.genre ?? []).map((g: any) => String(g)),
            rating: m.rating ? Number(m.rating) : undefined,
            plot: m.description || undefined,
          }));
          if (!alive) return;
          setMovies(mapped);
          setSource('FALLBACK');
          setLoading(false);
          try {
            localStorage.setItem(CACHE_KEY, JSON.stringify(mapped));
            localStorage.setItem(CACHE_AT, String(Date.now()));
          } catch {}
        } catch {
          if (alive) { setMovies([]); setSource('FALLBACK'); setLoading(false); }
        }
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  return { movies, loading, source };
}
