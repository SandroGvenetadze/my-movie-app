// src/pages/Details.tsx
import { useParams, Link } from 'react-router-dom';
import { useTop100 } from '@/hooks/useTop100';
import NavBar from '@/components/NavBar';

export default function Details() {
  const { id } = useParams();
  const { movies } = useTop100();
  const movie = movies.find(m => m.id === String(id));

  if (!movie) {
    return (
      <div>
        <NavBar />
        <main className="container mx-auto px-4 lg:px-6 py-6">
          <div className="text-zinc-500">Movie not found. <Link className="text-indigo-500" to="/">Go back</Link></div>
        </main>
      </div>
    );
  }

  return (
    <div>
      <NavBar />
      <main className="container mx-auto px-4 lg:px-6 py-6">
        <div className="grid gap-6 md:grid-cols-[300px_1fr]">
          <div>
            <div className="w-full aspect-[2/3] bg-black/10 dark:bg-white/5 rounded-xl overflow-hidden">
              <img src={movie.image || '/placeholder.svg'} alt={movie.title} className="w-full h-full object-cover" />
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-semibold mb-2">{movie.title}</h1>
            <div className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400 mb-4">
              <span>{movie.year || '—'}</span>
              {movie.rating ? <span className="px-2 py-0.5 text-xs rounded-full bg-indigo-500/15 text-indigo-500 border border-indigo-500/30">★ {movie.rating.toFixed(1)}</span> : null}
              {movie.genres?.map((g) => <span key={g} className="px-2 py-0.5 text-xs rounded-full bg-black/5 dark:bg-white/10">{g}</span>)}
            </div>
            <p className="text-zinc-700 dark:text-zinc-300 leading-7">{movie.plot || 'No plot available in cached data.'}</p>
            <div className="mt-6">
              <Link to="/" className="inline-flex items-center h-10 px-4 rounded-xl bg-indigo-600 text-white">Back</Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
