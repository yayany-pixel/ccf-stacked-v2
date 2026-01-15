"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import GlassCard from "@/components/ui/GlassCard";
import ButtonPill from "@/components/ui/ButtonPill";
import Reveal from "@/components/motion/Reveal";

type City = "chicago" | "eugene";

interface TopPick {
  label: string;
  href: string;
  icon: string;
}

const cityData = {
  chicago: {
    name: "Chicago",
    subtitle: "Pilsen Neighborhood",
    emoji: "🏙️",
    gradient: "from-purple-500/20 to-pink-500/20",
    description: "Our Pilsen studio sits in Chicago's most vibrant artistic neighborhood—colorful murals, Mexican heritage, and creative energy everywhere. Perfect for date nights, team building, and celebrating with friends.",
    location: "Pilsen, Chicago, IL",
    hours: "Wed-Fri 5:30-9pm, Sat 12-9:30pm, Sun 2:30-6:30pm",
    href: "/chicago",
    topPicks: [
      { label: "Date Night Pottery", href: "/chicago/date-night-wheel", icon: "💕" },
      { label: "Beginner Wheel", href: "/chicago/beginner-wheel", icon: "🎨" },
      { label: "Turkish Lamp", href: "/chicago/turkish-lamp", icon: "✨" },
      { label: "Glass Fusion", href: "/chicago/glass-fusion", icon: "🌈" }
    ]
  },
  eugene: {
    name: "Eugene",
    subtitle: "Oregon",
    emoji: "🌲",
    gradient: "from-green-500/20 to-cyan-500/20",
    description: "Our Eugene studio brings hands-on creativity to Oregon's gem city. Surrounded by nature, university culture, and Pacific Northwest charm. Perfect for couples, groups, and anyone seeking a unique creative escape.",
    location: "Eugene, Oregon",
    hours: "Hours vary by class",
    href: "/eugene",
    topPicks: [
      { label: "Date Night Pottery", href: "/eugene/date-night-wheel", icon: "💕" },
      { label: "Beginner Wheel", href: "/eugene/beginner-wheel", icon: "🎨" },
      { label: "Mosaics", href: "/eugene/mosaic", icon: "🎨" },
      { label: "Glass Fusion", href: "/eugene/glass-fusion", icon: "🌈" }
    ]
  }
};

export default function LocationSelector() {
  const [selectedCity, setSelectedCity] = useState<City>("chicago");
  const [isClient, setIsClient] = useState(false);

  // Handle initial load - check URL params and localStorage
  useEffect(() => {
    setIsClient(true);
    
    // Check URL parameter first
    const params = new URLSearchParams(window.location.search);
    const urlCity = params.get("location");
    if (urlCity === "chicago" || urlCity === "eugene") {
      setSelectedCity(urlCity);
      localStorage.setItem("preferredCity", urlCity);
      return;
    }

    // Fall back to localStorage
    const stored = localStorage.getItem("preferredCity");
    if (stored === "chicago" || stored === "eugene") {
      setSelectedCity(stored);
    }
  }, []);

  // Update localStorage when selection changes
  const handleCityChange = (city: City) => {
    setSelectedCity(city);
    if (isClient) {
      localStorage.setItem("preferredCity", city);
    }
  };

  const currentCity = cityData[selectedCity];

  return (
    <Reveal variant="fade-up">
      <GlassCard className="overflow-hidden">
        {/* City Selector Tabs */}
        <div className="flex border-b border-white/10">
          <button
            onClick={() => handleCityChange("chicago")}
            className={`flex-1 px-6 py-4 text-center font-semibold transition-all ${
              selectedCity === "chicago"
                ? "bg-purple-500/20 text-white border-b-2 border-purple-400"
                : "text-white/60 hover:text-white/80 hover:bg-white/5"
            }`}
            role="tab"
            aria-selected={selectedCity === "chicago"}
            aria-controls="city-content"
          >
            🏙️ Chicago
          </button>
          <button
            onClick={() => handleCityChange("eugene")}
            className={`flex-1 px-6 py-4 text-center font-semibold transition-all ${
              selectedCity === "eugene"
                ? "bg-green-500/20 text-white border-b-2 border-green-400"
                : "text-white/60 hover:text-white/80 hover:bg-white/5"
            }`}
            role="tab"
            aria-selected={selectedCity === "eugene"}
            aria-controls="city-content"
          >
            🌲 Eugene
          </button>
        </div>

        {/* City Content */}
        <div id="city-content" role="tabpanel" aria-live="polite">
          {/* Header Banner */}
          <div className={`relative h-48 overflow-hidden bg-gradient-to-br ${currentCity.gradient}`}>
            <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20" />
            <div className="relative z-10 flex h-full flex-col items-center justify-center p-8 text-center">
              <div className="text-5xl">{currentCity.emoji}</div>
              <h2 className="mt-3 font-serif text-3xl font-bold">{currentCity.name}</h2>
              <p className="mt-1 text-base text-white/80">{currentCity.subtitle}</p>
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            <p className="leading-relaxed text-white/75 text-base">
              {currentCity.description}
            </p>

            {/* Primary CTA */}
            <div className="mt-6">
              <ButtonPill href={currentCity.href} variant="primary" full>
                View {currentCity.name} Classes →
              </ButtonPill>
            </div>

            {/* Secondary Actions */}
            <div className="mt-4 flex flex-wrap gap-3">
              <ButtonPill href="/private-events" variant="secondary">
                Private Events
              </ButtonPill>
              <ButtonPill href="/gift-cards" variant="ghost">
                Gift Cards
              </ButtonPill>
            </div>

            {/* Top Picks */}
            <div className="mt-8 border-t border-white/10 pt-6">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-white/70">
                Popular in {currentCity.name}
              </h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {currentCity.topPicks.map((pick) => (
                  <Link
                    key={pick.href}
                    href={pick.href}
                    className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm transition hover:bg-white/10 hover:border-white/20"
                  >
                    <span>{pick.icon}</span>
                    <span className="text-white/75 hover:text-white">{pick.label}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Location Info */}
            <div className="mt-6 text-xs text-white/60">
              <p>📍 {currentCity.location}</p>
              <p className="mt-1">⏰ {currentCity.hours}</p>
            </div>
          </div>
        </div>
      </GlassCard>
    </Reveal>
  );
}
