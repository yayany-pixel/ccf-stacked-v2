import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import GlassCard from "@/components/ui/GlassCard";
import TagPill from "@/components/ui/TagPill";
import Reveal from "@/components/motion/Reveal";
import { COLLECTIONS, getCollectionBySlug, getSectionsForCollection } from "@/lib/collections";
import { getAllEvents, type NormalizedEvent } from "@/lib/eventsAPI";
import { STUDIO_LOCATIONS } from "@/lib/locations";

interface CollectionPageProps {
  params: {
    slug: string;
  };
}

export function generateStaticParams() {
  return COLLECTIONS.map(c => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: CollectionPageProps): Promise<Metadata> {
  const collection = getCollectionBySlug(params.slug);
  if (!collection) return { title: "Collection Not Found" };
  return {
    title: collection.seo.metaTitle,
    description: collection.seo.metaDescription,
    alternates: {
      canonical: `https://colorcocktailfactory.com/collections/${collection.slug}`
    },
    robots: {
      index: collection.slug !== "adults-only"
    },
    openGraph: {
      title: `${collection.title} | Color Cocktail Factory`,
      description: collection.description,
      url: `https://colorcocktailfactory.com/collections/${collection.slug}`,
      type: "website",
      images: [collection.coverImage || "/og-image.jpg"],
    },
  };
}

export default async function CollectionDetailPage({ params }: CollectionPageProps) {
  const collection = getCollectionBySlug(params.slug);
  if (!collection) notFound();

  // Load upcoming scheduled events matching this collection
  let upcomingEvents: NormalizedEvent[] = [];
  try {
    const all = await getAllEvents(45);
    upcomingEvents = all.filter(e => {
      // For pottery collection, do not include non-pottery craft categories
      if (collection.slug === "pottery") {
        const nonPotteryCategories = ["Mosaics", "Turkish Lamps", "Candle Making", "Bonsai", "Terrariums", "Glass Art", "Painting", "Soap & Bath", "Watercolor"];
        if (nonPotteryCategories.includes(e.category)) return false;
      }
      const text = `${e.title} ${e.category}`.toLowerCase();
      return collection.filterPattern.test(text);
    });
  } catch (err) {
    console.error("Error loading events for collection:", err);
  }

  // Related base activity sections
  const matchedSections = getSectionsForCollection(collection);

  // Cross-promotion: other popular collections
  const otherCollections = COLLECTIONS.filter(c => c.slug !== collection.slug).slice(0, 3);

  return (
    <main id="main-content" tabIndex={-1} className="min-h-screen">
      {/* Hero Section */}
      <div className="gradient-breathing relative overflow-hidden bg-gradient-to-br from-purple-900/40 via-slate-900/60 to-pink-900/40">
        <div className="sparkle-noise absolute inset-0 opacity-20" />
        
        {/* Breadcrumb Navigation */}
        <div className="relative mx-auto max-w-7xl px-6 pt-24 sm:pt-28">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-primary/60">
            <Link href="/" className="hover:text-primary transition">Home</Link>
            <span>/</span>
            <Link href="/collections" className="hover:text-primary transition">Collections</Link>
            <span>/</span>
            <span className="text-primary/90">{collection.title}</span>
          </nav>
        </div>

        <div className="relative mx-auto max-w-7xl px-6 py-12 sm:py-16">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-surface-secondary px-4 py-1 text-xs font-semibold tracking-wider text-amber-300">
              <span>{collection.icon}</span>
              <span>{collection.badge}</span>
            </div>
            
            <h1 className="font-serif text-4xl font-bold tracking-tight sm:text-6xl text-primary">
              {collection.title}
            </h1>
            
            <p className="mt-4 text-lg leading-relaxed text-primary/80">
              {collection.subtitle}
            </p>

            {/* Studio Address Badges */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3 text-xs sm:text-sm text-primary/70">
              <span className="rounded-full border border-border bg-surface-secondary px-3 py-1.5">
                🏛️ <strong>Chicago Studio:</strong> {STUDIO_LOCATIONS.chicago.streetAddress}, Pilsen
              </span>
              <span className="rounded-full border border-border bg-surface-secondary px-3 py-1.5">
                🌲 <strong>Eugene Studio:</strong> {STUDIO_LOCATIONS.eugene.streetAddress}, OR
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-12 sm:py-16">
        {/* Direct Acuity Booking Fee-Saver Notice */}
        <div className="mb-14 rounded-2xl border border-amber-500/30 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 text-amber-300 font-semibold text-sm">
                <span>⚡</span>
                <span>DIRECT BOOKING BENEFIT</span>
              </div>
              <h2 className="mt-1 font-serif text-xl sm:text-2xl font-bold text-primary">
                Book Directly On Acuity to Avoid Ticket Fees
              </h2>
              <p className="mt-2 text-sm text-primary/75 max-w-2xl leading-relaxed">
                Save on third-party service fees and secure your seats immediately by registering directly through our studio scheduler. Instant confirmations, guaranteed table placement, and responsive studio support. Policies for cancellation and rescheduling vary by workshop; refer to your booking confirmation or contact support@colorcocktailfactory.com for assistance.
              </p>
            </div>
            <a
              href="https://colorcocktailfactory.as.me/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-amber-400 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-amber-300 shrink-0"
            >
              <span>Open Direct Scheduler</span>
              <span>→</span>
            </a>
          </div>
        </div>

        {/* Collection Overview & Benefits */}
        <div className="mb-16 grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <h2 className="font-serif text-2xl font-bold text-primary">About This Collection</h2>
            <p className="mt-4 text-base leading-relaxed text-primary/80">
              {collection.longDescription}
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-surface-secondary p-6">
            <h3 className="font-serif text-lg font-bold text-amber-200">What’s Included in Every Ticket</h3>
            <ul className="mt-4 space-y-3 text-sm text-primary/75">
              {collection.benefits.map((b, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <span className="text-amber-400 mt-0.5">✓</span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Upcoming Live Sessions */}
        {upcomingEvents.length > 0 && (
          <section className="mb-16">
            <div className="mb-8 flex items-end justify-between">
              <div>
                <h2 className="font-serif text-3xl font-bold text-primary">Upcoming Dates & Sessions</h2>
                <p className="mt-1 text-sm text-primary/60">
                  Real-time schedule from our Acuity reservation system. Click any date to book direct.
                </p>
              </div>
              <Link 
                href="/events" 
                className="text-sm font-semibold text-amber-300 hover:text-amber-200 transition"
              >
                View full calendar →
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {upcomingEvents.slice(0, 9).map((event) => {
                const date = new Date(event.startDate);
                const dayStr = date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
                const timeStr = date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });

                return (
                  <GlassCard key={event.id} className="p-5 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-amber-300">
                          📍 {event.city}
                        </span>
                        <TagPill>{event.category}</TagPill>
                      </div>

                      <h3 className="mt-3 font-serif text-lg font-bold text-primary line-clamp-1">
                        {event.title}
                      </h3>

                      <div className="mt-3 flex items-center gap-2 text-sm text-primary/75">
                        <span className="font-medium text-primary">{dayStr}</span>
                        <span>·</span>
                        <span>{timeStr}</span>
                      </div>

                      <div className="mt-2 text-xs text-primary/50">
                        {event.venueName}
                      </div>
                    </div>

                    <div className="mt-5 pt-3 border-t border-border flex items-center justify-between">
                      <span className="text-sm font-semibold text-primary">
                        ${event.price}
                      </span>
                      <a
                        href={event.bookingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-full bg-surface-secondary px-4 py-1.5 text-xs font-semibold text-amber-300 transition hover:bg-amber-400 hover:text-slate-950"
                      >
                        Book Direct
                      </a>
                    </div>
                  </GlassCard>
                );
              })}
            </div>
          </section>
        )}

        {/* Featured Workshops in this Collection */}
        {matchedSections.length > 0 && (
          <section className="mb-16">
            <h2 className="mb-8 font-serif text-3xl font-bold text-primary">
              Signature Experiences in This Collection
            </h2>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {matchedSections.map((section, idx) => (
                <Reveal key={section.id} variant="fade-up" delay={idx * 50}>
                  <Link href={`/activities/${section.slug}`} className="group block h-full">
                    <GlassCard interactive className="flex h-full flex-col justify-between p-6 transition group-hover:border-white/30">
                      <div>
                        <div className="text-xs font-semibold uppercase tracking-wider text-amber-400">
                          {section.badge}
                        </div>
                        <h3 className="mt-2 font-serif text-xl font-bold text-primary group-hover:text-amber-200">
                          {section.heroTitle}
                        </h3>
                        <p className="mt-3 text-xs leading-relaxed text-primary/70 line-clamp-3">
                          {section.heroDescription}
                        </p>
                      </div>

                      <div className="mt-6 flex items-center justify-between border-t border-border pt-4 text-xs font-semibold text-amber-300">
                        <span>Details & Registration</span>
                        <span>→</span>
                      </div>
                    </GlassCard>
                  </Link>
                </Reveal>
              ))}
            </div>
          </section>
        )}

        {/* Explore Other Collections */}
        <section className="mt-20 border-t border-border pt-12">
          <h2 className="font-serif text-2xl font-bold text-primary">Explore More Collections</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-3">
            {otherCollections.map((c) => (
              <Link 
                key={c.slug} 
                href={`/collections/${c.slug}`}
                className="group block rounded-xl border border-border bg-surface-secondary p-5 transition hover:bg-surface-secondary"
              >
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{c.icon}</span>
                  <div>
                    <h3 className="font-serif text-base font-bold text-primary group-hover:text-amber-300">
                      {c.title}
                    </h3>
                    <p className="mt-1 text-xs text-primary/60 line-clamp-2">
                      {c.subtitle}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
