"use client";

import Link from "next/link";
import GlassCard from "@/components/ui/GlassCard";
import Reveal from "@/components/motion/Reveal";
import HeroVideoBackground from "@/components/HeroVideoBackground";
import { useScrollDepth } from "@/lib/analyticsHooks";

// TODO: Replace with your actual Etsy URL when ready
const ETSY_URL = "https://www.etsy.com/shop/ColorCocktailFactory";

const IconClass = () => (
  <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 0 0-5.78 1.128 2.25 2.25 0 0 1-2.4 2.245 4.5 4.5 0 0 0 8.4-2.245c0-.399-.078-.78-.22-1.128Zm0 0a15.998 15.998 0 0 0 3.388-1.62m-5.043-.025a15.994 15.994 0 0 1 1.622-3.395m3.42 3.42a15.995 15.995 0 0 0 4.764-4.648l3.876-5.814a1.151 1.151 0 0 0-1.597-1.597L14.146 6.32a15.996 15.996 0 0 0-4.649 4.763m3.42 3.42a6.776 6.776 0 0 0-3.42-3.42" />
  </svg>
);

const IconEvent = () => (
  <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
  </svg>
);

const IconStore = () => (
  <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
  </svg>
);

const IconContact = () => (
  <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 9.75a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 0 1 .778-.332 48.294 48.294 0 0 0 5.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
  </svg>
);

const CTAS = [
  {
    Icon: IconClass,
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
    Icon: IconEvent,
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
    Icon: IconContact,
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
        {/* Video background */}
        <HeroVideoBackground />
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
                    <div className="flex justify-center mb-5 text-white/80">
                      <cta.Icon />
                    </div>
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
