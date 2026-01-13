"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import BookingLink from "@/components/BookingLink";

export interface BookingLinks {
  rezclick?: string;
  eventbrite?: string;
  acuity?: string;
}

export interface UpcomingTime {
  label: string;
  url: string;
}

interface HomeTimesDrawerProps {
  bookingLinks: BookingLinks;
  upcomingTimes?: UpcomingTime[];
  city: string;
  classNameText: string;
  classId: string;
}

export default function HomeTimesDrawer({ 
  bookingLinks, 
  upcomingTimes = [],
  city,
  classNameText,
  classId
}: HomeTimesDrawerProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const hasAnyLink = bookingLinks.rezclick || bookingLinks.eventbrite || bookingLinks.acuity;

  if (!hasAnyLink) return null;

  return (
    <div className="mt-6 border-t border-white/10 pt-6">
      {/* Toggle Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex w-full items-center justify-between text-left transition-colors hover:text-white"
      >
        <span className="text-sm font-semibold text-white/80">
          {isExpanded ? "Hide" : "View"} upcoming times
        </span>
        <svg
          className={`h-4 w-4 text-white/60 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Expandable Content */}
      <div
        className={`
          overflow-hidden transition-all duration-300 ease-in-out
          ${isExpanded ? "mt-4 max-h-[600px] opacity-100" : "max-h-0 opacity-0"}
        `}
      >
        {/* Booking Platform Icons */}
        <div className="mb-5 rounded-lg border border-white/10 bg-white/5 p-4">
          <div className="mb-3 text-xs font-semibold uppercase tracking-wide text-white/50">
            Book via:
          </div>
          <div className="flex flex-wrap gap-3">
            {/* Groupon/RezClick */}
            {bookingLinks.rezclick ? (
              <BookingLink
                href={bookingLinks.rezclick}
                city={city}
                classNameText={classNameText}
                classId={classId}
                className="group flex items-center gap-2 rounded-lg border border-white/20 bg-white/10 px-4 py-2.5 transition-all hover:border-white/30 hover:bg-white/15 hover:shadow-lg hover:shadow-white/5"
                ariaLabel="Book via Groupon (RezClick)"
              >
                <div className="relative h-7 w-7">
                  <GrouponIcon />
                </div>
                <span className="text-xs font-semibold text-white/90 group-hover:text-white">
                  Groupon
                </span>
              </BookingLink>
            ) : (
              <div
                className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 opacity-40"
                title="Link not set yet"
              >
                <div className="relative h-7 w-7">
                  <GrouponIcon />
                </div>
                <span className="text-xs font-semibold text-white/60">Groupon</span>
              </div>
            )}

            {/* Eventbrite */}
            {bookingLinks.eventbrite ? (
              <BookingLink
                href={bookingLinks.eventbrite}
                city={city}
                classNameText={classNameText}
                classId={classId}
                className="group flex items-center gap-2 rounded-lg border border-white/20 bg-white/10 px-4 py-2.5 transition-all hover:border-white/30 hover:bg-white/15 hover:shadow-lg hover:shadow-white/5"
                ariaLabel="Book via Eventbrite"
              >
                <div className="relative h-7 w-7">
                  <EventbriteIcon />
                </div>
                <span className="text-xs font-semibold text-white/90 group-hover:text-white">
                  Eventbrite
                </span>
              </BookingLink>
            ) : (
              <div
                className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 opacity-40"
                title="Link not set yet"
              >
                <div className="relative h-7 w-7">
                  <EventbriteIcon />
                </div>
                <span className="text-xs font-semibold text-white/60">Eventbrite</span>
              </div>
            )}

            {/* Acuity */}
            {bookingLinks.acuity ? (
              <BookingLink
                href={bookingLinks.acuity}
                city={city}
                classNameText={classNameText}
                classId={classId}
                className="group flex items-center gap-2 rounded-lg border border-white/20 bg-white/10 px-4 py-2.5 transition-all hover:border-white/30 hover:bg-white/15 hover:shadow-lg hover:shadow-white/5"
                ariaLabel="Book remaining seats via Acuity"
              >
                <div className="relative h-7 w-7">
                  <AcuityIcon />
                </div>
                <span className="text-xs font-semibold text-white/90 group-hover:text-white">
                  Acuity
                </span>
              </BookingLink>
            ) : (
              <div
                className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 opacity-40"
                title="Link not set yet"
              >
                <div className="relative h-7 w-7">
                  <AcuityIcon />
                </div>
                <span className="text-xs font-semibold text-white/60">Acuity</span>
              </div>
            )}
          </div>
        </div>

        {/* Times List */}
        {upcomingTimes.length > 0 ? (
          <div className="space-y-2">
            <div className="text-xs font-semibold uppercase tracking-wide text-white/50">
              Available Times
            </div>
            {upcomingTimes.map((time, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between gap-3 rounded border border-white/5 bg-white/5 px-3 py-2 text-sm"
              >
                <span className="text-white/70">{time.label}</span>
                <BookingLink
                  href={time.url}
                  city={city}
                  classNameText={classNameText}
                  classId={classId}
                  className="whitespace-nowrap rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white transition-all hover:bg-white/20"
                >
                  Book →
                </BookingLink>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded border border-white/5 bg-white/5 px-4 py-3 text-center text-sm text-white/60">
            Times coming soon — choose a booking option above
          </div>
        )}
      </div>
    </div>
  );
}

// SVG Icons as components
function GrouponIcon() {
  return (
    <svg viewBox="0 0 512 512" className="h-full w-full">
      <rect fill="#53A318" width="512" height="512" rx="64" />
      <path
        fill="#FFF"
        d="M152 368c-42 0-72-28-72-72v-80c0-44 30-72 72-72h48v48h-44c-16 0-24 8-24 24v80c0 16 8 24 24 24h44v48zm88 0v-224h48v96h64v-96h48v224h-48v-96h-64v96zm168 0v-224h48v176h64v48z"
      />
    </svg>
  );
}

function EventbriteIcon() {
  return (
    <svg viewBox="0 0 512 512" className="h-full w-full">
      <rect fill="#F05537" width="512" height="512" rx="64" />
      <path
        fill="#FFF"
        d="M256 96c-88 0-160 72-160 160s72 160 160 160 160-72 160-160-72-160-160-160zm0 272c-62 0-112-50-112-112s50-112 112-112 112 50 112 112-50 112-112 112zm48-112c0 26-22 48-48 48s-48-22-48-48 22-48 48-48 48 22 48 48z"
      />
    </svg>
  );
}

function AcuityIcon() {
  return (
    <svg viewBox="0 0 512 512" className="h-full w-full">
      <rect fill="#007AFF" width="512" height="512" rx="64" />
      <path
        fill="#FFF"
        d="M256 96l96 64v128l-96 64-96-64V160zm0 48l-64 43v86l64 43 64-43v-86zm0 32l32 21v43l-32 21-32-21v-43z"
      />
    </svg>
  );
}
