"use client";

import Link from "next/link";
import GlassCard from "@/components/ui/GlassCard";
import ButtonPill from "@/components/ui/ButtonPill";
import Reveal from "@/components/motion/Reveal";
import LocationSelector from "@/components/LocationSelector";
import { CROStack } from "@/components/CROHelpers";
import { useABTest } from "@/lib/ab-testing";
import { useScrollDepth, useSectionVisibility } from "@/lib/analyticsHooks";

/**
 * Homepage Client Component
 * Week 2: Includes A/B testing, CRO helpers, and analytics tracking
 */
export default function HomePageClient() {
  // Week 2: A/B test on hero subheading
  const heroSubheadingVariant = useABTest('hero_subheading_test');
  
  // Week 2: Scroll depth tracking
  useScrollDepth();
  
  // Week 2: Section visibility tracking
  const heroRef = useSectionVisibility('Homepage Hero');
  const groupsRef = useSectionVisibility('Groups Section');
  const whyUsRef = useSectionVisibility('Why Us Section');

  return (
    <main id="main-content" className="min-h-screen">
      {/* Hero Section */}
      <section 
        ref={heroRef}
        className="gradient-breathing relative overflow-hidden bg-gradient-to-br from-indigo-900/40 via-purple-900/50 to-pink-900/40"
      >
        <div className="sparkle-noise absolute inset-0 bg-[url('/noise.png')] opacity-20" />
        
        <div className="relative z-10 mx-auto max-w-7xl px-6 py-24 sm:py-32">
          <div className="mx-auto max-w-4xl text-center">
            <Reveal variant="scale">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold backdrop-blur-xl pulse-glow">
                Creativity is shareable.
              </div>
            </Reveal>

            <Reveal delay={100} variant="fade-up">
              <h1 className="mt-6 font-serif text-5xl font-light leading-relaxed tracking-wide sm:text-7xl sm:leading-relaxed" style={{ letterSpacing: '0.05em' }}>
                Choose Your
                <br />
                <span className="italic font-normal">Location</span>
              </h1>
            </Reveal>

            <Reveal delay={200}>
              {/* Week 2: A/B Test - Hero Subheading */}
              {heroSubheadingVariant === 'A' ? (
                // Control (Original)
                <p className="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-white/85 sm:text-xl">
                  Expert-guided pottery, glass fusion, mosaics, and more. We bring people together through creativity in Chicago's Pilsen neighborhood and Eugene, Oregon. BYOB-friendly, beginner-friendly, memory-making experiences.
                </p>
              ) : (
                // Variant B (More action-oriented)
                <p className="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-white/85 sm:text-xl">
                  Book hands-on pottery, glass fusion, mosaics, and more today. Create something amazing at our Chicago (Pilsen) or Eugene studios. BYOB-friendly, beginner-friendly, unforgettable experiences.
                </p>
              )}
            </Reveal>

            {/* Week 2: CRO Stack (Urgency + Social Proof) */}
            <Reveal delay={300}>
              <div className="mt-6 flex flex-col items-center gap-3">
                <CROStack 
                  urgencyMessage="Limited spots available this week"
                  socialProofCount="23 people"
                  socialProofTimeframe="in the last 48 hours"
                  className="items-center"
                />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Location Selector Section (now includes videos) */}
      <section className="py-20">
        <div className="mx-auto max-w-3xl px-6">
          <LocationSelector />
        </div>
      </section>

      {/* Group Events Section */}
      <section 
        ref={groupsRef}
        id="groups-section" 
        className="bg-gradient-to-br from-pink-900/20 to-purple-900/20 py-20"
      >
        <div className="mx-auto max-w-7xl px-6">
          <Reveal variant="fade-up">
            <div className="text-center mb-12">
              <h2 className="font-serif text-4xl font-bold">Perfect for Groups & Celebrations</h2>
              <p className="mt-4 text-lg text-white/80 max-w-3xl mx-auto">
                Looking to celebrate with friends, colleagues, or your team? We specialize in unforgettable group experiences!
              </p>
            </div>
          </Reveal>

          <div className="grid gap-8 md:grid-cols-3">
            <Reveal variant="fade-up" delay={100}>
              <GlassCard className="h-full p-8 text-center hover:border-purple-400/50 transition-all">
                <div className="text-5xl mb-4">🤝</div>
                <h3 className="text-2xl font-bold mb-3">Team Building</h3>
                <p className="text-white/75 mb-6 leading-relaxed">
                  Strengthen your team through creative collaboration. Perfect for corporate groups, small businesses, and remote teams looking to connect IRL.
                </p>
                <ButtonPill href="/team-building" variant="secondary" full>
                  Learn More →
                </ButtonPill>
              </GlassCard>
            </Reveal>

            <Reveal variant="fade-up" delay={200}>
              <GlassCard className="h-full p-8 text-center hover:border-pink-400/50 transition-all">
                <div className="text-5xl mb-4">🎂</div>
                <h3 className="text-2xl font-bold mb-3">Birthday Parties</h3>
                <p className="text-white/75 mb-6 leading-relaxed">
                  Make birthdays unforgettable! Hands-on workshops for kids, teens, and adults. BYOB friendly with take-home art for everyone.
                </p>
                <ButtonPill href="/birthday-parties" variant="secondary" full>
                  Plan Your Party →
                </ButtonPill>
              </GlassCard>
            </Reveal>

            <Reveal variant="fade-up" delay={300}>
              <GlassCard className="h-full p-8 text-center hover:border-purple-400/50 transition-all">
                <div className="text-5xl mb-4">💍</div>
                <h3 className="text-2xl font-bold mb-3">Bachelorette Parties</h3>
                <p className="text-white/75 mb-6 leading-relaxed">
                  Skip the typical bar crawl! Create something meaningful together. Instagram-worthy, BYOB, and way more memorable.
                </p>
                <ButtonPill href="/bachelorette-parties" variant="secondary" full>
                  Book Bachelorette →
                </ButtonPill>
              </GlassCard>
            </Reveal>
          </div>

          <Reveal variant="fade-up" delay={400}>
            <div className="text-center mt-12">
              <Link 
                href="/private-events"
                className="inline-block bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-full font-bold text-lg hover:shadow-xl transition-all transform hover:scale-105"
              >
                Request a Private Event Quote
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Why We're Different */}
      <section 
        ref={whyUsRef}
        className="border-y border-white/10 bg-gradient-to-br from-purple-900/20 to-pink-900/20 py-20"
      >
        <div className="mx-auto max-w-4xl px-6">
          <Reveal variant="fade-up">
            <div className="text-center">
              <h2 className="font-serif text-4xl font-bold">Why Color Cocktail Factory?</h2>
              <div className="mx-auto mt-8 max-w-3xl space-y-6 text-lg leading-relaxed text-white/80">
                <p>
                  Since 2009, we've welcomed over 150,000 guests into our studios to create, connect, and have fun. We're more than just a workshop—we're a creative community.
                </p>
                <ul className="space-y-3 text-left">
                  <li className="flex items-start gap-3">
                    <span className="text-2xl">✓</span>
                    <span><strong>Expert instructors</strong> who make every technique approachable and fun</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-2xl">✓</span>
                    <span><strong>All skill levels welcome</strong> — seriously, no experience needed</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-2xl">✓</span>
                    <span><strong>BYOB & social</strong> — bring your favorite beverages and make memories</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-2xl">✓</span>
                    <span><strong>Take home your art</strong> — fired, finished, and ready to display</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-2xl">✓</span>
                    <span><strong>Private events available</strong> — groups of 8+ get exclusive studio time</span>
                  </li>
                </ul>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Gift Cards Section */}
      <section className="py-20 bg-gradient-to-br from-indigo-900/20 via-purple-900/20 to-pink-900/20">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <Reveal variant="fade-up">
            <h2 className="font-serif text-4xl font-bold">Give the Gift of Creativity</h2>
            <p className="mt-4 text-lg text-white/80 max-w-2xl mx-auto">
              Not sure which class to book? Gift cards are available and work for any workshop at both our Chicago and Eugene locations.
            </p>
            <div className="mt-8">
              <ButtonPill href="/gift-cards" variant="primary" className="text-lg px-8 py-4">
                Purchase Gift Card →
              </ButtonPill>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
