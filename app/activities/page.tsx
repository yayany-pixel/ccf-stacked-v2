import type { Metadata } from "next";
import Link from "next/link";
import GlassCard from "@/components/ui/GlassCard";
import TagPill from "@/components/ui/TagPill";
import Reveal from "@/components/motion/Reveal";
import { getActivitiesByCategory, ACTIVITY_CATEGORIES, type CategoryKey } from "@/lib/activities";

export const metadata: Metadata = {
  title: "All Classes & Workshops | Color Cocktail Factory",
  description: "Explore pottery, glass fusion, mosaics, Turkish lamps, bonsai, terrariums, candle making, painting, and more creative workshops in Chicago & Eugene.",
  keywords: [
    "pottery classes",
    "glass fusion workshops",
    "mosaic art",
    "Turkish lamp making",
    "bonsai workshops",
    "terrarium classes",
    "candle making",
    "painting classes",
    "date night pottery",
    "creative workshops Chicago",
    "art classes Eugene"
  ],
  alternates: {
    canonical: "https://colorcocktailfactory.com/activities"
  },
  openGraph: {
    title: "All Classes & Workshops | Color Cocktail Factory",
    description: "Explore pottery, glass fusion, mosaics, Turkish lamps, bonsai, terrariums, candle making, painting, and more creative workshops.",
    url: "https://colorcocktailfactory.com/activities",
    type: "website",
    images: [
      {
        url: "https://colorcocktailfactory.com/og-activities.jpg",
        width: 1200,
        height: 630,
        alt: "Color Cocktail Factory Classes"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "All Classes & Workshops | Color Cocktail Factory",
    description: "Explore pottery, glass fusion, mosaics, and more creative workshops."
  }
};

export default function ActivitiesIndexPage() {
  const activitiesByCategory = getActivitiesByCategory();

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <div className="gradient-breathing relative overflow-hidden bg-gradient-to-br from-purple-900/40 via-slate-900/60 to-pink-900/40">
        <div className="sparkle-noise absolute inset-0 bg-[url('/noise.png')] opacity-20" />
        <div className="relative mx-auto max-w-7xl px-6 py-24 sm:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="font-serif text-4xl font-bold tracking-tight sm:text-6xl">
              All Classes & Workshops
            </h1>
            <p className="mt-6 text-lg leading-8 text-white/80">
              From pottery and glass fusion to bonsai and painting, explore our full collection of creative experiences. 
              Each class is beginner-friendly, guided by experts, and designed for maximum fun.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-sm text-white/60">
              <span>Popular categories:</span>
              <Link 
                href="#mud-room" 
                className="rounded-full border bg-white/5 px-3 py-1 transition category-mud"
              >
                Pottery
              </Link>
              <Link 
                href="#glass-room" 
                className="rounded-full border bg-white/5 px-3 py-1 transition category-glass"
              >
                Glass & Mosaics
              </Link>
              <Link 
                href="#roots-room" 
                className="rounded-full border bg-white/5 px-3 py-1 transition category-roots"
              >
                Nature Crafts
              </Link>
              <Link 
                href="/gift-cards" 
                className="rounded-full border bg-white/5 px-3 py-1 transition category-romance"
              >
                Gift Cards
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Activities by Category */}
      <div className="mx-auto max-w-7xl px-6 py-16">
        {Array.from(activitiesByCategory.entries()).map(([categoryKey, activities]) => {
          if (activities.length === 0) return null;
          
          const category = ACTIVITY_CATEGORIES[categoryKey as CategoryKey];
          
          return (
            <section key={categoryKey} id={categoryKey} className="mb-20">
              <Reveal>
                <div className="mb-8">
                  <div className="flex items-center gap-3">
                    <span className="text-4xl" role="img" aria-label={category.label}>{category.icon}</span>
                    <div>
                      <h2 className="font-serif text-3xl font-bold">{category.label}</h2>
                      <p className="mt-1 text-white/65">{category.description}</p>
                    </div>
                  </div>
                </div>
              </Reveal>

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {activities.map((activity, idx) => {
                  const variants = ["fade-up", "scale", "fade-left"] as const;
                  const variant = variants[idx % 3];
                  
                  return (
                    <Reveal key={activity.slug} variant={variant} delay={idx * 50}>
                      <Link 
                        href={`/activities/${activity.slug}`}
                        className="group block"
                      >
                        <GlassCard interactive className={`h-full float-gentle p-6 ${category.colorClass}`} style={{ animationDelay: `${idx * 0.2}s` }}>
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="text-xs font-semibold uppercase tracking-wide category-accent">
                              {activity.badge.split(" · ")[0]}
                            </div>
                            <h3 className="card-title-underline mt-2 font-serif text-xl font-semibold group-hover:text-white/90">
                              {activity.heroTitle}
                            </h3>
                          </div>
                          {activity.schedulePill && (
                            <TagPill>{activity.schedulePill}</TagPill>
                          )}
                        </div>

                        <p className="mt-3 text-sm leading-relaxed text-white/70">
                          {activity.heroDescription}
                        </p>

                      <div className="mt-4 flex flex-wrap gap-1.5">
                        {activity.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full bg-white/5 px-2 py-1 text-xs text-white/60"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      <div className="mt-4 text-sm font-semibold category-accent group-hover:brightness-125">
                        View {activity.heroTitle} details →
                      </div>
                    </GlassCard>
                  </Link>
                  </Reveal>
                );
              })}
              </div>
            </section>
          );
        })}
      </div>

      {/* Bottom CTA Section */}
      <div className="border-t border-white/10 bg-gradient-to-br from-indigo-900/30 via-purple-900/20 to-pink-900/30 py-16">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="font-serif text-3xl font-bold">Can't decide? We've got you.</h2>
          <p className="mt-4 text-lg text-white/75">
            Grab a gift card and let them choose their own creative adventure, or book a private event for your whole crew.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/gift-cards"
              className="inline-flex items-center justify-center rounded-full border border-white/15 bg-pink-600 px-6 py-3 font-semibold text-white hover:bg-pink-700"
            >
              Shop Gift Cards
            </Link>
            <Link
              href="/activities/private-parties"
              className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/10 px-6 py-3 font-semibold text-white hover:bg-white/15"
            >
              Plan a Private Event
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
