import { useEffect, useState } from "react";
import type { Movie } from "../lib/data";

const FAV_KEY = "movie.favorites.v1";

export function useFavorites() {
  const [ids, setIds] = useState<string[]>([]);

  useEffect(() => {
    const raw = localStorage.getItem(FAV_KEY);
    setIds(raw ? JSON.parse(raw) : []);
  }, []);

  function toggle(movie: Movie) {
    setIds((prev) => {
      const next = prev.includes(movie.id)
        ? prev.filter((i) => i !== movie.id)
        : [...prev, movie.id];
      localStorage.setItem(FAV_KEY, JSON.stringify(next));
      return next;
    });
  }

  function isFav(id: string) {
    return ids.includes(id);
  }

  return { ids, toggle, isFav };
}
