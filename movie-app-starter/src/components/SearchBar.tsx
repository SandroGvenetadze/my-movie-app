import { useMemo, useState } from "react";
import type { Movie } from "../lib/data";

type Props = {
  source: Movie[];
  onChange: (list: Movie[]) => void;
};

export default function SearchBar({ source, onChange }: Props) {
  const [q, setQ] = useState("");
  const [genre, setGenre] = useState("All");

  const genres = useMemo(() => {
    const g = new Set<string>();
    source.forEach((m) => m.genres?.forEach((x) => g.add(x)));
    return ["All", ...Array.from(g).sort()];
  }, [source]);

  function apply() {
    const ql = q.trim().toLowerCase();
    const filtered = source.filter((m) => {
      const byQ =
        !ql ||
        m.title.toLowerCase().includes(ql) ||
        String(m.year).includes(ql);
      const byG = genre === "All" || m.genres?.includes(genre);
      return byQ && byG;
    });
    onChange(filtered);
  }

  return (
    <div className="flex flex-wrap gap-3 items-center mb-4">
      <input
        className="px-3 py-2 rounded-xl bg-gray-800 text-gray-100 outline-none"
        placeholder="Search by title or year…"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && apply()}
      />
      <select
        className="px-3 py-2 rounded-xl bg-gray-800 text-gray-100"
        value={genre}
        onChange={(e) => setGenre(e.target.value)}
      >
        {genres.map((g) => (
          <option key={g} value={g}>{g}</option>
        ))}
      </select>
      <button
        className="px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white"
        onClick={apply}
      >
        Filter
      </button>
    </div>
  );
}
