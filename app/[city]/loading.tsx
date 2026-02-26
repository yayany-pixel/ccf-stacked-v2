export default function CityLoading() {
  return (
    <main className="min-h-screen">
      {/* Hero skeleton */}
      <section className="relative flex min-h-[90vh] items-center overflow-hidden bg-gradient-to-br from-indigo-900/40 via-purple-900/50 to-pink-900/40 pt-24">
        <div className="relative z-20 mx-auto w-full max-w-7xl px-6 py-20">
          <div className="mx-auto max-w-4xl text-center space-y-6">
            <div className="h-16 w-80 mx-auto animate-pulse rounded-lg bg-white/10" />
            <div className="h-16 w-56 mx-auto animate-pulse rounded-lg bg-white/10" />
            <div className="space-y-3 mt-6">
              <div className="h-5 w-2/3 mx-auto animate-pulse rounded bg-white/10" />
              <div className="h-5 w-1/2 mx-auto animate-pulse rounded bg-white/10" />
            </div>
            <div className="flex justify-center gap-4 mt-8">
              <div className="h-12 w-36 animate-pulse rounded-xl bg-purple-500/20" />
              <div className="h-12 w-36 animate-pulse rounded-xl bg-white/10" />
            </div>
          </div>
        </div>
      </section>

      {/* Section skeletons */}
      <div className="space-y-1">
        {[1, 2, 3].map((i) => (
          <div key={i} className="relative h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
            <div className="absolute inset-0 animate-pulse bg-white/5" />
          </div>
        ))}
      </div>
    </main>
  );
}
