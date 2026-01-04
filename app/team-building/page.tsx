import type { Metadata } from "next";
import Link from "next/link";
import GlassCard from "@/components/ui/GlassCard";
import ButtonPill from "@/components/ui/ButtonPill";
import Reveal from "@/components/motion/Reveal";
import { sections } from "@/lib/config";
import { audiencePageBreadcrumbs } from "@/lib/breadcrumbs";

export const metadata: Metadata = {
  title: "Team Building Workshops | Corporate Events in Chicago & Eugene",
  description: "Boost morale and creativity with hands-on team building workshops. Pottery, glass fusion, mosaics & more. Perfect for corporate events, office parties, and team bonding. Chicago & Eugene.",
  keywords: [
    "team building Chicago",
    "team building Eugene",
    "corporate events Chicago",
    "corporate team building",
    "office party ideas",
    "team bonding activities",
    "creative team building",
    "pottery team building",
    "corporate workshops Chicago",
    "team building activities Eugene",
    "company event ideas",
    "employee appreciation events"
  ],
  alternates: {
    canonical: "https://colorcocktailfactory.com/team-building"
  },
  openGraph: {
    title: "Team Building Workshops | Color Cocktail Factory",
    description: "Hands-on creative workshops for corporate teams. Pottery, glass art & more in Chicago & Eugene.",
    url: "https://colorcocktailfactory.com/team-building",
    type: "website"
  }
};

