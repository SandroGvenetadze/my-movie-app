// Purpose: Top 100 page listing with search/filter + skeletons + toast.
import { useMemo, useState, useEffect } from 'react';
import { useTop100 } from '@/hooks/useTop100';
import { useFavorites } from '@/hooks/useFavorites';
import MovieCard from '@/components/MovieCard';
import SearchBar from '@/components/SearchBar';
import SkeletonCard from '@/components/SkeletonCard';
import { useToast } from '@/components/Toast';

export default function Top100() {
  const { movies, loading, apiLimited, source } = useTop100();
  const { isFav, toggle } = useFavorites();
  const [list, setList] = useState(movies);
  const { notify } = useToast();

  useEffect(() => {
    if (apiLimited) notify('API limit exceeded — using cached sample');
  }, [apiLimited, notify]);

  useMemo(() => setList(movies), [movies]);

  return (
    <div className="p-4">
      {apiLimited && (
        <div className="mb-4 p-3 rounded-xl bg-red-600 text-white">
          API Limit Exceeded – Showing cached sample
        </div>
      )}

      <SearchBar source={movies} onChange={setList} />

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {list.map((m) => (
            <MovieCard key={m.id} movie={m} isFav={isFav(m.id)} onToggle={toggle} />
          ))}
        </div>
      )}

      <div className="mt-4 text-xs text-gray-500">source: {source}</div>
    </div>
  );
}
