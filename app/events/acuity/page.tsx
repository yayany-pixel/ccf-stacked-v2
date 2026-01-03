import type { Metadata } from "next";
import { getAcuitySeries, type AcuitySeries } from "@/lib/acuity";
import AcuitySeriesCard from "@/components/AcuitySeriesCard";
import ButtonPill from "@/components/ui/ButtonPill";
import TagPill from "@/components/ui/TagPill";
import GlassCard from "@/components/ui/GlassCard";
import Reveal from "@/components/motion/Reveal";

// Force dynamic rendering - don't pre-render at build time
export const dynamic = 'force-dynamic';
export const revalidate = 60; // Revalidate every 60 seconds

export const metadata: Metadata = {
  title: "Acuity Schedule | Color Cocktail Factory",
  description: "Book creative workshops directly through our Acuity reservation system. Pottery, glass fusion, mosaics, and more.",
  keywords: [
    "acuity scheduling",
    "book pottery class",
    "pottery reservations",
    "creative workshop booking",
    "art class reservations"
  ],
  openGraph: {
    title: "Acuity Schedule | Color Cocktail Factory",
    description: "Book creative workshops directly through our reservation system.",
    type: "website",
    url: "https://colorcocktailfactory.com/events/acuity"
  },
  twitter: {
    card: "summary_large_image",
    title: "Acuity Schedule | CCF",
    description: "Book creative workshops directly."
  }
};

/**
 * Group series by category
 */
function groupByCategory(series: AcuitySeries[]): Map<string, AcuitySeries[]> {
  const grouped = new Map<string, AcuitySeries[]>();
  
  for (const seriesItem of series) {
    const category = seriesItem.category || "Other";
    if (!grouped.has(category)) {
      grouped.set(category, []);
    }
    grouped.get(category)!.push(seriesItem);
  }
  
  return grouped;
}



/**
 * Server component that displays upcoming Acuity PUBLIC availability
 * SECURITY: Never shows customer data or confirmation URLs
 */
export default async function AcuityEventsPage() {
  let series: AcuitySeries[] = [];
  let error: string | null = null;
  let notConfigured = false;

  try {
    series = await getAcuitySeries();
  } catch (e) {
    const errorMsg = e instanceof Error ? e.message : "Unable to load Acuity schedule";
    
    // Check if error is due to missing credentials
    if (errorMsg.includes("Missing required credentials")) {
      notConfigured = true;
    } else {
      error = errorMsg;
    }
    
    console.error("Error fetching Acuity series:", e);
  }

  const groupedSeries = groupByCategory(series);
  const categoryOrder = [
    "Pottery",
    "Mosaic",
    "Glass Fusion",
    "Candle",
    "Terrarium & Bonsai",
    "Painting",
    "Kids & Family",
    "Private",
    "Other"
  ];

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <div className="gradient-breathing relative overflow-hidden bg-gradient-to-br from-cyan-900/40 via-slate-900/60 to-purple-900/40">
        <div className="sparkle-noise absolute inset-0" />
        
        <div className="relative mx-auto max-w-7xl px-6 py-20 text-center">
          <Reveal variant="fade-up">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-500/10 px-4 py-1.5 text-xs font-semibold text-cyan-200">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-500"></span>
              </span>
              Acuity Scheduling
            </div>
          </Reveal>

          <Reveal variant="fade-up" delay={100}>
            <h1 className="mt-6 font-serif text-5xl leading-tight md:text-6xl lg:text-7xl">
              Book Directly
            </h1>
          </Reveal>

          <Reveal variant="fade-up" delay={200}>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/80">
              Reserve your spot in upcoming creative workshops through our Acuity reservation system.
              Choose from pottery, glass fusion, mosaics, and more.
            </p>
          </Reveal>

          <Reveal variant="fade-up" delay={300}>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <ButtonPill href="/events" variant="secondary">
                ← Back to Eventbrite Events
              </ButtonPill>
            </div>
          </Reveal>
        </div>
      </div>

      {/* Content Section */}
      <div className="relative bg-gradient-to-b from-slate-900 via-slate-900/95 to-slate-900 py-16">
        <div className="mx-auto max-w-7xl px-6">
          {/* Not Configured State */}
          {notConfigured && (
            <Reveal variant="fade-up">
              <GlassCard>
                <div className="p-12 text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-cyan-500/20">
                    <svg className="h-8 w-8 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h2 className="mb-2 text-2xl font-semibold">Acuity Not Connected</h2>
                  <p className="mb-6 text-white/70">
                    The Acuity integration requires API credentials to display available class times.
                  </p>
                  <div className="mx-auto max-w-lg rounded-lg bg-white/5 p-4 text-left">
                    <p className="mb-2 text-xs font-semibold text-white/50">Add to .env.local:</p>
                    <code className="block text-xs text-cyan-300">
                      ACUITY_USER_ID=your_user_id<br />
                      ACUITY_API_KEY=your_api_key
                    </code>
                    <p className="mt-3 text-xs text-white/60">
                      Get credentials from: <a href="https://acuityscheduling.com/app.php?key=api" target="_blank" rel="noopener noreferrer" className="text-cyan-400 underline">Acuity API Settings</a>
                    </p>
                  </div>
                </div>
              </GlassCard>
            </Reveal>
          )}

          {/* Error State */}
          {error && !notConfigured && (
            <Reveal variant="fade-up">
              <GlassCard>
                <div className="p-12 text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/20">
                    <svg className="h-8 w-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h2 className="mb-2 text-2xl font-semibold">Unable to Load Schedule</h2>
                  <p className="text-white/70">{error}</p>
                </div>
              </GlassCard>
            </Reveal>
          )}

          {/* Empty State (configured but no events) */}
          {!error && !notConfigured && series.length === 0 && (
            <Reveal variant="fade-up">
              <GlassCard>
                <div className="p-12 text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/10">
                    <svg className="h-8 w-8 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h2 className="mb-2 text-2xl font-semibold">No Upcoming Classes</h2>
                  <p className="text-white/70">Check back soon for new workshop availability!</p>
                </div>
              </GlassCard>
            </Reveal>
          )}

          {/* Series by Category */}
          {!error && !notConfigured && series.length > 0 && (
            <div className="space-y-12">
              {categoryOrder.map((category) => {
                const categorySeries = groupedSeries.get(category);
                if (!categorySeries || categorySeries.length === 0) return null;

                return (
                  <Reveal key={category} variant="fade-up">
                    <div>
                      <div className="mb-6 flex items-center gap-3">
                        <h2 className="font-serif text-3xl">{category}</h2>
                        <div className="h-px flex-1 bg-gradient-to-r from-white/20 to-transparent" />
                        <TagPill>{categorySeries.length} workshop{categorySeries.length !== 1 ? 's' : ''}</TagPill>
                      </div>

                      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {categorySeries.map((seriesItem, idx) => (
                          <Reveal key={seriesItem.id} variant="scale" delay={idx * 50}>
                            <AcuitySeriesCard series={seriesItem} />
                          </Reveal>
                        ))}
                      </div>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
