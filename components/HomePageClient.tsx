"use client";

import Link from "next/link";
import GlassCard from "@/components/ui/GlassCard";
import Reveal from "@/components/motion/Reveal";
import { useScrollDepth } from "@/lib/analyticsHooks";

// TODO: Replace with your actual Etsy URL when ready
const ETSY_URL = "https://www.etsy.com/shop/ColorCocktailFactory";

const CTAS = [
  {
    icon: "🎨",
    title: "Book a Class",
    description: "Pottery, glass fusion, mosaics & more. Pick your date and reserve your spot.",
    label: "See All Classes",
    href: "https://colorcocktailfactory.as.me/",
    gradientBg: "from-purple-500/20 to-indigo-500/20",
    hoverBorder: "hover:border-purple-400/60",
    buttonClass: "bg-gradient-to-r from-purple-500 to-indigo-500",
    shadow: "group-hover:shadow-purple-500/30",
  },
  {
    icon: "🎉",
    title: "Book a Private Event",
    description: "Birthdays, bachelorettes, corporate team-building — exclusive studio time for your group.",
    label: "Get a Quote",
    href: "/private-events",
    gradientBg: "from-pink-500/20 to-rose-500/20",
    hoverBorder: "hover:border-pink-400/60",
    buttonClass: "bg-gradient-to-r from-pink-500 to-rose-500",
    shadow: "group-hover:shadow-pink-500/30",
  },
  {
    icon: "🛍️",
    title: "Visit Our Online Store",
    description: "Shop handcrafted ceramics, art kits, and unique gifts made with love.",
    label: "Shop on Etsy",
    href: ETSY_URL,
    gradientBg: "from-amber-500/20 to-orange-500/20",
    hoverBorder: "hover:border-amber-400/60",
    buttonClass: "bg-gradient-to-r from-amber-500 to-orange-500",
    shadow: "group-hover:shadow-amber-500/30",
  },
  {
    icon: "💌",
    title: "Contact Us",
    description: "Questions? Ideas? Slide into our DMs — we're always happy to help.",
    label: "DM Us on Instagram",
    href: "https://www.instagram.com/colorcocktailfactory",
    gradientBg: "from-cyan-500/20 to-teal-500/20",
    hoverBorder: "hover:border-cyan-400/60",
    buttonClass: "bg-gradient-to-r from-cyan-500 to-teal-500",
    shadow: "group-hover:shadow-cyan-500/30",
  },
];

export default function HomePageClient() {
  useScrollDepth();

  return (
    <main id="main-content">
      {/* Full-screen CTA Hero */}
      <section className="gradient-breathing relative min-h-screen overflow-hidden bg-gradient-to-br from-indigo-900/40 via-purple-900/50 to-pink-900/40 flex flex-col items-center justify-center px-6 py-24">
        <div className="sparkle-noise absolute inset-0 bg-[url('/noise.png')] opacity-20" />

        <div className="relative z-10 mx-auto max-w-6xl w-full">
          {/* Brand Header */}
          <div className="text-center mb-16">
            <Reveal variant="scale">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold backdrop-blur-xl pulse-glow mb-6">
                Creativity is shareable.
              </div>
            </Reveal>

            <Reveal delay={100} variant="fade-up">
              <h1 className="font-serif text-5xl font-light leading-tight tracking-wide sm:text-7xl">
                Color Cocktail Factory
              </h1>
            </Reveal>

            <Reveal delay={200} variant="fade-up">
              <p className="mt-4 text-lg text-white/70 max-w-xl mx-auto">
                Expert-led pottery, glass art & mosaics in Chicago & Eugene. What are you here for?
              </p>
            </Reveal>
          </div>

          {/* 4 CTA Cards */}
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {CTAS.map((cta, i) => (
              <Reveal key={cta.title} variant="fade-up" delay={i * 80}>
                <Link
                  href={cta.href}
                  {...(cta.href.startsWith("http")
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                  className="group block h-full"
                >
                  <GlassCard
                    interactive
                    className={`h-full p-8 text-center transition-all duration-300 bg-gradient-to-br ${cta.gradientBg} ${cta.hoverBorder}`}
                  >
                    <div className="text-5xl mb-5">{cta.icon}</div>
                    <h2 className="text-xl font-bold mb-3 text-white">{cta.title}</h2>
                    <p className="text-sm text-white/70 mb-8 leading-relaxed">{cta.description}</p>
                    <span
                      className={`inline-block ${cta.buttonClass} text-white text-sm font-semibold px-5 py-2.5 rounded-full shadow-lg ${cta.shadow} transition-all duration-300 group-hover:shadow-xl group-hover:scale-105`}
                    >
                      {cta.label} →
                    </span>
                  </GlassCard>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
