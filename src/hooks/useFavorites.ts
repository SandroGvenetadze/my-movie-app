// src/hooks/useFavorites.ts
// Robust favorites hook storing movie IDs in localStorage.

import { useCallback, useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "favorites:v1";

function readFromStorage(): number[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed
        .map((x) => Number(x))
        .filter((x) => Number.isFinite(x));
    }
    return [];
  } catch {
    return [];
  }
}

function writeToStorage(ids: number[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch {
    // ignore quota errors
  }
}

export function useFavorites() {
  const [ids, setIds] = useState<number[]>(() => readFromStorage());

  // Persist on change
  useEffect(() => {
    writeToStorage(ids);
  }, [ids]);

  const set = useMemo(() => new Set(ids), [ids]);

  const isFav = useCallback((id: number) => set.has(id), [set]);

  const toggle = useCallback((id: number) => {
    setIds((prev) => {
      const s = new Set(prev);
      if (s.has(id)) {
        s.delete(id);
      } else {
        s.add(id);
      }
      return Array.from(s);
    });
  }, []);

  const clearAll = useCallback(() => setIds([]), []);

  return { ids, isFav, toggle, clearAll };
}
