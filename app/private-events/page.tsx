import type { Metadata } from "next";
import Link from "next/link";
import GlassCard from "@/components/ui/GlassCard";
import ButtonPill from "@/components/ui/ButtonPill";
import Reveal from "@/components/motion/Reveal";
import PrivateEventFormCard from "@/components/PrivateEventFormCard";
import { cities } from "@/lib/config";

export const metadata: Metadata = {
  title: "Private Events & Parties | Color Cocktail Factory",
  description: "Host unforgettable private parties in Chicago & Eugene. BYOB pottery, mosaics, glass fusion for weddings, team building, birthdays & more. Groups of 8-50+.",
  keywords: [
    "private party venue Chicago",
    "private party venue Eugene",
    "team building Chicago",
    "team building Eugene",
    "bachelorette party ideas Chicago",
    "bachelorette party ideas Eugene",
    "birthday party venue near me",
    "wedding guest activity",
    "corporate events Chicago",
    "corporate events Eugene",
    "BYOB party venue",
    "pottery party",
    "private pottery class",
    "group art classes",
    "bridal shower venue",
    "anniversary party ideas",
    "kids birthday party Chicago",
    "kids birthday party Eugene",
    "private creative workshop",
    "team outing ideas"
  ],
  alternates: {
    canonical: "https://colorcocktailfactory.com/private-events"
  },
  openGraph: {
    title: "Private Events & Parties | Color Cocktail Factory",
    description: "Host unforgettable private parties in Chicago & Eugene. BYOB pottery, mosaics, glass fusion for weddings, team building, birthdays & more.",
    url: "https://colorcocktailfactory.com/private-events",
    type: "website",
    images: [
      {
        url: "https://colorcocktailfactory.com/og-private-events.jpg",
        width: 1200,
        height: 630,
        alt: "Private Events at Color Cocktail Factory"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Private Events & Parties | Color Cocktail Factory",
    description: "Host unforgettable private parties in Chicago & Eugene. BYOB pottery, mosaics, glass fusion."
  }
};

export default function PrivateEventsPage() {
  // JSON-LD structured data
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": "Private Event Venue & Creative Workshops",
    "provider": {
      "@type": "Organization",
      "name": "Color Cocktail Factory",
      "telephone": "+1-312-881-9929",
      "email": "support@colorcocktailfactory.com"
    },
    "areaServed": [
      {
        "@type": "City",
        "name": "Chicago",
        "containedInPlace": {
          "@type": "State",
          "name": "Illinois"
        }
      },
      {
        "@type": "City",
        "name": "Eugene",
        "containedInPlace": {
          "@type": "State",
          "name": "Oregon"
        }
      }
    ],
    "offers": {
      "@type": "AggregateOffer",
      "priceCurrency": "USD",
      "lowPrice": "45",
      "highPrice": "85",
      "priceSpecification": {
        "@type": "UnitPriceSpecification",
        "price": "55",
        "priceCurrency": "USD",
        "unitText": "per person"
      }
    },
    "description": "Private creative events and parties including pottery, mosaics, glass fusion, and more. Perfect for team building, weddings, birthdays, and corporate events."
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Can we bring our own food and drinks?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes! Our private events are BYOB-friendly. Bring any food, drinks, wine, beer, or cocktails you'd like. We provide tables and space for your refreshments."
        }
      },
      {
        "@type": "Question",
        "name": "Can we arrive early to decorate?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Absolutely! You can arrive 30 minutes before your event start time to set up minimal decorations like balloons, banners, or table settings."
        }
      },
      {
        "@type": "Question",
        "name": "What group sizes do you accommodate?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We host groups from 8 to 50+ guests. Smaller groups (8-15) have an intimate studio feel, while larger groups (20-50+) can book the entire space for exclusive use."
        }
      },
      {
        "@type": "Question",
        "name": "How much does a private event cost?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Pricing ranges from $45-$85 per person depending on the activity chosen. Pottery wheel throwing, handbuilding, mosaics, and terrariums are on the lower end, while glass fusion and Turkish lamp making are premium experiences."
        }
      },
      {
        "@type": "Question",
        "name": "Is this suitable for kids?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes! We offer age-appropriate activities for kids as young as 6 years old. Popular options include handbuilding pottery, painting, and simple mosaics. Parent supervision is required for children under 10."
        }
      },
      {
        "@type": "Question",
        "name": "Do guests take their creations home?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Most projects go home the same day! Pottery pieces need to be fired and glazed, so those are ready for pickup 2-3 weeks later. Glass fusion items are fired and ready in about 1 week. Terrariums, bonsai, candles, and painted items go home immediately."
        }
      },
      {
        "@type": "Question",
        "name": "Do you provide instruction?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Every private event includes expert instruction from our experienced artists. We guide your group step-by-step, ensuring everyone has fun and creates something beautiful, regardless of skill level."
        }
      },
      {
        "@type": "Question",
        "name": "How far in advance should we book?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We recommend booking 2-4 weeks in advance for weekends and 1-2 weeks for weekdays. However, we can often accommodate last-minute requests within 3-5 days if availability permits."
        }
      },
      {
        "@type": "Question",
        "name": "What's your cancellation policy?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Cancellations made 7+ days before your event receive a full refund. Cancellations within 7 days may receive partial credit toward a future booking. We're flexible and understanding of emergencies."
        }
      },
      {
        "@type": "Question",
        "name": "Can we customize the experience?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Absolutely! We can tailor activities to your theme, mix multiple projects, adjust difficulty levels, and work within your budget and timeline. Just share your vision in the inquiry form and we'll create a custom proposal."
        }
      }
    ]
  };

  const eventTypes = [
    {
      icon: "💍",
      title: "Weddings & Engagement Parties",
      description: "Create unforgettable guest experiences or couple activities"
    },
    {
      icon: "👰",
      title: "Bachelorette & Bridal Showers",
      description: "Celebrate with pottery, champagne, and lifelong memories"
    },
    {
      icon: "💼",
      title: "Corporate Team Building",
      description: "Foster creativity, collaboration, and connection"
    },
    {
      icon: "🎉",
      title: "Birthday Parties",
      description: "Adults and kids alike love hands-on creative celebrations"
    },
    {
      icon: "👨‍👩‍👧‍👦",
      title: "Family Reunions",
      description: "Multi-generational fun that everyone can enjoy together"
    },
    {
      icon: "🎄",
      title: "Holiday Parties",
      description: "Festive team outings or friend gatherings with seasonal flair"
    },
    {
      icon: "🎓",
      title: "School & Youth Groups",
      description: "Educational, age-appropriate art experiences for kids"
    },
    {
      icon: "💖",
      title: "Anniversary Celebrations",
      description: "Romantic date nights or milestone parties with a creative twist"
    }
  ];

  const experiences = [
    {
      title: "Pottery Wheel Throwing",
      duration: "2 hours",
      price: "$55-65",
      description: "Learn to center clay and create bowls, cups, or vases on the pottery wheel. Our most popular group activity!",
      skill: "Beginner-friendly",
      takeHome: "Fired & glazed in 2-3 weeks",
      link: "/activities/date-night-wheel"
    },
    {
      title: "Handbuilding Pottery",
      duration: "2 hours",
      price: "$45-55",
      description: "No wheel needed! Use pinching, coiling, and slab techniques to create unique sculptural pieces.",
      skill: "All ages welcome",
      takeHome: "Fired & glazed in 2-3 weeks",
      link: "/activities/handbuilding"
    },
    {
      title: "Turkish Lamp Mosaics",
      duration: "2-3 hours",
      price: "$75-85",
      description: "Design stunning mosaic lamps using colorful glass pieces. A premium, show-stopping experience.",
      skill: "Beginner-friendly",
      takeHome: "Same day",
      link: "/activities/turkish-lamp"
    },
    {
      title: "Glass Fusion Art",
      duration: "1.5-2 hours",
      price: "$65-75",
      description: "Create fused glass coasters, jewelry dishes, or suncatchers. Modern and vibrant.",
      skill: "Beginner-friendly",
      takeHome: "Fired & ready in 1 week",
      link: "/activities/glass-fusion"
    },
    {
      title: "Mosaic Art",
      duration: "2 hours",
      price: "$55-65",
      description: "Design colorful mosaic artwork on tiles or frames. Great for team building and group creativity.",
      skill: "All ages",
      takeHome: "Same day",
      link: "/activities/mosaic"
    },
    {
      title: "Terrarium Building",
      duration: "1.5 hours",
      price: "$45-55",
      description: "Assemble lush mini gardens in glass vessels. Calming, meditative, and everyone succeeds.",
      skill: "Perfect for all",
      takeHome: "Same day",
      link: "/activities/terrarium"
    },
    {
      title: "Bonsai Workshop",
      duration: "2 hours",
      price: "$55-65",
      description: "Learn the ancient art of bonsai cultivation. Take home a living work of art.",
      skill: "Beginner-friendly",
      takeHome: "Same day",
      link: "/activities/bonsai"
    },
    {
      title: "Candle Making",
      duration: "1.5 hours",
      price: "$45-55",
      description: "Pour custom-scented candles with unique vessels and fragrance blends.",
      skill: "All ages",
      takeHome: "Same day",
      link: "/activities/candle-making"
    }
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="gradient-breathing relative overflow-hidden bg-gradient-to-br from-indigo-900/40 via-purple-900/50 to-pink-900/40">
          <div className="sparkle-noise absolute inset-0 bg-[url('/noise.png')] opacity-20" />
          
          <div className="relative z-10 mx-auto max-w-7xl px-6 py-24 sm:py-32">
            <div className="mx-auto max-w-4xl text-center">
              <Reveal variant="fade-up">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold backdrop-blur-xl">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
                  </span>
                  Chicago & Eugene Locations
                </div>
              </Reveal>

              <Reveal delay={100} variant="fade-up">
                <h1 className="mt-6 font-serif text-5xl font-light leading-relaxed tracking-wide sm:text-7xl sm:leading-relaxed" style={{ letterSpacing: '0.05em' }}>
                  Private Events &
                  <br />
                  <span className="italic font-normal">Creative Parties</span>
                </h1>
              </Reveal>

              <Reveal delay={200}>
                <p className="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-white/85 sm:text-xl">
                  Host unforgettable gatherings where creativity flows and memories are made. 
                  From team building to bachelorette parties, weddings to birthdays—bring your group for 
                  expert-led pottery, mosaics, glass art, and more. <strong className="text-white">BYOB welcome.</strong>
                </p>
              </Reveal>

              <Reveal delay={300} variant="scale">
                <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                  <ButtonPill href="#inquiry-form" variant="primary">
                    Get a Custom Quote →
                  </ButtonPill>
                  <ButtonPill href="#experiences" variant="secondary">
                    Browse Experiences
                  </ButtonPill>
                </div>
              </Reveal>

              <Reveal delay={400}>
                <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-white/70">
                  <span className="flex items-center gap-2">
                    <span className="text-lg">🍷</span> BYOB Friendly
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="text-lg">⏰</span> Arrive 30 min early to decorate
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="text-lg">👥</span> Groups of 8-50+
                  </span>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* Social Proof Section */}
        <section className="border-y border-white/10 bg-gradient-to-br from-purple-900/20 to-pink-900/20 py-12">
          <div className="mx-auto max-w-7xl px-6">
            <div className="grid gap-8 md:grid-cols-3">
              <div className="text-center">
                <div className="text-4xl font-bold text-purple-300">500+</div>
                <div className="mt-2 text-sm text-white/70">Private Events Hosted</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-pink-300">4.9★</div>
                <div className="mt-2 text-sm text-white/70">Average Group Rating</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-cyan-300">15K+</div>
                <div className="mt-2 text-sm text-white/70">Happy Guests Served</div>
              </div>
            </div>

            <div className="mt-12 text-center">
              <p className="text-lg italic text-white/80">
                "The perfect blend of creative, fun, and memorable. Our team loved it!"
              </p>
              <p className="mt-2 text-sm text-white/60">— Sarah M., Corporate Event Organizer</p>
            </div>
          </div>
        </section>

        {/* Perfect For Section */}
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mb-12 text-center">
              <h2 className="font-serif text-4xl font-bold">Perfect For Every Occasion</h2>
              <p className="mt-4 text-lg text-white/75">
                Whether you're celebrating a milestone or building team connections, we create experiences your group will love.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {eventTypes.map((event, idx) => (
                <Reveal key={event.title} delay={idx * 50} variant="fade-up">
                  <GlassCard className="p-6 text-center">
                    <div className="text-5xl">{event.icon}</div>
                    <h3 className="mt-4 font-serif text-xl font-semibold">{event.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-white/70">{event.description}</p>
                  </GlassCard>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Experiences Menu */}
        <section id="experiences" className="border-y border-white/10 bg-gradient-to-br from-slate-900/60 to-purple-900/30 py-20">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mb-12 text-center">
              <h2 className="font-serif text-4xl font-bold">Choose Your Experience</h2>
              <p className="mt-4 text-lg text-white/75">
                All activities are beginner-friendly, instructor-led, and designed for maximum fun and creativity.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {experiences.map((exp, idx) => (
                <Reveal key={exp.title} delay={idx * 50} variant="fade-up">
                  <GlassCard className="flex h-full flex-col p-6">
                    <div className="flex items-start justify-between">
                      <h3 className="font-serif text-xl font-semibold">{exp.title}</h3>
                      <span className="rounded-full bg-purple-500/20 px-3 py-1 text-xs font-semibold text-purple-200">
                        {exp.price}
                      </span>
                    </div>
                    
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-white/75">
                      {exp.description}
                    </p>

                    <div className="mt-4 space-y-2 border-t border-white/10 pt-4 text-xs text-white/60">
                      <div className="flex justify-between">
                        <span>Duration:</span>
                        <span className="text-white/80">{exp.duration}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Skill Level:</span>
                        <span className="text-white/80">{exp.skill}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Take Home:</span>
                        <span className="text-white/80">{exp.takeHome}</span>
                      </div>
                    </div>

                    <Link 
                      href={exp.link}
                      className="mt-4 inline-block text-sm font-semibold text-purple-300 hover:text-purple-200"
                    >
                      Learn more about {exp.title} →
                    </Link>
                  </GlassCard>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing & What's Included */}
        <section className="py-20">
          <div className="mx-auto max-w-5xl px-6">
            <div className="mb-12 text-center">
              <h2 className="font-serif text-4xl font-bold">Simple, Transparent Pricing</h2>
              <p className="mt-4 text-lg text-white/75">
                Pricing varies by activity. Share your budget and we'll craft the perfect experience.
              </p>
            </div>

            <GlassCard className="p-8">
              <div className="grid gap-8 md:grid-cols-2">
                <div>
                  <h3 className="text-xl font-semibold text-purple-200">What's Included</h3>
                  <ul className="mt-4 space-y-3 text-sm text-white/75">
                    <li className="flex items-start gap-2">
                      <span className="text-green-400">✓</span>
                      <span>Expert instruction from professional artists</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-400">✓</span>
                      <span>All materials, tools, and supplies included</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-400">✓</span>
                      <span>Firing, glazing, and finishing (for pottery & glass)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-400">✓</span>
                      <span>Setup and cleanup—you just enjoy!</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-400">✓</span>
                      <span>BYOB—bring any food and drinks</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-400">✓</span>
                      <span>30 minutes early access for decorations</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-pink-200">Pricing Tiers</h3>
                  <div className="mt-4 space-y-3 text-sm">
                    <div className="flex justify-between rounded-lg bg-white/5 p-3">
                      <span className="text-white/75">Budget-Friendly</span>
                      <span className="font-semibold text-white">$45-55/person</span>
                    </div>
                    <div className="text-xs text-white/60 pl-3">
                      Handbuilding, candles, terrariums
                    </div>

                    <div className="flex justify-between rounded-lg bg-white/5 p-3">
                      <span className="text-white/75">Popular Tier</span>
                      <span className="font-semibold text-white">$55-65/person</span>
                    </div>
                    <div className="text-xs text-white/60 pl-3">
                      Pottery wheel, mosaics, bonsai
                    </div>

                    <div className="flex justify-between rounded-lg bg-white/5 p-3">
                      <span className="text-white/75">Premium</span>
                      <span className="font-semibold text-white">$65-85/person</span>
                    </div>
                    <div className="text-xs text-white/60 pl-3">
                      Glass fusion, Turkish lamps
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 rounded-lg border border-purple-500/30 bg-purple-500/10 p-4 text-center">
                <p className="text-sm text-white/80">
                  💡 <strong>Pro Tip:</strong> Mix and match activities for variety! We can create custom packages 
                  combining 2-3 experiences to fit your budget and keep everyone engaged.
                </p>
              </div>
            </GlassCard>
          </div>
        </section>

        {/* How It Works */}
        <section className="border-y border-white/10 bg-gradient-to-br from-pink-900/20 to-purple-900/30 py-20">
          <div className="mx-auto max-w-5xl px-6">
            <div className="mb-12 text-center">
              <h2 className="font-serif text-4xl font-bold">How It Works</h2>
              <p className="mt-4 text-lg text-white/75">
                Booking your private event is simple and stress-free.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-4">
              {[
                {
                  step: "1",
                  title: "Submit Inquiry",
                  description: "Fill out the form below with your event details, group size, and preferred date."
                },
                {
                  step: "2",
                  title: "Get Custom Quote",
                  description: "We'll email you within 24 hours with available times, activity options, and pricing."
                },
                {
                  step: "3",
                  title: "Confirm & Pay",
                  description: "Choose your experience, confirm your date, and secure your spot with a deposit."
                },
                {
                  step: "4",
                  title: "Show Up & Create",
                  description: "Arrive, bring your drinks/food, and enjoy your creative event. We handle everything else!"
                }
              ].map((item, idx) => (
                <Reveal key={item.step} delay={idx * 100} variant="fade-up">
                  <GlassCard className="p-6 text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-purple-500/30 to-pink-500/30">
                      <span className="font-serif text-3xl font-bold text-white">{item.step}</span>
                    </div>
                    <h3 className="mt-4 font-semibold">{item.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-white/70">{item.description}</p>
                  </GlassCard>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Locations */}
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mb-12 text-center">
              <h2 className="font-serif text-4xl font-bold">Two Locations to Serve You</h2>
              <p className="mt-4 text-lg text-white/75">
                Host your private event at either of our creative studios.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
              {cities.map((city, idx) => (
                <Reveal key={city.param} delay={idx * 100} variant="fade-up">
                  <GlassCard className="p-8">
                    <h3 className="font-serif text-2xl font-semibold">{city.label}, {city.param === 'chicago' ? 'Illinois' : 'Oregon'}</h3>
                    <p className="mt-2 text-sm text-white/70">{city.address}</p>
                    
                    <div className="mt-6 space-y-2 text-sm text-white/75">
                      <p><strong>Perfect for:</strong> {city.param === 'chicago' ? 'Pilsen, West Loop, South Loop, and greater Chicago area groups' : 'Downtown Eugene, Whiteaker, and greater Eugene area groups'}</p>
                      <p><strong>Capacity:</strong> Up to 50 guests</p>
                      <p><strong>Parking:</strong> {city.param === 'chicago' ? 'Street parking and nearby lots' : 'Free street parking available'}</p>
                    </div>

                    <div className="mt-6">
                      <Link 
                        href={`/${city.param}`}
                        className="inline-flex items-center gap-2 text-sm font-semibold text-purple-300 hover:text-purple-200"
                      >
                        Explore {city.label} location →
                      </Link>
                    </div>
                  </GlassCard>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section className="border-y border-white/10 bg-gradient-to-br from-slate-900/60 to-indigo-900/30 py-20">
          <div className="mx-auto max-w-4xl px-6">
            <div className="mb-12 text-center">
              <h2 className="font-serif text-4xl font-bold">Frequently Asked Questions</h2>
            </div>

            <div className="space-y-6">
              {faqSchema.mainEntity.map((faq, idx) => (
                <Reveal key={idx} delay={idx * 30} variant="fade-up">
                  <GlassCard className="p-6">
                    <h3 className="font-semibold text-purple-200">{faq.name}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-white/75">{faq.acceptedAnswer.text}</p>
                  </GlassCard>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Inquiry Form */}
        <section id="inquiry-form" className="py-20">
          <div className="mx-auto max-w-4xl px-6">
            <div className="mb-12 text-center">
              <h2 className="font-serif text-4xl font-bold">Get Your Custom Quote</h2>
              <p className="mt-4 text-lg text-white/75">
                Share a few details and we'll respond within 24 hours with availability, pricing, and next steps.
              </p>
            </div>

            <Reveal variant="fade-up">
              <PrivateEventFormCard 
                city={cities[0]} 
                timeWindows={[]} 
              />
            </Reveal>

            <div className="mt-8 text-center text-sm text-white/60">
              <p>Prefer to call? Reach us at <a href="tel:+13128819929" className="inline-block py-2 font-semibold text-purple-300 hover:text-purple-200">312-881-9929</a></p>
              <p className="mt-1">Or email <a href="mailto:support@colorcocktailfactory.com" className="inline-block py-2 font-semibold text-purple-300 hover:text-purple-200">support@colorcocktailfactory.com</a></p>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="gradient-breathing border-t border-white/10 bg-gradient-to-br from-purple-900/40 to-pink-900/40 py-16">
          <div className="mx-auto max-w-3xl px-6 text-center">
            <h2 className="font-serif text-3xl font-bold">Ready to Create Something Unforgettable?</h2>
            <p className="mt-4 text-lg text-white/80">
              Whether it's a team outing, celebration, or gathering with friends, we'll make it memorable.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <ButtonPill href="#inquiry-form" variant="primary">
                Get Started →
              </ButtonPill>
              <ButtonPill href="/activities" variant="secondary">
                Browse All Experiences
              </ButtonPill>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
