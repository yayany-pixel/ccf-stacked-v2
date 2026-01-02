"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

interface PrivatePartyCTAProps {
  variant?: "header" | "footer" | "sticky";
  className?: string;
}

/**
 * Global Private Party Request CTA
 * Tracks clicks via Google Analytics if available
 */
export default function PrivatePartyCTA({ variant = "header", className = "" }: PrivatePartyCTAProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (variant === "sticky") {
      // Show sticky button after scrolling 100px
      const handleScroll = () => {
        setIsVisible(window.scrollY > 100);
      };
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    } else {
      setIsVisible(true);
    }
  }, [variant]);

  const handleClick = () => {
    // Track with GA4 if available
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("event", "private_party_cta_click", {
        page_path: window.location.pathname,
        placement: variant,
      });
    }
  };

  if (!isVisible) return null;

  // Header variant (compact)
  if (variant === "header") {
    return (
      <Link
        href="/private-events"
        onClick={handleClick}
        className={`inline-flex items-center gap-2 rounded-full border border-purple-400/30 bg-purple-500/10 px-4 py-2 text-sm font-semibold text-purple-300 transition hover:bg-purple-500/20 ${className}`}
        aria-label="Request a private party"
      >
        <span className="hidden sm:inline">🎉</span>
        <span>Private Party</span>
      </Link>
    );
  }

  // Footer variant (prominent)
  if (variant === "footer") {
    return (
      <div className={`text-center ${className}`}>
        <Link
          href="/private-events"
          onClick={handleClick}
          className="inline-flex items-center gap-3 rounded-2xl border border-purple-400/30 bg-gradient-to-r from-purple-500/20 to-pink-500/20 px-8 py-4 text-lg font-bold transition hover:scale-105 hover:border-purple-400/50"
          aria-label="Request a private party quote"
        >
          <span className="text-2xl">🎉</span>
          <span>Plan Your Private Event →</span>
        </Link>
        <p className="mt-3 text-sm text-white/60">
          Team building • Birthdays • Bachelorettes • Corporate events
        </p>
      </div>
    );
  }

  // Sticky mobile button (bottom-right)
  if (variant === "sticky") {
    return (
      <div
        className={`fixed bottom-6 right-6 z-40 animate-bounce ${className}`}
        style={{ animation: "bounce 2s infinite" }}
      >
        <Link
          href="/private-events"
          onClick={handleClick}
          className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-purple-400/50 bg-gradient-to-br from-purple-600 to-pink-600 text-2xl shadow-2xl transition hover:scale-110 sm:h-auto sm:w-auto sm:gap-2 sm:px-6 sm:py-3"
          aria-label="Request a private party"
        >
          <span>🎉</span>
          <span className="hidden text-sm font-bold sm:inline">Private Party</span>
        </Link>
      </div>
    );
  }

  return null;
}
