// src/components/SkeletonCard.tsx
// Lightweight skeleton with gradient shimmer (CSS-only).

export default function SkeletonCard() {
  return (
    <div className="card p-3 sm:p-4">
      <div className="w-full aspect-[2/3] rounded-xl mb-3 shimmer" />
      <div className="h-4 rounded w-3/4 mb-2 shimmer" />
      <div className="h-3 rounded w-1/3 mb-3 shimmer" />
      <div className="flex gap-2 mb-3">
        <div className="h-5 rounded-full w-16 shimmer" />
        <div className="h-5 rounded-full w-14 shimmer" />
        <div className="h-5 rounded-full w-12 shimmer" />
      </div>
      <div className="grid grid-cols-[1fr_auto] gap-2">
        <div className="h-10 rounded-xl shimmer" />
        <div className="w-24 h-10 rounded-xl shimmer" />
      </div>
    </div>
  );
}
