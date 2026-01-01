import type { Metadata } from "next";
import Link from "next/link";
import GlassCard from "@/components/ui/GlassCard";
import ButtonPill from "@/components/ui/ButtonPill";
import Reveal from "@/components/motion/Reveal";
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

  const chicagoTopPicks = [
    { label: "Date Night Pottery", href: "/chicago/date-night-wheel", icon: "💕" },
    { label: "Beginner Wheel", href: "/chicago/beginner-wheel", icon: "🎨" },
    { label: "Turkish Lamp Mosaics", href: "/chicago/turkish-lamp", icon: "✨" },
    { label: "Handbuilding", href: "/chicago/handbuilding", icon: "🏺" },
    { label: "Glass Fusion", href: "/chicago/glass-fusion", icon: "🌈" },
    { label: "Bonsai Workshop", href: "/chicago/bonsai", icon: "🌿" }
  ];

  const eugeneTopPicks = [
    { label: "Date Night Pottery", href: "/eugene/date-night-wheel", icon: "💕" },
    { label: "Beginner Wheel", href: "/eugene/beginner-wheel", icon: "🎨" },
    { label: "Mosaics", href: "/eugene/mosaic", icon: "🎨" },
    { label: "Terrarium Making", href: "/eugene/terrarium", icon: "🌱" },
    { label: "Candle Making", href: "/eugene/candle-making", icon: "🕯️" },
    { label: "Glass Fusion", href: "/eugene/glass-fusion", icon: "🌈" }
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(multiLocationSchema) }}
      />

      <main className="min-h-screen">
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

        {/* Location Cards */}
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-6">
            <div className="grid gap-8 lg:grid-cols-2">
              {/* Chicago Card */}
              <Reveal variant="fade-up">
                <GlassCard className="group h-full overflow-hidden">
                  <div className="relative h-64 overflow-hidden bg-gradient-to-br from-purple-500/20 to-pink-500/20">
                    <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20" />
                    <div className="relative z-10 flex h-full flex-col items-center justify-center p-8 text-center">
                      <div className="text-6xl">🏙️</div>
                      <h2 className="mt-4 font-serif text-4xl font-bold">Chicago</h2>
                      <p className="mt-2 text-lg text-white/80">Pilsen Neighborhood</p>
                    </div>
                  </div>
                  
                  <div className="p-8">
                    <p className="leading-relaxed text-white/75">
                      Our Pilsen studio sits in Chicago's most vibrant artistic neighborhood—colorful murals, 
                      Mexican heritage, and creative energy everywhere. Perfect for date nights, team building, 
                      and celebrating with friends.
                    </p>

                    <div className="mt-6 flex flex-wrap gap-3">
                      <ButtonPill href="/chicago" variant="primary" full>
                        View Chicago Classes →
                      </ButtonPill>
                      <ButtonPill href="/private-events" variant="secondary">
                        Private Events
                      </ButtonPill>
                      <ButtonPill href="/gift-cards" variant="ghost">
                        Gift Cards
                      </ButtonPill>
                    </div>

                    <div className="mt-8 border-t border-white/10 pt-6">
                      <h3 className="text-sm font-semibold uppercase tracking-wide text-white/70">Top Picks in Chicago</h3>
                      <div className="mt-4 grid grid-cols-2 gap-2">
                        {chicagoTopPicks.map((pick) => (
                          <Link
                            key={pick.href}
                            href={pick.href}
                            className="group/link flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm transition hover:bg-white/10"
                          >
                            <span>{pick.icon}</span>
                            <span className="text-white/75 group-hover/link:text-white">{pick.label}</span>
                          </Link>
                        ))}
                      </div>
                    </div>

                    <div className="mt-6 text-xs text-white/60">
                      <p>📍 Pilsen, Chicago, IL</p>
                      <p className="mt-1">⏰ Wed-Fri 5:30-9pm, Sat 12-9:30pm, Sun 2:30-6:30pm</p>
                    </div>
                  </div>
                </GlassCard>
              </Reveal>

              {/* Eugene Card */}
              <Reveal variant="fade-up" delay={100}>
                <GlassCard className="group h-full overflow-hidden">
                  <div className="relative h-64 overflow-hidden bg-gradient-to-br from-green-500/20 to-cyan-500/20">
                    <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20" />
                    <div className="relative z-10 flex h-full flex-col items-center justify-center p-8 text-center">
                      <div className="text-6xl">🌲</div>
                      <h2 className="mt-4 font-serif text-4xl font-bold">Eugene</h2>
                      <p className="mt-2 text-lg text-white/80">Oregon</p>
                    </div>
                  </div>
                  
                  <div className="p-8">
                    <p className="leading-relaxed text-white/75">
                      Our Eugene studio brings hands-on creativity to Oregon's gem city. Surrounded by nature, 
                      university culture, and Pacific Northwest charm. Perfect for couples, groups, and anyone 
                      seeking a unique creative escape.
                    </p>

                    <div className="mt-6 flex flex-wrap gap-3">
                      <ButtonPill href="/eugene" variant="primary" full>
                        View Eugene Classes →
                      </ButtonPill>
                      <ButtonPill href="/private-events" variant="secondary">
                        Private Events
                      </ButtonPill>
                      <ButtonPill href="/gift-cards" variant="ghost">
                        Gift Cards
                      </ButtonPill>
                    </div>

                    <div className="mt-8 border-t border-white/10 pt-6">
                      <h3 className="text-sm font-semibold uppercase tracking-wide text-white/70">Top Picks in Eugene</h3>
                      <div className="mt-4 grid grid-cols-2 gap-2">
                        {eugeneTopPicks.map((pick) => (
                          <Link
                            key={pick.href}
                            href={pick.href}
                            className="group/link flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm transition hover:bg-white/10"
                          >
                            <span>{pick.icon}</span>
                            <span className="text-white/75 group-hover/link:text-white">{pick.label}</span>
                          </Link>
                        ))}
                      </div>
                    </div>

                    <div className="mt-6 text-xs text-white/60">
                      <p>📍 Eugene, Oregon</p>
                      <p className="mt-1">⏰ Hours vary by class</p>
                    </div>
                  </div>
                </GlassCard>
              </Reveal>
            </div>
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

