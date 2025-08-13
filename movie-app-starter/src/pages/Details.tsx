import { useParams, Link } from "react-router-dom";
import { useTop100 } from "../hooks/useTop100";

export default function Details() {
  const { id } = useParams();
  const { movies } = useTop100();
  const movie = movies.find((m) => m.id === id);

  if (!movie) {
    return (
      <div className="p-4 text-gray-400">
        Movie not found. <Link className="text-indigo-400" to="/">Go back</Link>
      </div>
    );
  }

  return (
    <div className="p-4">
      <Link to="/" className="text-indigo-400">&larr; Back</Link>
      <div className="mt-3 grid md:grid-cols-3 gap-6">
        <img src={movie.image} alt={movie.title} className="rounded-2xl w-full object-cover" />
        <div className="md:col-span-2">
          <h1 className="text-2xl text-gray-100 font-semibold">{movie.title}</h1>
          <div className="text-gray-400">{movie.year}</div>
          <div className="flex flex-wrap gap-2 my-2">
            {movie.genres?.map((g) => (
              <span key={g} className="text-xs bg-gray-800 px-2 py-1 rounded-full">{g}</span>
            ))}
          </div>
          {movie.rating ? (
            <div className="text-gray-200">Rating: {movie.rating}</div>
          ) : null}
          <p className="mt-3 text-gray-300 leading-7">
            {movie.plot || "No plot available in cached data."}
          </p>
        </div>
      </div>
    </div>
  );
}
