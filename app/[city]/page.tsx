import StackedSection from "@/components/StackedSection";
import GlassCard from "@/components/ui/GlassCard";
import ButtonPill from "@/components/ui/ButtonPill";
import Reveal from "@/components/motion/Reveal";
import ScrollHint from "@/components/motion/ScrollHint";
import HeroVideoBackground from "@/components/HeroVideoBackground";
import Testimonials from "@/components/Testimonials";
import { sections } from "@/lib/config";
import { eugeneSections } from "@/lib/eugene-config";
import { chicagoSections } from "@/lib/chicago-config";
import { getCityByParam, buildHomeBookLink } from "@/lib/links";
import { STUDIO_LOCATIONS } from "@/lib/locations";
import { generateLocalBusinessSchema, generateOrganizationSchema, generateBreadcrumbSchema } from "@/lib/enhancedStructuredData";
import type { Metadata } from "next";
import { buildCityMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return [{ city: "chicago" }, { city: "eugene" }];
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: { city: string } }): Promise<Metadata> {
  const city = getCityByParam(params.city);
  return buildCityMetadata(city);
}

export default function CityHome({ params }: { params: { city: string } }) {
  const city = getCityByParam(params.city);
  const studio = city.param === "eugene" ? STUDIO_LOCATIONS.eugene : STUDIO_LOCATIONS.chicago;
  
  // Use city-specific sections for Eugene and Chicago, fallback to regular sections
  const citySections = city.param === 'eugene' ? eugeneSections : 
                       city.param === 'chicago' ? chicagoSections : 
                       sections;
  
  // Generate structured data for this city
  const localBusinessSchema = generateLocalBusinessSchema(city);
  const organizationSchema = generateOrganizationSchema();
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "https://colorcocktailfactory.com" },
    { name: city.label, url: `https://colorcocktailfactory.com/${city.param}` }
  ]);

  return (
    <main id="main-content" tabIndex={-1} className="min-h-screen">
      {/* JSON-LD Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      
      {/* Hero Section */}
      <section className="gradient-breathing relative flex min-h-[85vh] items-center overflow-hidden bg-gradient-to-br from-indigo-900/40 via-purple-900/50 to-pink-900/40 pt-24 sm:pt-28">
        {/* Video Background + Overlays */}
        <HeroVideoBackground />
        
        {/* Fallback layers */}
        <div className="sparkle-noise absolute inset-0 z-10" />
        
        {/* Gradient overlay */}
        <div 
          className="absolute inset-0 z-10 opacity-50"
          style={{
            background: `
              radial-gradient(ellipse at top left, hsl(280 70% 40%) 0%, transparent 50%),
              radial-gradient(ellipse at top right, hsl(189 85% 40%) 0%, transparent 50%),
              radial-gradient(ellipse at bottom, hsl(330 80% 40%) 0%, transparent 60%)
            `,
            animation: 'gradientShift 20s ease infinite',
            backgroundSize: '200% 200%'
          }}
        />
        
        <div className="relative z-20 mx-auto w-full max-w-7xl px-6 py-16 sm:py-20">
          <div className="mx-auto max-w-4xl text-center">
            {/* Studio Badge */}
            <Reveal delay={100} variant="fade-up">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-pink-200 backdrop-blur-sm">
                <span>📍</span>
                <span>{city.label} Studio · {city.param === 'chicago' ? 'Pilsen Art District' : 'Cross Street Studio'}</span>
              </div>
            </Reveal>

            <Reveal delay={200} variant="fade-up">
              <h1 className="mt-4 font-serif text-5xl font-light leading-tight tracking-wide sm:text-7xl">
                Where Creativity
                <br />
                <span className="italic font-normal">Takes Shape in {city.label}</span>
              </h1>
            </Reveal>

            <Reveal delay={300}>
              <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/85 sm:text-xl">
                Expert-guided pottery wheel throwing, date night workshops, Turkish lamps, and handmade art. 
                All skill levels welcome in our welcoming, BYOB-friendly {city.label} studio.
              </p>
            </Reveal>

            <Reveal delay={400} variant="scale">
              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                <ButtonPill href={buildHomeBookLink(city)} variant="primary" className="px-8 py-3.5 text-base">
                  Book a Class in {city.label} →
                </ButtonPill>
                <ButtonPill href="/private-events" variant="secondary" className="px-6 py-3.5 text-base">
                  Group &amp; Private Parties
                </ButtonPill>
                <ButtonPill href="/gift-cards" variant="ghost" className="px-5 py-3.5 text-base">
                  🎁 Gift Cards
                </ButtonPill>
              </div>
            </Reveal>

            {/* Quick Category Jump Links */}
            <Reveal delay={500} variant="fade-up">
              <div className="mt-10 flex flex-wrap items-center justify-center gap-2.5 text-sm">
                <span className="text-white/60 text-xs uppercase tracking-wide">Featured:</span>
                <a 
                  href="#date-night" 
                  className="rounded-full border border-white/15 bg-white/5 px-3.5 py-1 text-xs font-medium text-white/90 transition hover:bg-white/15"
                >
                  💕 Date Night Pottery
                </a>
                <a 
                  href="#beginner-wheel" 
                  className="rounded-full border border-white/15 bg-white/5 px-3.5 py-1 text-xs font-medium text-white/90 transition hover:bg-white/15"
                >
                  🏺 Beginner Wheel
                </a>
                <a 
                  href="#mosaics" 
                  className="rounded-full border border-white/15 bg-white/5 px-3.5 py-1 text-xs font-medium text-white/90 transition hover:bg-white/15"
                >
                  ✨ Glass &amp; Mosaics
                </a>
                <a 
                  href="#private-events" 
                  className="rounded-full border border-white/15 bg-white/5 px-3.5 py-1 text-xs font-medium text-white/90 transition hover:bg-white/15"
                >
                  🎉 Private Parties
                </a>
              </div>
            </Reveal>
          </div>

          {/* Social Proof Stats */}
          <div className="mx-auto mt-14 max-w-4xl">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <Reveal variant="scale" delay={400}>
                <GlassCard className="p-5 text-center">
                  <div className="text-3xl font-bold text-amber-300">150K+</div>
                  <div className="mt-1 text-xs text-white/60">Happy Guests</div>
                </GlassCard>
              </Reveal>
              <Reveal variant="scale" delay={500}>
                <GlassCard className="p-5 text-center">
                  <div className="text-3xl font-bold text-pink-300">4.9★</div>
                  <div className="mt-1 text-xs text-white/60">Average Rating</div>
                </GlassCard>
              </Reveal>
              <Reveal variant="scale" delay={600}>
                <GlassCard className="p-5 text-center">
                  <div className="text-3xl font-bold text-purple-300">70+</div>
                  <div className="mt-1 text-xs text-white/60">Weekly Sessions</div>
                </GlassCard>
              </Reveal>
              <Reveal variant="scale" delay={700}>
                <GlassCard className="p-5 text-center">
                  <div className="text-3xl font-bold text-cyan-300">BYOB</div>
                  <div className="mt-1 text-xs text-white/60">Snacks &amp; Drinks</div>
                </GlassCard>
              </Reveal>
            </div>
          </div>
        </div>

        <ScrollHint />
      </section>

      {/* Studio Location Card */}
      <section className="relative z-20 mx-auto max-w-7xl px-6 py-10">
        <GlassCard className="p-6 sm:p-8">
          <div className="grid gap-6 md:grid-cols-3">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-pink-400">
                Studio Address
              </div>
              <div className="mt-2 text-base font-semibold text-white">
                {studio.streetAddress}
              </div>
              <div className="text-sm text-white/70">
                {studio.addressLocality}, {studio.addressRegion} {studio.postalCode}
              </div>
              <div className="mt-3 text-xs text-white/50">
                {city.param === 'chicago' ? 'Located in Pilsen near 18th St Pink Line.' : 'Located on Cross Street with easy parking.'}
              </div>
            </div>

            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-purple-400">
                Studio Atmosphere
              </div>
              <div className="mt-2 text-sm text-white/80 leading-relaxed">
                BYOB friendly for adult evening sessions (21+). We provide glassware, openers, and ice. All materials and tools included with every class.
              </div>
            </div>

            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
                Questions &amp; Private Bookings
              </div>
              <div className="mt-2 text-sm text-white/80 leading-relaxed">
                Planning a group outing or birthday party? Reach our team at{" "}
                <a href="mailto:support@colorcocktailfactory.com" className="underline hover:text-white">
                  support@colorcocktailfactory.com
                </a>.
              </div>
            </div>
          </div>
        </GlassCard>
      </section>

      {/* City-Specific Sections */}
      {citySections.map((section) => (
        <StackedSection key={section.id} city={city} section={section} />
      ))}

      {/* Testimonials */}
      <Testimonials />
    </main>
  );
}
