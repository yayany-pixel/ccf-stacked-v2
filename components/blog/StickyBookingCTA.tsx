"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function StickyBookingCTA() {
  const [isVisible, setIsVisible] = useState(false);
  const [selectedCity, setSelectedCity] = useState<"chicago" | "eugene">("chicago");

  useEffect(() => {
    const handleScroll = () => {
      // Show sticky CTA after scrolling 600px
      setIsVisible(window.scrollY > 600);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!isVisible) return null;

  const bookingUrl = selectedCity === "chicago"
    ? "https://www.rezclick.com/colorcocktailfactory/index.php?page=calendar"
    : "https://colorcocktailfactoryoregon.rezclick.com/index.php?page=calendar";

  return (
    <div className="fixed bottom-4 right-4 z-40 hidden md:block">
      <div className="shimmer-drift rounded-2xl border border-white/10 bg-gradient-to-br from-purple-900/95 via-pink-900/95 to-purple-900/95 p-4 shadow-2xl shadow-purple-500/30 backdrop-blur-xl">
        <div className="text-xs font-semibold uppercase tracking-wide text-white/60">Book a Class</div>
        <div className="mt-2 flex gap-2">
          <button
            onClick={() => setSelectedCity("chicago")}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-all ${
              selectedCity === "chicago"
                ? "bg-purple-500 text-white shadow-lg shadow-purple-500/50"
                : "bg-white/10 text-white/70 hover:bg-white/20"
            }`}
          >
            Chicago
          </button>
          <button
            onClick={() => setSelectedCity("eugene")}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-all ${
              selectedCity === "eugene"
                ? "bg-cyan-500 text-white shadow-lg shadow-cyan-500/50"
                : "bg-white/10 text-white/70 hover:bg-white/20"
            }`}
          >
            Eugene
          </button>
        </div>
        <Link
          href={bookingUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 block rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-2 text-center text-sm font-semibold text-white shadow-lg shadow-purple-500/50 transition-all hover:shadow-xl hover:shadow-purple-500/60"
        >
          View Calendar
        </Link>
      </div>
    </div>
  );
}
