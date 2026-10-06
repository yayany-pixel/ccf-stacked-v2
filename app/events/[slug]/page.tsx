import MetaActivityView from "@/components/MetaActivityView";
import { eventTimeZone } from "@/lib/locations";
import { getCatalog, getClassById } from "@/lib/askccf/catalog";
import { catalogBookingUrl } from "@/lib/booking";
import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import NextImage from "next/image";
import { getEventBySlug, eventLocationSchema, type NormalizedEvent } from "@/lib/eventsAPI";
import GlassCard from "@/components/ui/GlassCard";
import ButtonPill from "@/components/ui/ButtonPill";
import BookingLink from "@/components/BookingLink";
import Reveal from "@/components/motion/Reveal";

export const dynamic = 'force-dynamic';

// Generate metadata for each event
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  if (params.slug.startsWith("eventbrite-")) return { title: "Find Current Class Dates" };
  const event = await getEventBySlug(params.slug);
  
  if (!event) {
    return {
      title: "Event Not Found"
    };
  }

  return {
    title: event.title,
    description: event.description,
    openGraph: {
      title: event.title,
      description: event.description,
      images: event.imageUrl ? [event.imageUrl] : ["/og-image.jpg"],
      type: "website",
      url: `https://colorcocktailfactory.com/events/${event.slug}`
    },
    alternates: {
      canonical: `https://colorcocktailfactory.com/events/${event.slug}`
    }
  };
}

// Generate JSON-LD for single event
function generateEventSchema(event: NormalizedEvent) {
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    "name": event.title,
    "description": event.description,
    "startDate": event.startDate,
    "endDate": event.endDate,
    "eventStatus": event.status === 'scheduled' ? "https://schema.org/EventScheduled" : "https://schema.org/EventCancelled",
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
    } : {
      "@type": "Offer",
      "url": event.bookingUrl,
      "availability": "https://schema.org/InStock"
    }
  };
}

// Format date range for display
function formatEventDateRange(startDate: string, endDate: string, city: string): string {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  const dateOptions: Intl.DateTimeFormatOptions = {
    timeZone: eventTimeZone(city),
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };
  
  const timeOptions: Intl.DateTimeFormatOptions = {
    timeZone: eventTimeZone(city),
    hour: 'numeric',
    minute: '2-digit',
    timeZoneName: 'short'
  };
  
  return `${start.toLocaleDateString('en-US', dateOptions)} from ${start.toLocaleTimeString('en-US', timeOptions)} to ${end.toLocaleTimeString('en-US', timeOptions)}`;
}

export default async function EventDetailPage({ params }: { params: { slug: string } }) {
  if (params.slug.startsWith("eventbrite-")) {
    const city = params.slug.includes("eugene") ? "eugene" : params.slug.includes("online") ? "online" : "chicago";
    redirect(catalogBookingUrl(await getCatalog(), city, params.slug));
  }
  const event = await getEventBySlug(params.slug);
  if (!event) {
    const match = params.slug.match(/^acuity-(\d+)-/);
    const item = match ? await getClassById(match[1]) : null;
    if (item) redirect(item.bookingUrl);
    notFound();
  }

  const eventSchema = generateEventSchema(event);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900">
      <MetaActivityView id={event.slug} name={event.title} city={event.city === "Virtual" ? "online" : event.city.toLowerCase()} url={event.bookingUrl} price={event.currency === "USD" ? event.price ?? undefined : undefined} />
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventSchema).replace(/</g, "\\u003c") }}
      />

      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Back Link */}
        <Reveal variant="fade-up">
          <Link 
            href="/events"
            className="mb-6 inline-flex items-center gap-2 text-sm text-purple-400 hover:text-purple-300"
          >
            ← Back to all events
          </Link>
        </Reveal>

        {/* Event Header */}
        <Reveal variant="fade-up" delay={100}>
          <GlassCard className="overflow-hidden">
            {/* Event Image */}
            {event.imageUrl && (
              <div className="h-64 overflow-hidden sm:h-96 relative">
                <NextImage 
                  src={event.imageUrl} 
                  alt={event.title}
                  fill
                  sizes="100vw"
                  priority
                  className="object-cover"
                />
              </div>
            )}

            <div className="p-8">
              {/* Badges */}
              <div className="mb-4 flex flex-wrap gap-2">
                <span className="rounded-full bg-purple-500/20 px-4 py-1.5 text-sm font-semibold text-purple-300">
                  {event.category}
                </span>
                <span className="rounded-full bg-cyan-500/20 px-4 py-1.5 text-sm font-semibold text-cyan-300">
                  {event.city}
                </span>
                {event.price === 0 && (
                  <span className="rounded-full bg-green-500/20 px-4 py-1.5 text-sm font-semibold text-green-300">
                    Free Event
                  </span>
                )}
              </div>

              {/* Title */}
              <h1 className="mb-4 bg-gradient-to-r from-purple-200 via-pink-200 to-cyan-200 bg-clip-text font-serif text-3xl font-bold text-transparent sm:text-4xl">
                {event.title}
              </h1>

              {/* Event Details */}
              <div className="mb-6 space-y-3 border-b border-white/10 pb-6">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">📅</span>
                  <div>
                    <div className="font-semibold text-white">Date & Time</div>
                    <div className="text-white/70">{formatEventDateRange(event.startDate, event.endDate, event.city)}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="text-2xl">📍</span>
                  <div>
                    <div className="font-semibold text-white">Location</div>
                    <div className="text-white/70">
                      {event.venueName}<br />
                      {event.streetAddress}<br />
                      {event.addressLocality}, {event.addressRegion} {event.postalCode}
                    </div>
                  </div>
                </div>

                {event.price !== null && (
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">💰</span>
                    <div>
                      <div className="font-semibold text-white">Price</div>
                      <div className="text-white/70">
                        {event.price === 0 ? 'Free' : `$${event.price.toFixed(2)} ${event.currency}`}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="mb-8">
                <h2 className="mb-3 text-xl font-bold text-white">About This Event</h2>
                <p className="whitespace-pre-line text-white/80">
                  {event.description}
                </p>
              </div>

              {/* Booking CTA */}
              <div className="flex flex-col gap-4 sm:flex-row">
                <BookingLink
                  href={event.bookingUrl}
                  city={event.city}
                  classNameText={event.title}
                  classId={event.slug}
                  className="btn-interactive inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-white/20 flex-1 border-0 bg-gradient-to-r from-pink-500/80 via-purple-500/80 to-indigo-500/80 text-white shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50"
                >
                  Book This Event →
                </BookingLink>
                <ButtonPill 
                  href={event.city === "Virtual" ? "/events?city=Virtual" : `/${event.city.toLowerCase()}`}
                  variant="secondary"
                >
                  More {event.city} Classes
                </ButtonPill>
              </div>

              {/* Source Info */}
              <div className="mt-6 text-sm text-white/40">
                Booking powered by Acuity Scheduling
              </div>
            </div>
          </GlassCard>
        </Reveal>

        {/* Additional Info */}
        <Reveal variant="fade-up" delay={200}>
          <div className="mt-8 text-center">
            <p className="mb-4 text-white/60">
              Questions about this event?
            </p>
            <Link 
              href="/private-events"
              className="text-purple-400 hover:text-purple-300 underline"
            >
              Contact us about private events
            </Link>
          </div>
        </Reveal>
      </div>
    </main>
  );
}
