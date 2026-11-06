"use client";

import { useState } from "react";
import Link from "next/link";
import BookingLink from "@/components/BookingLink";

export interface TimeSlot {
  datetime: Date;
  bookingUrl: string;
  bookingSource: "eventbrite" | "rezclick" | "acuity";
}

interface ShowTimesDrawerProps {
  times: TimeSlot[];
  maxVisible?: number;
  city: string;
  classNameText: string;
  classId: string;
}

export default function ShowTimesDrawer({ times, maxVisible = 4, city, classNameText, classId }: ShowTimesDrawerProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showAll, setShowAll] = useState(false);

  const visibleTimes = showAll ? times : times.slice(0, maxVisible);
  const hasMoreTimes = times.length > maxVisible;

  return (
    <div className="relative">
      {/* Toggle Button */}
      <button
        onClick={(e) => {
          e.preventDefault();
          setIsExpanded(!isExpanded);
        }}
        className="flex w-full items-center justify-between rounded-lg border border-border bg-surface-secondary px-4 py-2.5 text-sm font-semibold text-primary/80 transition-all hover:bg-surface-secondary hover:text-primary"
      >
        <span>{isExpanded ? "Hide" : "View"} upcoming times</span>
        <svg
          className={`h-4 w-4 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Expandable Drawer */}
      <div
        className={`
          overflow-hidden transition-all duration-300 ease-in-out
          ${isExpanded ? "mt-3 max-h-[500px] opacity-100" : "max-h-0 opacity-0"}
        `}
      >
        <div className="space-y-2 rounded-lg border border-border bg-surface-secondary p-4">
          <div className="mb-3 text-xs font-semibold uppercase tracking-wide text-primary/50">
            Upcoming Times
          </div>

          {/* Time Slots */}
          <div className="space-y-2">
            {visibleTimes.map((time, idx) => {
              const formattedDate = time.datetime.toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
              });
              const formattedTime = time.datetime.toLocaleTimeString("en-US", {
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
              });

              return (
                <div
                  key={idx}
                  className="flex items-center justify-between gap-3 rounded border border-white/5 bg-surface-secondary px-3 py-2 text-sm"
                >
                  <div className="flex items-center gap-2 text-primary/70">
                    <span className="text-primary/40">•</span>
                    <span>
                      {formattedDate} – {formattedTime}
                    </span>
                  </div>
                  <BookingLink
                    href={time.bookingUrl}
                    city={city}
                    classNameText={classNameText}
                    classId={classId}
                    onClick={(e) => e.stopPropagation()}
                    className="whitespace-nowrap rounded-full bg-surface-secondary px-3 py-1 text-xs font-semibold text-primary transition-all hover:bg-surface-secondary"
                  >
                    Book →
                  </BookingLink>
                </div>
              );
            })}
          </div>

          {/* Show All Toggle */}
          {hasMoreTimes && !showAll && (
            <button
              onClick={(e) => {
                e.preventDefault();
                setShowAll(true);
              }}
              className="mt-3 w-full rounded border border-border bg-surface-secondary px-3 py-2 text-xs font-semibold text-primary/60 transition hover:bg-surface-secondary hover:text-primary/80"
            >
              View all {times.length} times
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
