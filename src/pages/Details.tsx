// src/pages/Details.tsx
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTop100 } from '@/hooks/useTop100';
import NavBar from '@/components/NavBar';

type TmdbGenre = { id: number; name: string };
type TmdbDetails = {
  id: number;
  title?: string;
  name?: string;
  overview?: string;
  backdrop_path?: string;
  poster_path?: string;
  release_date?: string;
  runtime?: number;
  genres?: TmdbGenre[];
  vote_average?: number;
};
type TmdbCredits = {
  cast?: Array<{ id: number; name: string; character?: string; profile_path?: string }>;
};

const IMG = (path?: string | null, fallback = '/placeholder.svg') =>
  path ? `https://image.tmdb.org/t/p/w500${path}` : fallback;

export default function Details() {
  const { id } = useParams();
  const movieId = Number(id); // useTop100 -> id is number
  const { movies } = useTop100();

  const movie = movies.find((m) => m.id === movieId);

  const [details, setDetails] = useState<TmdbDetails | null>(null);
  const [credits, setCredits] = useState<TmdbCredits | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch TMDb details/credits via our proxy
  useEffect(() => {
    if (!movieId) return;

    let cancelled = false;
    (async () => {
      try {
        const [dRes, cRes] = await Promise.all([
          fetch(`/api/tmdb?path=/movie/${movieId}&language=en-US`),
          fetch(`/api/tmdb?path=/movie/${movieId}/credits&language=en-US`),
        ]);

        if (!cancelled) {
          if (dRes.ok) setDetails(await dRes.json());
          if (cRes.ok) setCredits(await cRes.json());
        }
      } catch {
        // ignore and rely on cached list data
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [movieId]);

  // If the list hasn't loaded yet or wrong id
  if (!movie) {
    return (
      <div>
        <NavBar />
        <main className="container mx-auto px-4 lg:px-6 py-6">
          <div className="text-zinc-500">
            Movie not found.{' '}
            <Link className="text-indigo-500 underline-offset-2 hover:underline" to="/">
              Go back
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const title = details?.title || details?.name || movie.title;
  const year =
    (details?.release_date ? Number(String(details.release_date).slice(0, 4)) : undefined) ??
    movie.year;
  const rating = typeof details?.vote_average === 'number' ? details?.vote_average : movie.rating;
  const poster = movie.image || IMG(details?.poster_path);
  const backdrop = movie.backdrop || IMG(details?.backdrop_path, '/backdrop-placeholder.jpg');
  const overview = details?.overview || movie.plot || 'No plot available.';

  return (
    <div>
      <NavBar />

      {/* Backdrop header */}
      <div className="relative w-full aspect-[16/6] overflow-hidden">
        <img
          src={backdrop}
          alt={`${title} backdrop`}
          className="w-full h-full object-cover"
          onError={(e) => ((e.currentTarget as HTMLImageElement).src = '/backdrop-placeholder.jpg')}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
      </div>

      <main className="container mx-auto px-4 lg:px-6 -mt-10 pb-10">
        <div className="grid gap-6 md:grid-cols-[300px_1fr]">
          {/* Poster */}
          <div>
            <div className="w-full aspect-[2/3] bg-black/10 dark:bg-white/5 rounded-xl overflow-hidden border border-black/10 dark:border-white/10">
              <img
                src={poster}
                alt={title}
                className="w-full h-full object-cover"
                onError={(e) => ((e.currentTarget as HTMLImageElement).src = '/placeholder.svg')}
              />
            </div>
          </div>

          {/* Text */}
          <div>
            <h1 className="text-2xl font-semibold mb-2">{title}</h1>

            <div className="flex flex-wrap items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400 mb-4">
              <span>{year || '—'}</span>
              {typeof rating === 'number' ? (
                <span className="px-2 py-0.5 text-xs rounded-full bg-indigo-500/15 text-indigo-500 border border-indigo-500/30">
                  ★ {rating.toFixed(1)}
                </span>
              ) : null}
              {/* Genres: prefer names from details; else ids from list */}
              {details?.genres?.map((g) => (
                <span key={g.id} className="px-2 py-0.5 text-xs rounded-full bg-black/5 dark:bg-white/10">
                  {g.name}
                </span>
              ))}
              {!details?.genres?.length &&
                movie.genres?.map((g) => (
                  <span key={g} className="px-2 py-0.5 text-xs rounded-full bg-black/5 dark:bg-white/10">
                    {g}
                  </span>
                ))}
            </div>

            <p className="text-zinc-700 dark:text-zinc-300 leading-7">{overview}</p>

            {/* Extra info */}
            <div className="mt-4 text-sm text-zinc-600 dark:text-zinc-400 space-x-3">
              {details?.runtime ? <span>⏱️ {details.runtime} min</span> : null}
              {details?.release_date ? <span>• Released: {details.release_date}</span> : null}
            </div>

            <div className="mt-6">
              <Link to="/" className="inline-flex items-center h-10 px-4 rounded-xl bg-indigo-600 text-white hover:bg-indigo-500">
                Back
              </Link>
            </div>
          </div>
        </div>

        {/* Cast */}
        <section className="mt-10">
          <h2 className="text-lg font-semibold mb-3">Top Cast</h2>
          {loading && <div className="text-sm text-zinc-500">Loading…</div>}
          {!loading && (
            <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {credits?.cast?.slice(0, 12).map((c) => (
                <div key={c.id} className="rounded-xl overflow-hidden border border-black/10 dark:border-white/10 bg-white dark:bg-neutral-900">
                  <div className="aspect-[2/3] w-full overflow-hidden">
                    <img
                      src={IMG(c.profile_path, '/placeholder.svg')}
                      alt={c.name}
                      className="w-full h-full object-cover"
                      onError={(e) => ((e.currentTarget as HTMLImageElement).src = '/placeholder.svg')}
                    />
                  </div>
                  <div className="p-2">
                    <div className="text-sm font-medium truncate">{c.name}</div>
                    {c.character ? (
                      <div className="text-xs text-zinc-500 truncate">as {c.character}</div>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
