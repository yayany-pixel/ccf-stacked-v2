import type { Metadata } from "next";
import Link from "next/link";
import GlassCard from "@/components/ui/GlassCard";
import TagPill from "@/components/ui/TagPill";
import Reveal from "@/components/motion/Reveal";
import { COLLECTIONS } from "@/lib/collections";
import { STUDIO_LOCATIONS } from "@/lib/locations";

export const metadata: Metadata = {
  title: { absolute: "Workshop Collections | Color Cocktail Factory" },
  description: "Browse pottery, online art, date night, glass, bonsai and candle-making collections. Find creative workshops in Chicago and Eugene.",
  alternates: {
    canonical: "https://colorcocktailfactory.com/collections"
  },
  openGraph: {
    title: "Class Collections | Color Cocktail Factory",
    description: "Browse curated workshop collections: Beginners, Online, Date Night, Pottery, Glass & Mosaics, and Nature & Aroma.",
    url: "https://colorcocktailfactory.com/collections",
    type: "website",
    images: ["/og-image.jpg"]
  }
};

export default function CollectionsIndexPage() {
  return (
    <main id="main-content" tabIndex={-1} className="min-h-screen">
      {/* Hero Section */}
      <div className="gradient-breathing relative overflow-hidden bg-gradient-to-br from-purple-900/40 via-slate-900/60 to-pink-900/40">
        <div className="sparkle-noise absolute inset-0 opacity-20" />
        <div className="relative mx-auto max-w-7xl px-6 py-24 sm:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1 text-xs font-semibold tracking-wider text-white/80">
              EXPLORE BY THEME
            </div>
            <h1 className="font-serif text-4xl font-bold tracking-tight sm:text-6xl">
              Curated Class Collections
            </h1>
            <p className="mt-6 text-lg leading-8 text-white/80">
              Whether you are looking for your very first beginner wheel spin, an intimate date night, 
              or live interactive virtual workshops, explore our handpicked collections below.
            </p>
            
            {/* Quick studio location badges */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-sm text-white/70">
              <span className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1">
                📍 <strong>Chicago Studio:</strong> {STUDIO_LOCATIONS.chicago.streetAddress}, Pilsen
              </span>
              <span className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1">
                📍 <strong>Eugene Studio:</strong> {STUDIO_LOCATIONS.eugene.streetAddress}, OR
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Collections Grid */}
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {COLLECTIONS.map((collection, idx) => (
            <Reveal key={collection.slug} variant="fade-up" delay={idx * 60}>
              <Link 
                href={`/collections/${collection.slug}`}
                className="group block h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
              >
                <GlassCard interactive className="flex h-full flex-col justify-between p-7 transition group-hover:border-white/30">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-4xl" role="img" aria-label={collection.title}>
                        {collection.icon}
                      </span>
                      <TagPill>{collection.badge}</TagPill>
                    </div>

                    <h2 className="mt-5 font-serif text-2xl font-bold text-white group-hover:text-amber-200">
                      {collection.title}
                    </h2>
                    
                    <p className="mt-2 text-sm text-white/70">
                      {collection.subtitle}
                    </p>

                    <p className="mt-4 text-xs leading-relaxed text-white/60 line-clamp-3">
                      {collection.description}
                    </p>
                  </div>

                  <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4 text-sm font-semibold text-amber-300 group-hover:translate-x-1 transition-transform">
                    <span>Explore Collection & Dates</span>
                    <span>→</span>
                  </div>
                </GlassCard>
              </Link>
            </Reveal>
          ))}
        </div>

        {/* Fee-Free Direct Booking Notice */}
        <div className="mt-16 rounded-2xl border border-amber-500/20 bg-amber-500/5 p-8 text-center sm:p-10">
          <h3 className="font-serif text-2xl font-bold text-amber-200">
            💡 Book Direct & Save On Third-Party Fees
          </h3>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-white/80">
            Tickets purchased through third-party platforms often incur external service fees. 
            When you register directly through our official Color Cocktail Factory scheduler at{" "}
            <a 
              href="https://colorcocktailfactory.as.me/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="font-semibold text-amber-300 underline underline-offset-4 hover:text-amber-100"
            >
              colorcocktailfactory.as.me
            </a>
            , you get the lowest guaranteed rates and immediate confirmation directly from our studio.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/events"
              className="rounded-full bg-amber-500 px-6 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-amber-400"
            >
              View Full Live Calendar
            </Link>
            <Link
              href="/private-events"
              className="rounded-full border border-white/20 bg-white/5 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Plan Private Party
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
