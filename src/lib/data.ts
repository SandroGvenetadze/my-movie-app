// src/lib/data.ts
export type Movie = {
  id: string;
  title: string;
  image: string;
  year: number;
  genres: string[];
  rating?: number;
  plot?: string;
};

const LS_KEY = "top100.cache.v1";
const LS_TIME_KEY = "top100.cacheTime.v1";
// რამდენ ხანში გავთვალოთ ქეში მოძველებულად (დღეები)
const STALE_DAYS = 2;

const API_BASE = import.meta.env.VITE_RAPIDAPI_BASEURL;
const API_KEY = import.meta.env.VITE_API_KEY;
const API_HOST = import.meta.env.VITE_RAPIDAPI_HOST;

function isFresh(ts: number) {
  const ageMs = Date.now() - ts;
  return ageMs < STALE_DAYS * 24 * 60 * 60 * 1000;
}

export async function fetchTop100(): Promise<{
  data: Movie[];
  source: "api" | "cache" | "fallback";
  apiLimit?: boolean;
}> {
  // 1) სცადე cache
  const cached = localStorage.getItem(LS_KEY);
  const cachedAt = Number(localStorage.getItem(LS_TIME_KEY) || 0);
  if (cached && isFresh(cachedAt)) {
    return { data: JSON.parse(cached), source: "cache" };
  }

  // 2) სცადე API
  try {
    const res = await fetch(`${API_BASE}/titles`, {
      headers: {
        "x-rapidapi-key": API_KEY,
        "x-rapidapi-host": API_HOST,
      },
    });

    // 429 ან სხვა error-> fallback
    if (!res.ok) throw new Error(String(res.status));

    const json = await res.json();
    // შეცვალე აქ mapping შენი API-ს რეალურ სტრუქტურაზე
    const normalized: Movie[] = (json?.results || json || []).map((m: any) => ({
      id: String(m.id ?? m.imdbid ?? crypto.randomUUID()),
      title: m.title ?? m.name,
      image: m.image ?? m.thumbnail,
      year: Number(m.year ?? m.releaseYear ?? 0),
      genres: (m.genres ?? m.genreList ?? []).map((g: any) => String(g)),
      rating: Number(m.rating ?? m.imdbRating ?? m.imDbRating ?? 0) || undefined,
      plot: m.plot ?? m.description ?? undefined,
    }));

    if (normalized.length) {
      localStorage.setItem(LS_KEY, JSON.stringify(normalized));
      localStorage.setItem(LS_TIME_KEY, String(Date.now()));
    }

    return { data: normalized, source: "api" };
  } catch (e: any) {
    // 3) fallback ფაილი
    const fb = await fetch("/top100.fallback.json").then((r) => r.json());
    const normalized: Movie[] = (fb?.results ?? fb ?? []).map((m: any) => ({
      id: String(m.id ?? m.imdbid ?? crypto.randomUUID()),
      title: m.title ?? m.name,
      image: m.image ?? m.thumbnail,
      year: Number(m.year ?? m.releaseYear ?? 0),
      genres: (m.genres ?? m.genreList ?? []).map((g: any) => String(g)),
      rating: Number(m.rating ?? m.imdbRating ?? m.imDbRating ?? 0) || undefined,
      plot: m.plot ?? m.description ?? undefined,
    }));
    // fallback-იც დავაკეშოთ, თუნდაც ცოტა ხნით
    localStorage.setItem(LS_KEY, JSON.stringify(normalized));
    localStorage.setItem(LS_TIME_KEY, String(Date.now()));
    return { data: normalized, source: "fallback", apiLimit: true };
  }
}
