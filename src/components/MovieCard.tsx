// src/components/MovieCard.tsx
import { Link } from "react-router-dom";
import { TMDB_GENRES } from "@/constants/genres";

type GenreItem = { id?: number; name: string };

type Movie = {
  id: number;
  title?: string;
  name?: string;
  year?: number;
  release_date?: string;
  vote_average?: number;
  rating?: number;
  vote?: number;
  poster_path?: string | null;
  posterUrl?: string | null;
  image?: string | null;
  genre_ids?: number[];
  genres?: GenreItem[];
};

type Props = {
  movie: Movie;
  isFav: boolean;
  onToggle: (id: number) => void;
};

function getYear(movie: Movie): string {
  // Prefer explicit "year"; else derive from "release_date"
  if (movie.year) return String(movie.year);
  if (movie.release_date) return String(new Date(movie.release_date).getFullYear());
  return "—";
}

function getRating(movie: Movie): string {
  // Use whichever field is present and format to one decimal
  const raw = movie.vote_average ?? movie.rating ?? movie.vote;
  if (raw === undefined || raw === null) return "—";
  const n = Number(raw);
  return Number.isFinite(n) ? n.toFixed(1) : "—";
}

function getPoster(movie: Movie): string {
  // Try TMDB path first; then custom fields; finally local placeholder
  if (movie.poster_path) return `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
  if (movie.posterUrl) return String(movie.posterUrl);
  if (movie.image) return String(movie.image);
  return "/placeholder.svg";
}

export default function MovieCard({ movie, isFav, onToggle }: Props) {
  const title = movie.title || movie.name || "Untitled";
  const year = getYear(movie);
  const rating = getRating(movie);

  // Build genre names from either genre_ids or genres array
  let genreNames: string[] = [];

  if (Array.isArray(movie.genre_ids) && movie.genre_ids.length > 0) {
    genreNames = movie.genre_ids
      .map((id) => TMDB_GENRES[id])
      .filter(Boolean) as string[];
  } else if (Array.isArray(movie.genres) && movie.genres.length > 0) {
    genreNames = movie.genres
      .map((g) => (typeof g === "string" ? g : g.name))
      .filter(Boolean) as string[];
  }

  // Keep max 3 to avoid layout overflow
  genreNames = genreNames.slice(0, 3);

  return (
    <div className="group overflow-hidden rounded-xl bg-zinc-900/60 ring-1 ring-zinc-800 transition hover:ring-zinc-700">
      {/* Poster */}
      <div className="aspect-[2/3] overflow-hidden">
        <img
          src={getPoster(movie)}
          alt={title}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
          onError={(e) => {
            // If image fails, fallback to local placeholder
            (e.currentTarget as HTMLImageElement).src = "/placeholder.svg";
          }}
          loading="lazy"
        />
      </div>

      {/* Title */}
      <div className="px-4 pt-3 text-sm font-medium text-zinc-200 line-clamp-2">
        {title}
      </div>

      {/* Meta badges */}
      <div className="px-4 pt-2 pb-3">
        <div className="flex flex-wrap items-center gap-2 text-[11px] text-zinc-300/90">
          <span className="rounded-md bg-zinc-800/70 px-2 py-0.5 ring-1 ring-zinc-700/60">
            {year}
          </span>
          <span className="rounded-md bg-zinc-800/70 px-2 py-0.5 ring-1 ring-zinc-700/60">
            ⭐ {rating}
          </span>

          {/* Render genres only if we actually have them */}
          {genreNames.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {genreNames.map((g) => (
                <span
                  key={g}
                  className="rounded-md bg-zinc-800/70 px-2 py-0.5 ring-1 ring-zinc-700/60"
                >
                  {g}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="mt-3 flex items-center gap-2">
          <button
            onClick={() => onToggle(movie.id)}
            className="w-full rounded-lg bg-zinc-800/70 py-1.5 text-xs font-medium text-zinc-200 ring-1 ring-zinc-700/60 hover:bg-zinc-800"
          >
            {isFav ? "Unfavorite" : "Favorite"}
          </button>
          <Link
            to={`/details/${movie.id}`}
            className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-indigo-500"
          >
            Details
          </Link>
        </div>
      </div>
    </div>
  );
}
