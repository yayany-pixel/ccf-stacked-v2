import type { Metadata } from "next";
import Link from "next/link";
import { getAllEvents, eventLocationSchema } from "@/lib/eventsAPI";
import { ACUITY_EVENTS_HREF } from "@/lib/constants";
import GlassCard from "@/components/ui/GlassCard";
import Reveal from "@/components/motion/Reveal";
import ButtonPill from "@/components/ui/ButtonPill";
import EventsGrid from "@/components/EventsGrid";

// Force dynamic rendering - don't pre-render at build time
export const dynamic = 'force-dynamic';
export const revalidate = 60; // Revalidate every 60 seconds

export const metadata: Metadata = {
  title: "Upcoming Workshops & Events",
  description: "Browse upcoming creative workshops in Chicago & Eugene. Pottery, glass fusion, mosaics, bonsai, painting, and more. Book your spot today!",
  openGraph: {
    title: "Upcoming Creative Workshops | Color Cocktail Factory",
    description: "Join us for hands-on pottery, glass art, mosaics, and more. Expert-guided workshops for all skill levels.",
    type: "website",
    url: "https://colorcocktailfactory.com/events",
    images: ["/og-image.jpg"]
  },
  twitter: {
    card: "summary_large_image",
    title: "Upcoming Workshops | Color Cocktail Factory",
    description: "Browse creative workshops: pottery, glass art, mosaics, and more."
  },
  alternates: {
    canonical: "https://colorcocktailfactory.com/events"
  }
};

/**
 * Server component that displays upcoming events from the public Acuity schedule
 * With proper JSON-LD structured data for SEO
 * Automatically revalidates every 60 seconds
 */
export default async function EventsPage({ searchParams }: { searchParams: { city?: string; category?: string; page?: string } }) {
  let events;
  let error: string | null = null;

  try {
    events = await getAllEvents(60);
  } catch (e) {
    error = "The schedule is temporarily unavailable. You can still view dates and book directly in Acuity.";
    console.error("Error fetching events:", e);
  }

  const cityOptions = Array.from(new Set((events ?? []).map(event => event.city))).sort();
  const categoryOptions = Array.from(new Set((events ?? []).map(event => event.category))).sort();
  const selectedCity = cityOptions.find(city => city === searchParams.city) ?? "all";
  const selectedCategory = categoryOptions.find(category => category === searchParams.category) ?? "all";
  const matchingEvents = (events ?? []).filter(event =>
    (selectedCity === "all" || event.city === selectedCity) &&
    (selectedCategory === "all" || event.category === selectedCategory));
  const pageSize = 48;
  const pageCount = Math.max(1, Math.ceil(matchingEvents.length / pageSize));
  const requestedPage = Number.parseInt(searchParams.page ?? "1", 10) || 1;
  const currentPage = Math.min(pageCount, Math.max(1, requestedPage));
  const pageEvents = matchingEvents.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // Generate JSON-LD for event list
  const eventSchemas = pageEvents.map(event => ({
    "@context": "https://schema.org",
    "@type": "Event",
    "name": event.title,
    "description": event.description,
    "startDate": event.startDate,
    "endDate": event.endDate,
    "eventStatus": "https://schema.org/EventScheduled",
    "eventAttendanceMode": event.city === "Virtual" ? "https://schema.org/OnlineEventAttendanceMode" : "https://schema.org/OfflineEventAttendanceMode",
    "location": eventLocationSchema(event),
    "image": event.imageUrl || "https://colorcocktailfactory.com/apple-touch-icon.png",
    "organizer": {
      "@type": "Organization",
      "name": "Color Cocktail Factory",
      "url": "https://colorcocktailfactory.com"
    },
    "offers": event.price !== null ? {
      "@type": "Offer",
      "url": event.bookingUrl,
      "price": event.price,
      "priceCurrency": event.currency,
      "availability": "https://schema.org/InStock",
      "validFrom": new Date().toISOString()
    } : undefined
  }));

  // Format date for display in Central Time
  function formatEventDate(isoDate: string): string {
    const date = new Date(isoDate);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      timeZone: 'America/Chicago',
      timeZoneName: 'short'
    });
  }

  return (
    <main id="main-content" tabIndex={-1} className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
      {/* JSON-LD Structured Data */}
      {!error && events && events.length > 0 && eventSchemas.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }}
        />
      ))}

      {/* Header */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <Reveal variant="fade-up">
          <div className="mb-12 text-center">
            <h1 className="mb-4 bg-gradient-to-r from-purple-200 via-pink-200 to-cyan-200 bg-clip-text font-serif text-4xl font-bold text-transparent sm:text-5xl">
              Upcoming Events
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-white/70">
              Discover our upcoming pottery, glass, painting, and creative workshops in Chicago, Eugene, and online.
              All skill levels welcome!
            </p>
          </div>
        </Reveal>

        {/* Error State */}
        {error && (
          <Reveal variant="scale">
            <GlassCard className="mx-auto max-w-2xl p-8 text-center">
              <div className="text-xl font-semibold text-red-400">Unable to Load Events</div>
              <p className="mt-3 text-white/70">{error}</p>
              <p className="mt-4 text-sm text-white/60">
                Availability and booking remain available on our scheduling page.
              </p>
              <Link
                href="https://colorcocktailfactory.as.me/"
                className="mt-6 inline-block rounded-full border border-white/15 bg-white/5 px-6 py-2 text-sm font-semibold transition hover:bg-white/10"
              >
                View Dates in Acuity
              </Link>
            </GlassCard>
          </Reveal>
        )}

        {/* Empty State */}
        {!error && events && events.length === 0 && (
          <Reveal variant="fade-up" delay={100}>
            <GlassCard className="p-12 text-center">
              <p className="text-white/70">
                No upcoming events scheduled at this time. Check back soon or{" "}
                <Link href="/chicago" className="text-purple-400 underline hover:text-purple-300">
                  browse our regular classes
                </Link>
                .
              </p>
            </GlassCard>
          </Reveal>
        )}

        {/* Events Grid with Filters */}
        {!error && events && events.length > 0 && (
          <EventsGrid events={pageEvents} totalEvents={matchingEvents.length} cityOptions={cityOptions} categoryOptions={categoryOptions} selectedCity={selectedCity} selectedCategory={selectedCategory} currentPage={currentPage} pageSize={pageSize} />
        )}

        {/* Call to Action */}
        <Reveal variant="fade-up" delay={200}>
          <div className="mt-12 text-center">
            <p className="mb-4 text-white/60">
              Looking for ongoing classes?
            </p>
            <div className="flex justify-center gap-4">
              <ButtonPill href="/chicago" variant="secondary">
                Chicago Classes
              </ButtonPill>
              <ButtonPill href="/eugene" variant="secondary">
                Eugene Classes
              </ButtonPill>
            </div>
          </div>
        </Reveal>
      </div>
    </main>
  );
}
