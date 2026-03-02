import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/motion/Reveal";
import GlassCard from "@/components/ui/GlassCard";
import BirthdayFormCard from "@/components/BirthdayFormCard";

// --- Metadata ----------------------------------------------------------------

export const metadata: Metadata = {
  title: "Birthday Party Venue in Chicago & Eugene | Art & Pottery Birthday Parties",
  description:
    "Book a private hands-on art birthday party at Color Cocktail Factory. Pottery, mosaics, glass art, candles & more. BYOB welcome. All ages. $55–$95/person. Chicago & Eugene.",
  keywords: [
    "birthday party venue",
    "birthday party venue near me",
    "kids birthday party venue",
    "adult birthday party venue",
    "pottery birthday party",
    "clay birthday party",
    "art birthday party",
    "craft birthday party",
    "paint your own pottery party",
    "pottery painting birthday party",
    "kids art studio birthday party",
    "party space rental",
    "birthday party rentals",
    "birthday party packages",
    "private birthday party space",
    "kids activities near me",
    "family activities near me",
    "family entertainment near me",
    "fun family activities near me",
    "art birthday party theme",
    "pottery party theme",
    "Chicago birthday party venue",
    "Eugene birthday party venue",
    "birthday party Chicago Pilsen",
    "birthday party Eugene Oregon",
    "party rental halls near me",
    "creative birthday party ideas",
    "unique birthday party ideas",
    "hands on birthday party",
    "BYOB birthday party",
  ],
  alternates: {
    canonical: "https://colorcocktailfactory.com/birthday-parties",
  },
  openGraph: {
    title: "Birthday Party Venue | Art & Pottery Birthday Parties — Color Cocktail Factory",
    description:
      "Private hands-on art birthday parties in Chicago & Eugene. Pottery, mosaics, glass art, candles & more. BYOB. All ages. $55–$95/person.",
    url: "https://colorcocktailfactory.com/birthday-parties",
    type: "website",
    images: [
      {
        url: "https://colorcocktailfactory.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Birthday Party at Color Cocktail Factory",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Birthday Party Venue | Art & Pottery Parties — Color Cocktail Factory",
    description:
      "Private hands-on art birthday parties in Chicago & Eugene. BYOB. All ages. $55–$95/person.",
  },
};

// --- Static Data -------------------------------------------------------------

const faqs = [
  {
    q: "How much does a birthday party cost?",
    a: "Birthday parties are $55–$95 per person. You choose your budget level when you submit your inquiry — a higher budget means more special touches, premium materials, and elevated extras. All tiers include professional instruction, all materials, a private studio session, and everyone takes home what they make.",
  },
  {
    q: "What ages are birthday parties suitable for?",
    a: "We welcome all ages! Kids (8 and up with an adult present), teens, and adults are all at home here. Activity types vary by age-appropriateness — pottery wheel and glass fusion tend to suit teens and adults best, while handbuilt pottery, candle making, and terrarium building work wonderfully for younger groups too. Let us know ages when you inquire and we'll suggest the best fit.",
  },
  {
    q: "Can we bring our own cake, food, and drinks?",
    a: "Absolutely. We're BYOB-friendly and you're welcome to bring finger foods, cupcakes, and cake (cupcakes preferred — easier to serve in the studio). Bring whatever drinks you'd like to celebrate with. We just ask that you keep food and beverages away from the art-making surfaces to protect everyone's work.",
  },
  {
    q: "How long does a birthday party last?",
    a: "Each birthday party session is 2 hours. That includes instructor-guided art time, a celebration break, and time to wrap up. If you'd like more time, let us know in your inquiry and we'll see what we can accommodate.",
  },
  {
    q: "What's the maximum number of guests?",
    a: "We can host birthday parties of up to 60 guests. If you're planning a large group, mention the size in your inquiry so we can confirm studio availability and any logistics.",
  },
  {
    q: "What if our guest count changes after we submit the inquiry?",
    a: "No problem — guest counts often shift before the day of. We'll finalize the headcount when guests register individually via the link we send after you agree on your quote. Just let us know about any significant changes and we'll adjust accordingly.",
  },
  {
    q: "Can we choose a specific party theme?",
    a: "The activity is the theme — and honestly, it's more memorable than any decoration package. A pottery-wheel birthday feels completely different from a mosaic birthday or a Turkish lamp night. We don't currently offer separate theme décor packages, but you're welcome to bring your own decorations to the studio.",
  },
  {
    q: "What do guests take home after the party?",
    a: "Every guest takes home what they make. For pottery (wheel-thrown or handbuilt), pieces can optionally be glazed and kiln-fired for a small additional fee — ready for pickup approximately 3 weeks after the party. For mosaics, Turkish lamps, glass fusion, candles, and terrariums, guests take their finished piece home the same day.",
  },
  {
    q: "Is there parking? Is the studio wheelchair accessible?",
    a: "Free street parking is available at both our Chicago (Pilsen) and Eugene locations. Our Chicago studio is wheelchair accessible for pottery classes. Please mention any mobility or accessibility needs in your inquiry so we can prepare accordingly.",
  },
  {
    q: "How do I book? What happens after I fill out the form?",
    a: "Fill out the birthday inquiry form below. We'll email you within 24 hours with a custom quote, available date options, and all the details. Once you agree on the package and date, we'll send you a registration link that each of your guests can use to book their own spot individually. No deposit is required to inquire.",
  },
];

const testimonials = [
  {
    quote:
      "My daughter's 11th birthday here was the easiest party I've ever planned — and the most fun she's ever had. Every kid made a terrarium they got to bring home. The instructor was so patient. We booked again for her 12th before we even left.",
    name: "Sarah M.",
    location: "Chicago",
    initials: "SM",
    avatarColor: "from-pink-500 to-rose-500",
  },
  {
    quote:
      "This was the ONLY birthday idea that actually made everyone put down their phones and fully engage. My daughter turned 16 and we did the mosaic workshop. Parents were just as into it as the kids. The studio handled everything effortlessly.",
    name: "Tanya R.",
    location: "Eugene",
    initials: "TR",
    avatarColor: "from-purple-500 to-indigo-500",
  },
  {
    quote:
      "I've thrown birthday parties at restaurants and rooftop bars for years. Nothing has ever been this easy to plan OR this memorable. I sent the form on a Tuesday, had a quote by Wednesday morning, and the whole event was handled. Perfect.",
    name: "Devon K.",
    location: "Chicago",
    initials: "DK",
    avatarColor: "from-cyan-500 to-blue-500",
  },
  {
    quote:
      "I threw my dad a 60th birthday here and everyone — adults in their 50s and 60s — had the time of their lives on the pottery wheel. Nobody wanted to leave. The studio handled everything seamlessly. I cannot recommend this enough.",
    name: "Diane F.",
    location: "Eugene",
    initials: "DF",
    avatarColor: "from-amber-500 to-orange-500",
  },
];

const experiences = [
  {
    emoji: "🏺",
    title: "Pottery Wheel Birthday",
    subtitle: "Wheel Throwing Party",
    description:
      "Everyone gets on a wheel and throws their own piece — cups, bowls, vases, or freeform. The most immersive experience we offer. Pairs perfectly with BYOB wine or cocktails.",
    bestFor: "Teens & Adults · Date night groups · Milestone birthdays",
    duration: "2 hours",
    takeHome: "Your own piece (optional fire & glaze, 3-week pickup)",
    tag: "Most Popular",
    tagColor: "border-pink-400/40 bg-pink-500/15 text-pink-300",
    href: "/chicago/beginner-wheel",
  },
  {
    emoji: "🎨",
    title: "Handbuilt Pottery Birthday",
    subtitle: "Clay Sculpting Party",
    description:
      "No wheel required — guests sculpt by hand, building cups, planters, animals, or whatever they imagine. Tactile, social, and great for mixed ages.",
    bestFor: "All ages (kids 8+) · Family groups · Any crowd",
    duration: "2 hours",
    takeHome: "Your own piece (optional fire & glaze, 3-week pickup)",
    tag: "All Ages",
    tagColor: "border-green-400/40 bg-green-500/15 text-green-300",
    href: "/chicago/handbuilding",
  },
  {
    emoji: "✨",
    title: "Mosaic & Turkish Lamp Birthday",
    subtitle: "Glass Art Party",
    description:
      "Create a stunning mosaic or a handcrafted Turkish lamp using glass, tile, and mirror. Beautiful, bold results from the very first session — no experience needed.",
    bestFor: "Teens & Adults · Bachelorette crossovers · Creative groups",
    duration: "2 hours",
    takeHome: "Finished piece home the same day",
    tag: "Same-Day Take-Home",
    tagColor: "border-cyan-400/40 bg-cyan-500/15 text-cyan-300",
    href: "/chicago/turkish",
  },
  {
    emoji: "🕯️",
    title: "Candle · Terrarium · Glass Fusion",
    subtitle: "Craft & Make Party",
    description:
      "Choose from candle pouring, terrarium building, or glass fusion art. Relaxed, sensory, and endlessly customizable. Everyone leaves with something beautiful.",
    bestFor: "Kids & adults · Relaxed celebrations · Corporate crossovers",
    duration: "2 hours",
    takeHome: "Finished piece home the same day",
    tag: "Beginner Friendly",
    tagColor: "border-purple-400/40 bg-purple-500/15 text-purple-300",
    href: "/chicago/candle",
  },
];

// --- JSON-LD ------------------------------------------------------------------

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
    "Premium hands-on creative birthday party venue in Chicago (Pilsen) and Eugene, Oregon.",
  url: "https://colorcocktailfactory.com/birthday-parties",
  telephone: "+1-312-881-9929",
  priceRange: "$$",
};

// --- Page ---------------------------------------------------------------------

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

      {/* CSS animations */}
      <style>{`
        @keyframes confetti-fall {
          0%   { transform: translateY(-10px) rotate(0deg) scale(1);   opacity: 1; }
          80%  { opacity: 0.6; }
          100% { transform: translateY(120px) rotate(400deg) scale(0.8); opacity: 0; }
        }
        @keyframes badge-pulse {
          0%, 100% { box-shadow: 0 0 12px rgba(236,72,153,0.25); }
          50%       { box-shadow: 0 0 28px rgba(236,72,153,0.55), 0 0 50px rgba(168,85,247,0.3); }
        }
        .confetti-piece { animation: confetti-fall ease-in infinite; }
        .badge-pulse    { animation: badge-pulse 2.2s ease-in-out infinite; }
        .card-hover {
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }
        .card-hover:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 40px rgba(168,85,247,0.2);
        }
        details summary::-webkit-details-marker { display: none; }
        details[open] .faq-chevron { transform: rotate(180deg); }
        .faq-chevron { transition: transform 0.2s ease; }
      `}</style>

      {/* --------------- 1. HERO --------------- */}
      <section className="gradient-breathing relative overflow-hidden bg-gradient-to-br from-indigo-950 via-purple-950 to-pink-950 pb-24 pt-32">
        {/* Confetti */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-10 overflow-hidden">
          {[...Array(14)].map((_, i) => (
            <div
              key={i}
              className="confetti-piece absolute h-2 w-2 rounded-sm"
              style={{
                left: `${5 + i * 6.5}%`,
                top: "-12px",
                backgroundColor: ["#f472b6","#a78bfa","#34d399","#fbbf24","#60a5fa","#fb923c","#e879f9"][i % 7],
                animationDelay: `${i * 0.22}s`,
                animationDuration: `${2.8 + (i % 4) * 0.4}s`,
              }}
            />
          ))}
        </div>

        <div className="sparkle-noise absolute inset-0 bg-[url('/noise.png')] opacity-15" />

        <div className="relative z-20 mx-auto max-w-7xl px-6 text-center">
          <Reveal variant="scale">
            <div className="badge-pulse inline-flex items-center gap-2 rounded-full border border-pink-400/30 bg-pink-500/15 px-4 py-2 text-sm font-semibold text-pink-300 backdrop-blur-xl">
              🎂 Birthday Party Venue · Chicago &amp; Eugene
            </div>
          </Reveal>

          <Reveal delay={100} variant="fade-up">
            <h1 className="mx-auto mt-6 max-w-5xl font-serif text-4xl font-light leading-tight tracking-wide sm:text-6xl sm:leading-tight">
              The Birthday Party Where{" "}
              <span className="italic bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-300 bg-clip-text text-transparent">
                Everyone
              </span>{" "}
              Makes Something They Keep.
            </h1>
          </Reveal>

          <Reveal delay={200} variant="fade-up">
            <p className="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-white/80">
              A private, hands-on art party where everyone actually participates — not just watches.
              Pottery, mosaics, glass art, candles, and more. BYOB welcome. All ages.
              Perfect for kids, teens, and adults who want something better than the usual birthday venue near you.
            </p>
          </Reveal>

          <Reveal delay={300} variant="fade-up">
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <a
                href="#birthday-form"
                className="inline-flex items-center gap-2 rounded-full border border-pink-400/30 bg-gradient-to-r from-pink-500 to-purple-600 px-8 py-4 text-base font-bold text-white shadow-lg shadow-pink-500/30 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-pink-400/50"
              >
                🎉 Request Birthday Party
              </a>
              <a
                href="#packages"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-8 py-4 text-base font-semibold text-white backdrop-blur-sm transition hover:bg-white/15"
              >
                See Experiences ↓
              </a>
            </div>
          </Reveal>

          <Reveal delay={400} variant="fade-up">
            <div className="mx-auto mt-14 flex max-w-2xl flex-wrap justify-center gap-10">
              {[
                { stat: "$55–$95", label: "per person" },
                { stat: "2 hours", label: "party duration" },
                { stat: "Up to 60", label: "guests" },
                { stat: "All ages", label: "welcome" },
              ].map(({ stat, label }) => (
                <div key={stat} className="text-center">
                  <div className="text-2xl font-bold text-white">{stat}</div>
                  <div className="mt-0.5 text-sm text-white/55">{label}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* --------------- 2. WHY PARENTS BOOK THIS --------------- */}
      <section className="bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <Reveal variant="fade-up">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="font-serif text-4xl font-light tracking-wide sm:text-5xl">
                The Birthday Venue for{" "}
                <span className="italic text-purple-300">Families Who Want More</span>
              </h2>
              <p className="mt-4 text-lg text-white/70">
                When you search for <em>kids activities near me</em> or{" "}
                <em>family entertainment near me</em>, you usually find the same options — bounce
                houses, escape rooms, or a restaurant with a cake. This is different.
              </p>
            </div>
          </Reveal>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {[
              {
                icon: "🙌",
                title: "Everyone Participates",
                description:
                  "This is a hands-on creative experience — not a show. Every guest gets a workstation, materials, and an instructor guiding them through something real. No standing around.",
              },
              {
                icon: "🎁",
                title: "Everyone Takes Something Home",
                description:
                  "Every guest leaves with the thing they made — a bowl, a terrarium, a lamp, a candle. Not a party favor bag. An actual piece of art they made with their own hands.",
              },
              {
                icon: "🍾",
                title: "BYOB + Private Studio",
                description:
                  "Bring your own food, cupcakes, wine, or cocktails. Your group gets a private session — no shared space with strangers. It feels like renting your own creative studio.",
              },
            ].map((item, i) => (
              <Reveal key={item.title} delay={i * 100} variant="fade-up">
                <GlassCard className="card-hover h-full p-8">
                  <div className="mb-4 text-4xl">{item.icon}</div>
                  <h3 className="mb-3 text-xl font-bold">{item.title}</h3>
                  <p className="leading-relaxed text-white/70">{item.description}</p>
                </GlassCard>
              </Reveal>
            ))}
          </div>

          <Reveal delay={200} variant="fade-up">
            <div className="mx-auto mt-12 max-w-3xl rounded-3xl border border-white/10 bg-white/5 p-6 text-center backdrop-blur-sm">
              <p className="text-sm text-white/60">
                Looking for <strong className="text-white/80">fun family activities near me</strong>,
                a <strong className="text-white/80">kids birthday party venue</strong>, or an{" "}
                <strong className="text-white/80">adult birthday party venue</strong> that&apos;s
                actually worth showing up to? You&apos;re in the right place.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* --------------- 3. BIRTHDAY EXPERIENCES --------------- */}
      <section id="packages" className="bg-gradient-to-br from-indigo-900/30 via-purple-900/40 to-pink-900/30 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <Reveal variant="fade-up">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="font-serif text-4xl font-light tracking-wide sm:text-5xl">
                Choose Your{" "}
                <span className="italic text-pink-300">Birthday Experience</span>
              </h2>
              <p className="mt-4 text-white/70">
                All experiences run 2 hours and start at $55/person. Budget level is chosen on the
                inquiry form — higher tiers include premium materials and extra special touches.
              </p>
            </div>
          </Reveal>

          <div className="mt-14 grid gap-8 md:grid-cols-2 xl:grid-cols-4">
            {experiences.map((exp, i) => (
              <Reveal key={exp.title} delay={i * 80} variant="fade-up">
                <GlassCard className="card-hover flex h-full flex-col p-7 hover:border-purple-400/30">
                  <div className="mb-1 flex items-start justify-between">
                    <span className="text-4xl">{exp.emoji}</span>
                    <span
                      className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${exp.tagColor}`}
                    >
                      {exp.tag}
                    </span>
                  </div>
                  <h3 className="mt-3 text-xl font-bold leading-snug">{exp.title}</h3>
                  <p className="mt-0.5 text-xs font-medium uppercase tracking-wider text-white/50">
                    {exp.subtitle}
                  </p>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-white/70">
                    {exp.description}
                  </p>
                  <div className="mt-5 space-y-2 border-t border-white/10 pt-4 text-xs text-white/55">
                    <div>⏱ {exp.duration}</div>
                    <div>🎁 {exp.takeHome}</div>
                    <div>👤 Best for: {exp.bestFor}</div>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-base font-bold text-white">From $55/person</span>
                    <Link
                      href={exp.href}
                      className="rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-semibold text-white/80 transition hover:bg-white/10"
                    >
                      See Class →
                    </Link>
                  </div>
                </GlassCard>
              </Reveal>
            ))}
          </div>

          <Reveal delay={200} variant="fade-up">
            <p className="mt-8 text-center text-sm text-white/45">
              Not sure which to pick? Tell us about your group in the form below and we&apos;ll recommend the best fit.
            </p>
          </Reveal>
        </div>
      </section>

      {/* --------------- 5. HOW IT WORKS --------------- */}
      <section className="bg-gradient-to-br from-slate-900 via-indigo-900/20 to-slate-900 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <Reveal variant="fade-up">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="font-serif text-4xl font-light tracking-wide sm:text-5xl">
                How It Works
              </h2>
              <p className="mt-4 text-white/65">
                Planning a birthday party at Color Cocktail Factory is genuinely easy.
              </p>
            </div>
          </Reveal>

          <div className="mt-14 grid gap-8 md:grid-cols-4">
            {[
              {
                step: "01",
                emoji: "📝",
                title: "Fill Out the Inquiry Form",
                desc: "Tell us who's celebrating, the activity you're drawn to, your preferred date, and your guest count.",
              },
              {
                step: "02",
                emoji: "📬",
                title: "We Reply Within 24 Hours",
                desc: "We'll email you a custom quote, available dates, and everything you need to confirm.",
              },
              {
                step: "03",
                emoji: "🔗",
                title: "Guests Register Individually",
                desc: "Once you agree on details, we send you a link. Each guest books their own spot — no group payment headache.",
              },
              {
                step: "04",
                emoji: "🎂",
                title: "Show Up & Create",
                desc: "Walk in, bring your drinks and cupcakes, and let us handle everything. Your only job is to celebrate.",
              },
            ].map((item, i) => (
              <Reveal key={item.step} delay={i * 100} variant="fade-up">
                <div className="relative text-center">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-purple-400/30 bg-gradient-to-br from-purple-600/30 to-pink-600/30 text-2xl shadow-lg shadow-purple-500/20">
                    {item.emoji}
                  </div>
                  <div className="mb-1 text-xs font-bold uppercase tracking-widest text-white/30">
                    Step {item.step}
                  </div>
                  <h3 className="text-lg font-bold">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/60">{item.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* --------------- 6. BIRTHDAY FORM --------------- */}
      <section
        id="birthday-form"
        className="bg-gradient-to-br from-purple-950 via-pink-950/60 to-indigo-950 py-24"
      >
        <div className="mx-auto max-w-3xl px-6">
          <Reveal variant="fade-up">
            <div className="mb-10 text-center">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-pink-400/25 bg-pink-500/10 px-4 py-1.5 text-xs font-semibold text-pink-300">
                🎂 Birthday Party Request Form
              </div>
              <h2 className="font-serif text-4xl font-light tracking-wide sm:text-5xl">
                Plan My{" "}
                <span className="italic text-pink-300">Birthday Party</span>
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-white/65">
                We reply within 24 hours with a custom quote and available dates. No deposit required.
              </p>
            </div>
          </Reveal>
          <Reveal delay={100} variant="fade-up">
            <BirthdayFormCard />
          </Reveal>
        </div>
      </section>

      {/* --------------- 8. GALLERY --------------- */}
      <section className="bg-gradient-to-br from-indigo-900/30 via-purple-900/30 to-pink-900/30 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <Reveal variant="fade-up">
            <div className="mx-auto mb-12 max-w-2xl text-center">
              <h2 className="font-serif text-4xl font-light tracking-wide sm:text-5xl">
                What Birthdays{" "}
                <span className="italic text-pink-300">Look Like Here</span>
              </h2>
              <p className="mt-4 text-white/60">
                Real people, real art, real cake. This is what your party looks like.
              </p>
            </div>
          </Reveal>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { label: "Guests at the pottery wheel", gradient: "from-purple-800/60 to-pink-800/60", emoji: "🏺" },
              { label: "Birthday person throwing clay", gradient: "from-pink-800/60 to-rose-800/60", emoji: "🎂" },
              { label: "Group photo with finished pieces", gradient: "from-indigo-800/60 to-purple-800/60", emoji: "📸" },
              { label: "Cupcakes and BYOB drinks on the table", gradient: "from-amber-800/60 to-orange-800/60", emoji: "🥂" },
              { label: "Turkish lamp glowing at the end of the night", gradient: "from-cyan-800/60 to-teal-800/60", emoji: "✨" },
              { label: "Birthday person with their handbuilt piece", gradient: "from-rose-800/60 to-pink-800/60", emoji: "🎂" },
            ].map((item, i) => (
              <Reveal key={item.label} delay={i * 60} variant="fade-up">
                <div
                  className={`aspect-[4/3] rounded-2xl border border-white/10 bg-gradient-to-br ${item.gradient} flex flex-col items-center justify-center gap-3 p-6 text-center`}
                >
                  <span className="text-5xl" role="img" aria-label={item.label}>{item.emoji}</span>
                  <span className="text-sm font-medium text-white/60">{item.label}</span>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={200} variant="fade-up">
            <p className="mt-6 text-center text-xs text-white/35">
              Tag us{" "}
              <a
                href="https://www.instagram.com/colorcocktailfactory"
                target="_blank"
                rel="noopener noreferrer"
                className="text-pink-400/80 hover:text-pink-300"
              >
                @colorcocktailfactory
              </a>{" "}
              for a feature on our page
            </p>
          </Reveal>
        </div>
      </section>

      {/* --------------- 9. TESTIMONIALS --------------- */}
      <section className="bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <Reveal variant="fade-up">
            <div className="mx-auto mb-14 max-w-2xl text-center">
              <h2 className="font-serif text-4xl font-light tracking-wide sm:text-5xl">
                What Birthday Guests{" "}
                <span className="italic text-purple-300">Actually Said</span>
              </h2>
            </div>
          </Reveal>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {testimonials.map((t, i) => (
              <Reveal key={t.name} delay={i * 80} variant="fade-up">
                <GlassCard className="card-hover flex h-full flex-col p-7">
                  <div className="mb-4 text-sm text-yellow-400" aria-label="5 stars">★★★★★</div>
                  <blockquote className="flex-1 text-sm leading-relaxed text-white/80">
                    &ldquo;{t.quote}&rdquo;
                  </blockquote>
                  <div className="mt-5 flex items-center gap-3 border-t border-white/10 pt-4">
                    <div
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${t.avatarColor} text-xs font-bold text-white`}
                    >
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
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
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

      {/* --------------- 10. FAQ --------------- */}
      <section className="bg-gradient-to-br from-indigo-950 via-purple-950/50 to-slate-950 py-24">
        <div className="mx-auto max-w-3xl px-6">
          <Reveal variant="fade-up">
            <div className="mb-12 text-center">
              <h2 className="font-serif text-4xl font-light tracking-wide sm:text-5xl">
                Birthday Party{" "}
                <span className="italic text-pink-300">FAQs</span>
              </h2>
              <p className="mt-4 text-white/60">Everything you need to know before you book.</p>
            </div>
          </Reveal>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <Reveal key={i} delay={i * 30} variant="fade-up">
                <details className="group rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-4">
                    <span className="text-sm font-semibold text-white/90 sm:text-base">
                      {faq.q}
                    </span>
                    <span className="faq-chevron shrink-0 text-white/40">▾</span>
                  </summary>
                  <p className="px-6 pb-5 pt-1 text-sm leading-relaxed text-white/65">{faq.a}</p>
                </details>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* --------------- 11. LOCATIONS --------------- */}
      <section className="bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 py-24">
        <div className="mx-auto max-w-5xl px-6">
          <Reveal variant="fade-up">
            <div className="mb-12 text-center">
              <h2 className="font-serif text-4xl font-light tracking-wide sm:text-5xl">
                Find Us{" "}
                <span className="italic text-purple-300">Near You</span>
              </h2>
              <p className="mt-4 text-white/60">
                Two studios. Both private. Both ready to host your birthday.
              </p>
            </div>
          </Reveal>

          <div className="grid gap-8 md:grid-cols-2">
            {[
              {
                city: "Chicago",
                neighborhood: "Pilsen",
                address: "1142 W. 18th Street, Chicago, IL 60608",
                phone: "(312) 881-9929",
                parking: "Free street parking on 18th St",
                access: "Wheelchair accessible (pottery classes)",
                emoji: "🏙️",
                gradient: "from-purple-800/40 to-indigo-800/40",
                href: "/chicago",
                cta: "See Chicago Studio",
                seoNote: "Chicago birthday party venue · Pilsen art studio · kids birthday party venue Chicago",
              },
              {
                city: "Eugene",
                neighborhood: "Eugene, Oregon",
                address: "1162 Lorella Ave, Eugene, OR 97401",
                phone: "(312) 881-9929",
                parking: "Free street parking",
                access: "Wheelchair accessible (pottery classes)",
                emoji: "🌲",
                gradient: "from-green-800/40 to-teal-800/40",
                href: "/eugene",
                cta: "See Eugene Studio",
                seoNote: "Eugene birthday party venue · Eugene art studio · private birthday party space Eugene OR",
              },
            ].map((loc, i) => (
              <Reveal key={loc.city} delay={i * 100} variant="fade-up">
                <GlassCard className="card-hover h-full p-8">
                  <div
                    className={`mb-5 flex h-20 w-full items-center justify-center rounded-2xl bg-gradient-to-br ${loc.gradient} text-4xl`}
                  >
                    {loc.emoji}
                  </div>
                  <h3 className="text-2xl font-bold">{loc.city}</h3>
                  <p className="mt-0.5 text-sm text-purple-300">{loc.neighborhood}</p>
                  <div className="mt-4 space-y-2 text-sm text-white/65">
                    <div className="flex items-start gap-2">
                      <span className="shrink-0">📍</span>
                      {loc.address}
                    </div>
                    <div className="flex items-center gap-2">
                      <span>📞</span>
                      <a href="tel:3128819929" className="hover:text-white">
                        {loc.phone}
                      </a>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>🚗</span> {loc.parking}
                    </div>
                    <div className="flex items-center gap-2">
                      <span>♿</span> {loc.access}
                    </div>
                  </div>
                  <p className="mt-3 text-xs italic text-white/25">{loc.seoNote}</p>
                  <Link
                    href={loc.href}
                    className="mt-5 block rounded-full border border-white/15 bg-white/5 py-2.5 text-center text-sm font-semibold text-white/80 transition hover:bg-white/10"
                  >
                    {loc.cta} →
                  </Link>
                </GlassCard>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* --------------- 12. FINAL CTA --------------- */}
      <section className="relative overflow-hidden bg-gradient-to-br from-pink-950 via-purple-950 to-indigo-950 py-28 text-center">
        <div className="sparkle-noise absolute inset-0 opacity-10" />

        <div className="relative z-10 mx-auto max-w-3xl px-6">
          <Reveal variant="scale">
            <div className="mb-6 text-6xl">🎂</div>
          </Reveal>
          <Reveal delay={100} variant="fade-up">
            <h2 className="font-serif text-4xl font-light leading-tight tracking-wide sm:text-5xl">
              Ready to Plan a Birthday{" "}
              <span className="italic text-pink-300">They&apos;ll Never Forget?</span>
            </h2>
          </Reveal>
          <Reveal delay={200} variant="fade-up">
            <p className="mx-auto mt-5 max-w-xl text-lg text-white/70">
              Inquire today — we reply within 24 hours with a quote, available dates, and everything
              you need. No deposit to get started.
            </p>
          </Reveal>
          <Reveal delay={300} variant="fade-up">
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <a
                href="#birthday-form"
                className="inline-flex items-center gap-2 rounded-full border border-pink-400/30 bg-gradient-to-r from-pink-500 to-purple-600 px-9 py-4 text-base font-bold text-white shadow-lg shadow-pink-500/30 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-pink-400/50"
              >
                🎉 Plan My Birthday Party
              </a>
              <Link
                href="/private-events"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/8 px-8 py-4 text-base font-semibold text-white/80 backdrop-blur-sm transition hover:bg-white/15"
              >
                Corporate &amp; Private Events →
              </Link>
            </div>
          </Reveal>
          <Reveal delay={400} variant="fade-up">
            <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-sm text-white/40">
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
    </main>
  );
}

