import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/motion/Reveal";
import GlassCard from "@/components/ui/GlassCard";
import BirthdayFormCard from "@/components/BirthdayFormCard";

// ─────────────────────────────────────────────────────────────────────────────
// CONFIG
// ─────────────────────────────────────────────────────────────────────────────

/** Set to false to swap BYOB block for non-alcoholic guidance */
const BYOB_ENABLED = true;

const BYOB_RULES = [
  "Beer and wine welcome — hard liquor allowed too",
  "Bring your own cups, ice, and any mixers you need",
  "Keep drinks off the art-making surfaces to protect your work",
  "BYOB is for guests 21+ (valid ID may be requested by studio staff)",
  "Outside food and food delivery welcome — cupcakes preferred over whole cakes",
  "Cleanup is shared — we handle the studio, you handle your bottles and trash",
];

const BYOB_OFF_COPY =
  "Our studio is alcohol-free, but you're welcome to bring non-alcoholic beverages, sparkling water, and celebratory mocktails. Great spots for after-party drinks are steps from both locations.";

const UPGRADES = [
  {
    icon: "🥂",
    label: "Champagne Toast Setup",
    detail: "Chilled bottles, flutes, and a dedicated toast moment built into the session",
  },
  {
    icon: "🎂",
    label: "Cake Table Styling",
    detail: "We set a styled table so your dessert moment is photo-ready",
  },
  {
    icon: "🎈",
    label: "Balloon Aesthetic Package",
    detail: "Curated balloon display matching your color palette — set up before you arrive",
  },
  {
    icon: "📸",
    label: "Photographer Add-On",
    detail: "A dedicated photographer captures candid moments throughout the session",
  },
  {
    icon: "🎶",
    label: "Custom Playlist + Birthday Spotlight",
    detail: "Your playlist queued up, plus a birthday spotlight moment mid-session the group won't forget",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// METADATA
// ─────────────────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: "Adult Birthday Party Venue Chicago & Eugene | CCF Creative Parties",
  description:
    "Private, guided art birthday experiences for adults in Chicago (Pilsen) and Eugene, OR. Pottery wheel, paint, mosaics, candles & more. BYOB. 21+ friendly. Milestone-worthy. $55–$95/person.",
  keywords: [
    "adult birthday party venue",
    "birthday party venue near me",
    "birthday party packages",
    "party space rental",
    "birthday party rentals",
    "party rental halls near me",
    "creative birthday party ideas",
    "unique birthday experience",
    "art birthday party",
    "pottery birthday party",
    "craft birthday party",
    "BYOB birthday party",
    "birthday party Chicago",
    "birthday party Eugene Oregon",
    "milestone birthday ideas",
    "21st birthday venue",
    "30th birthday venue",
    "40th birthday venue",
    "private party studio Chicago",
    "private party studio Eugene",
    "adult art class party",
    "paint and sip birthday",
    "pottery wheel party adults",
  ],
  alternates: { canonical: "https://colorcocktailfactory.com/birthday-parties" },
  openGraph: {
    title: "Adult Birthday Party Venue | Creative Experiences — Color Cocktail Factory",
    description:
      "Private art birthday parties for adults in Chicago & Eugene. Pottery, paint, mosaics & more. BYOB welcome. Milestone-worthy. $55–$95/person.",
    url: "https://colorcocktailfactory.com/birthday-parties",
    type: "website",
    images: [
      {
        url: "https://colorcocktailfactory.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Adult Birthday Party at Color Cocktail Factory",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Adult Birthday Party Venue | CCF Creative Parties",
    description:
      "Private art birthday parties for adults in Chicago & Eugene. BYOB. Milestone-worthy. $55–$95/person.",
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// STATIC DATA
// ─────────────────────────────────────────────────────────────────────────────

const packages = [
  {
    emoji: "🏺",
    badge: "Most Popular",
    badgeColor: "border-pink-400/40 bg-pink-500/15 text-pink-300",
    title: "Wheel Night Party",
    subtitle: "Pottery Wheel Experience",
    description:
      "Everyone at their own wheel — centering clay, shaping bowls, cups, or freeform pieces. The most immersive experience we offer. Pairs perfectly with your BYOB setup.",
    bullets: [
      "Private studio — your group only",
      "Instructor-guided from the very first touch",
      "Optional glaze & kiln fire (small fee, ~3-week pickup)",
      "BYOB welcome — bring wine, cocktails, or spirits",
    ],
    bestFor: "21st · 30th · 40th · milestone birthdays · date-night energy groups",
    duration: "2 hours",
  },
  {
    emoji: "🎨",
    badge: "Great for Groups",
    badgeColor: "border-violet-400/40 bg-violet-500/15 text-violet-300",
    title: "Paint & Sip Party",
    subtitle: "Canvas or Wine-Glass Painting",
    description:
      "Guided painting session — everyone works at their own canvas or decorates wine glasses. Social, relaxed, zero experience required. Your vibe, your music, your drinks.",
    bullets: [
      "Canvas or wine-glass format — your choice",
      "Step-by-step instruction, no experience needed",
      "Take your finished piece home the same day",
      "Ideal for groups of any size",
    ],
    bestFor: "Any adult age · large groups · low-key celebration energy",
    duration: "2 hours",
  },
  {
    emoji: "✨",
    badge: "Bold Take-Home",
    badgeColor: "border-cyan-400/40 bg-cyan-500/15 text-cyan-300",
    title: "Signature Experience",
    subtitle: "Mosaics · Turkish Lamp · Candle · Terrarium",
    description:
      "Choose from crafted glass mosaic art, hand-assembled Turkish lamps, scented candle pours, or living terrariums. Striking finished pieces — same-day take-home.",
    bullets: [
      "Finished piece goes home with every guest",
      "No kiln wait — done the same night",
      "Multiple activity formats to choose from",
      "Visible results from the very first session",
    ],
    bestFor: "Creative groups · bachelorette crossovers · milestone celebrations",
    duration: "2 hours",
  },
];

const testimonials = [
  {
    quote:
      "I planned my wife's 40th here and it was genuinely the best party I've ever hosted. The whole group was on pottery wheels. Nobody looked at their phones for two straight hours. The instructor made it feel effortless and we all left with something we're proud of.",
    name: "Marcus T.",
    location: "Chicago",
    initials: "MT",
    avatar: "from-purple-500 to-indigo-600",
  },
  {
    quote:
      "We did the Turkish lamp workshop for my 35th and every single person said it was the most unique birthday they'd ever been to. The vibe was incredible — our playlist, our wine, low studio lighting. The lamps we made now hang in my apartment.",
    name: "Jasmine L.",
    location: "Eugene",
    initials: "JL",
    avatar: "from-pink-500 to-rose-500",
  },
  {
    quote:
      "I've done rooftop bars, escape rooms, wine tours — nothing kept everyone engaged like this. We booked the wheel night for my 30th. Zero phones the entire time. We added the photographer and having those pictures is everything.",
    name: "Renée C.",
    location: "Chicago",
    initials: "RC",
    avatar: "from-cyan-500 to-blue-600",
  },
  {
    quote:
      "Planned my dad's 60th here — eight adults between 50 and 68. Everyone was nervous going in and completely obsessed by the end. They talked about it for weeks. The studio handled every detail. I couldn't have asked for a better night.",
    name: "Diane F.",
    location: "Eugene",
    initials: "DF",
    avatar: "from-amber-500 to-orange-500",
  },
];

const faqs: { q: string; a: string }[] = [
  {
    q: "Is this venue 21+ or all ages?",
    a: "We're all-ages friendly, but adult birthday parties tend to be our specialty. The atmosphere, BYOB policy, and guided creative format naturally draw 21+ groups. If you want a fully adult-vibe private session, just mention it in your inquiry and we'll make sure the setup matches.",
  },
  {
    q: "Can we bring our own alcohol (BYOB)?",
    a: BYOB_ENABLED
      ? "Yes — we're BYOB-friendly. Beer, wine, and spirits are welcome. Bring your own cups, ice, and mixers. Keep drinks off the art-making surfaces to protect your work. BYOB is for guests 21+ (valid ID may be requested). Outside food and delivery also welcome."
      : BYOB_OFF_COPY,
  },
  {
    q: "What's included in the price?",
    a: "All materials, a private studio session for your group, and professional instruction from start to finish. Pottery pieces can optionally be glazed and kiln-fired for a small additional fee (ready ~3 weeks later). For all other activities guests take their finished piece home the same day.",
  },
  {
    q: "How much does an adult birthday party cost?",
    a: "Birthday party packages start at $55 per person and go up to $95 depending on your chosen experience and preferences. You select a budget tier when you submit your inquiry — higher tiers include premium materials and elevated extras. We'll send you a custom quote within 24 hours.",
  },
  {
    q: "What's the minimum and maximum guest count?",
    a: "We're flexible on minimums — reach out and we'll let you know what's available for your group size. We can host private birthday parties of up to 60 guests. If you're planning a large group, mention that in your inquiry so we can confirm availability.",
  },
  {
    q: "How long does a birthday party session last?",
    a: "Each session is 2 hours. That covers instructor-led creative time, a celebration break, and wrap-up. If your group wants more time, just mention it in your inquiry and we'll see what we can arrange.",
  },
  {
    q: "Can we bring a cake or food?",
    a: "Absolutely. Bring finger foods, cupcakes, cake — cupcakes are preferred since they're easier to serve in the studio. Outside delivery is also welcome (pizza, charcuterie, etc.). We ask that food stays off the art-making surfaces.",
  },
  {
    q: "Are there paid upgrades available?",
    a: "Yes — you can add extras like a photographer, champagne toast setup, cake table styling, a balloon aesthetic package, and a custom birthday playlist plus spotlight moment. These are paid add-ons; ask about pricing when you submit your inquiry.",
  },
  {
    q: "Do you have availability on weekends?",
    a: "Weekend slots fill up fastest. We recommend reaching out at least 2–3 weeks in advance for weekend availability. We'll respond within 24 hours with current openings and options. Weekday evening sessions are typically more flexible.",
  },
  {
    q: "What about deposits, changes, or cancellations?",
    // PLACEHOLDER — update with actual policy before launch
    a: "No deposit is required to submit your initial inquiry. Booking terms are confirmed after your quote is agreed upon. Please mention any changes to your guest count as soon as you know — we'll always work with you. Contact us at (312) 881-9929 or hello@colorcocktailfactory.com.",
  },
  {
    q: "Is there parking? Are the studios accessible?",
    a: "Free street parking is available at both our Chicago (Pilsen, 18th St) and Eugene (Lorella Ave) locations. Both studios are wheelchair accessible for pottery classes. Let us know about any accessibility needs in your inquiry and we'll prepare accordingly.",
  },
  {
    q: "Can we pick a theme or customize the experience?",
    a: "The activity is the theme — and it's more memorable than any décor package. A pottery-wheel night feels completely different from a Turkish lamp night. You're welcome to bring your own decorations, balloons, or anything else that personalizes the space.",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// JSON-LD
// ─────────────────────────────────────────────────────────────────────────────

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Color Cocktail Factory",
  description:
    "Premium adult birthday party venue offering private guided art experiences in Chicago (Pilsen) and Eugene, Oregon.",
  url: "https://colorcocktailfactory.com/birthday-parties",
  telephone: "+1-312-881-9929",
  priceRange: "$$",
  address: [
    {
      "@type": "PostalAddress",
      streetAddress: "1142 W. 18th Street",
      addressLocality: "Chicago",
      addressRegion: "IL",
      postalCode: "60608",
      addressCountry: "US",
    },
    {
      "@type": "PostalAddress",
      streetAddress: "1162 Lorella Ave",
      addressLocality: "Eugene",
      addressRegion: "OR",
      postalCode: "97401",
      addressCountry: "US",
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// PAGE COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export default function BirthdayPartiesPage() {
  return (
    <main className="min-h-screen">
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />

      {/* CSS */}
      <style>{`
        @keyframes shimmer-ring {
          0%   { transform: rotate(0deg)   scale(1);     opacity: 0.55; }
          50%  { transform: rotate(180deg) scale(1.05);  opacity: 0.8; }
          100% { transform: rotate(360deg) scale(1);     opacity: 0.55; }
        }
        @keyframes badge-glow {
          0%, 100% { box-shadow: 0 0 10px rgba(168,85,247,0.2); }
          50%       { box-shadow: 0 0 24px rgba(168,85,247,0.5), 0 0 40px rgba(236,72,153,0.2); }
        }
        @keyframes shimmer-sweep {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }
        .shimmer-ring { animation: shimmer-ring 10s linear infinite; }
        .badge-glow   { animation: badge-glow 3s ease-in-out infinite; }
        .shimmer-text {
          background: linear-gradient(90deg, #c084fc 0%, #f9a8d4 30%, #ffffff 50%, #f9a8d4 70%, #c084fc 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer-sweep 4s linear infinite;
        }
        .card-lift { transition: transform 0.25s ease, box-shadow 0.25s ease; }
        .card-lift:hover { transform: translateY(-5px); box-shadow: 0 24px 48px rgba(168,85,247,0.22); }
        .upgrade-chip { transition: transform 0.2s ease, background 0.2s ease; }
        .upgrade-chip:hover { transform: translateY(-2px); background: rgba(255,255,255,0.09); }
        details summary::-webkit-details-marker { display: none; }
        details[open] .faq-chevron { transform: rotate(180deg); }
        .faq-chevron { transition: transform 0.2s ease; }
        @media (max-width: 767px) {
          .sticky-cta {
            position: fixed; bottom: 0; left: 0; right: 0; z-index: 50;
            padding: 12px 16px;
            background: linear-gradient(to top, rgba(15,10,30,0.97) 0%, rgba(15,10,30,0.85) 100%);
            backdrop-filter: blur(12px);
            border-top: 1px solid rgba(255,255,255,0.08);
          }
        }
        @media (min-width: 768px) { .sticky-cta { display: none; } }
      `}</style>

      {/* ─── STICKY MOBILE CTA ─── */}
      <div className="sticky-cta" aria-label="Mobile sticky CTA">
        <a
          href="#birthday-form"
          className="block w-full rounded-full bg-gradient-to-r from-pink-500 to-purple-600 py-3 text-center text-sm font-bold text-white shadow-lg"
        >
          Get Birthday Quote
        </a>
      </div>

      {/* ──────────────────────────────────────────────────────────────
          1. HERO
      ────────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-950 via-purple-950 to-pink-950 pb-28 pt-32">
        {/* Rotating ring accent */}
        <div aria-hidden="true" className="shimmer-ring pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/3">
          <svg width="640" height="640" viewBox="0 0 640 640" fill="none" className="text-purple-500/15">
            <circle cx="320" cy="320" r="290" stroke="currentColor" strokeWidth="2" strokeDasharray="18 10" />
            <circle cx="320" cy="320" r="230" stroke="currentColor" strokeWidth="1" strokeDasharray="6 14" opacity="0.6" />
            <circle cx="320" cy="320" r="170" stroke="currentColor" strokeWidth="1.5" strokeDasharray="12 8" opacity="0.4" />
          </svg>
        </div>
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10" />

        <div className="relative z-10 mx-auto max-w-5xl px-6 text-center">
          <Reveal variant="scale">
            <div className="badge-glow mb-6 inline-flex items-center gap-2 rounded-full border border-purple-400/30 bg-purple-500/10 px-4 py-2 text-sm font-semibold text-purple-300 backdrop-blur-xl">
              ✦ Adult Birthday Party Venue · Chicago &amp; Eugene
            </div>
          </Reveal>

          <Reveal delay={80} variant="fade-up">
            <h1 className="mx-auto max-w-4xl font-serif text-4xl font-light leading-tight tracking-wide sm:text-6xl sm:leading-[1.1]">
              The{" "}
              <span className="shimmer-text font-normal italic">Adult Birthday Party Venue</span>
              {" "}Near You
            </h1>
          </Reveal>

          <Reveal delay={160} variant="fade-up">
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-white/75">
              Date-night energy for your whole crew. Private, guided creative experiences for
              birthdays — pottery, paint, mosaics, candles, and more.
            </p>
            <p className="mx-auto mt-2 max-w-xl text-sm text-white/50">
              21+ friendly. Milestone-worthy. BYOB welcome. $55–$95/person.
              Chicago (Pilsen) &amp; Eugene, OR.
            </p>
          </Reveal>

          <Reveal delay={240} variant="fade-up">
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              <a
                href="#birthday-form"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 px-8 py-4 text-base font-bold text-white shadow-lg shadow-purple-600/30 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-purple-500/40"
              >
                Check Availability
              </a>
              <a
                href="#birthday-form"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-8 py-4 text-base font-semibold text-white backdrop-blur-sm transition hover:bg-white/10"
              >
                Get My Birthday Quote
              </a>
              <a
                href="tel:3128819929"
                className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-6 py-4 text-sm font-semibold text-emerald-300 backdrop-blur-sm transition hover:bg-emerald-500/15"
                aria-label="Call us"
              >
                📞 (312) 881-9929
              </a>
            </div>
          </Reveal>

          <Reveal delay={320} variant="fade-up">
            <div className="mx-auto mt-14 flex max-w-2xl flex-wrap justify-center gap-10">
              {[
                { stat: "2 hrs", label: "private session" },
                { stat: "Up to 60", label: "guests" },
                { stat: "$55–$95", label: "per person" },
                { stat: "21+", label: "friendly vibe" },
              ].map(({ stat, label }) => (
                <div key={stat} className="text-center">
                  <div className="text-2xl font-bold text-white">{stat}</div>
                  <div className="mt-0.5 text-xs uppercase tracking-wider text-white/50">{label}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────────
          2. THE VIBE
      ────────────────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 py-24">
        <div className="mx-auto max-w-4xl px-6">
          <Reveal variant="fade-up">
            <div className="text-center">
              <h2 className="font-serif text-4xl font-light tracking-wide sm:text-5xl">
                Date-night energy,{" "}
                <span className="italic text-purple-300">for your whole crew</span>
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-white/65">
                No awkward mixing with strangers. No restaurant noise. Just your people, a private studio,
                good drinks, and an instructor who makes everyone look like they actually know what they're doing.
              </p>
            </div>
          </Reveal>

          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: "🎯", text: "Guided from start to finish — zero experience, zero stress" },
              { icon: "🍷", text: "BYOB welcome — bring your wine, cocktails, or spirits" },
              { icon: "🔒", text: "Private studio — your group only, no shared space with strangers" },
              { icon: "✨", text: "Ambient lighting, your playlist, premium atmosphere" },
              { icon: "🎁", text: "Every guest leaves with the art they made — not a party favor" },
              { icon: "🎂", text: "Built for milestones — 21st, 30th, 40th, 50th, and beyond" },
            ].map((item, i) => (
              <Reveal key={i} delay={i * 60} variant="fade-up">
                <div className="flex items-start gap-4 rounded-2xl border border-white/8 bg-white/4 p-5 backdrop-blur-sm">
                  <span className="mt-0.5 shrink-0 text-2xl">{item.icon}</span>
                  <p className="text-sm leading-relaxed text-white/75">{item.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────────
          3. PARTY MODES
      ────────────────────────────────────────────────────────────── */}
      <section id="packages" className="bg-gradient-to-br from-indigo-900/30 via-purple-900/40 to-pink-900/30 py-24">
        <div className="mx-auto max-w-6xl px-6">
          <Reveal variant="fade-up">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="font-serif text-4xl font-light tracking-wide sm:text-5xl">
                Choose Your{" "}
                <span className="italic text-pink-300">Adult Party Mode</span>
              </h2>
              <p className="mt-4 text-white/65">
                Three approaches to a birthday they'll actually remember. All run 2 hours, starting at $55/person.
              </p>
            </div>
          </Reveal>

          <div className="mt-14 grid gap-8 lg:grid-cols-3">
            {packages.map((pkg, i) => (
              <Reveal key={pkg.title} delay={i * 100} variant="fade-up">
                <GlassCard className="card-lift flex h-full flex-col p-8 hover:border-purple-400/25">
                  <div className="mb-3 flex items-start justify-between">
                    <span className="text-4xl">{pkg.emoji}</span>
                    <span className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${pkg.badgeColor}`}>
                      {pkg.badge}
                    </span>
                  </div>
                  <h3 className="mt-2 text-xl font-bold leading-snug">{pkg.title}</h3>
                  <p className="mt-0.5 text-xs font-medium uppercase tracking-wider text-white/45">{pkg.subtitle}</p>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-white/70">{pkg.description}</p>
                  <ul className="mt-5 space-y-1.5 border-t border-white/10 pt-5">
                    {pkg.bullets.map((b) => (
                      <li key={b} className="flex items-start gap-2 text-xs text-white/60">
                        <span className="mt-0.5 shrink-0 text-purple-400">✓</span>
                        {b}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-5 space-y-1 text-xs text-white/40">
                    <div>⏱ {pkg.duration}</div>
                    <div>👥 Best for: {pkg.bestFor}</div>
                  </div>
                  <a
                    href="#birthday-form"
                    className="mt-6 block rounded-full border border-white/15 bg-white/5 py-2.5 text-center text-sm font-semibold text-white/80 transition hover:bg-white/10"
                  >
                    Book This Experience →
                  </a>
                </GlassCard>
              </Reveal>
            ))}
          </div>

          <Reveal delay={200} variant="fade-up">
            <p className="mt-8 text-center text-sm text-white/40">
              Not sure which to pick? Tell us about your group in the inquiry form and we'll suggest the best fit.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────────
          4. PREMIUM UPGRADES
      ────────────────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-slate-900 via-indigo-900/15 to-slate-900 py-20">
        <div className="mx-auto max-w-5xl px-6">
          <Reveal variant="fade-up">
            <div className="mb-10 text-center">
              <h2 className="font-serif text-3xl font-light tracking-wide sm:text-4xl">
                Elevate the Night —{" "}
                <span className="italic text-purple-300">Premium Upgrades</span>
              </h2>
              <p className="mt-3 text-sm text-white/55">
                Paid add-ons available on request. Ask about pricing in your birthday inquiry.
              </p>
            </div>
          </Reveal>

          <div className="flex flex-wrap justify-center gap-4">
            {UPGRADES.map((u, i) => (
              <Reveal key={u.label} delay={i * 60} variant="fade-up">
                <div className="upgrade-chip flex max-w-xs flex-col gap-2 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
                  <div className="text-2xl">{u.icon}</div>
                  <div className="text-sm font-bold text-white/90">{u.label}</div>
                  <p className="text-xs leading-relaxed text-white/55">{u.detail}</p>
                  {/* PLACEHOLDER pricing — update labels before launch */}
                  <span className="mt-1 self-start rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-xs text-white/35">
                    Ask in inquiry
                  </span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────────
          5. BYOB BLOCK
      ────────────────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-indigo-900/25 via-slate-900 to-purple-900/20 py-20">
        <div className="mx-auto max-w-3xl px-6">
          <Reveal variant="fade-up">
            <GlassCard className="p-8">
              <div className="mb-2 text-2xl">{BYOB_ENABLED ? "🍷" : "🥤"}</div>
              <h2 className="font-serif text-2xl font-light tracking-wide">
                {BYOB_ENABLED ? "BYOB — How It Works" : "Drinks at Color Cocktail Factory"}
              </h2>
              {BYOB_ENABLED ? (
                <ul className="mt-5 space-y-2.5">
                  {BYOB_RULES.map((rule) => (
                    <li key={rule} className="flex items-start gap-3 text-sm text-white/70">
                      <span className="mt-0.5 shrink-0 text-purple-400">✓</span>
                      {rule}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-4 text-sm leading-relaxed text-white/70">{BYOB_OFF_COPY}</p>
              )}
            </GlassCard>
          </Reveal>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────────
          6. HOW IT WORKS
      ────────────────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-slate-900 via-purple-900/15 to-slate-900 py-24">
        <div className="mx-auto max-w-5xl px-6">
          <Reveal variant="fade-up">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="font-serif text-4xl font-light tracking-wide sm:text-5xl">How It Works</h2>
              <p className="mt-3 text-white/60">Planning an adult birthday party here is genuinely easy.</p>
            </div>
          </Reveal>

          <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
            {[
              { step: "01", icon: "📝", title: "Pick a date + experience", desc: "Fill out the short form with your preferred date, activity, and guest count." },
              { step: "02", icon: "📬", title: "We reply in 24 hrs", desc: "Custom quote, available dates, and every detail you need to say yes." },
              { step: "03", icon: "👥", title: "Invite your guests", desc: "We send a registration link so each guest books their own spot individually." },
              { step: "04", icon: "✨", title: "Add your upgrades", desc: "Photographer, champagne toast, cake styling — opt in before the day." },
              { step: "05", icon: "🎂", title: "Celebrate + create", desc: "Walk in, set your drinks on the table, and let us handle everything from there." },
            ].map((item, i) => (
              <Reveal key={item.step} delay={i * 80} variant="fade-up">
                <div className="text-center">
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full border border-purple-400/30 bg-gradient-to-br from-purple-600/25 to-pink-600/25 text-xl">
                    {item.icon}
                  </div>
                  <div className="mb-1 text-xs font-bold uppercase tracking-widest text-white/25">{item.step}</div>
                  <h3 className="text-sm font-bold leading-snug">{item.title}</h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-white/55">{item.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────────
          7. FORM
      ────────────────────────────────────────────────────────────── */}
      <section id="birthday-form" className="bg-gradient-to-br from-purple-950 via-pink-950/50 to-indigo-950 py-24">
        <div className="mx-auto max-w-2xl px-6">
          <Reveal variant="fade-up">
            <div className="mb-10 text-center">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-pink-400/25 bg-pink-500/10 px-4 py-1.5 text-xs font-semibold text-pink-300">
                ✦ Birthday Inquiry
              </div>
              <h2 className="font-serif text-3xl font-light tracking-wide sm:text-4xl">
                Get My <span className="italic text-pink-300">Birthday Quote</span>
              </h2>
              <p className="mx-auto mt-3 max-w-md text-sm text-white/55">
                We reply within 24 hours. No deposit to inquire.
              </p>
            </div>
          </Reveal>
          <Reveal delay={100} variant="fade-up">
            <BirthdayFormCard byobEnabled={BYOB_ENABLED} />
          </Reveal>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────────
          8. TESTIMONIALS
      ────────────────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 py-24">
        <div className="mx-auto max-w-6xl px-6">
          <Reveal variant="fade-up">
            <div className="mx-auto mb-14 max-w-2xl text-center">
              <h2 className="font-serif text-4xl font-light tracking-wide sm:text-5xl">
                What Adults{" "}
                <span className="italic text-purple-300">Actually Said</span>
              </h2>
            </div>
          </Reveal>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {testimonials.map((t, i) => (
              <Reveal key={t.name} delay={i * 80} variant="fade-up">
                <GlassCard className="card-lift flex h-full flex-col p-7">
                  <div className="mb-4 text-sm text-yellow-400" aria-label="5 stars">★★★★★</div>
                  <blockquote className="flex-1 text-sm leading-relaxed text-white/80">
                    &ldquo;{t.quote}&rdquo;
                  </blockquote>
                  <div className="mt-5 flex items-center gap-3 border-t border-white/10 pt-4">
                    <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${t.avatar} text-xs font-bold text-white`}>
                      {t.initials}
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-white/90">{t.name}</div>
                      <div className="text-xs text-white/45">{t.location}</div>
                    </div>
                    <div className="ml-auto flex shrink-0 items-center gap-1 text-white/30">
                      <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" aria-label="Google review">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84z"/>
                      </svg>
                      <span className="text-xs">Google</span>
                    </div>
                  </div>
                </GlassCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────────
          9. FAQ
      ────────────────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-indigo-950 via-purple-950/40 to-slate-950 py-24">
        <div className="mx-auto max-w-3xl px-6">
          <Reveal variant="fade-up">
            <div className="mb-12 text-center">
              <h2 className="font-serif text-4xl font-light tracking-wide sm:text-5xl">
                Questions? <span className="italic text-pink-300">Answered.</span>
              </h2>
              <p className="mt-3 text-white/55">Everything you need to know before you book.</p>
            </div>
          </Reveal>

          <div className="space-y-2.5">
            {faqs.map((faq, i) => (
              <Reveal key={i} delay={i * 25} variant="fade-up">
                <details className="group rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-4">
                    <span className="text-sm font-semibold text-white/90 sm:text-base">{faq.q}</span>
                    <span className="faq-chevron shrink-0 text-white/40">▾</span>
                  </summary>
                  <p className="px-6 pb-5 pt-1 text-sm leading-relaxed text-white/65">{faq.a}</p>
                </details>
              </Reveal>
            ))}
          </div>

          <Reveal delay={100} variant="fade-up">
            <div className="mt-10 text-center">
              <p className="text-sm text-white/40">
                More questions?{" "}
                <a href="tel:3128819929" className="text-purple-400 transition hover:text-purple-300">
                  Call (312) 881-9929
                </a>{" "}
                or{" "}
                <a href="mailto:hello@colorcocktailfactory.com" className="text-purple-400 transition hover:text-purple-300">
                  email us
                </a>.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────────
          10. LOCATIONS
      ────────────────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-slate-900 via-purple-900/15 to-slate-900 py-24">
        <div className="mx-auto max-w-4xl px-6">
          <Reveal variant="fade-up">
            <div className="mb-12 text-center">
              <h2 className="font-serif text-4xl font-light tracking-wide sm:text-5xl">
                Find a Studio{" "}
                <span className="italic text-purple-300">Near You</span>
              </h2>
              <p className="mt-3 text-white/55">Two private studios. Both ready for your birthday.</p>
            </div>
          </Reveal>

          <div className="grid gap-8 md:grid-cols-2">
            {[
              {
                city: "Chicago",
                neighborhood: "Pilsen, IL",
                address: "1142 W. 18th Street, Chicago, IL 60608",
                parking: "Free street parking on 18th St",
                access: "Wheelchair accessible (pottery classes)",
                emoji: "🏙️",
                gradient: "from-purple-800/40 to-indigo-800/40",
                href: "/chicago",
                cta: "View Chicago Studio",
              },
              {
                city: "Eugene",
                neighborhood: "Eugene, OR",
                address: "1162 Lorella Ave, Eugene, OR 97401",
                parking: "Free street parking",
                access: "Wheelchair accessible (pottery classes)",
                emoji: "🌲",
                gradient: "from-green-800/40 to-teal-800/40",
                href: "/eugene",
                cta: "View Eugene Studio",
              },
            ].map((loc, i) => (
              <Reveal key={loc.city} delay={i * 100} variant="fade-up">
                <GlassCard className="card-lift h-full p-8">
                  <div className={`mb-5 flex h-16 w-full items-center justify-center rounded-2xl bg-gradient-to-br ${loc.gradient} text-3xl`}>
                    {loc.emoji}
                  </div>
                  <h3 className="text-xl font-bold">{loc.city}</h3>
                  <p className="mt-0.5 text-xs uppercase tracking-wider text-purple-300">{loc.neighborhood}</p>
                  <div className="mt-4 space-y-2 text-sm text-white/60">
                    <div className="flex items-start gap-2"><span>📍</span>{loc.address}</div>
                    <div className="flex items-center gap-2"><span>📞</span>
                      <a href="tel:3128819929" className="transition hover:text-white">(312) 881-9929</a>
                    </div>
                    <div className="flex items-center gap-2"><span>🚗</span>{loc.parking}</div>
                    <div className="flex items-center gap-2"><span>♿</span>{loc.access}</div>
                  </div>
                  <Link
                    href={loc.href}
                    className="mt-5 block rounded-full border border-white/15 bg-white/5 py-2.5 text-center text-sm font-semibold text-white/75 transition hover:bg-white/10"
                  >
                    {loc.cta} →
                  </Link>
                </GlassCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────────
          11. FINAL CTA
      ────────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-pink-950 via-purple-950 to-indigo-950 py-28 text-center">
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-8" />
        <div className="relative z-10 mx-auto max-w-2xl px-6">
          <Reveal variant="scale">
            <div className="mb-5 text-5xl">🎂</div>
          </Reveal>
          <Reveal delay={80} variant="fade-up">
            <h2 className="font-serif text-4xl font-light leading-tight tracking-wide sm:text-5xl">
              Ready for a Birthday{" "}
              <span className="italic text-pink-300">Worth Remembering?</span>
            </h2>
          </Reveal>
          <Reveal delay={160} variant="fade-up">
            <p className="mx-auto mt-4 max-w-md text-white/65">
              Send a quick inquiry — we reply within 24 hours with availability, pricing, and everything you
              need. No deposit required to get started.
            </p>
          </Reveal>
          <Reveal delay={240} variant="fade-up">
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <a
                href="#birthday-form"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 px-9 py-4 text-base font-bold text-white shadow-lg shadow-pink-500/30 transition-all hover:-translate-y-0.5"
              >
                Get My Birthday Quote
              </a>
              <a
                href="tel:3128819929"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-8 py-4 text-sm font-semibold text-white/75 backdrop-blur-sm transition hover:bg-white/10"
              >
                📞 Call (312) 881-9929
              </a>
            </div>
          </Reveal>
          <Reveal delay={320} variant="fade-up">
            <div className="mt-10 flex flex-wrap items-center justify-center gap-5 text-xs text-white/35">
              <Link href="/chicago" className="transition hover:text-purple-300">Chicago Studio</Link>
              <span>·</span>
              <Link href="/eugene" className="transition hover:text-purple-300">Eugene Studio</Link>
              <span>·</span>
              <Link href="/team-building" className="transition hover:text-purple-300">Team Building</Link>
              <span>·</span>
              <Link href="/bachelorette-parties" className="transition hover:text-purple-300">Bachelorette Parties</Link>
              <span>·</span>
              <Link href="/gift-cards" className="transition hover:text-purple-300">Gift Cards</Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/*
        NEGATIVE KEYWORDS (dev reference — NOT shown to users):
        bounce house rentals, tent rentals, table-and-chair rentals,
        water slide rentals, mechanical bull rental
      */}
    </main>
  );
}
