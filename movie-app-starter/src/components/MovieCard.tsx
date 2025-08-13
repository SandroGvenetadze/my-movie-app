import { Link } from "react-router-dom";
import type { Movie } from "../lib/data";

type Props = {
  movie: Movie;
  isFav: boolean;
  onToggle: (m: Movie) => void;
};

export default function MovieCard({ movie, isFav, onToggle }: Props) {
  return (
    <div className="bg-gray-900 rounded-2xl p-4 shadow">
      <img src={movie.image} alt={movie.title} className="w-full h-56 object-cover rounded-xl mb-3" />
      <h3 className="text-gray-100 font-semibold">{movie.title}</h3>
      <div className="text-sm text-gray-400">{movie.year}</div>
      <div className="flex flex-wrap gap-2 my-2">
        {movie.genres?.slice(0,3).map((g) => (
          <span key={g} className="text-xs bg-gray-800 px-2 py-1 rounded-full">{g}</span>
        ))}
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => onToggle(movie)}
          className={`flex-1 px-3 py-2 rounded-xl ${isFav ? "bg-amber-600" : "bg-gray-800"} text-white`}
        >
          {isFav ? "Favorited" : "Favorite"}
        </button>
        <Link
          to={`/details/${movie.id}`}
          className="px-3 py-2 rounded-xl bg-indigo-600 text-white"
        >
          Details
        </Link>
      </div>
    </div>
  );
}
