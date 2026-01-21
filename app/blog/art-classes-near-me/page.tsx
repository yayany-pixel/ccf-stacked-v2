import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import GlassCard from "@/components/ui/GlassCard";
import ButtonPill from "@/components/ui/ButtonPill";
import Reveal from "@/components/motion/Reveal";
import CitySelectorCTA from "@/components/blog/CitySelectorCTA";
import StickyBookingCTA from "@/components/blog/StickyBookingCTA";

export const metadata: Metadata = {
  title: "Art Classes Near Me | Book Local Workshops",
  description: "Find art classes near you—pottery, mosaics, bonsai, and more. Choose your city, pick a time, and book in minutes. Beginner-friendly.",
  keywords: [
    "art classes near me",
    "art classes near me for adults",
    "art classes near me for kids",
    "art classes for kids near me",
    "local art classes for adults near me",
    "summer art classes near me",
    "drawing classes for kids near me",
    "painting classes near me",
    "drawing classes near me",
    "art classes for adults near me",
    "pottery classes near me",
    "ceramic classes near me",
    "creative workshops near me"
  ],
  openGraph: {
    title: "Art Classes Near Me: Find the Right Class for Adults, Kids, and Date Nights",
    description: "Find art classes near you—pottery, mosaics, bonsai, and more. Choose your city, pick a time, and book in minutes. Beginner-friendly.",
    type: "article",
    publishedTime: "2026-01-20",
    authors: ["Color Cocktail Factory"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Art Classes Near Me | Book Local Workshops",
    description: "Find art classes near you—pottery, mosaics, bonsai, and more. Beginner-friendly workshops in Chicago & Eugene."
  },
  alternates: {
    canonical: "https://colorcocktailfactory.com/blog/art-classes-near-me"
  }
};

export default function ArtClassesNearMePage() {
  // JSON-LD structured data
  const blogPostingSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": "Art Classes Near Me: Find the Right Class for Adults, Kids, and Date Nights",
    "description": "Find art classes near you—pottery, mosaics, bonsai, and more. Choose your city, pick a time, and book in minutes. Beginner-friendly.",
    "author": {
      "@type": "Organization",
      "name": "Color Cocktail Factory",
      "url": "https://colorcocktailfactory.com"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Color Cocktail Factory",
      "logo": {
        "@type": "ImageObject",
        "url": "https://colorcocktailfactory.com/images/logo.png"
      }
    },
    "datePublished": "2026-01-20",
    "dateModified": "2026-01-20",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": "https://colorcocktailfactory.com/blog/art-classes-near-me"
    }
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What types of art classes are available near me?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Common art classes near you include pottery and ceramics (wheel throwing, handbuilding), painting (watercolor, acrylic, oil), drawing (figure drawing, sketching), glass art (fusion, blowing, stained glass), mosaics, mixed media, sculpture, printmaking, and craft workshops like candle making, bonsai, and terrarium building. Many studios offer beginner-friendly sessions with all materials included."
        }
      },
      {
        "@type": "Question",
        "name": "Are there art classes for kids near me?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes! Many art studios offer kids and family-friendly sessions, especially during school breaks, summer camps, and weekends. Look for age-specific classes (5-7, 8-12, teens) or family workshops where kids and adults work together. Common kids' classes include drawing, painting, pottery, clay sculpture, and craft projects designed for young artists."
        }
      },
      {
        "@type": "Question",
        "name": "How can I find local art classes for adults?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "To find local art classes for adults: 1) Search Google Maps for 'pottery classes near me' or 'art studios near me', 2) Check community centers and recreation departments, 3) Browse studio websites for class calendars, 4) Look on platforms like Eventbrite or ClassPass, 5) Ask at local art supply stores, 6) Follow studios on Instagram for schedule updates. Many studios offer drop-in sessions perfect for beginners."
        }
      },
      {
        "@type": "Question",
        "name": "What are the benefits of taking art classes?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Benefits of art classes include: stress relief and relaxation, creative self-expression, learning new skills, meeting like-minded people, improved focus and mindfulness, creating meaningful handmade gifts, boosting confidence, trying something outside your routine, and having a screen-free hobby. Art classes provide hands-on experiences that engage both mind and body."
        }
      },
      {
        "@type": "Question",
        "name": "Where can I find summer art classes near me?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Summer art classes are offered by art studios, community centers, parks & recreation departments, university extension programs, and camps. Summer sessions often include kids' camps, intensive workshops, outdoor classes, and themed programs. Check studio websites in May-June for summer schedules, or search for 'summer art camps near me' or 'summer pottery workshops'."
        }
      }
    ]
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://colorcocktailfactory.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Blog",
        "item": "https://colorcocktailfactory.com/blog"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": "Art Classes Near Me",
        "item": "https://colorcocktailfactory.com/blog/art-classes-near-me"
      }
    ]
  };

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/40 to-slate-900">
        <div className="sparkle-noise absolute inset-0 opacity-20" />
        
        <div className="relative mx-auto max-w-4xl px-6 py-20">
          {/* Breadcrumbs */}
          <Reveal variant="fade-up">
            <nav className="flex items-center gap-2 text-sm text-white/60" aria-label="Breadcrumb">
              <Link href="/" className="hover:text-purple-300">Home</Link>
              <span>/</span>
              <Link href="/blog" className="hover:text-purple-300">Blog</Link>
              <span>/</span>
              <span className="text-white/90">Art Classes Near Me</span>
            </nav>
          </Reveal>

          {/* Hero Section */}
          <Reveal delay={100} variant="fade-up">
            <div className="mt-6">
              <div className="mb-4 flex flex-wrap items-center gap-3 text-sm text-white/60">
                <span className="rounded-full bg-purple-500/20 px-3 py-1 text-purple-200">Local Guides</span>
                <span>January 20, 2026</span>
                <span>•</span>
                <span>10 min read</span>
              </div>
              
              <h1 className="font-serif text-4xl font-bold leading-tight sm:text-5xl">
                Art Classes Near Me: Find the Right Class for Adults, Kids, and Date Nights
              </h1>
              
              <p className="mt-4 text-xl leading-relaxed text-white/80">
                Looking for art classes near you? Whether you're searching for pottery workshops, painting sessions, or creative date night ideas, finding the right local class is easier than you think. Here's everything you need to know to choose your city, pick a class, and book your spot today.
              </p>
            </div>
          </Reveal>

          {/* Above-the-Fold CTA */}
          <Suspense fallback={<div className="h-48" />}>
            <CitySelectorCTA />
          </Suspense>

          {/* Main Content */}
          <div className="mt-12 space-y-8 text-white/85">
            
            {/* Introduction */}
            <Reveal variant="fade-up">
              <GlassCard>
                <div className="p-8">
                  <h2 className="font-serif text-3xl font-bold">Art Classes Near Me: What You'll Find Locally</h2>
                  <div className="mt-4 space-y-4 leading-relaxed">
                    <p>
                      When you search for art classes near me, you'll discover a vibrant local creative community offering everything from pottery and ceramics to painting, drawing, mosaics, glass art, and craft workshops. The best part? Most studios are designed for absolute beginners—no experience required.
                    </p>
                    <p>
                      Common class types you'll find include:
                    </p>
                    <ul className="ml-6 list-disc space-y-2 text-white/75">
                      <li><strong className="text-white/90">Pottery & Ceramics:</strong> Wheel throwing, handbuilding, glazing workshops</li>
                      <li><strong className="text-white/90">Painting:</strong> Watercolor, acrylic, oil painting, sip-and-paint events</li>
                      <li><strong className="text-white/90">Drawing:</strong> Figure drawing, sketching, illustration</li>
                      <li><strong className="text-white/90">Glass Art:</strong> Glass fusion, stained glass, mosaics, glass blowing</li>
                      <li><strong className="text-white/90">Mixed Media & Crafts:</strong> Candle making, bonsai, terrariums, Turkish lamp making</li>
                    </ul>
                    <div className="mt-6 rounded-lg border border-purple-500/30 bg-purple-500/10 p-4">
                      <p className="text-center text-white/90">
                        <strong>Want the fastest path?</strong> Pick your city above and book a spot in our beginner-friendly workshops. Classes run weekly with same-day availability.
                      </p>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </Reveal>

            {/* Art Classes for Kids */}
            <Reveal variant="fade-up">
              <GlassCard>
                <div className="p-8">
                  <h2 className="font-serif text-3xl font-bold">Art Classes Near Me for Kids (and Family-Friendly Options)</h2>
                  <div className="mt-4 space-y-4 leading-relaxed">
                    <p>
                      Searching for <strong>art classes near me for kids</strong> or <strong>drawing classes for kids near me</strong>? Many studios run seasonal kids and family-friendly sessions—especially during school breaks, summer camps, and weekends.
                    </p>
                    <p>
                      What to look for when searching for <strong>art classes for kids near me</strong>:
                    </p>
                    <ul className="ml-6 list-disc space-y-2 text-white/75">
                      <li>Age-appropriate classes (typically 5-7, 8-12, and teen groups)</li>
                      <li>Family workshops where kids and adults work side-by-side</li>
                      <li>Summer art camps with daily or weekly sessions</li>
                      <li>Drop-in sessions for flexibility</li>
                      <li>Classes with all materials included</li>
                    </ul>
                    <p className="mt-4">
                      Popular kids' classes include pottery handbuilding, painting, clay sculpture, drawing basics, and seasonal craft projects. Many studios offer shorter sessions (60-90 minutes) perfect for younger attention spans.
                    </p>
                    <div className="mt-6 rounded-lg border border-cyan-500/30 bg-cyan-500/10 p-4">
                      <p className="text-sm text-white/80">
                        <strong>Looking for kids or family sessions?</strong>{" "}
                        <Link href="/activities" className="text-cyan-300 hover:text-cyan-200 hover:underline">
                          Check the calendar for family-friendly workshops
                        </Link>{" "}
                        or{" "}
                        <Link href="/private-events" className="text-cyan-300 hover:text-cyan-200 hover:underline">
                          book a private family event
                        </Link>.
                      </p>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </Reveal>

            {/* Art Classes for Adults */}
            <Reveal variant="fade-up">
              <GlassCard>
                <div className="p-8">
                  <h2 className="font-serif text-3xl font-bold">Art Classes Near Me for Adults: The Best Way to Start a New Hobby</h2>
                  <div className="mt-4 space-y-4 leading-relaxed">
                    <p>
                      When searching for <strong>art classes for adults near me</strong> or <strong>local art classes for adults near me</strong>, you're likely exploring a new creative hobby, planning a date night, or looking for a social activity with friends. The good news? Adult art classes are designed with beginners in mind.
                    </p>
                    <p>
                      Here's how to choose your vibe:
                    </p>
                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                      <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                        <h3 className="font-semibold text-purple-300">Social + Hands-On</h3>
                        <p className="mt-2 text-sm text-white/70">
                          Pottery wheel throwing, ceramics, handbuilding—perfect for couples and groups
                        </p>
                        <Link href="/chicago/date-night-wheel" className="mt-2 inline-block text-sm text-purple-300 hover:underline">
                          Explore pottery classes →
                        </Link>
                      </div>
                      <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                        <h3 className="font-semibold text-cyan-300">Color + Pattern</h3>
                        <p className="mt-2 text-sm text-white/70">
                          Mosaic workshops, glass fusion, Turkish lamp making
                        </p>
                        <Link href="/chicago/mosaics-and-glass" className="mt-2 inline-block text-sm text-cyan-300 hover:underline">
                          Explore mosaic classes →
                        </Link>
                      </div>
                      <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                        <h3 className="font-semibold text-green-300">Calm + Meditative</h3>
                        <p className="mt-2 text-sm text-white/70">
                          Bonsai workshops, terrarium building, nature-focused crafts
                        </p>
                        <Link href="/chicago/bonsai" className="mt-2 inline-block text-sm text-green-300 hover:underline">
                          Explore bonsai classes →
                        </Link>
                      </div>
                      <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                        <h3 className="font-semibold text-pink-300">Quick Win</h3>
                        <p className="mt-2 text-sm text-white/70">
                          Candle making, wine glass painting, single-session projects
                        </p>
                        <Link href="/activities" className="mt-2 inline-block text-sm text-pink-300 hover:underline">
                          See all workshops →
                        </Link>
                      </div>
                    </div>
                    <div className="mt-6">
                      <p className="mb-3 text-center font-semibold">Ready to book an adult-friendly class?</p>
                      <div className="grid gap-3 sm:grid-cols-3">
                        <ButtonPill 
                          href="https://www.rezclick.com/colorcocktailfactory/index.php?page=calendar&term=pottery"
                          variant="romanceCta"
                          className="w-full text-center"
                        >
                          Book Pottery
                        </ButtonPill>
                        <ButtonPill 
                          href="https://www.rezclick.com/colorcocktailfactory/index.php?page=calendar&term=mosaic"
                          variant="romanceCta"
                          className="w-full text-center"
                        >
                          Book Mosaic
                        </ButtonPill>
                        <ButtonPill 
                          href="https://www.rezclick.com/colorcocktailfactory/index.php?page=calendar&term=bonsai"
                          variant="romanceCta"
                          className="w-full text-center"
                        >
                          Book Bonsai
                        </ButtonPill>
                      </div>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </Reveal>

            {/* Finding the Right Class */}
            <Reveal variant="fade-up">
              <GlassCard>
                <div className="p-8">
                  <h2 className="font-serif text-3xl font-bold">Finding the Right Art Class Near You</h2>
                  
                  <div className="mt-6 space-y-6">
                    <div>
                      <h3 className="text-xl font-semibold text-purple-300">Match the Class to Your Skill Level</h3>
                      <p className="mt-2 leading-relaxed text-white/75">
                        Most local studios welcome absolute beginners. Look for classes labeled "beginner-friendly," "intro," or "no experience required." Instructors provide step-by-step guidance, and all materials are typically included. If you're nervous, start with a shorter single-session workshop before committing to a multi-week course.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold text-cyan-300">Choose by Interests (Not Just Medium)</h3>
                      <p className="mt-2 leading-relaxed text-white/75">
                        Don't just search for "painting classes near me" or "drawing classes near me"—think about <em>why</em> you want to take a class. Use these filters:
                      </p>
                      <ul className="ml-6 mt-3 list-disc space-y-1 text-white/70">
                        <li><strong className="text-white/85">"I want a take-home object"</strong> → Pottery, ceramics, mosaic, candle making</li>
                        <li><strong className="text-white/85">"I want a date night"</strong> → Couples pottery, wine glass painting, partner workshops</li>
                        <li><strong className="text-white/85">"I want low-pressure"</strong> → Drop-in sessions, paint-and-sip, bonsai</li>
                        <li><strong className="text-white/85">"I want something fast"</strong> → Single-session classes under 2 hours</li>
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold text-green-300">Resources for Locating Art Classes Near Me</h3>
                      <p className="mt-2 leading-relaxed text-white/75">
                        To find art classes in your area:
                      </p>
                      <ul className="ml-6 mt-3 list-disc space-y-1 text-white/70">
                        <li>Search Google Maps for "pottery classes near me," "art studios near me," or "painting classes near me"</li>
                        <li>Check local community centers and parks & recreation departments</li>
                        <li>Browse platforms like Eventbrite, ClassPass, or CourseHorse</li>
                        <li>Follow studios on Instagram for schedule updates and special events</li>
                        <li>Ask at local art supply stores for recommendations</li>
                        <li>Look at city event calendars and tourism guides</li>
                      </ul>
                      <p className="mt-3 text-sm text-white/70">
                        Many studios (like Color Cocktail Factory) offer online booking with real-time availability, making it easy to reserve your spot in minutes.
                      </p>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </Reveal>

            {/* Benefits */}
            <Reveal variant="fade-up">
              <GlassCard>
                <div className="p-8">
                  <h2 className="font-serif text-3xl font-bold">Benefits of Taking Art Classes</h2>
                  <div className="mt-4 space-y-4 leading-relaxed">
                    <p>
                      Beyond learning a new skill, art classes offer meaningful benefits:
                    </p>
                    <ul className="ml-6 list-disc space-y-2 text-white/75">
                      <li><strong className="text-white/90">Creative Self-Expression:</strong> Explore ideas and make something uniquely yours</li>
                      <li><strong className="text-white/90">Stress Relief:</strong> Hands-on work provides a screen-free mental break</li>
                      <li><strong className="text-white/90">Social Connection:</strong> Meet like-minded people in a relaxed, creative environment</li>
                      <li><strong className="text-white/90">Skill Building:</strong> Develop new techniques and grow as an artist</li>
                      <li><strong className="text-white/90">Meaningful Gifts:</strong> Create handmade pieces for friends and family</li>
                      <li><strong className="text-white/90">Mindfulness:</strong> Focus on the present moment and improve concentration</li>
                      <li><strong className="text-white/90">Confidence:</strong> Gain pride from completing a project and trying something new</li>
                    </ul>
                    <p className="mt-4 text-sm text-white/60">
                      Note: While many people find art therapeutic, formal art therapy requires a licensed therapist. Think of classes as a rewarding hobby, not medical treatment.
                    </p>
                  </div>
                </div>
              </GlassCard>
            </Reveal>

            {/* Summer Classes */}
            <Reveal variant="fade-up">
              <GlassCard>
                <div className="p-8">
                  <h2 className="font-serif text-3xl font-bold">Summer Art Classes Near Me: What Changes Seasonally</h2>
                  <div className="mt-4 space-y-4 leading-relaxed">
                    <p>
                      Searching for <strong>summer art classes near me</strong>? Summer brings exciting changes to local art studios:
                    </p>
                    <ul className="ml-6 list-disc space-y-2 text-white/75">
                      <li><strong className="text-white/90">Kids' Summer Camps:</strong> Daily or weekly intensive programs (ages 5-17)</li>
                      <li><strong className="text-white/90">Outdoor Workshops:</strong> Plein air painting, outdoor sculpture, nature-inspired crafts</li>
                      <li><strong className="text-white/90">Themed Sessions:</strong> Beach glass art, summer florals, seasonal projects</li>
                      <li><strong className="text-white/90">Extended Hours:</strong> More evening and weekend availability for adults</li>
                      <li><strong className="text-white/90">Short Intensives:</strong> Multi-day workshops for visitors and locals alike</li>
                    </ul>
                    <p className="mt-4">
                      Pro tip: Summer schedules are typically posted in late April or May. Sign up early for popular camps and workshops—spots fill quickly!
                    </p>
                    <div className="mt-6 rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-4">
                      <p className="text-sm text-white/80">
                        <strong>Planning ahead?</strong>{" "}
                        <Link href="/activities" className="text-yellow-300 hover:text-yellow-200 hover:underline">
                          See our current calendar
                        </Link>{" "}
                        or{" "}
                        <Link href="/private-events" className="text-yellow-300 hover:text-yellow-200 hover:underline">
                          book a private summer event
                        </Link>.
                      </p>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </Reveal>

            {/* FAQ */}
            <Reveal variant="fade-up">
              <GlassCard>
                <div className="p-8">
                  <h2 className="font-serif text-3xl font-bold">FAQ: Art Classes Near Me</h2>
                  <div className="mt-6 space-y-6">
                    
                    <div>
                      <h3 className="text-lg font-semibold text-purple-300">What types of art classes are available near me?</h3>
                      <p className="mt-2 leading-relaxed text-white/75">
                        Common art classes near you include pottery and ceramics (wheel throwing, handbuilding), painting (watercolor, acrylic, oil), drawing (figure drawing, sketching), glass art (fusion, blowing, stained glass), mosaics, mixed media, sculpture, printmaking, and craft workshops like candle making, bonsai, and terrarium building. Many studios offer beginner-friendly sessions with all materials included.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-purple-300">Are there art classes for kids near me?</h3>
                      <p className="mt-2 leading-relaxed text-white/75">
                        Yes! Many art studios offer kids and family-friendly sessions, especially during school breaks, summer camps, and weekends. Look for age-specific classes (5-7, 8-12, teens) or family workshops where kids and adults work together. Common kids' classes include drawing, painting, pottery, clay sculpture, and craft projects designed for young artists.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-purple-300">How can I find local art classes for adults?</h3>
                      <p className="mt-2 leading-relaxed text-white/75">
                        To find local art classes for adults: 1) Search Google Maps for "pottery classes near me" or "art studios near me", 2) Check community centers and recreation departments, 3) Browse studio websites for class calendars, 4) Look on platforms like Eventbrite or ClassPass, 5) Ask at local art supply stores, 6) Follow studios on Instagram for schedule updates. Many studios offer drop-in sessions perfect for beginners.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-purple-300">What are the benefits of taking art classes?</h3>
                      <p className="mt-2 leading-relaxed text-white/75">
                        Benefits of art classes include: stress relief and relaxation, creative self-expression, learning new skills, meeting like-minded people, improved focus and mindfulness, creating meaningful handmade gifts, boosting confidence, trying something outside your routine, and having a screen-free hobby. Art classes provide hands-on experiences that engage both mind and body.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-purple-300">Where can I find summer art classes near me?</h3>
                      <p className="mt-2 leading-relaxed text-white/75">
                        Summer art classes are offered by art studios, community centers, parks & recreation departments, university extension programs, and camps. Summer sessions often include kids' camps, intensive workshops, outdoor classes, and themed programs. Check studio websites in May-June for summer schedules, or search for "summer art camps near me" or "summer pottery workshops".
                      </p>
                    </div>

                  </div>
                </div>
              </GlassCard>
            </Reveal>

            {/* Conclusion / Next Steps */}
            <Reveal variant="fade-up">
              <GlassCard>
                <div className="p-8">
                  <h2 className="font-serif text-3xl font-bold">Next Steps: Pick Your City and Book a Class</h2>
                  <div className="mt-4 space-y-4 leading-relaxed">
                    <p>
                      Finding art classes near you doesn't have to be complicated. Whether you're searching for pottery, painting, mosaics, or something entirely new, the key is to start with what excites you—then book your spot.
                    </p>
                    <p>
                      Choose your city below to explore beginner-friendly workshops with same-day availability:
                    </p>
                  </div>
                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    <Link
                      href="/chicago"
                      className="group rounded-xl border border-white/20 bg-gradient-to-br from-purple-500/20 to-pink-500/20 p-6 transition-all hover:border-white/40 hover:shadow-lg hover:shadow-purple-500/30"
                    >
                      <h3 className="text-xl font-semibold text-purple-300 group-hover:text-purple-200">Chicago, IL</h3>
                      <p className="mt-2 text-sm text-white/70">Pilsen studio • Pottery, mosaics, glass art & more</p>
                      <div className="mt-3 text-sm font-semibold text-purple-300 group-hover:text-purple-200">
                        View Chicago classes →
                      </div>
                    </Link>
                    <Link
                      href="/eugene"
                      className="group rounded-xl border border-white/20 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 p-6 transition-all hover:border-white/40 hover:shadow-lg hover:shadow-cyan-500/30"
                    >
                      <h3 className="text-xl font-semibold text-cyan-300 group-hover:text-cyan-200">Eugene, OR</h3>
                      <p className="mt-2 text-sm text-white/70">Downtown Eugene • Creative workshops & pottery</p>
                      <div className="mt-3 text-sm font-semibold text-cyan-300 group-hover:text-cyan-200">
                        View Eugene classes →
                      </div>
                    </Link>
                  </div>
                  <div className="mt-8 border-t border-white/10 pt-6">
                    <p className="mb-3 text-center text-sm text-white/70">Looking for something else?</p>
                    <div className="flex flex-wrap justify-center gap-3">
                      <Link 
                        href="/gift-cards" 
                        className="rounded-full border border-white/20 bg-white/5 px-4 py-2 text-sm text-white/80 transition-all hover:border-white/40 hover:bg-white/10"
                      >
                        Gift Cards
                      </Link>
                      <Link 
                        href="/private-events" 
                        className="rounded-full border border-white/20 bg-white/5 px-4 py-2 text-sm text-white/80 transition-all hover:border-white/40 hover:bg-white/10"
                      >
                        Private Events
                      </Link>
                      <Link 
                        href="/corporate" 
                        className="rounded-full border border-white/20 bg-white/5 px-4 py-2 text-sm text-white/80 transition-all hover:border-white/40 hover:bg-white/10"
                      >
                        Corporate Team Building
                      </Link>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </Reveal>

          </div>

          {/* Back to Blog */}
          <Reveal variant="fade-up" delay={100}>
            <div className="mt-12">
              <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-purple-300 hover:text-purple-200">
                ← Back to Blog
              </Link>
            </div>
          </Reveal>
        </div>

        {/* Sticky CTA */}
        <Suspense fallback={null}>
          <StickyBookingCTA />
        </Suspense>
      </main>
    </>
  );
}
