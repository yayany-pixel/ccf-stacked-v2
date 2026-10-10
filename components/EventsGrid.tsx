'use client';

import { eventTimeZone } from "@/lib/locations";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, useMemo } from "react";
import Link from "next/link";
import NextImage from "next/image";
import { classImageLoader } from "@/lib/classImageLoader";
import GlassCard from "@/components/ui/GlassCard";
import Reveal from "@/components/motion/Reveal";
import ButtonPill from "@/components/ui/ButtonPill";
import BookingLink from "@/components/BookingLink";
import type { NormalizedEvent } from "@/lib/eventsAPI";

interface EventsGridProps {
  events: NormalizedEvent[];
  totalEvents: number;
  cityOptions: string[];
  categoryOptions: string[];
  selectedCity: string;
  selectedCategory: string;
  currentPage: number;
  pageSize: number;
}

export default function EventsGrid({ events, totalEvents, cityOptions, categoryOptions, selectedCity, selectedCategory, currentPage, pageSize }: EventsGridProps) {
  const query = useSearchParams();
  const router = useRouter();
  const [viewMode, setViewMode] = useState<"grid" | "timeline">("timeline");
  const cities = ["all", ...cityOptions];
  const categories = ["all", ...categoryOptions];
  const visibleEvents = events;
  const updateFilter = (key: string, value: string) => {
    const next = new URLSearchParams(query.toString());
    if (value === "all") next.delete(key); else next.set(key, value);
    if (key !== "page") next.delete("page");
    router.push(`/events${next.size ? `?${next}` : ""}`, { scroll: false });
  };

  // Group events by date for timeline view
  const groupedEvents = useMemo(() => {
    const groups: { [key: string]: NormalizedEvent[] } = {};
    
    visibleEvents.forEach(event => {
      const date = new Date(event.startDate);
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const nextWeek = new Date(today);
      nextWeek.setDate(nextWeek.getDate() + 7);
      
      let groupKey: string;
      
      const localDay = (d: Date) => d.toLocaleDateString("en-CA", { timeZone: eventTimeZone(event.city) });
      if (localDay(date) === localDay(today)) {
        groupKey = "Today";
      } else if (localDay(date) === localDay(tomorrow)) {
        groupKey = "Tomorrow";
      } else if (date < nextWeek) {
        groupKey = "This Week";
      } else {
        const monthNames = ["January", "February", "March", "April", "May", "June",
          "July", "August", "September", "October", "November", "December"];
        groupKey = date.toLocaleDateString("en-US", { month: "long", year: "numeric", timeZone: eventTimeZone(event.city) });
      }
      
      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(event);
    });
    
    return groups;
  }, [visibleEvents]);

  // Format date for display in Central Time
  function formatEventDate(isoDate: string, city: string): string {
    const date = new Date(isoDate);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      timeZone: eventTimeZone(city),
      timeZoneName: 'short'
    });
  }

  function formatEventTime(isoDate: string, city: string): string {
    const date = new Date(isoDate);
    if (city.toLowerCase() === "virtual" || city.toLowerCase() === "online") {
      const central = date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        timeZoneName: 'short',
        timeZone: 'America/Chicago'
      });
      const pacific = date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        timeZoneName: 'short',
        timeZone: 'America/Los_Angeles'
      });
      return `${central} / ${pacific}`;
    }
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      timeZoneName: 'short',
      timeZone: eventTimeZone(city)
    });
  }

  function formatEventDay(isoDate: string, city: string): string {
    const date = new Date(isoDate);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      timeZone: eventTimeZone(city)
    });
  }

  return (
    <>
      {/* Filters */}
      <Reveal variant="fade-up">
        <div className="mb-8 space-y-4">
          {/* View Toggle */}
          <div className="flex items-center justify-between flex-wrap gap-4">
            <p className="text-sm text-white/60">
              Showing {totalEvents ? (currentPage - 1) * pageSize + 1 : 0}–{(currentPage - 1) * pageSize + events.length} of {totalEvents} matching events
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode("timeline")}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  viewMode === "timeline"
                    ? "bg-purple-500/30 text-purple-200"
                    : "bg-white/5 text-white/60 hover:bg-white/10"
                }`}
              >
                📅 Timeline
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  viewMode === "grid"
                    ? "bg-purple-500/30 text-purple-200"
                    : "bg-white/5 text-white/60 hover:bg-white/10"
                }`}
              >
                ⊞ Grid
              </button>
            </div>
          </div>

          {/* Filter Buttons */}
          <div className="space-y-3">
            {/* City Filter */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-white/80">Location</label>
              <div className="flex flex-wrap gap-2">
                {cities.map(city => (
                  <button
                    key={city}
                    onClick={() => updateFilter("city", city)}
                    className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                      selectedCity === city
                        ? "bg-cyan-500/30 text-cyan-200 ring-1 ring-cyan-400/50"
                        : "bg-white/5 text-white/60 hover:bg-white/10"
                    }`}
                  >
                    {city === "all" ? "All Locations" : city}
                  </button>
                ))}
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-white/80">Category</label>
              <div className="flex flex-wrap gap-2">
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => updateFilter("category", category)}
                    className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                      selectedCategory === category
                        ? "bg-purple-500/30 text-purple-200 ring-1 ring-purple-400/50"
                        : "bg-white/5 text-white/60 hover:bg-white/10"
                    }`}
                  >
                    {category === "all" ? "All Categories" : category}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Reveal>

      {/* Timeline View */}
      {viewMode === "timeline" && (
        <div className="space-y-8">
          {Object.entries(groupedEvents).map(([groupName, groupEvents], groupIndex) => (
            <Reveal key={groupName} variant="fade-up" delay={groupIndex * 100}>
              <div>
                {/* Group Header */}
                <div className="mb-4 flex items-center gap-3">
                  <h2 className="bg-gradient-to-r from-purple-200 to-pink-200 bg-clip-text text-2xl font-bold text-transparent">
                    {groupName}
                  </h2>
                  <div className="h-px flex-1 bg-gradient-to-r from-purple-500/30 to-transparent" />
                  <span className="text-sm text-white/40">
                    {groupEvents.length} event{groupEvents.length !== 1 ? 's' : ''}
                  </span>
                </div>

                {/* Events List */}
                <div className="space-y-4">
                  {groupEvents.map((event, index) => (
                    <Reveal key={event.id} variant="fade-left" delay={index * 30}>
                      <GlassCard className="overflow-hidden">
                        <div className="flex flex-col md:flex-row">
                          {/* Event Image */}
                          {event.imageUrl && (
                            <div className="md:w-48 h-48 md:h-auto flex-shrink-0 relative">
                              <NextImage 
                                src={event.imageUrl} 
                                loader={classImageLoader}
                                alt={event.title}
                                fill
                                sizes="(max-width: 768px) 100vw, 192px"
                                className="object-cover"
                              />
                            </div>
                          )}

                          {/* Event Content */}
                          <div className="flex flex-1 flex-col p-6">
                            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                              <div className="flex-1">
                                {/* Category & City Badges */}
                                <div className="mb-2 flex flex-wrap items-center gap-2">
                                  <span className="rounded-full bg-purple-500/20 px-3 py-1 text-xs font-semibold text-purple-300">
                                    {event.category}
                                  </span>
                                  <span className="rounded-full bg-cyan-500/20 px-3 py-1 text-xs font-semibold text-cyan-300">
                                    📍 {event.city}
                                  </span>
                                  {event.price === 0 && (
                                    <span className="rounded-full bg-green-500/20 px-3 py-1 text-xs font-semibold text-green-300">
                                      Free
                                    </span>
                                  )}
                                </div>

                                {/* Event Title */}
                                <h3 className="mb-2 text-xl font-bold text-white">
                                  {event.title}
                                </h3>

                                {/* Event Time & Location */}
                                <div className="mb-3 space-y-1 text-sm text-white/70">
                                  <div className="flex items-center gap-2">
                                    <span className="text-purple-400">🕒</span>
                                    <time dateTime={event.startDate}>{formatEventDate(event.startDate, event.city)}</time>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-cyan-400">📍</span>
                                    <span>{event.venueName}</span>
                                  </div>
                                </div>

                                {/* Description */}
                                <p className="line-clamp-2 text-sm text-white/60">
                                  {event.description}
                                </p>
                              </div>

                              {/* Actions */}
                              <div className="flex flex-row md:flex-col gap-2 md:w-40">
                                <BookingLink
                                  href={event.bookingUrl}
                                  city={event.city}
                                  classNameText={event.title}
                                  classId={event.slug}
                                  className="btn-interactive inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-white/20 flex-1 md:w-full border-0 bg-gradient-to-r from-pink-500/80 via-purple-500/80 to-indigo-500/80 text-white shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50"
                                >
                                  Book Now
                                </BookingLink>
                                <ButtonPill 
                                  href={`/events/${event.slug}`}
                                  variant="ghost"
                                  className="flex-1 md:w-full text-sm"
                                >
                                  Details
                                </ButtonPill>
                              </div>
                            </div>

                            {/* Price & Source */}
                            <div className="mt-3 flex items-center justify-between border-t border-white/5 pt-3">
                              {event.formattedPrice ? (
                                <span className="text-sm font-semibold text-pink-300">
                                  {event.formattedPrice}
                                </span>
                              ) : event.price !== null && event.price > 0 ? (
                                <span className="text-sm font-semibold text-pink-300">
                                  ${event.price.toFixed(2)} {event.ticketUnit || "per ticket"}
                                </span>
                              ) : null}
                              <span className="ml-auto text-xs text-white/40">
                                via Acuity
                              </span>
                            </div>
                          </div>
                        </div>
                      </GlassCard>
                    </Reveal>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      )}

      {/* Grid View */}
      {viewMode === "grid" && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {visibleEvents.map((event, index) => (
            <Reveal key={event.id} variant="fade-up" delay={index * 50}>
              <GlassCard className="flex h-full flex-col">
                <div className="p-6">
                  {/* Event Image */}
                  {event.imageUrl && (
                    <div className="mb-4 overflow-hidden rounded-lg relative h-48">
                      <NextImage 
                        src={event.imageUrl} 
                        loader={classImageLoader}
                        alt={event.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover"
                      />
                    </div>
                  )}

                  {/* Category Badge */}
                  <div className="mb-2 flex items-center gap-2">
                    <span className="rounded-full bg-purple-500/20 px-3 py-1 text-xs font-semibold text-purple-300">
                      {event.category}
                    </span>
                    <span className="rounded-full bg-cyan-500/20 px-3 py-1 text-xs font-semibold text-cyan-300">
                      {event.city}
                    </span>
                  </div>

                  {/* Event Title */}
                  <h2 className="mb-2 text-xl font-bold text-white">
                    {event.title}
                  </h2>

                  {/* Event Details */}
                  <div className="mb-4 space-y-2 text-sm text-white/70">
                    <div className="flex items-start gap-2">
                      <span className="text-purple-400">📅</span>
                      <time dateTime={event.startDate}>{formatEventDay(event.startDate, event.city)} at {formatEventTime(event.startDate, event.city)}</time>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-cyan-400">📍</span>
                      <span>{event.venueName}</span>
                    </div>
                    {event.price !== null && (
                      <div className="flex items-start gap-2">
                        <span className="text-pink-400">💰</span>
                        <span>
                          {event.formattedPrice || (event.price === 0 ? 'Free' : `$${event.price.toFixed(2)} ${event.ticketUnit || "per ticket"}`)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Description */}
                  <p className="mb-4 line-clamp-3 text-sm text-white/60">
                    {event.description}
                  </p>

                  {/* Actions */}
                  <div className="mt-auto flex gap-2">
                    <ButtonPill 
                      href={event.bookingUrl}
                      variant="primary"
                      className="flex-1"
                    >
                      Book Now
                    </ButtonPill>
                    <ButtonPill 
                      href={`/events/${event.slug}`}
                      variant="ghost"
                    >
                      Details
                    </ButtonPill>
                  </div>

                  {/* Source Badge */}
                  <div className="mt-3 text-xs text-white/40">
                    via Acuity
                  </div>
                </div>
              </GlassCard>
            </Reveal>
          ))}
        </div>
      )}

      {totalEvents > pageSize && (
        <nav aria-label="Event pages" className="mt-8 flex items-center justify-center gap-4">
          <button disabled={currentPage === 1} onClick={() => updateFilter("page", String(currentPage - 1))} className="rounded-full border border-purple-300/40 px-5 py-3 font-semibold disabled:opacity-30">Previous</button>
          <span className="text-sm text-white/70">Page {currentPage} of {Math.ceil(totalEvents / pageSize)}</span>
          <button disabled={currentPage * pageSize >= totalEvents} onClick={() => updateFilter("page", String(currentPage + 1))} className="rounded-full border border-purple-300/40 bg-purple-500/20 px-5 py-3 font-semibold disabled:opacity-30">Next Dates</button>
        </nav>
      )}

      {/* Empty Filtered State */}
      {events.length === 0 && (
        <Reveal variant="fade-up">
          <GlassCard className="p-12 text-center">
            <p className="text-white/70">
              No events match your selected filters. Try adjusting your selection.
            </p>
            <button
              onClick={() => {
                router.push("/events", { scroll: false });
              }}
              className="mt-4 text-purple-400 hover:text-purple-300 underline"
            >
              Clear all filters
            </button>
          </GlassCard>
        </Reveal>
      )}
    </>
  );
}