export default function TeamBuildingPage() {
  // Filter relevant workshops for team building
  const teamWorkshops = sections.filter(s => 
    ["beginner-wheel", "date-night-wheel", "handbuilding", "turkish", "mosaic", "glass-fusion", "bonsai", "terrarium", "candle"].includes(s.id)
  );

  // Simple emoji mapping
  const emojiMap: Record<string, string> = {
    'beginner-wheel': '🏺',
    'date-night-wheel': '💕',
    'handbuilding': '🎨',
    'turkish': '✨',
    'mosaic': '🎨',
    'glass-fusion': '🌈',
    'bonsai': '🌿',
    'terrarium': '🌱',
    'candle': '🕯️'
  };

  // FAQ Schema
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What group sizes do you accommodate for team building?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "We host teams from 8 to 50+ people. For groups larger than 30, we can arrange multiple sessions or private studio rentals."
        }
      },
      {
        "@type": "Question",
        "name": "How much does team building cost?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Pricing starts at $55-$85 per person depending on the workshop. Volume discounts available for groups of 20+. Contact us for a custom quote."
        }
      },
      {
        "@type": "Question",
        "name": "Can we bring food and drinks?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes! We're BYOB-friendly. Bring wine, beer, snacks, or even cater a meal. We provide all creative materials and instruction."
        }
      },
      {
        "@type": "Question",
        "name": "How long do team building workshops last?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Most workshops run 2-2.5 hours. We can customize timing to fit your schedule, including lunch-and-learn formats or evening events."
        }
      },
      {
        "@type": "Question",
        "name": "Do you offer weekday corporate events?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Absolutely! We offer flexible scheduling including weekday afternoons and evenings. Contact us to discuss your preferred dates."
        }
      }
    ]
  };

  const breadcrumbSchema = audiencePageBreadcrumbs("Team Building", "team-building");

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900/40 to-slate-900">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      
      <div className="sparkle-noise absolute inset-0 opacity-20" />
      
      {/* Hero */}
      <section className="relative overflow-hidden py-24">
        <div className="mx-auto max-w-7xl px-6">
          <Reveal variant="fade-up">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold backdrop-blur-xl">
                🤝 Corporate & Team Events
              </div>
              <h1 className="mt-6 font-serif text-5xl font-bold sm:text-6xl">
                Team Building Through Creativity
              </h1>
              <p className="mx-auto mt-6 max-w-3xl text-xl leading-relaxed text-white/85">
                Build stronger teams through hands-on workshops. Boost morale, spark creativity, and create lasting memories with pottery, glass art, mosaics, and more.
              </p>

              {/* Key Benefits */}
              <div className="mx-auto mt-8 grid max-w-3xl gap-4 text-left sm:grid-cols-3">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">✨</span>
                  <div>
                    <div className="font-semibold">No Experience Needed</div>
                    <div className="text-sm text-white/70">Expert instructors guide every step</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-2xl">🍷</span>
                  <div>
                    <div className="font-semibold">BYOB Welcome</div>
                    <div className="text-sm text-white/70">Bring drinks, snacks, or catering</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-2xl">📍</span>
                  <div>
                    <div className="font-semibold">Two Locations</div>
                    <div className="text-sm text-white/70">Chicago & Eugene</div>
                  </div>
                </div>
              </div>

              <div className="mt-10 flex flex-wrap justify-center gap-4">
                <ButtonPill href="/private-events" variant="primary">
                  Request a Quote →
                </ButtonPill>
                <ButtonPill href="#workshops" variant="secondary">
                  See Workshop Options
                </ButtonPill>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Workshop Options */}
      <section id="workshops" className="relative px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <h2 className="mb-4 text-center font-serif text-4xl font-bold">Choose Your Team Experience</h2>
            <p className="mx-auto mb-12 max-w-2xl text-center text-white/75">
              All workshops are beginner-friendly, fully guided, and designed for teams of 8-50+ people.
            </p>
          </Reveal>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {teamWorkshops.map((workshop, idx) => (
              <Reveal key={workshop.slug} delay={idx * 50}>
                <GlassCard interactive className="h-full">
                  <div className="p-6">
                    <div className="mb-3 text-4xl">{emojiMap[workshop.id] || '🎨'}</div>
                    <h3 className="text-xl font-bold">{workshop.navLabel}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-white/70">
                      {workshop.heroDescription}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <Link 
                        href={`/chicago/${workshop.slug}`}
                        className="rounded-full bg-purple-500/20 px-3 py-1 text-xs font-semibold text-purple-300 hover:bg-purple-500/30"
                      >
                        Chicago
                      </Link>
                      <Link 
                        href={`/eugene/${workshop.slug}`}
                        className="rounded-full bg-cyan-500/20 px-3 py-1 text-xs font-semibold text-cyan-300 hover:bg-cyan-500/30"
                      >
                        Eugene
                      </Link>
                    </div>
                  </div>
                </GlassCard>
              </Reveal>
            ))}
          </div>

          <div className="mt-12 text-center">
            <ButtonPill href="/private-events" variant="primary">
              Request Custom Team Event →
            </ButtonPill>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="relative border-y border-white/10 bg-gradient-to-br from-indigo-900/20 to-purple-900/20 px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <Reveal>
            <h2 className="mb-12 text-center font-serif text-4xl font-bold">How It Works</h2>
          </Reveal>

          <div className="grid gap-8 md:grid-cols-4">
            {[
              { step: "1", title: "Pick Your Workshop", desc: "Choose from pottery, glass, mosaics, and more" },
              { step: "2", title: "Choose Location & Date", desc: "Chicago & Eugene available, weekday or weekend" },
              { step: "3", title: "We Confirm Details", desc: "Get a custom quote and finalize your booking" },
              { step: "4", title: "Show Up & Create", desc: "We provide everything. Just bring your team!" }
            ].map((item, idx) => (
              <Reveal key={idx} delay={idx * 100}>
                <div className="text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-purple-500/30 to-pink-500/30 font-serif text-2xl font-bold">
                    {item.step}
                  </div>
                  <h3 className="font-bold">{item.title}</h3>
                  <p className="mt-2 text-sm text-white/70">{item.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing & Group Sizes */}
      <section className="relative px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <Reveal>
            <h2 className="mb-8 text-center font-serif text-4xl font-bold">Group Sizes & Pricing</h2>
          </Reveal>

          <div className="grid gap-6 md:grid-cols-2">
            <Reveal delay={100}>
              <GlassCard>
                <div className="p-8">
                  <h3 className="text-xl font-bold text-purple-200">Small Teams (8-15)</h3>
                  <p className="mt-2 text-sm text-white/70">
                    Perfect for departments or close-knit groups
                  </p>
                  <div className="mt-4 text-3xl font-bold">$55-$85</div>
                  <div className="text-sm text-white/60">per person</div>
                  <ul className="mt-6 space-y-2 text-sm text-white/75">
                    <li className="flex items-center gap-2">
                      <span className="text-green-400">✓</span>
                      Expert instructor
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-400">✓</span>
                      All materials included
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-400">✓</span>
                      Take-home creations
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-400">✓</span>
                      BYOB policy
                    </li>
                  </ul>
                </div>
              </GlassCard>
            </Reveal>

            <Reveal delay={200}>
              <GlassCard>
                <div className="p-8">
                  <h3 className="text-xl font-bold text-cyan-200">Large Teams (16-50+)</h3>
                  <p className="mt-2 text-sm text-white/70">
                    Great for company-wide events or retreats
                  </p>
                  <div className="mt-4 text-3xl font-bold">Custom Pricing</div>
                  <div className="text-sm text-white/60">volume discounts available</div>
                  <ul className="mt-6 space-y-2 text-sm text-white/75">
                    <li className="flex items-center gap-2">
                      <span className="text-green-400">✓</span>
                      Multiple instructors
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-400">✓</span>
                      Private studio rental
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-400">✓</span>
                      Flexible scheduling
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-400">✓</span>
                      Custom team activities
                    </li>
                  </ul>
                </div>
              </GlassCard>
            </Reveal>
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm italic text-white/60">
              *Prices vary by workshop type. Contact us for exact quote based on group size and date.
            </p>
          </div>
        </div>
      </section>

      {/* What's Included */}
      <section className="relative border-y border-white/10 bg-gradient-to-br from-purple-900/20 to-pink-900/20 px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <Reveal>
            <h2 className="mb-8 text-center font-serif text-4xl font-bold">What's Included</h2>
          </Reveal>

          <div className="grid gap-6 sm:grid-cols-2">
            {[
              { icon: "👨‍🎨", title: "Expert Instruction", desc: "Professional artists guide every step" },
              { icon: "🎨", title: "All Materials", desc: "Clay, glazes, tools - everything provided" },
              { icon: "🏺", title: "Take-Home Art", desc: "Everyone leaves with their creation" },
              { icon: "🍷", title: "BYOB Policy", desc: "Bring your favorite drinks & snacks" },
              { icon: "📸", title: "Photo Opportunities", desc: "Instagram-worthy moments guaranteed" },
              { icon: "♿", title: "Accessible Studio", desc: "Wheelchair accessible, all skill levels" }
            ].map((item, idx) => (
              <Reveal key={idx} delay={idx * 50}>
                <div className="flex items-start gap-4">
                  <div className="text-4xl">{item.icon}</div>
                  <div>
                    <h3 className="font-bold">{item.title}</h3>
                    <p className="mt-1 text-sm text-white/70">{item.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={300}>
            <div className="mt-12 rounded-2xl border border-orange-400/30 bg-orange-500/10 p-6 text-center">
              <p className="font-semibold text-orange-200">Cancellation Policy</p>
              <p className="mt-2 text-sm text-white/75">
                Cancel up to 48 hours before your event for a full refund. Reschedule anytime with 24-hour notice.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* FAQ */}
      <section className="relative px-6 py-20">
        <div className="mx-auto max-w-3xl">
          <Reveal>
            <h2 className="mb-12 text-center font-serif text-4xl font-bold">Frequently Asked Questions</h2>
          </Reveal>

          <div className="space-y-4">
            {faqSchema.mainEntity.map((faq, idx) => (
              <Reveal key={idx} delay={idx * 50}>
                <GlassCard>
                  <details className="group p-6">
                    <summary className="cursor-pointer list-none font-semibold">
                      <div className="flex items-start justify-between gap-4">
                        <span>{faq.name}</span>
                        <span className="text-2xl transition-transform group-open:rotate-180">▼</span>
                      </div>
                    </summary>
                    <p className="mt-4 leading-relaxed text-white/75">
                      {faq.acceptedAnswer.text}
                    </p>
                  </details>
                </GlassCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative px-6 py-20">
        <div className="mx-auto max-w-4xl text-center">
          <Reveal variant="scale">
            <GlassCard>
              <div className="p-12">
                <h2 className="font-serif text-3xl font-bold">Ready to Book Your Team Event?</h2>
                <p className="mx-auto mt-4 max-w-2xl text-lg text-white/75">
                  Fill out our private event form and we'll get back to you within 24 hours with a custom quote.
                </p>
                <div className="mt-8 flex flex-wrap justify-center gap-4">
                  <ButtonPill href="/private-events" variant="primary">
                    Request a Quote →
                  </ButtonPill>
                  <ButtonPill href="/activities" variant="secondary">
                    Browse All Workshops
                  </ButtonPill>
                </div>
                <p className="mt-6 text-sm text-white/60">
                  Questions? Email us at <a href="mailto:support@colorcocktailfactory.com" className="text-purple-300 underline">support@colorcocktailfactory.com</a>
                </p>
              </div>
            </GlassCard>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
