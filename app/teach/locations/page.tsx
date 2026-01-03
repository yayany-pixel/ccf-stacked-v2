import type { Metadata } from "next";
import GlassCard from "@/components/ui/GlassCard";
import Reveal from "@/components/motion/Reveal";
import ButtonPill from "@/components/ui/ButtonPill";
import TeachCTA from "@/components/teach/TeachCTA";

export const metadata: Metadata = {
  title: "Locations — Teach in Chicago or Eugene",
  description: "Color Cocktail Factory has studios in Chicago's Pilsen neighborhood and downtown Eugene, Oregon. Explore instructor opportunities at both locations.",
  alternates: {
    canonical: "https://colorcocktailfactory.com/teach/locations"
  }
};

export default function LocationsPage() {
  const locations = [
    {
      city: "Chicago",
      neighborhood: "Pilsen",
      address: "1824 S Halsted St, Chicago, IL 60608",
      description: "Our flagship studio in the heart of Chicago's vibrant arts district. 3,500 sq ft of creative space with 12 pottery wheels, kiln room, and dedicated areas for glass fusion, mosaics, and mixed media.",
      features: [
        "12 pottery wheels + hand-building stations",
        "Electric kilns for ceramics and glass",
        "Separate mosaic workshop area",
        "BYOB-friendly lounge space",
        "Street parking + public transit access"
      ],
      currentOpenings: ["Pottery Lead Instructor", "Glass Fusion Instructor", "Weekend Assistant"],
      vibe: "Urban, diverse, high-energy. We serve everyone from first-date couples to Fortune 500 team-building groups."
    },
    {
      city: "Eugene",
      neighborhood: "Downtown",
      address: "123 Main St, Eugene, OR 97401",
      description: "Our cozy Eugene studio brings creative workshops to the Pacific Northwest. 2,000 sq ft with a focus on pottery and nature-inspired crafts.",
      features: [
        "8 pottery wheels in intimate setting",
        "Outdoor workspace for seasonal workshops",
        "Bonsai and terrarium area",
        "Local artist collaborations",
        "Bike-friendly location"
      ],
      currentOpenings: ["Multi-Medium Instructor", "Assistant Instructor"],
      vibe: "Relaxed, community-focused, eco-conscious. Expect college students, families, and creative retirees."
    }
  ];

  return (
    <div className="relative">
      <div className="mx-auto max-w-4xl px-4 py-12">
        <h1 className="mb-4 bg-gradient-to-r from-purple-200 via-pink-200 to-cyan-200 bg-clip-text text-4xl font-bold text-transparent md:text-5xl">
          Teaching Locations
        </h1>
        <p className="mb-12 text-lg text-white/70">
          We operate creative studios in two amazing cities. Choose the location that fits your life.
        </p>
      </div>

      {/* Locations */}
      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-12 lg:grid-cols-2">
          {locations.map((loc, index) => (
            <Reveal key={loc.city} delay={index * 0.2}>
              <GlassCard className="p-8">
                <div className="mb-4 flex items-baseline justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">{loc.city}</h2>
                    <p className="text-sm text-white/60">{loc.neighborhood}</p>
                  </div>
                  <span className="rounded-full bg-purple-500/20 px-3 py-1 text-xs font-semibold text-purple-300">
                    {loc.currentOpenings.length} opening{loc.currentOpenings.length !== 1 ? 's' : ''}
                  </span>
                </div>

                <p className="mb-4 text-sm text-white/50">{loc.address}</p>
                <p className="mb-6 text-white/80">{loc.description}</p>

                <div className="mb-6">
                  <h3 className="mb-3 text-sm font-semibold text-pink-300">Studio Features</h3>
                  <ul className="space-y-2">
                    {loc.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-white/70">
                        <span className="mt-1 text-cyan-400">•</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mb-6">
                  <h3 className="mb-3 text-sm font-semibold text-purple-300">Current Openings</h3>
                  <ul className="space-y-2">
                    {loc.currentOpenings.map((role, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-white/80">
                        <span className="text-pink-400">✓</span>
                        <span>{role}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-lg bg-black/30 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-white/50">The Vibe</p>
                  <p className="mt-1 text-sm text-white/70">{loc.vibe}</p>
                </div>
              </GlassCard>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Multi-Location Benefits */}
      <section className="mx-auto max-w-4xl px-4 py-12">
        <Reveal>
          <GlassCard className="bg-gradient-to-br from-cyan-500/10 to-purple-500/10 p-8">
            <h2 className="mb-4 text-2xl font-bold">Work at Both Locations</h2>
            <p className="mb-4 text-white/80">
              Many of our instructors teach at both studios. If you're willing to travel or split time between cities, 
              you'll have access to more shifts and broader teaching opportunities.
            </p>
            <p className="text-sm text-white/60">
              We cover travel expenses for instructors who teach at both locations on the same day.
            </p>
          </GlassCard>
        </Reveal>
      </section>

      <TeachCTA />
    </div>
  );
}
