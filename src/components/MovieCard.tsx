// src/components/MovieCard.tsx
// Movie card with cinematic poster glow, light-weight hover, and robust image fallback.

import { Link } from 'react-router-dom';

export type Movie = {
  id: string;
  title: string;
  image: string; // poster url or '/placeholder.svg'
  year: number;
  genres: string[];
  rating?: number;
  plot?: string;
};

type Props = { movie: Movie; isFav: boolean; onToggle: (movie: Movie) => void };

export default function MovieCard({ movie, isFav, onToggle }: Props) {
  return (
    <article className="group card p-3 sm:p-4 hover:-translate-y-0.5 transition">
      <div className="poster w-full aspect-[2/3] rounded-xl mb-3 bg-black/10 dark:bg-white/5">
        <img
          src={movie.image || '/placeholder.svg'}
          alt={movie.title}
          loading="lazy"
          decoding="async"
          fetchpriority="low"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/placeholder.svg'; }}
          className="w-full h-full object-cover block transition-transform duration-500 ease-smooth group-hover:scale-[1.02]"
        />
      </div>

      <h3 className="font-semibold leading-tight mb-1 line-clamp-2">{movie.title}</h3>

      <div className="flex items-center flex-wrap gap-2 text-sm mb-3">
        <span className="px-2 py-0.5 rounded-full border border-black/5 dark:border-white/10 text-zinc-600 dark:text-zinc-300">
          {movie.year || '—'}
        </span>

        {typeof movie.rating === 'number' && (
          <span
            className="px-2 py-0.5 text-xs rounded-full border
                       bg-indigo-500/15 text-indigo-500 border-indigo-500/30"
            title="TMDb average"
          >
            ★ {movie.rating.toFixed(1)}
          </span>
        )}

        {movie.genres?.slice(0, 2).map((g) => (
          <span
            key={g}
            className="px-2 py-0.5 text-xs rounded-full bg-black/5 dark:bg-white/10 text-zinc-600 dark:text-zinc-300"
          >
            {g}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-[1fr_auto] gap-2">
        <button
          onClick={() => onToggle(movie)}
          className={`h-10 rounded-xl border transition ${
            isFav
              ? 'bg-amber-500/15 text-amber-600 border-amber-500/40'
              : 'bg-black/5 dark:bg-white/10 text-inherit border-black/5 dark:border-white/10 hover:bg-black/10 dark:hover:bg-white/20'
          }`}
        >
          {isFav ? 'Favorited' : 'Favorite'}
        </button>

        <Link
          to={`/details/${movie.id}`}
          className="h-10 px-3 rounded-xl bg-indigo-600 text-white inline-flex items-center justify-center hover:brightness-110 active:brightness-95 transition"
        >
          Details
        </Link>
      </div>
    </article>
  );
}
