// Purpose: Favorites page powered by localStorage and cached list + skeletons.
import { useTop100 } from '@/hooks/useTop100';
import { useFavorites } from '@/hooks/useFavorites';
import MovieCard from '@/components/MovieCard';
import SkeletonCard from '@/components/SkeletonCard';

export default function Favorites() {
  const { movies, loading } = useTop100();
  const { ids, toggle, isFav } = useFavorites();

  const favs = movies.filter((m) => ids.includes(m.id));

  return (
    <div className="p-4">
      <h2 className="text-xl text-gray-100 mb-3">Favorites ({favs.length})</h2>
      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : favs.length ? (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {favs.map((m) => (
            <MovieCard key={m.id} movie={m} isFav={isFav(m.id)} onToggle={toggle} />
          ))}
        </div>
      ) : (
        <div className="text-gray-400">No favorites yet.</div>
      )}
    </div>
  );
}
