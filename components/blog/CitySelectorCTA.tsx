"use client";

import { useState } from "react";
import Link from "next/link";
import ButtonPill from "@/components/ui/ButtonPill";
import GlassCard from "@/components/ui/GlassCard";
import Reveal from "@/components/motion/Reveal";

type City = "chicago" | "eugene";

export default function CitySelectorCTA() {
  const [selectedCity, setSelectedCity] = useState<City | null>(null);

  const getCityBookingLinks = (city: City) => {
    const base = city === "chicago" 
      ? "https://www.rezclick.com/colorcocktailfactory/index.php?page=calendar&term="
      : "https://colorcocktailfactoryoregon.rezclick.com/index.php?page=calendar&term=";
    
    return {
      pottery: `${base}pottery`,
      mosaic: `${base}mosaic`,
      bonsai: `${base}bonsai`,
      cityPage: `/${city}`
    };
  };

  const links = selectedCity ? getCityBookingLinks(selectedCity) : null;

  return (
    <Reveal variant="fade-up" delay={200}>
      <GlassCard className="mt-8">
        <div className="p-6 md:p-8">
          <h3 className="text-center font-serif text-2xl font-bold">Choose Your City & Book a Class</h3>
          <p className="mt-2 text-center text-white/70">
            Select your location to see available workshops
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button
              onClick={() => setSelectedCity("chicago")}
              className={`rounded-full border-2 px-6 py-3 font-semibold transition-all ${
                selectedCity === "chicago"
                  ? "border-purple-400 bg-purple-500/20 text-purple-200 shadow-lg shadow-purple-500/30"
                  : "border-white/20 bg-white/5 text-white/80 hover:border-white/40 hover:bg-white/10"
              }`}
            >
              Chicago, IL
            </button>
            <button
              onClick={() => setSelectedCity("eugene")}
              className={`rounded-full border-2 px-6 py-3 font-semibold transition-all ${
                selectedCity === "eugene"
                  ? "border-cyan-400 bg-cyan-500/20 text-cyan-200 shadow-lg shadow-cyan-500/30"
                  : "border-white/20 bg-white/5 text-white/80 hover:border-white/40 hover:bg-white/10"
              }`}
            >
              Eugene, OR
            </button>
          </div>

          {links && (
            <div className="mt-6 space-y-3">
              <div className="grid gap-3 sm:grid-cols-3">
                <ButtonPill 
                  href={links.pottery}
                  variant="romanceCta"
                  className="w-full text-center"
                >
                  Book Pottery
                </ButtonPill>
                <ButtonPill 
                  href={links.mosaic}
                  variant="romanceCta"
                  className="w-full text-center"
                >
                  Book Mosaic
                </ButtonPill>
                <ButtonPill 
                  href={links.bonsai}
                  variant="romanceCta"
                  className="w-full text-center"
                >
                  Book Bonsai
                </ButtonPill>
              </div>
              <div className="text-center">
                <Link 
                  href={links.cityPage}
                  className="text-sm text-purple-300 hover:text-purple-200 hover:underline"
                >
                  View all {selectedCity === "chicago" ? "Chicago" : "Eugene"} classes →
                </Link>
              </div>
            </div>
          )}

          <div className="mt-6 flex flex-wrap justify-center gap-4 border-t border-white/10 pt-6 text-sm text-white/60">
            <div className="flex items-center gap-2">
              <svg className="h-4 w-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Beginner-friendly</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="h-4 w-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>All materials included</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="h-4 w-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Take-home piece options</span>
            </div>
          </div>
        </div>
      </GlassCard>
    </Reveal>
  );
}
