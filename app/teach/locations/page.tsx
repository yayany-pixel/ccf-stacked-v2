import type { Metadata } from "next";
import GlassCard from "@/components/ui/GlassCard";
import Reveal from "@/components/motion/Reveal";
import ButtonPill from "@/components/ui/ButtonPill";
import TeachCTA from "@/components/teach/TeachCTA";

export const metadata: Metadata = {
  title: "Locations — Teach Anywhere in USA & Canada",
  description: "Color Cocktail Factory's instructor partnership program is available nationwide. Teach wheel-throwing date nights from your own space anywhere in the USA or Canada.",
  alternates: {
    canonical: "https://colorcocktailfactory.com/teach/locations"
  }
};

export default function LocationsPage() {
  const requirements = [
    {
      title: "Your Teaching Space",
      description: "You need a dedicated area where you can host small groups (2-6 people) for 2-hour pottery classes. This could be:",
      examples: [
        "Home studio or garage setup",
        "Dedicated room in your residence",
        "Rented studio space",
        "Shared maker space with booking privileges"
      ]
    },
    {
      title: "Space Must Be",
      description: "We verify your space meets these basic standards:",
      examples: [
        "Clean and professional in appearance",
        "Safe (good ventilation, clear pathways, proper lighting)",
        "Guest-ready (comfortable for date night atmosphere)",
        "Accessible for couples/small groups"
      ]
    },
    {
      title: "Equipment Setup",
      description: "You'll need access to:",
      examples: [
        "2-3 pottery wheels (lease from us or use your own)",
        "Kiln for bisque and glaze firing",
        "Basic pottery tools and workspace",
        "Wedging surface and water source"
      ]
    }
  ];

  const regions = [
    { region: "West Coast", note: "California, Oregon, Washington, Nevada, Arizona" },
    { region: "Midwest", note: "Illinois, Wisconsin, Minnesota, Ohio, Michigan" },
    { region: "East Coast", note: "New York, Massachusetts, Pennsylvania, Virginia, Florida" },
    { region: "South", note: "Texas, Tennessee, North Carolina, Georgia, Louisiana" },
    { region: "Mountain", note: "Colorado, Utah, Montana, Idaho, New Mexico" },
    { region: "Canada", note: "Ontario, British Columbia, Alberta, Quebec" }
  ];

  return (
    <div className="relative">
      <div className="mx-auto max-w-4xl px-4 py-12">
        <h1 className="mb-4 bg-gradient-to-r from-purple-200 via-pink-200 to-cyan-200 bg-clip-text text-4xl font-bold text-transparent md:text-5xl">
          Teach Anywhere
        </h1>
        <p className="mb-12 text-lg text-white/70">
          Our instructor partnership program is available throughout the USA and Canada. 
          Teach wheel-throwing date night classes from your own space.
        </p>
      </div>

      {/* Coverage Map */}
      <section className="mx-auto max-w-5xl px-4 py-12">
        <Reveal>
          <h2 className="mb-8 text-center text-3xl font-bold">Active Regions</h2>
          <p className="mb-8 text-center text-white/60">
            We're accepting instructor partners nationwide. Wherever you are, we can send you bookings.
          </p>
        </Reveal>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {regions.map((area, index) => (
            <Reveal key={area.region} delay={index * 0.1}>
              <GlassCard className="p-4">
                <h3 className="mb-2 font-semibold text-purple-300">{area.region}</h3>
                <p className="text-xs text-white/50">{area.note}</p>
              </GlassCard>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Space Requirements */}
      <section className="mx-auto max-w-6xl px-4 py-12">
        <Reveal>
          <h2 className="mb-8 text-center text-3xl font-bold">Space & Setup Requirements</h2>
        </Reveal>
        <div className="grid gap-8 md:grid-cols-3">
          {requirements.map((req, index) => (
            <Reveal key={req.title} delay={index * 0.1}>
              <GlassCard className="p-6">
                <h3 className="mb-3 text-lg font-semibold text-cyan-300">{req.title}</h3>
                <p className="mb-4 text-sm text-white/70">{req.description}</p>
                <ul className="space-y-2">
                  {req.examples.map((example, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-white/60">
                      <span className="mt-1 text-xs text-pink-400">•</span>
                      <span>{example}</span>
                    </li>
                  ))}
                </ul>
              </GlassCard>
            </Reveal>
          ))}
        </div>
      </section>

      <TeachCTA />
    </div>
  );
}
