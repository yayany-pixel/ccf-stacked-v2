import StackedSection from "@/components/StackedSection";
import GlassCard from "@/components/ui/GlassCard";
import ButtonPill from "@/components/ui/ButtonPill";
import Reveal from "@/components/motion/Reveal";
import ScrollHint from "@/components/motion/ScrollHint";
import HeroVideoBackground from "@/components/HeroVideoBackground";
import { sections } from "@/lib/config";
import { getCityByParam, buildHomeBookLink } from "@/lib/links";

export default function CityHome({ params }: { params: { city: string } }) {
  const city = getCityByParam(params.city);

  return (
    <main className="min-h-screen">
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
            <Reveal variant="scale">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold backdrop-blur-xl pulse-glow">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
                </span>
                Now Open in {city.label}
              </div>
            </Reveal>

            <Reveal delay={100} variant="fade-up">
              <h1 className="mt-6 font-serif text-5xl font-bold leading-tight tracking-tight sm:text-7xl">
                Where Creativity
                <br />
                Comes to Life
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
                  🎁 Gift Cards (50% Off)
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
      {sections.map((section) => (
        <StackedSection key={section.id} city={city} section={section} />
      ))}

      {/* Footer */}
      <footer className="border-t border-white/10 bg-black/20 px-6 pb-16 pt-10 text-white/70">
        <div className="mx-auto max-w-5xl">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-8 shadow-soft">
            <h2 className="text-lg font-semibold text-white/90">Premium Creative Workshops in {city.label}</h2>
            <p className="mt-3 text-sm leading-relaxed text-white/75">
              Color Cocktail Factory offers hands-on pottery classes, Turkish lamp making, glass fusion, mosaics, 
              and more creative workshops in {city.label}. Perfect for date nights, team building, private events, 
              and unique gifts. All skill levels welcome.
            </p>
            
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="text-left">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-white/80">Popular Classes</h3>
                <ul className="mt-2 space-y-1 text-xs text-white/65">
                  <li>Pottery Wheel Throwing</li>
                  <li>Turkish Lamp Mosaics</li>
                  <li>Glass Fusion</li>
                  <li>Handbuilding Pottery</li>
                </ul>
              </div>
              
              <div className="text-left">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-white/80">Perfect For</h3>
                <ul className="mt-2 space-y-1 text-xs text-white/65">
                  <li>Date Nights & Couples</li>
                  <li>Team Building Events</li>
                  <li>Birthday Parties</li>
                  <li>Gift Experiences</li>
                </ul>
              </div>
              
              <div className="text-left">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-white/80">Connect</h3>
                <ul className="mt-2 space-y-1 text-xs">
                  <li>
                    <a 
                      className="text-white/65 underline decoration-white/25 underline-offset-4 hover:text-white/90" 
                      href="https://www.instagram.com/colorcocktailfactory" 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      Instagram
                    </a>
                  </li>
                  <li>
                    <a 
                      className="text-white/65 underline decoration-white/25 underline-offset-4 hover:text-white/90" 
                      href="/gift-cards"
                    >
                      Gift Cards
                    </a>
                  </li>
                  <li>
                    <a 
                      className="text-white/65 underline decoration-white/25 underline-offset-4 hover:text-white/90" 
                      href={`/${city.param}/private-parties`}
                    >
                      Private Events
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="mt-6 border-t border-white/10 pt-4">
              <p className="text-xs text-white/55">
                © {new Date().getFullYear()} Color Cocktail Factory. {city.label} creative workshops. 
                All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
