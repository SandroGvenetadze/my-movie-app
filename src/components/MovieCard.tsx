import { TMDB_GENRES } from "@/constants/genres";

type Movie = {
  id: number;
  title: string;
  poster_path: string | null;
  release_date?: string;
  vote_average?: number;
  genre_ids?: number[];
  // ... დანარჩენი რომ გაქვს
};

function getYear(date?: string) {
  return date ? new Date(date).getFullYear() : "—";
}

export default function MovieCard({ movie }: { movie: Movie }) {
  const year = getYear(movie.release_date);
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : "—";
  const genreNames =
    (movie.genre_ids || [])
      .map((id) => TMDB_GENRES[id])
      .filter(Boolean)
      .slice(0, 3); // მხოლოდ 3 ჟანრი, რომ ლეიაუითი არ დაიშალოს

  return (
    <div className="group rounded-xl bg-zinc-900/60 ring-1 ring-zinc-800 overflow-hidden">
      {/* პოსტერები და ზედა ნაწილი უცვლელია */}
      {/* ... */}

      {/* ქვედა მეტა-ბარი */}
      <div className="px-4 pb-3">
        <div className="flex items-center gap-3 text-[11px] text-zinc-300/90">
          <span className="rounded-md bg-zinc-800/70 px-2 py-0.5 ring-1 ring-zinc-700/60">
            {year}
          </span>
          <span className="rounded-md bg-zinc-800/70 px-2 py-0.5 ring-1 ring-zinc-700/60">
            ⭐ {rating}
          </span>

          {/* ჟანრების ბეჯები */}
          <div className="flex flex-wrap gap-1">
            {genreNames.length
              ? genreNames.map((g) => (
                  <span
                    key={g}
                    className="rounded-md bg-zinc-800/70 px-2 py-0.5 ring-1 ring-zinc-700/60"
                  >
                    {g}
                  </span>
                ))
              : (
                <span className="rounded-md bg-zinc-800/70 px-2 py-0.5 ring-1 ring-zinc-700/60">
                  Genre
                </span>
              )}
          </div>
        </div>
      </div>
    </div>
  );
}
