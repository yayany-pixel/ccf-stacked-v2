"use client";

import { useState } from "react";
import type { AcuitySeries, AcuityTimeSlot } from "@/lib/acuity";
import GlassCard from "@/components/ui/GlassCard";
import BookingLink from "@/components/BookingLink";

/**
 * Format date/time for display
 */
function formatDateTime(date: Date): string {
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true
  });
}

type AcuitySeriesCardProps = {
  series: AcuitySeries;
};

const INITIAL_TIMES_SHOWN = 6;

export default function AcuitySeriesCard({ series }: AcuitySeriesCardProps) {
  const [showTimesDrawer, setShowTimesDrawer] = useState(false);
  const [visibleTimesCount, setVisibleTimesCount] = useState(INITIAL_TIMES_SHOWN);
  
  const totalTimes = series.times.length;
  const visibleTimes = series.times.slice(0, visibleTimesCount);
  const hasMoreTimes = visibleTimesCount < totalTimes;

  // Get next available time and seat info
  const nextTime = series.times[0];
  const nextTimeLabel = nextTime ? formatDateTime(nextTime.datetime) : null;
  const totalSeats = series.times.reduce((sum, time) => {
    return sum + (time.remainingSeats ?? 0);
  }, 0);

  // Extract city from location
  const city = series.location?.includes("Chicago") ? "Chicago" : 
               series.location?.includes("Eugene") ? "Eugene" : null;

  const handleShowMore = () => {
    setVisibleTimesCount(prev => Math.min(prev + INITIAL_TIMES_SHOWN, totalTimes));
  };

  return (
    <GlassCard>
      {/* Typographic Hero - replaces image placeholder */}
      <div className="relative aspect-video w-full overflow-hidden rounded-t-2xl bg-gradient-to-br from-purple-900/60 via-slate-800/80 to-cyan-900/60">
        {/* Subtle texture overlay */}
        <div className="sparkle-noise absolute inset-0 opacity-30" />
        
        {/* Glow accent */}
        <div className="absolute -top-20 right-0 h-40 w-40 rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="absolute -bottom-20 left-0 h-40 w-40 rounded-full bg-purple-500/20 blur-3xl" />
        
        <div className="relative flex h-full flex-col justify-between p-5">
          {/* Top badges */}
          <div className="flex flex-wrap items-start gap-2">
            {city && (
              <span className="rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-200">
                {city}
              </span>
            )}
            <span className="rounded-full border border-purple-400/30 bg-purple-500/10 px-3 py-1 text-xs font-semibold text-purple-200">
              {series.category}
            </span>
          </div>

          {/* Title */}
          <div className="flex-1 flex items-center">
            <h3 className="line-clamp-2 text-2xl font-bold leading-tight text-white drop-shadow-lg">
              {series.title}
            </h3>
          </div>

          {/* Bottom info */}
          <div className="space-y-1.5">
            {nextTimeLabel && (
              <div className="flex items-center gap-2 text-sm font-medium text-white/90">
                <svg className="h-4 w-4 text-cyan-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>Next: {nextTimeLabel}</span>
              </div>
            )}
            
            {/* Seat availability summary */}
            {totalTimes > 0 && (
              <div className="flex items-center gap-2 text-sm font-medium">
                {totalSeats > 0 ? (
                  <span className="text-green-300">
                    {totalSeats} {totalSeats === 1 ? "seat" : "seats"} available
                  </span>
                ) : nextTime?.remainingSeats === 0 ? (
                  <span className="text-yellow-300">Limited availability</span>
                ) : (
                  <span className="text-cyan-300">{totalTimes} {totalTimes === 1 ? "time" : "times"} available</span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="p-5">
        {/* View Times Button */}
        <button
          onClick={() => setShowTimesDrawer(!showTimesDrawer)}
          className="w-full rounded-full border border-white/20 bg-white/5 px-4 py-2 text-sm font-semibold transition-all hover:border-white/30 hover:bg-white/10"
        >
          {showTimesDrawer ? "Hide" : "View"} upcoming times
        </button>

        {/* Times Drawer */}
        {showTimesDrawer && (
          <div className="mt-3 mb-4 space-y-2 rounded-lg border border-white/10 bg-white/5 p-3">
            {visibleTimes.length === 0 && (
              <div className="py-2 text-center text-sm text-white/60">
                Times coming soon
              </div>
            )}
            
            {visibleTimes.map((time) => (
              <div
                key={time.startISO}
                className="flex items-center justify-between gap-3 rounded-lg border border-white/10 bg-white/5 p-2 text-sm transition-colors hover:bg-white/10"
              >
                <div className="flex flex-1 flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <svg className="h-3.5 w-3.5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="font-medium">{formatDateTime(time.datetime)}</span>
                  </div>
                  
                  {/* Seat availability */}
                  {time.remainingSeats !== undefined && (
                    <div className="ml-5 text-xs text-white/60">
                      {time.remainingSeats === 0 ? (
                        <span className="text-red-400">Sold out</span>
                      ) : time.remainingSeats <= 3 ? (
                        <span className="text-yellow-400">{time.remainingSeats} seats left</span>
                      ) : (
                        <span className="text-green-400">{time.remainingSeats} seats available</span>
                      )}
                    </div>
                  )}
                  
                  {/* Capacity (if remainingSeats not available) */}
                  {time.remainingSeats === undefined && time.capacity !== undefined && (
                    <div className="ml-5 text-xs text-white/60">
                      Capacity: {time.capacity}
                    </div>
                  )}
                  
                  {/* Generic available (if no seat data) */}
                  {time.remainingSeats === undefined && time.capacity === undefined && (
                    <div className="ml-5 text-xs text-green-400">
                      Available
                    </div>
                  )}
                </div>

                <BookingLink
                  href={time.bookingUrl}
                  city="Chicago" 
                  classNameText={series.title}
                  classId={series.title.toLowerCase().replace(/\s+/g, '-')}
                  className="rounded-full bg-cyan-500/20 px-3 py-1 text-xs font-semibold text-cyan-200 transition-colors hover:bg-cyan-500/30"
                >
                  Book →
                </BookingLink>
              </div>
            ))}

            {/* More Times Button */}
            {hasMoreTimes && (
              <button
                onClick={handleShowMore}
                className="w-full rounded-lg border border-white/10 bg-white/5 py-2 text-sm font-semibold text-white/70 transition-all hover:border-white/20 hover:bg-white/10 hover:text-white"
              >
                More times ({totalTimes - visibleTimesCount} remaining)
              </button>
            )}
          </div>
        )}

        {/* Main Book Button */}
        <BookingLink
          href={series.bookingUrl}
          city="Chicago"
          classNameText={series.title}
          classId={series.title.toLowerCase().replace(/\s+/g, '-')}
          className="btn-interactive inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-white/20 mt-4 w-full border-0 bg-gradient-to-r from-pink-500/80 via-purple-500/80 to-indigo-500/80 text-white shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50"
        >
          Book This Class →
        </BookingLink>
      </div>
    </GlassCard>
  );
}
