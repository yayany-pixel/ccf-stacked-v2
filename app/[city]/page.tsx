import StackedSection from "@/components/StackedSection";
import GlassCard from "@/components/ui/GlassCard";
import ButtonPill from "@/components/ui/ButtonPill";
import Reveal from "@/components/motion/Reveal";
import ScrollHint from "@/components/motion/ScrollHint";
import HeroVideoBackground from "@/components/HeroVideoBackground";
import Testimonials from "@/components/Testimonials";
import NewsletterSignup from "@/components/NewsletterSignup";
import { sections } from "@/lib/config";
import { eugeneSections } from "@/lib/eugene-config";
import { chicagoSections } from "@/lib/chicago-config";
import { getCityByParam, buildHomeBookLink } from "@/lib/links";
import { generateLocalBusinessSchema, generateOrganizationSchema, generateBreadcrumbSchema } from "@/lib/enhancedStructuredData";
import type { Metadata } from "next";
import { buildCityMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: { city: string } }): Promise<Metadata> {
  const city = getCityByParam(params.city);
  return buildCityMetadata(city);
}

export default function CityHome({ params }: { params: { city: string } }) {
  const city = getCityByParam(params.city);
  
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
    <main className="min-h-screen">
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
      <section className="gradient-breathing relative flex min-h-[90vh] items-center overflow-hidden bg-gradient-to-br from-indigo-900/40 via-purple-900/50 to-pink-900/40">
        {/* Video Background + Overlays */}
        <HeroVideoBackground />
        
        {/* Fallback layers (shown when video not playing or reduced motion) */}
        <div className="sparkle-noise absolute inset-0 z-10" />
        
        {/* Vibrant multi-color gradient overlay */}
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
        
        <div className="relative z-20 mx-auto w-full max-w-7xl px-6 py-20">
          <div className="mx-auto max-w-4xl text-center">
            <Reveal delay={100} variant="fade-up">
              <h1 className="font-serif text-5xl font-light leading-relaxed tracking-wide sm:text-7xl sm:leading-relaxed" style={{ letterSpacing: '0.05em' }}>
                Where Love
                <br />
                <span className="italic font-normal">Takes Shape</span>
              </h1>
            </Reveal>

            <Reveal delay={200}>
              <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/85 sm:text-xl">
                Expert-guided pottery, glass fusion, mosaics, and more. Perfect for date nights, 
                team building, or discovering your creative side in {city.label}.
              </p>
            </Reveal>

            <Reveal delay={300} variant="scale">
              <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                <ButtonPill href={buildHomeBookLink(city)} variant="primary">
                  Book a Class →
                </ButtonPill>
                <ButtonPill href="/activities" variant="secondary">
                  Explore All Workshops
                </ButtonPill>
                <ButtonPill href="/gift-cards" variant="ghost">
                  🎁 Gift Cards
                </ButtonPill>
              </div>
            </Reveal>

            {/* Quick Category Links */}
            <Reveal delay={400} variant="fade-up">
              <div className="mt-12 flex flex-wrap items-center justify-center gap-3 text-sm">
                <span className="text-white/60">Popular:</span>
                <a 
                  href="#date-night" 
                  className="rounded-full border bg-white/5 px-3 py-1.5 transition-all hover:scale-110 category-romance"
                  style={{ animationDelay: '0s' }}
                >
                  💕 Date Night Pottery
                </a>
                <a 
                  href="#mosaics" 
                  className="rounded-full border bg-white/5 px-3 py-1.5 transition-all hover:scale-110 category-glass"
                  style={{ animationDelay: '0.5s' }}
                >
                  ✨ Mosaics & Glass
                </a>
                <a 
                  href="#bonsai" 
                  className="rounded-full border bg-white/5 px-3 py-1.5 transition-all hover:scale-110 category-roots"
                  style={{ animationDelay: '1s' }}
                >
                  🌱 Bonsai
                </a>
                <a 
                  href="#private-events" 
                  className="rounded-full border bg-white/5 px-3 py-1.5 transition-all hover:scale-110 category-private"
                  style={{ animationDelay: '1.5s' }}
                >
                  🎉 Private Events
                </a>
              </div>
            </Reveal>
          </div>

          {/* Social Proof Stats */}
          <div className="mx-auto mt-20 max-w-4xl">
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
              <Reveal variant="scale" delay={400}>
                <GlassCard interactive className="bg-gradient-mud p-6 text-center category-mud float-gentle" style={{ animationDelay: '0s' }}>
                  <div className="text-3xl font-bold category-accent">150K+</div>
                  <div className="mt-1 text-sm text-white/60">Happy Customers</div>
                </GlassCard>
              </Reveal>
              <Reveal variant="scale" delay={500}>
                <GlassCard interactive className="bg-gradient-glass p-6 text-center category-glass float-gentle" style={{ animationDelay: '0.5s' }}>
                  <div className="text-3xl font-bold category-accent">4.9★</div>
                  <div className="mt-1 text-sm text-white/60">Average Rating</div>
                </GlassCard>
              </Reveal>
              <Reveal variant="scale" delay={600}>
                <GlassCard interactive className="bg-gradient-crush p-6 text-center category-crush float-gentle" style={{ animationDelay: '1s' }}>
                  <div className="text-3xl font-bold category-accent">70+</div>
                  <div className="mt-1 text-sm text-white/60">Classes per Week</div>
                </GlassCard>
              </Reveal>
              <Reveal variant="scale" delay={700}>
                <GlassCard interactive className="bg-gradient-roots p-6 text-center category-roots float-gentle" style={{ animationDelay: '1.5s' }}>
                  <div className="text-3xl font-bold category-accent">All Levels</div>
                  <div className="mt-1 text-sm text-white/60">Welcome Here</div>
                </GlassCard>
              </Reveal>
            </div>
          </div>
        </div>

        <ScrollHint />
      </section>

      {/* Sections */}
      {citySections.map((section) => (
        <StackedSection key={section.id} city={city} section={section} />
      ))}

      {/* Testimonials */}
      <Testimonials />

      {/* Footer */}
      <footer className="border-t border-white/10 bg-black/20 px-6 pb-16 pt-10 text-white/70">
        <div className="mx-auto max-w-5xl">
          {/* Newsletter Signup */}
          <div className="mb-12">
            <NewsletterSignup />
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-8 shadow-soft">
            <h2 className="text-lg font-semibold text-white/90">
              {city.label} Creative Workshops & Pottery Classes | Color Cocktail Factory
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-white/75">
              Color Cocktail Factory is {city.label}&apos;s premier creative workshop studio offering hands-on pottery classes, 
              wheel throwing, Turkish lamp making, glass fusion, mosaics, and more. Located in {city.param === 'chicago' ? 'Pilsen, Chicago' : 'downtown Eugene, Oregon'}, 
              our expert-led workshops are perfect for date nights, team building, private events, birthdays, bachelorette parties, 
              and unique experience gifts. All skill levels welcome - from complete beginners to experienced artists. 
              Book online for same-day availability.
            </p>
            
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="text-left">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-white/80">Popular {city.label} Classes</h3>
                <ul className="mt-2 space-y-1 text-xs text-white/65">
                  <li>Pottery Wheel Throwing {city.label}</li>
                  <li>Turkish Lamp Mosaics</li>
                  <li>Glass Fusion Workshop</li>
                  <li>Handbuilding Pottery</li>
                  <li>Date Night Pottery Class</li>
                  <li>Beginner Ceramics</li>
                </ul>
              </div>
              
              <div className="text-left">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-white/80">Perfect For</h3>
                <ul className="mt-2 space-y-1 text-xs text-white/65">
                  <li>Date Nights & Couples Activities</li>
                  <li>Team Building Events {city.label}</li>
                  <li>Birthday Parties</li>
                  <li>Bachelorette Parties</li>
                  <li>Corporate Events</li>
                  <li>Experience Gift Cards</li>
                </ul>
              </div>
              
              <div className="text-left">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-white/80">Quick Links</h3>
                <ul className="mt-2 space-y-2 text-sm">
                  <li>
                    <a 
                      className="inline-block py-2 text-white/65 underline decoration-white/25 underline-offset-4 hover:text-white/90" 
                      href={buildHomeBookLink(city)}
                    >
                      Book a Class
                    </a>
                  </li>
                  <li>
                    <a 
                      className="inline-block py-2 text-white/65 underline decoration-white/25 underline-offset-4 hover:text-white/90" 
                      href="/gift-cards"
                    >
                      Gift Cards
                    </a>
                  </li>
                  <li>
                    <a 
                      className="inline-block py-2 text-white/65 underline decoration-white/25 underline-offset-4 hover:text-white/90" 
                      href={`/${city.param}/private-parties`}
                    >
                      Private Events & Parties
                    </a>
                  </li>
                  <li>
                    <a 
                      className="inline-block py-2 text-white/65 underline decoration-white/25 underline-offset-4 hover:text-white/90" 
                      href="https://www.instagram.com/colorcocktailfactory" 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      Instagram
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="mt-6 border-t border-white/10 pt-4">
              <p className="text-xs text-white/55">
                © {new Date().getFullYear()} Color Cocktail Factory. {city.label} creative workshops, pottery classes, and art studio. 
                Serving {city.param === 'chicago' ? 'Pilsen, West Loop, South Loop, and greater Chicago area' : 'downtown Eugene, Whiteaker, and greater Eugene area'}. 
                All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
