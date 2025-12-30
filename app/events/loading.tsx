import { SkeletonGrid } from "@/components/ui/Skeleton";

export default function EventsLoading() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <div className="gradient-breathing relative overflow-hidden bg-gradient-to-br from-purple-900/40 via-slate-900/60 to-pink-900/40">
        <div className="sparkle-noise absolute inset-0" />
        <div className="relative mx-auto max-w-7xl px-6 py-20 sm:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <div className="h-12 w-64 mx-auto animate-pulse rounded-lg bg-white/10" />
            <div className="mt-6 h-6 w-96 mx-auto animate-pulse rounded bg-white/10" />
          </div>
        </div>
      </div>

      {/* Loading Content */}
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="animate-pulse space-y-8">
          <div className="h-8 w-48 rounded bg-white/10" />
          <SkeletonGrid count={6} />
        </div>
      </div>
    </main>
  );
}
