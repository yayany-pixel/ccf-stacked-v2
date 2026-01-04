'use client';

import { useState, useMemo } from "react";
import Link from "next/link";
import GlassCard from "@/components/ui/GlassCard";
import Reveal from "@/components/motion/Reveal";
import ButtonPill from "@/components/ui/ButtonPill";
import type { NormalizedEvent } from "@/lib/eventsAPI";

interface EventsGridProps {
  events: NormalizedEvent[];
}

export default function EventsGrid({ events }: EventsGridProps) {
  const [selectedCity, setSelectedCity] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "timeline">("timeline");

  // Extract unique cities and categories
  const cities = useMemo(() => {
    const uniqueCities = Array.from(new Set(events.map(e => e.city)));
    return ["all", ...uniqueCities.sort()];
  }, [events]);

  const categories = useMemo(() => {
    const uniqueCategories = Array.from(new Set(events.map(e => e.category)));
    return ["all", ...uniqueCategories.sort()];
  }, [events]);

  // Filter events
  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      const cityMatch = selectedCity === "all" || event.city === selectedCity;
      const categoryMatch = selectedCategory === "all" || event.category === selectedCategory;
      return cityMatch && categoryMatch;
    });
  }, [events, selectedCity, selectedCategory]);

  // Group events by date for timeline view
  const groupedEvents = useMemo(() => {
    const groups: { [key: string]: NormalizedEvent[] } = {};
    
    filteredEvents.forEach(event => {
      const date = new Date(event.startDate);
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const nextWeek = new Date(today);
      nextWeek.setDate(nextWeek.getDate() + 7);
      
      let groupKey: string;
      
      if (date.toDateString() === today.toDateString()) {
        groupKey = "Today";
      } else if (date.toDateString() === tomorrow.toDateString()) {
        groupKey = "Tomorrow";
      } else if (date < nextWeek) {
        groupKey = "This Week";
      } else {
        const monthNames = ["January", "February", "March", "April", "May", "June",
          "July", "August", "September", "October", "November", "December"];
        groupKey = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
      }
      
      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(event);
    });
    
    return groups;
  }, [filteredEvents]);

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

  function formatEventTime(isoDate: string): string {
    const date = new Date(isoDate);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      timeZone: 'America/Chicago'
    });
  }

  function formatEventDay(isoDate: string): string {
    const date = new Date(isoDate);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      timeZone: 'America/Chicago'
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
              Showing {filteredEvents.length} of {events.length} events
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
                    onClick={() => setSelectedCity(city)}
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
                    onClick={() => setSelectedCategory(category)}
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
                            <div className="md:w-48 h-48 md:h-auto flex-shrink-0">
                              <img 
                                src={event.imageUrl} 
                                alt={event.title}
                                className="h-full w-full object-cover"
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
                                    <time dateTime={event.startDate}>{formatEventDate(event.startDate)}</time>
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
                                <ButtonPill 
                                  href={event.bookingUrl}
                                  variant="primary"
                                  className="flex-1 md:w-full text-sm"
                                >
                                  Book Now
                                </ButtonPill>
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
                              {event.price !== null && event.price > 0 && (
                                <span className="text-sm font-semibold text-pink-300">
                                  ${event.price.toFixed(2)}
                                </span>
                              )}
                              <span className="ml-auto text-xs text-white/40">
                                via {event.source === 'eventbrite' ? 'Eventbrite' : 'Acuity'}
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
          {filteredEvents.map((event, index) => (
            <Reveal key={event.id} variant="fade-up" delay={index * 50}>
              <GlassCard className="flex h-full flex-col">
                <div className="p-6">
                  {/* Event Image */}
                  {event.imageUrl && (
                    <div className="mb-4 overflow-hidden rounded-lg">
                      <img 
                        src={event.imageUrl} 
                        alt={event.title}
                        className="h-48 w-full object-cover"
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
                      <time dateTime={event.startDate}>{formatEventDay(event.startDate)} at {formatEventTime(event.startDate)}</time>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-cyan-400">📍</span>
                      <span>{event.venueName}</span>
                    </div>
                    {event.price !== null && (
                      <div className="flex items-start gap-2">
                        <span className="text-pink-400">💰</span>
                        <span>
                          {event.price === 0 ? 'Free' : `$${event.price.toFixed(2)}`}
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
                    via {event.source === 'eventbrite' ? 'Eventbrite' : 'Acuity'}
                  </div>
                </div>
              </GlassCard>
            </Reveal>
          ))}
        </div>
      )}

      {/* Empty Filtered State */}
      {filteredEvents.length === 0 && (
        <Reveal variant="fade-up">
          <GlassCard className="p-12 text-center">
            <p className="text-white/70">
              No events match your selected filters. Try adjusting your selection.
            </p>
            <button
              onClick={() => {
                setSelectedCity("all");
                setSelectedCategory("all");
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
