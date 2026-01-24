"use client";

import { useState, useEffect } from "react";
import { getPromoStatus, type PromoStatus } from "@/lib/pricingWindow";

export default function PricingDisplay({ variant = "full" }: { variant?: "full" | "compact" }) {
  const [status, setStatus] = useState<PromoStatus | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Initial load
    setStatus(getPromoStatus());

    // Update every 60 seconds
    const interval = setInterval(() => {
      setStatus(getPromoStatus());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  // Prevent SSR mismatch - show loading state until client hydrated
  if (!mounted || !status) {
    return (
      <div className="rounded-2xl border border-white/20 bg-gradient-to-br from-purple-900/40 to-pink-900/40 p-8 backdrop-blur-sm">
        <div className="text-center">
          <div className="h-8 w-32 mx-auto bg-white/10 rounded animate-pulse mb-4" />
          <div className="h-12 w-48 mx-auto bg-white/10 rounded animate-pulse" />
        </div>
      </div>
    );
  }

  if (variant === "compact") {
    return (
      <div className="inline-flex items-center gap-3">
        <div className="rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-3 py-1 text-sm font-semibold text-white shadow-lg">
          {status.isPromo ? "Weekend Deal" : "Regular Price"}
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-white">${status.price}</span>
          {status.isPromo && (
            <span className="text-lg text-white/60 line-through">${status.regularPrice}</span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/20 bg-gradient-to-br from-purple-900/40 to-pink-900/40 p-8 backdrop-blur-sm">
      {/* Badge */}
      <div className="mb-4 flex items-center justify-center">
        <div className={`rounded-full px-4 py-2 text-sm font-semibold shadow-lg ${
          status.isPromo 
            ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white" 
            : "bg-white/10 text-white/80"
        }`}>
          {status.isPromo ? "Weekend Deal" : "Regular Price"}
        </div>
      </div>

      {/* Price */}
      <div className="mb-6 text-center">
        <div className="flex items-baseline justify-center gap-3">
          <span className="font-serif text-5xl font-bold text-white">
            ${status.price}
          </span>
          {status.isPromo && (
            <span className="text-2xl text-white/50 line-through">
              ${status.regularPrice}
            </span>
          )}
        </div>
        <div className="mt-2 text-sm text-white/70">
          One-time payment • Includes free wheel & kit
        </div>
      </div>

      {/* Countdown / Deadline */}
      <div className="space-y-2 border-t border-white/10 pt-4">
        {status.isPromo ? (
          <>
            <div className="text-center text-sm font-semibold text-white/90">
              Deal ends Sunday at 11:59 PM CT
            </div>
            {status.hoursRemaining && (
              <div className="text-center">
                <span className="inline-flex items-center gap-2 rounded-full bg-red-500/20 px-3 py-1 text-sm font-medium text-red-200">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Ends in {status.hoursRemaining} {status.hoursRemaining === 1 ? "hour" : "hours"}
                </span>
              </div>
            )}
          </>
        ) : (
          <>
            <div className="text-center text-sm text-white/70">
              Next Weekend Deal starts Friday at 9:00 AM CT
            </div>
            {status.hoursUntilStart && (
              <div className="text-center text-xs text-white/50">
                Starts in {status.hoursUntilStart} {status.hoursUntilStart === 1 ? "hour" : "hours"}
              </div>
            )}
          </>
        )}
      </div>

      {/* CTA */}
      <div className="mt-6">
        <a
          href="https://app.acuityscheduling.com/catalog.php?owner=35932879&category=3-Month+Pottery+Membership"
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-8 py-4 text-center font-serif text-lg font-semibold text-white shadow-lg shadow-purple-500/50 transition-all hover:scale-105 hover:shadow-xl hover:shadow-purple-500/60"
        >
          Enroll Now • ${status.price}
        </a>
      </div>
    </div>
  );
}
