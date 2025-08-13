// src/pages/Favorites.tsx
import NavBar from '@/components/NavBar';
import MovieCard from '@/components/MovieCard';
import SkeletonCard from '@/components/SkeletonCard';
import { useFavorites } from '@/hooks/useFavorites';
import { useTop100 } from '@/hooks/useTop100';

export default function Favorites() {
  const { movies, loading } = useTop100();
  const { ids, toggle, isFav } = useFavorites();
  const favs = movies.filter(m => ids.includes(m.id));

  return (
    <div>
      <NavBar />
      <main className="container mx-auto px-4 lg:px-6 py-6">
        <h1 className="text-xl font-semibold mb-4">Favorites ({favs.length})</h1>

        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : favs.length ? (
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {favs.map((m) => (
              <MovieCard key={m.id} movie={m} isFav={isFav(m.id)} onToggle={toggle} />
            ))}
          </div>
        ) : (
          <div className="text-zinc-500">No favorites yet.</div>
        )}
      </main>
    </div>
  );
}
