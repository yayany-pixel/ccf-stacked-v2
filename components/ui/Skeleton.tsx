export default function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
      <div className="flex items-center justify-between">
        <div className="h-4 w-24 rounded-full bg-white/10" />
        <div className="h-4 w-16 rounded-full bg-white/10" />
      </div>
      
      <div className="mt-4 space-y-3">
        <div className="h-6 w-3/4 rounded bg-white/10" />
        <div className="h-6 w-1/2 rounded bg-white/10" />
      </div>
      
      <div className="mt-4 space-y-2">
        <div className="h-4 w-full rounded bg-white/10" />
        <div className="h-4 w-full rounded bg-white/10" />
        <div className="h-4 w-2/3 rounded bg-white/10" />
      </div>
      
      <div className="mt-6 flex gap-2">
        <div className="h-10 w-32 rounded-xl bg-white/10" />
        <div className="h-10 w-28 rounded-xl bg-white/10" />
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 3 }: { count?: number }) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

export function SkeletonText({ lines = 3 }: { lines?: number }) {
  return (
    <div className="animate-pulse space-y-3">
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="h-4 rounded bg-white/10"
          style={{ width: i === lines - 1 ? "66%" : "100%" }}
        />
      ))}
    </div>
  );
}

export function SkeletonButton() {
  return <div className="h-10 w-32 animate-pulse rounded-xl bg-white/10" />;
}
