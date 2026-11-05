export default function EventSlugLoading() {
  return (
    <main id="main-content" tabIndex={-1} className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Back link skeleton */}
        <div className="mb-6 h-5 w-32 animate-pulse rounded bg-surface-secondary" />

        {/* Main card skeleton */}
        <div className="overflow-hidden rounded-2xl border border-border bg-surface-secondary">
          {/* Image skeleton */}
          <div className="h-64 w-full animate-pulse bg-surface-secondary sm:h-96" />

          <div className="p-8 space-y-6">
            {/* Badges */}
            <div className="flex gap-3">
              <div className="h-7 w-24 animate-pulse rounded-full bg-btn/20" />
              <div className="h-7 w-20 animate-pulse rounded-full bg-cyan-500/20" />
            </div>

            {/* Title */}
            <div className="space-y-3">
              <div className="h-10 w-3/4 animate-pulse rounded bg-surface-secondary" />
              <div className="h-10 w-1/2 animate-pulse rounded bg-surface-secondary" />
            </div>

            {/* Details */}
            <div className="space-y-4 border-t border-border pt-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-3">
                  <div className="h-8 w-8 animate-pulse rounded bg-surface-secondary" />
                  <div className="space-y-2 flex-1">
                    <div className="h-4 w-20 animate-pulse rounded bg-surface-secondary" />
                    <div className="h-4 w-48 animate-pulse rounded bg-surface-secondary" />
                  </div>
                </div>
              ))}
            </div>

            {/* CTA button */}
            <div className="h-12 w-48 animate-pulse rounded-xl bg-btn/20" />
          </div>
        </div>
      </div>
    </main>
  );
}
