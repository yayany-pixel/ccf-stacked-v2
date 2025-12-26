import type { Metadata } from "next";
import Link from "next/link";
import { getCCFEvents } from "@/lib/eventbrite";
import { eventsListSchemaJsonLd } from "@/lib/eventSchema";
import { ACUITY_EVENTS_HREF } from "@/lib/constants";
import GlassCard from "@/components/ui/GlassCard";
import Reveal from "@/components/motion/Reveal";
import EventsGrid from "@/components/EventsGrid";

export const metadata: Metadata = {
  title: "Upcoming Workshops & Events | Color Cocktail Factory",
  description: "Browse upcoming creative workshops in Chicago and Eugene. Pottery, glass fusion, mosaics, bonsai, painting, and more. Book your spot today!",
  keywords: [
    "pottery workshops",
    "pottery classes Chicago",
    "pottery classes Eugene",
    "creative workshops",
    "glass fusion classes",
    "mosaic workshops",
    "art classes near me",
    "date night pottery",
    "team building activities",
    "things to do in Chicago",
    "things to do in Eugene"
  ],
  openGraph: {
    title: "Upcoming Creative Workshops | Color Cocktail Factory",
    description: "Join us for hands-on pottery, glass art, mosaics, and more. Expert-guided workshops for all skill levels.",
    type: "website",
    url: "https://colorcocktailfactory.com/events",
    images: [
      {
        url: "https://colorcocktailfactory.com/og-events.jpg",
        width: 1200,
        height: 630,
        alt: "Color Cocktail Factory Workshops"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Upcoming Workshops | Color Cocktail Factory",
    description: "Browse creative workshops: pottery, glass art, mosaics, and more.",
    images: ["https://colorcocktailfactory.com/og-events.jpg"]
  },
  alternates: {
    canonical: "https://colorcocktailfactory.com/events"
  }
};

/**
 * Server component that displays upcoming Eventbrite events
 * Structured by city → category → grouped series
 * Automatically revalidates every 60 seconds
 */
export default async function EventsPage() {
  let events;
  let error: string | null = null;

  try {
    events = await getCCFEvents();
  } catch (e) {
    error = e instanceof Error ? e.message : "Unable to load events";
    console.error("Error fetching events:", e);
  }

  return (
    <main className="min-h-screen">
      {/* Event Schema for Google */}
      {!error && events && events.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(eventsListSchemaJsonLd(events))
          }}
        />
      )}

      {/* Hero Section */}
      <div className="gradient-breathing relative overflow-hidden bg-gradient-to-br from-purple-900/40 via-slate-900/60 to-pink-900/40">
        <div className="sparkle-noise absolute inset-0" />
        <div className="relative mx-auto max-w-7xl px-6 py-20 sm:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <Reveal variant="fade-up">
              <h1 className="font-serif text-4xl font-bold tracking-tight sm:text-6xl">
                Upcoming Workshops
              </h1>
            </Reveal>
            <Reveal delay={100} variant="fade-up">
              <p className="mt-6 text-lg leading-8 text-white/80">
                Hands-on creative experiences in Chicago and Eugene. Select your city to explore workshops.
              </p>
            </Reveal>
            <Reveal delay={200} variant="fade-up">
              <div className="mt-8">
                <Link
                  href={ACUITY_EVENTS_HREF}
                  className="inline-flex items-center gap-2 rounded-full border border-cyan-400/40 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 px-6 py-2.5 text-sm font-semibold shadow-lg shadow-cyan-500/20 transition-all hover:border-cyan-400/60 hover:shadow-cyan-500/30"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  View Acuity Schedule →
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-6 py-12">
        {/* Error State */}
        {error && (
          <Reveal variant="scale">
            <GlassCard className="mx-auto max-w-2xl p-8 text-center">
              <div className="text-xl font-semibold text-red-400">Unable to Load Events</div>
              <p className="mt-3 text-white/70">{error}</p>
              <p className="mt-4 text-sm text-white/60">
                Please check your environment configuration or try again later.
              </p>
              <Link
                href="/"
                className="mt-6 inline-block rounded-full border border-white/15 bg-white/5 px-6 py-2 text-sm font-semibold transition hover:bg-white/10"
              >
                ← Back to Home
              </Link>
            </GlassCard>
          </Reveal>
        )}

        {/* Empty State */}
        {!error && events && events.length === 0 && (
          <Reveal variant="scale">
            <GlassCard className="mx-auto max-w-2xl p-8 text-center">
              <div className="text-xl font-semibold">No Upcoming Events</div>
              <p className="mt-3 text-white/70">
                We're currently planning our next workshops. Check back soon or explore our regular offerings.
              </p>
              <Link
                href="/"
                className="mt-6 inline-block rounded-full border border-white/15 bg-white/5 px-6 py-2 text-sm font-semibold transition hover:bg-white/10"
              >
                ← Back to Home
              </Link>
            </GlassCard>
          </Reveal>
        )}

        {/* Structured Events Grid */}
        {!error && events && events.length > 0 && <EventsGrid events={events} />}
      </div>
    </main>
  );
}
