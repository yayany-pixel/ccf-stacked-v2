"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import GlassCard from "@/components/ui/GlassCard";
import Reveal from "@/components/motion/Reveal";
import CityFilter from "@/components/CityFilter";
import ShowTimesDrawer, { type TimeSlot } from "@/components/ShowTimesDrawer";
import type { EventbriteEvent } from "@/lib/eventbrite";

type City = "chicago" | "eugene";
type Category = 
  | "Pottery" 
  | "Mosaic" 
  | "Glass Fusion" 
  | "Candle" 
  | "Terrarium & Bonsai" 
  | "Painting" 
  | "Kids & Family" 
  | "Private" 
  | "Flash" 
  | "Other";

interface GroupedEvent {
  title: string;
  category: Category;
  times: TimeSlot[];
  logo?: string;
}

function getCityFromEvent(event: EventbriteEvent): City {
  const title = event.name.text.toLowerCase();
  if (title.includes("chicago")) return "chicago";
  if (title.includes("eugene")) return "eugene";
  // Default fallback
  return "chicago";
}

function getCategory(title: string): Category {
  const t = title.toLowerCase();
  if (t.includes("wheel") || t.includes("pottery") || t.includes("ceramic") || t.includes("mug") || t.includes("bowl")) return "Pottery";
  if (t.includes("mosaic")) return "Mosaic";
  if (t.includes("glass") || t.includes("fuse") || t.includes("fusion")) return "Glass Fusion";
  if (t.includes("candle")) return "Candle";
  if (t.includes("terrarium") || t.includes("bonsai")) return "Terrarium & Bonsai";
  if (t.includes("paint")) return "Painting";
  if (t.includes("kids") || t.includes("grown-up & me")) return "Kids & Family";
  if (t.includes("private") || t.includes("lesson")) return "Private";
  if (t.includes("flash") || t.includes("sale")) return "Flash";
  return "Other";
}

function normalizeTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/\b(chicago|eugene)\b/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function groupEvents(events: EventbriteEvent[]): GroupedEvent[] {
  const grouped = new Map<string, GroupedEvent>();

  events.forEach((event) => {
    const normalized = normalizeTitle(event.name.text);
    const category = getCategory(event.name.text);

    if (!grouped.has(normalized)) {
      grouped.set(normalized, {
        title: event.name.text.replace(/\b(Chicago|Eugene)\b/g, "").trim(),
        category,
        times: [],
        logo: event.logo?.url,
      });
    }

    const group = grouped.get(normalized)!;
    group.times.push({
      datetime: new Date(event.start.local),
      bookingUrl: event.url,
      bookingSource: "eventbrite", // All current events are from Eventbrite
    });
  });

  // Sort times within each group
  grouped.forEach((group) => {
    group.times.sort((a, b) => a.datetime.getTime() - b.datetime.getTime());
  });

  return Array.from(grouped.values());
}

const FEATURED_TITLES = [
  "date night on the wheel",
  "turkish lamp mosaic",
  "beginner wheel throwing",
  "beginners pottery",
];

function isFeatured(title: string): boolean {
  const normalized = title.toLowerCase();
  return FEATURED_TITLES.some((featured) => normalized.includes(featured));
}

interface EventsGridProps {
  events: EventbriteEvent[];
}

export default function EventsGrid({ events }: EventsGridProps) {
  const [selectedCity, setSelectedCity] = useState<City>("chicago");

  // Layer 1: Filter by city
  const cityEvents = events.filter((event) => getCityFromEvent(event) === selectedCity);

  // Layer 3: Group and deduplicate
  const groupedEvents = groupEvents(cityEvents);

  // Layer 4: Split into featured and regular
  const featuredEvents = groupedEvents.filter((e) => isFeatured(e.title));
  const regularEvents = groupedEvents.filter((e) => !isFeatured(e.title));

  // Layer 2: Organize by category
  const categories: Category[] = [
    "Pottery",
    "Mosaic",
    "Glass Fusion",
    "Candle",
    "Terrarium & Bonsai",
    "Painting",
    "Kids & Family",
    "Private",
    "Flash",
    "Other",
  ];

  const eventsByCategory = categories.reduce((acc, category) => {
    const categoryEvents = regularEvents.filter((e) => e.category === category);
    if (categoryEvents.length > 0) {
      acc[category] = categoryEvents;
    }
    return acc;
  }, {} as Record<Category, GroupedEvent[]>);

  return (
    <>
      {/* Layer 1: City Toggle */}
      <div className="mb-12">
        <Reveal variant="fade-down">
          <CityFilter onCityChange={setSelectedCity} defaultCity="chicago" />
        </Reveal>
      </div>

      {/* Layer 4: Featured Band */}
      {featuredEvents.length > 0 && (
        <section className="mb-16">
          <Reveal variant="fade-up">
            <h2 className="mb-6 text-center font-serif text-2xl font-bold sm:text-3xl">
              This Week's Highlights
            </h2>
          </Reveal>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredEvents.map((event, idx) => (
              <EventCard key={event.title} event={event} delay={idx * 50} featured />
            ))}
          </div>
        </section>
      )}

      {/* Layer 2: Categories */}
      {Object.entries(eventsByCategory).map(([category, categoryEvents]) => (
        <section key={category} className="mb-16">
          <Reveal variant="fade-up">
            <h2 className="mb-6 border-b border-white/10 pb-3 font-serif text-xl font-bold sm:text-2xl">
              {category}
            </h2>
          </Reveal>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {categoryEvents.map((event, idx) => (
              <EventCard key={event.title} event={event} delay={idx * 50} />
            ))}
          </div>
        </section>
      ))}

      {/* Empty state for city */}
      {groupedEvents.length === 0 && (
        <Reveal variant="scale">
          <GlassCard className="mx-auto max-w-2xl p-8 text-center">
            <div className="text-xl font-semibold">No Upcoming Events in {selectedCity}</div>
            <p className="mt-3 text-white/70">
              Try selecting the other location or check back soon for new workshops.
            </p>
          </GlassCard>
        </Reveal>
      )}
    </>
  );
}

interface EventCardProps {
  event: GroupedEvent;
  delay?: number;
  featured?: boolean;
}

function EventCard({ event, delay = 0, featured = false }: EventCardProps) {
  return (
    <Reveal variant="scale" delay={delay}>
      <GlassCard 
        className={`h-full overflow-hidden p-0 ${featured ? 'ring-2 ring-white/20' : ''}`}
      >
        {/* Event Image */}
        {event.logo && (
          <div className="relative aspect-[16/9] w-full overflow-hidden">
            <Image
              src={event.logo}
              alt={event.title}
              fill
              className="object-cover transition-transform duration-300"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          </div>
        )}

        {/* Event Details */}
        <div className="p-6">
          {/* Category Badge */}
          <div className="mb-3 text-xs font-semibold uppercase tracking-wide text-white/50">
            {event.category}
            {featured && <span className="ml-2 text-cyan-400">★ Featured</span>}
          </div>

          {/* Event Title */}
          <h3 className="mb-4 font-serif text-xl font-semibold leading-tight">
            {event.title}
          </h3>

          {/* Next Available Time */}
          <div className="mb-4 text-sm text-white/60">
            Next: {event.times[0].datetime.toLocaleDateString("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
            })}{" "}
            at{" "}
            {event.times[0].datetime.toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
            })}
          </div>

          {/* Expandable Times Drawer */}
          <ShowTimesDrawer times={event.times} maxVisible={4} />
        </div>
      </GlassCard>
    </Reveal>
  );
}
