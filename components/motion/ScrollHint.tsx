"use client";

import { useEffect, useState } from "react";

/**
 * Gentle scroll hint that bobs at the bottom of the hero
 * Fades out when user starts scrolling
 * Respects prefers-reduced-motion
 */
export default function ScrollHint() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      setIsVisible(false);
      return;
    }

    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="pointer-events-none fixed bottom-8 left-1/2 z-40 -translate-x-1/2">
      <div className="scroll-hint-bob flex flex-col items-center gap-2 opacity-60">
        <span className="text-xs font-medium uppercase tracking-wider text-white/70">
          Explore
        </span>
        <svg
          className="h-6 w-6 text-white/70"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </div>
    </div>
  );
}
