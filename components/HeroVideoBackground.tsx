"use client";

import { useEffect, useState } from "react";

export default function HeroVideoBackground() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Check for reduced motion preference
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // Don't render video if user prefers reduced motion
  if (prefersReducedMotion) {
    return null;
  }

  return (
    <>
      {/* Video Background Layer (z-0) */}
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster="/videos/ccf-header-poster.jpg"
        className="absolute inset-0 h-full w-full object-cover"
        aria-hidden="true"
      >
        {/* Prefer WebM for better compression, fallback to MP4 */}
        <source src="/videos/ccf-header.webm" type="video/webm" />
        <source src="/videos/ccf-header.mp4" type="video/mp4" />
      </video>

      {/* Dark Gradient Overlay (z-10) - ensures text legibility */}
      <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/85 via-black/60 to-black/85" />

      {/* Subtle Brand Tint (z-10) - adds warmth without blocking readability */}
      <div className="absolute inset-0 z-10 bg-purple-900/15" />
    </>
  );
}
