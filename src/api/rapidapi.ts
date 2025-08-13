// src/api/rapidapi.ts
// All TMDb calls go through our serverless proxy (/api/tmdb) so no keys leak.

const IMG_BASE = 'https://image.tmdb.org/t/p/w500';
const FALLBACK_POSTER = '/placeholder.svg';
const FALLBACK_BACKDROP = '/backdrop-placeholder.jpg';

export type Genre = { id: number; name: string };

export type MovieLite = {
  id: number;
  title: string;
  image: string;
  backdrop: string;
  year: number;
  genres: number[];
  rating?: number;
  plot?: string;
};

// --- Genres ---
export async function getGenres(language = 'en-US'): Promise<Genre[]> {
  const res = await fetch(`/api/tmdb?path=/genre/movie/list&language=${encodeURIComponent(language)}`);
  if (!res.ok) return [];
  const json = await res.json();
  return Array.isArray(json?.genres) ? (json.genres as Genre[]) : [];
}

// --- Search (maps to our MovieLite used ყველგან) ---
export async function searchMovies(query: string, page = 1, language = 'en-US'): Promise<MovieLite[]> {
  if (!query?.trim()) return [];

  const url = `/api/tmdb?path=/search/movie&language=${encodeURIComponent(language)}&page=${page}&query=${encodeURIComponent(
    query.trim()
  )}`;

  const res = await fetch(url);
  if (!res.ok) return [];

  const data = await res.json();
  const arr = Array.isArray(data?.results) ? data.results : [];

  return arr.map((m: any) => {
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
    } as MovieLite;
  });
}
