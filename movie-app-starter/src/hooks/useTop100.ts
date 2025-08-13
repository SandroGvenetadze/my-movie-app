import { useEffect, useState } from 'react';

export type Movie = {
  id: number;
  title: string;
  image: string;
  backdrop: string;
  year: number;
  genres: number[];
  rating?: number;
  plot?: string;
};

type Result = { movies: Movie[]; loading: boolean; source: 'TMDB' | 'FALLBACK' };

const CACHE_KEY = 'top100.cache.v3';
const CACHE_AT = 'top100.cacheAt.v3';
const STALE_MS = 1000 * 60 * 60 * 24; // 24h

const IMG_BASE = 'https://image.tmdb.org/t/p/w500';
const FALLBACK_POSTER = '/placeholder.svg';
const FALLBACK_BACKDROP = '/backdrop-placeholder.jpg';

async function fetchTMDbTop100ViaProxy(): Promise<Movie[]> {
  const pages = [1, 2, 3, 4, 5];
  const results: any[] = [];
  for (const page of pages) {
    const res = await fetch(`/api/tmdb?path=/movie/top_rated&language=en-US&page=${page}`);
    if (!res.ok) throw new Error('TMDb proxy failed: ' + res.status);
    const json = await res.json();
    results.push(...(json.results || []));
  }
  return results.slice(0, 100).map((m: any) => {
    const posterFull = m.poster_path ? `${IMG_BASE}${m.poster_path}` : FALLBACK_POSTER;
    const backdropFull = m.backdrop_path ? `${IMG_BASE}${m.backdrop_path}` : FALLBACK_BACKDROP;
    return {
      id: m.id,
      title: m.title || m.name || 'Untitled',
      image: posterFull,
      backdrop: backdropFull,
      year: m.release_date ? Number(String(m.release_date).slice(0, 4)) : NaN,
      genres: Array.isArray(m.genre_ids) ? m.genre_ids : [],
      rating: typeof m.vote_average === 'number' ? m.vote_average : undefined,
      plot: m.overview || ''
    } as Movie;
  });
}

async function fetchFallback(): Promise<Movie[]> {
  const res = await fetch('/top100.fallback.json');
  if (!res.ok) throw new Error('Fallback JSON missing');
  const arr = await res.json();
  return (arr as any[]).slice(0, 100).map((m: any) => {
    const posterFull = m.poster_path ? `${IMG_BASE}${m.poster_path}` : FALLBACK_POSTER;
    const backdropFull = m.backdrop_path ? `${IMG_BASE}${m.backdrop_path}` : FALLBACK_BACKDROP;
    return {
      id: m.id,
      title: m.title || m.name || 'Untitled',
      image: posterFull,
      backdrop: backdropFull,
      year: m.release_date ? Number(String(m.release_date).slice(0, 4)) : NaN,
      genres: Array.isArray(m.genre_ids) ? m.genre_ids : [],
      rating: typeof m.vote_average === 'number' ? m.vote_average : undefined,
      plot: m.overview || ''
    } as Movie;
  });
}

export function useTop100(): Result {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState<'TMDB' | 'FALLBACK'>('TMDB');

  useEffect(() => {
    const now = Date.now();
    const cached = localStorage.getItem(CACHE_KEY);
    const cachedAt = Number(localStorage.getItem(CACHE_AT) || 0);

    if (cached && now - cachedAt < STALE_MS) {
      try {
        const parsed = JSON.parse(cached) as Movie[];
        setMovies(parsed);
        setSource('TMDB');
        setLoading(false);
        return;
      } catch {}
    }

    (async () => {
      try {
        const tmdb = await fetchTMDbTop100ViaProxy();
        setMovies(tmdb);
        setSource('TMDB');
        localStorage.setItem(CACHE_KEY, JSON.stringify(tmdb));
        localStorage.setItem(CACHE_AT, String(Date.now()));
      } catch {
        try {
          const fb = await fetchFallback();
          setMovies(fb);
          setSource('FALLBACK');
          localStorage.setItem(CACHE_KEY, JSON.stringify(fb));
          localStorage.setItem(CACHE_AT, String(Date.now()));
        } catch {
          setMovies([]);
        }
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return { movies, loading, source };
}
