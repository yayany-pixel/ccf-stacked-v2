"use client";

import React, { useEffect, useRef, useState } from "react";
import { STUDIO_LOCATIONS } from "@/lib/locations";
import { trackBeginCheckout } from "@/lib/analytics";

export type LocationDestination = {
  city: "chicago" | "eugene" | "online";
  appointmentTypeId: number;
  calendarIds?: number[];
  bookingUrl: string;
  price?: number | null;
  priceUnit?: string;
  wasPrice?: number | null;
  formattedPrice?: string;
  verifiedTitle?: string;
};

export type VariantDestination = {
  id: number;
  title: string;
  city: "chicago" | "eugene" | "online";
  calendarIds?: number[];
  bookingUrl: string;
  currentPrice: number | null;
  priceUnit?: string;
  wasPrice?: number | null;
  formattedPrice?: string;
};

export type LocationModalProps = {
  isOpen: boolean;
  onClose: () => void;
  activityTitle: string;
  activitySlug: string;
  locations: {
    chicago?: LocationDestination;
    eugene?: LocationDestination;
    online?: LocationDestination;
  };
  variants?: VariantDestination[];
};

export default function LocationModal({
  isOpen,
  onClose,
  activityTitle,
  activitySlug,
  locations,
  variants,
}: LocationModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [preferredCity, setPreferredCity] = useState<string | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("preferredCity") || localStorage.getItem("ccf-city");
      if (stored === "chicago" || stored === "eugene") {
        setPreferredCity(stored);
      }
    } catch {}
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    // Focus first interactive element in modal
    const focusTimer = setTimeout(() => {
      const firstBtn = modalRef.current?.querySelector<HTMLElement>("button, a");
      firstBtn?.focus();
    }, 50);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      clearTimeout(focusTimer);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const hasVariants = Boolean(variants && variants.length > 1);
  const hasChicago = Boolean(locations.chicago);
  const hasEugene = Boolean(locations.eugene);
  const isOnline = Boolean(locations.online && !hasChicago && !hasEugene);
  const isBoth = hasChicago && hasEugene && !hasVariants;

  const handleBookingClick = (dest: LocationDestination, cityName: string) => {
    try {
      if (typeof window !== "undefined" && dest.city !== "online") {
        localStorage.setItem("preferredCity", dest.city);
        localStorage.setItem("ccf-city", dest.city);
      }
    } catch {}

    trackBeginCheckout({
      city: dest.city,
      class_name: dest.verifiedTitle || activityTitle,
      class_id: String(dest.appointmentTypeId),
      appointment_type_id: String(dest.appointmentTypeId),
      link_url: dest.bookingUrl,
      displayed_price: dest.price ?? undefined,
      click_target: `see_${dest.city}_dates`,
      booking_provider: "acuity",
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="location-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={modalRef}
        className="relative w-full max-w-lg rounded-3xl border border-white/20 bg-slate-900/95 p-6 sm:p-8 text-white shadow-2xl backdrop-blur-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white/70 transition hover:bg-white/20 hover:text-white"
          aria-label="Close dialog"
        >
          <span className="text-xl leading-none" aria-hidden="true">✕</span>
        </button>

        {/* Modal Header */}
        <div className="pr-8">
          <p className="text-xs font-semibold uppercase tracking-wider text-pink-400">
            {hasVariants ? "Choose Workshop Option" : "Select Studio Location"}
          </p>
          <h2 id="location-modal-title" className="mt-2 font-serif text-2xl font-bold leading-tight sm:text-3xl">
            {hasVariants
              ? `Choose your ${activityTitle} style`
              : `Where would you like to take ${activityTitle}?`}
          </h2>
          <p className="mt-2 text-sm text-white/75">
            {hasVariants
              ? "Select an option below to view live studio dates and reserve your table."
              : "Choose your studio to see available dates."}
          </p>
        </div>

        {/* Variants Selection (e.g. Turkish Lamp) */}
        {hasVariants && variants && (
          <div className="mt-6 space-y-4">
            {variants.map((v) => (
              <div
                key={v.id}
                className="rounded-2xl border border-white/15 bg-white/5 p-5 transition hover:border-pink-500/50 hover:bg-white/10"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-pink-400">
                    {v.title}
                  </span>
                  <span className="text-xs text-white/60">Chicago Pilsen Studio</span>
                </div>
                <p className="mt-1.5 text-xs text-white/80">
                  {STUDIO_LOCATIONS.chicago.address}
                </p>
                <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="text-sm font-semibold text-amber-300">
                    {v.wasPrice && v.currentPrice && v.wasPrice > v.currentPrice && (
                      <del className="text-xs text-white/50 mr-1.5" aria-label="Original price">${v.wasPrice}</del>
                    )}
                    {v.formattedPrice || (v.currentPrice ? `$${v.currentPrice} ${v.priceUnit || ""}` : "See price at checkout")}
                  </div>
                  <a
                    href={v.bookingUrl}
                    onClick={() =>
                      handleBookingClick(
                        {
                          city: v.city,
                          appointmentTypeId: v.id,
                          calendarIds: v.calendarIds,
                          bookingUrl: v.bookingUrl,
                          price: v.currentPrice,
                          priceUnit: v.priceUnit,
                          verifiedTitle: v.title,
                        },
                        "Chicago",
                      )
                    }
                    className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-pink-500/25 transition hover:from-pink-600 hover:to-purple-700 hover:shadow-pink-500/40 focus:outline-none focus:ring-2 focus:ring-pink-400 shrink-0"
                  >
                    See {v.title} Dates →
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Both Cities Offered */}
        {isBoth && (
          <div className="mt-6 space-y-4">
            {/* Chicago Option */}
            {locations.chicago && (
              <div className="rounded-2xl border border-white/15 bg-white/5 p-5 transition hover:border-pink-500/50 hover:bg-white/10">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-pink-400">
                      Chicago, Illinois
                    </span>
                    {preferredCity === "chicago" && (
                      <span className="ml-2 rounded-full border border-pink-400/40 bg-pink-500/20 px-2 py-0.5 text-[10px] font-semibold text-pink-300">
                        Suggested
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-white/60">In-person workshop</span>
                </div>
                <p className="mt-1.5 text-xs text-white/80">
                  {STUDIO_LOCATIONS.chicago.address}
                </p>
                <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="text-sm font-semibold text-amber-300">
                    {locations.chicago.wasPrice && locations.chicago.price && locations.chicago.wasPrice > locations.chicago.price && (
                      <del className="text-xs text-white/50 mr-1.5" aria-label="Original price">${locations.chicago.wasPrice}</del>
                    )}
                    {locations.chicago.formattedPrice || (locations.chicago.price ? `$${locations.chicago.price} ${locations.chicago.priceUnit || ""}` : "See price at checkout")}
                  </div>
                  <a
                    href={locations.chicago.bookingUrl}
                    onClick={() => handleBookingClick(locations.chicago!, "Chicago")}
                    className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-pink-500/25 transition hover:from-pink-600 hover:to-purple-700 hover:shadow-pink-500/40 focus:outline-none focus:ring-2 focus:ring-pink-400 shrink-0"
                  >
                    See Chicago Dates →
                  </a>
                </div>
              </div>
            )}

            {/* Eugene Option */}
            {locations.eugene && (
              <div className="rounded-2xl border border-white/15 bg-white/5 p-5 transition hover:border-emerald-500/50 hover:bg-white/10">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                      Eugene, Oregon
                    </span>
                    {preferredCity === "eugene" && (
                      <span className="ml-2 rounded-full border border-emerald-400/40 bg-emerald-500/20 px-2 py-0.5 text-[10px] font-semibold text-emerald-300">
                        Suggested
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-white/60">In-person workshop</span>
                </div>
                <p className="mt-1.5 text-xs text-white/80">
                  {STUDIO_LOCATIONS.eugene.address}
                </p>
                <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="text-sm font-semibold text-amber-300">
                    {locations.eugene.wasPrice && locations.eugene.price && locations.eugene.wasPrice > locations.eugene.price && (
                      <del className="text-xs text-white/50 mr-1.5" aria-label="Original price">${locations.eugene.wasPrice}</del>
                    )}
                    {locations.eugene.formattedPrice || (locations.eugene.price ? `$${locations.eugene.price} ${locations.eugene.priceUnit || ""}` : "See price at checkout")}
                  </div>
                  <a
                    href={locations.eugene.bookingUrl}
                    onClick={() => handleBookingClick(locations.eugene!, "Eugene")}
                    className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 transition hover:from-emerald-600 hover:to-teal-700 hover:shadow-emerald-500/40 focus:outline-none focus:ring-2 focus:ring-emerald-400 shrink-0"
                  >
                    See Eugene Dates →
                  </a>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Single City - Chicago Only */}
        {!isBoth && !hasVariants && hasChicago && locations.chicago && (
          <div className="mt-6 rounded-2xl border border-white/15 bg-white/5 p-6">
            <span className="text-xs font-bold uppercase tracking-wider text-pink-400">
              In-person workshop
            </span>
            <p className="mt-2 text-base font-semibold text-white">
              This workshop takes place in Chicago, Illinois.
            </p>
            <p className="mt-1 text-sm text-white/75">
              {STUDIO_LOCATIONS.chicago.address}
            </p>
            <div className="mt-6 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="text-sm font-semibold text-amber-300">
                  {locations.chicago.wasPrice && locations.chicago.price && locations.chicago.wasPrice > locations.chicago.price && (
                    <del className="text-xs text-white/50 mr-1.5" aria-label="Original price">${locations.chicago.wasPrice}</del>
                  )}
                  {locations.chicago.formattedPrice || (locations.chicago.price ? `$${locations.chicago.price} ${locations.chicago.priceUnit || ""}` : "See price at checkout")}
                </div>
                <a
                  href={locations.chicago.bookingUrl}
                  onClick={() => handleBookingClick(locations.chicago!, "Chicago")}
                  className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-pink-500/25 transition hover:from-pink-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-pink-400 shrink-0"
                >
                  See Chicago Dates →
                </a>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="w-full text-center text-xs text-white/60 underline hover:text-white pt-2"
              >
                ← Return to workshop details
              </button>
            </div>
          </div>
        )}

        {/* Single City - Eugene Only */}
        {!isBoth && !hasVariants && hasEugene && locations.eugene && (
          <div className="mt-6 rounded-2xl border border-white/15 bg-white/5 p-6">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              In-person workshop
            </span>
            <p className="mt-2 text-base font-semibold text-white">
              This workshop takes place in Eugene, Oregon.
            </p>
            <p className="mt-1 text-sm text-white/75">
              {STUDIO_LOCATIONS.eugene.address}
            </p>
            <div className="mt-6 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="text-sm font-semibold text-amber-300">
                  {locations.eugene.wasPrice && locations.eugene.price && locations.eugene.wasPrice > locations.eugene.price && (
                    <del className="text-xs text-white/50 mr-1.5" aria-label="Original price">${locations.eugene.wasPrice}</del>
                  )}
                  {locations.eugene.formattedPrice || (locations.eugene.price ? `$${locations.eugene.price} ${locations.eugene.priceUnit || ""}` : "See price at checkout")}
                </div>
                <a
                  href={locations.eugene.bookingUrl}
                  onClick={() => handleBookingClick(locations.eugene!, "Eugene")}
                  className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 transition hover:from-emerald-600 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-emerald-400 shrink-0"
                >
                  See Eugene Dates →
                </a>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="w-full text-center text-xs text-white/60 underline hover:text-white pt-2"
              >
                ← Return to workshop details
              </button>
            </div>
          </div>
        )}

        {/* Online Workshop Only */}
        {!hasVariants && isOnline && locations.online && (
          <div className="mt-6 rounded-2xl border border-white/15 bg-white/5 p-6">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-400">
              Virtual Studio
            </span>
            <p className="mt-2 text-base font-semibold text-white">
              Live online—join from home
            </p>
            <p className="mt-1 text-sm text-white/75">
              Kit delivered to your door. Join expert-guided interactive session from anywhere.
            </p>
            <div className="mt-6 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="text-sm font-semibold text-amber-300">
                  {locations.online.wasPrice && locations.online.price && locations.online.wasPrice > locations.online.price && (
                    <del className="text-xs text-white/50 mr-1.5" aria-label="Original price">${locations.online.wasPrice}</del>
                  )}
                  {locations.online.formattedPrice || (locations.online.price ? `$${locations.online.price} ${locations.online.priceUnit || ""}` : "See price at checkout")}
                </div>
                <a
                  href={locations.online.bookingUrl}
                  onClick={() => handleBookingClick(locations.online!, "Online")}
                  className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-500/25 transition hover:from-purple-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-purple-400 shrink-0"
                >
                  See Online Dates →
                </a>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="w-full text-center text-xs text-white/60 underline hover:text-white pt-2"
              >
                ← Return to workshop details
              </button>
            </div>
          </div>
        )}

        {/* Safe fallback if neither is available */}
        {!hasVariants && !hasChicago && !hasEugene && !isOnline && (
          <div className="mt-6 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-5 text-center">
            <p className="text-sm font-semibold text-amber-200">
              Booking is not currently available for this workshop.
            </p>
            <p className="mt-1 text-xs text-amber-300/80">
              Check back soon or explore our other available workshops.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-4 rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold text-white hover:bg-white/20"
            >
              Return to browsing
            </button>
          </div>
        )}

        {/* Helper footer */}
        <p className="mt-6 text-center text-xs text-white/50">
          Direct studio booking with zero ticketing fees. Select your studio above to view live dates.
        </p>
      </div>
    </div>
  );
}
