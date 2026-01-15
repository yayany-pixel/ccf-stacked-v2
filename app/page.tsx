import type { Metadata } from "next";
import Link from "next/link";
import GlassCard from "@/components/ui/GlassCard";
import ButtonPill from "@/components/ui/ButtonPill";
import Reveal from "@/components/motion/Reveal";
import VideoSwitcher from "@/components/VideoSwitcher";
import LocationSelector from "@/components/LocationSelector";
import { generateOrganizationSchema } from "@/lib/enhancedStructuredData";

export const metadata: Metadata = {
  title: "Color Cocktail Factory | Pottery & Creative Workshops in Chicago & Eugene",
  description: "Choose your location: Expert-guided pottery, glass fusion, mosaics & more in Chicago (Pilsen) and Eugene, Oregon. BYOB, beginner-friendly creative experiences.",
  keywords: [
    "pottery classes",
    "pottery classes chicago",
    "pottery classes eugene",
    "creative workshops",
    "art classes chicago",
    "art classes eugene",
    "date night pottery",
    "team building chicago",
    "team building eugene",
    "glass fusion",
    "mosaic classes",
    "pottery studio chicago",
    "pottery studio eugene"
  ],
  alternates: {
    canonical: "https://colorcocktailfactory.com/"
  },
  openGraph: {
    title: "Color Cocktail Factory | Pottery & Creative Workshops",
    description: "Expert-guided pottery, glass fusion, mosaics & more in Chicago & Eugene. BYOB, beginner-friendly.",
    url: "https://colorcocktailfactory.com/",
    type: "website",
    images: [
      {
        url: "https://colorcocktailfactory.com/og-home.jpg",
        width: 1200,
        height: 630,
        alt: "Color Cocktail Factory"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Color Cocktail Factory | Pottery & Creative Workshops",
    description: "Expert-guided pottery, glass fusion, mosaics & more in Chicago & Eugene."
  }
};

export default function HomePage() {
  // Organization schema with both locations
  const organizationSchema = generateOrganizationSchema();
  
  // Multi-location business schema
  const multiLocationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": "https://colorcocktailfactory.com/#organization",
    "name": "Color Cocktail Factory",
    "alternateName": "CCF",
    "url": "https://colorcocktailfactory.com",
    "logo": "https://colorcocktailfactory.com/logo.png",
    "description": "Creative workshops and pottery classes in Chicago and Eugene. Expert-led hands-on experiences including pottery, glass art, mosaics, and more.",
    "slogan": "Creativity is shareable.",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+1-312-881-9929",
      "contactType": "customer service",
      "email": "support@colorcocktailfactory.com",
      "availableLanguage": "English"
    },
    "location": [
      {
        "@type": "LocalBusiness",
        "@id": "https://colorcocktailfactory.com/chicago#localbusiness",
        "name": "Color Cocktail Factory - Chicago",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "1000 W 35th St",
          "addressLocality": "Chicago",
          "addressRegion": "IL",
          "postalCode": "60609",
          "addressCountry": "US"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": 41.8307,
          "longitude": -87.6567
        },
        "telephone": "+1-312-881-9929",
        "url": "https://colorcocktailfactory.com/chicago",
        "openingHoursSpecification": [
          {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": ["Wednesday", "Thursday", "Friday"],
            "opens": "17:30",
            "closes": "21:00"
          },
          {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": "Saturday",
            "opens": "12:00",
            "closes": "21:30"
          },
          {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": "Sunday",
            "opens": "14:30",
            "closes": "18:30"
          }
        ]
      },
      {
        "@type": "LocalBusiness",
        "@id": "https://colorcocktailfactory.com/eugene#localbusiness",
        "name": "Color Cocktail Factory - Eugene",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "123 Main St",
          "addressLocality": "Eugene",
          "addressRegion": "OR",
          "postalCode": "97401",
          "addressCountry": "US"
        },
        "telephone": "+1-312-881-9929",
        "url": "https://colorcocktailfactory.com/eugene"
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(multiLocationSchema) }}
      />

      <main id="main-content" className="min-h-screen">
        {/* Hero Section */}
        <section className="gradient-breathing relative overflow-hidden bg-gradient-to-br from-indigo-900/40 via-purple-900/50 to-pink-900/40">
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
                <p className="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-white/85 sm:text-xl">
                  Expert-guided pottery, glass fusion, mosaics, and more. We bring people together through creativity in Chicago's Pilsen neighborhood and Eugene, Oregon. BYOB-friendly, beginner-friendly, memory-making experiences.
                </p>
              </Reveal>
            </div>
          </div>
        </section>

        {/* Location Selector Section */}
        <section className="py-20">
          <div className="mx-auto max-w-3xl px-6">
            <LocationSelector />
            
            {/* Scroll for details affordance */}
            <Reveal delay={100}>
              <div className="mt-8 text-center">
                <a 
                  href="#groups-section"
                  className="inline-flex items-center gap-2 text-sm text-purple-300 hover:text-purple-200 transition-colors group"
                >
                  <span>Just browsing? Scroll for details</span>
                  <svg 
                    className="w-4 h-4 animate-bounce group-hover:translate-y-0.5 transition-transform" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </a>
              </div>
            </Reveal>
          </div>
        </section>

        {/* Videos Section - Moved here */}
        <section className="bg-gradient-to-br from-purple-900/10 to-pink-900/10 py-16">
          <div className="mx-auto max-w-7xl px-6">
            <Reveal variant="fade-up">
              <div className="text-center mb-8">
                <h2 className="font-serif text-3xl font-bold">See Our Studio in Action</h2>
                <p className="mt-2 text-white/70">Watch what makes our workshops special</p>
              </div>
            </Reveal>

            <Reveal delay={100} variant="fade-up">
              <VideoSwitcher />
            </Reveal>
          </div>
        </section>

        {/* Group Events Section */}
        <section id="groups-section" className="bg-gradient-to-br from-pink-900/20 to-purple-900/20 py-20">
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
        <section className="border-y border-white/10 bg-gradient-to-br from-purple-900/20 to-pink-900/20 py-20">
          <div className="mx-auto max-w-4xl px-6">
            <Reveal variant="fade-up">
              <div className="text-center">
                <h2 className="font-serif text-4xl font-bold">Why Color Cocktail Factory?</h2>
                <div className="mx-auto mt-8 max-w-3xl space-y-6 text-lg leading-relaxed text-white/80">
                  <p>
                    Since 2009, we've welcomed over 150,000 guests into our studios to create, connect, and 
                    celebrate. We're not just a pottery class—we're a place where first dates turn into 
                    anniversaries, coworkers become friends, and strangers leave as artists.
                  </p>
                  <p>
                    Every experience is beginner-friendly, instructor-led, and designed for maximum fun. 
                    Bring your own drinks (yes, really!), bring your friends, bring your curiosity. 
                    We'll handle the rest—from clay to kiln, from glass to glaze. Your only job is to enjoy.
                  </p>
                </div>

                <div className="mt-12 grid gap-6 sm:grid-cols-3">
                  <GlassCard className="p-6 text-center">
                    <div className="text-4xl">🎨</div>
                    <h3 className="mt-3 font-semibold">Expert Instructors</h3>
                    <p className="mt-2 text-sm text-white/70">Professional artists guide every class</p>
                  </GlassCard>

                  <GlassCard className="p-6 text-center">
                    <div className="text-4xl">🍷</div>
                    <h3 className="mt-3 font-semibold">BYOB Welcome</h3>
                    <p className="mt-2 text-sm text-white/70">Bring wine, beer, or any drinks you love</p>
                  </GlassCard>

                  <GlassCard className="p-6 text-center">
                    <div className="text-4xl">✨</div>
                    <h3 className="mt-3 font-semibold">Take Home Art</h3>
                    <p className="mt-2 text-sm text-white/70">Every piece tells your story</p>
                  </GlassCard>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* Final CTA */}
        <section className="gradient-breathing py-20">
          <div className="mx-auto max-w-3xl px-6 text-center">
            <Reveal variant="scale">
              <h2 className="font-serif text-3xl font-bold">Ready to Create Something Amazing?</h2>
              <p className="mt-4 text-lg text-white/80">
                Choose your city above and explore our full range of creative experiences.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <ButtonPill href="/chicago" variant="primary">
                  Explore Chicago →
                </ButtonPill>
                <ButtonPill href="/eugene" variant="primary">
                  Explore Eugene →
                </ButtonPill>
              </div>
              <div className="mt-6">
                <Link href="/blog" className="inline-block py-2 text-sm text-purple-300 hover:text-purple-200">
                  Read Our Blog
                </Link>
                <span className="mx-3 text-white/40">•</span>
                <Link href="/events" className="inline-block py-2 text-sm text-purple-300 hover:text-purple-200">
                  Upcoming Events
                </Link>
                <span className="mx-3 text-white/40">•</span>
                <Link href="/activities" className="inline-block py-2 text-sm text-purple-300 hover:text-purple-200">
                  All Activities
                </Link>
              </div>
            </Reveal>
          </div>
        </section>
      </main>
    </>
  );
}

