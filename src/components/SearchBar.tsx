// src/components/SearchBar.tsx
// Simple search + (optional) year filter
type Props = {
  query: string;
  setQuery: (v: string) => void;
  year?: string;
  setYear?: (v: string) => void;
};

export default function SearchBar({ query, setQuery, year, setYear }: Props) {
  return (
    <div className="flex flex-col sm:flex-row gap-2">
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search by title or year…"
        className="h-10 rounded-xl px-3 border border-black/5 dark:border-white/10
                   bg-white/80 dark:bg-white/5 backdrop-blur"
      />
      {setYear && (
        <input
          value={year ?? ''}
          onChange={(e) => setYear?.(e.target.value)}
          placeholder="Year"
          className="h-10 rounded-xl px-3 border border-black/5 dark:border-white/10
                     bg-white/80 dark:bg-white/5 backdrop-blur w-28"
        />
      )}
    </div>
  );
}
