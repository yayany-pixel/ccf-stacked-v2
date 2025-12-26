import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import GlassCard from "@/components/ui/GlassCard";
import TagPill from "@/components/ui/TagPill";
import ButtonPill from "@/components/ui/ButtonPill";
import Reveal from "@/components/motion/Reveal";
import { 
  getActivityBySlug, 
  getAllActivitySlugs, 
  getRelatedActivities,
  getCategoryForSection,
  ACTIVITY_CATEGORIES,
  getLinkAnchorText
} from "@/lib/activities";
import { cities, buildBookingLink } from "@/lib/links";
import type { City } from "@/lib/config";

// Generate static params for all activities
export async function generateStaticParams() {
  const slugs = getAllActivitySlugs();
  return slugs.map((slug) => ({
    slug
  }));
}

// Generate metadata for SEO
export async function generateMetadata({
  params
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const activity = getActivityBySlug(params.slug);
  
  if (!activity) {
    return {
      title: "Activity Not Found",
      description: "This activity could not be found."
    };
  }

  const title = `${activity.heroTitle} | Color Cocktail Factory`;
  const description = activity.heroDescription;
  const url = `https://colorcocktailfactory.com/activities/${activity.slug}`;

  return {
    title,
    description,
    keywords: [
      ...activity.tags,
      `${activity.navLabel} Chicago`,
      `${activity.navLabel} Eugene`,
      "creative workshops",
      "art classes",
      "Color Cocktail Factory"
    ],
    alternates: {
      canonical: url
    },
    openGraph: {
      title,
      description,
      url,
      type: "website",
      images: [
        {
          url: `https://colorcocktailfactory.com/og-${activity.slug}.jpg`,
          width: 1200,
          height: 630,
          alt: activity.heroTitle
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title,
      description
    }
  };
}

export default function ActivityPage({ params }: { params: { slug: string } }) {
  const activity = getActivityBySlug(params.slug);
  
  if (!activity) {
    notFound();
  }

  const relatedActivities = getRelatedActivities(activity, 5);
  const category = getCategoryForSection(activity);
  const categoryInfo = ACTIVITY_CATEGORIES[category];

  // JSON-LD structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "name": activity.heroTitle,
        "description": activity.heroDescription,
        "provider": {
          "@type": "LocalBusiness",
          "name": "Color Cocktail Factory",
          "image": "https://colorcocktailfactory.com/logo.png",
          "address": [
            {
              "@type": "PostalAddress",
              "streetAddress": "1657 W Chicago Ave",
              "addressLocality": "Chicago",
              "addressRegion": "IL",
              "postalCode": "60622",
              "addressCountry": "US"
            },
            {
              "@type": "PostalAddress",
              "streetAddress": "780 Blair Blvd",
              "addressLocality": "Eugene",
              "addressRegion": "OR",
              "postalCode": "97402",
              "addressCountry": "US"
            }
          ],
          "telephone": "+1-312-555-0100"
        },
        "category": categoryInfo.label,
        "offers": {
          "@type": "Offer",
          "availability": "https://schema.org/InStock",
          "priceCurrency": "USD"
        }
      },
      {
        "@type": "FAQPage",
        "mainEntity": activity.faqs.map(faq => ({
          "@type": "Question",
          "name": faq.q,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": faq.a
          }
        }))
      },
      {
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
            "name": "Activities",
            "item": "https://colorcocktailfactory.com/activities"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": activity.heroTitle,
            "item": `https://colorcocktailfactory.com/activities/${activity.slug}`
          }
        ]
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="min-h-screen">
        {/* Breadcrumb Navigation */}
        <nav className="border-b border-white/10 bg-black/20 px-6 py-3">
          <div className="mx-auto max-w-7xl">
            <ol className="flex items-center gap-2 text-sm text-white/60">
              <li>
                <Link href="/" className="hover:text-white">Home</Link>
              </li>
              <li>→</li>
              <li>
                <Link href="/activities" className="hover:text-white">Activities</Link>
              </li>
              <li>→</li>
              <li className="text-white/90">{activity.navLabel}</li>
            </ol>
          </div>
        </nav>

        {/* Hero Section */}
        <div className={`relative overflow-hidden ${activity.overlayClass}`}>
          <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20" />
          <div className="relative mx-auto max-w-7xl px-6 py-16 sm:py-24">
            <div className="mx-auto max-w-3xl">
              <div className="flex flex-wrap items-center gap-2">
                <TagPill>{categoryInfo.icon} {categoryInfo.label}</TagPill>
                {activity.schedulePill && <TagPill>{activity.schedulePill}</TagPill>}
              </div>
              
              <h1 className="mt-4 font-serif text-4xl font-bold tracking-tight sm:text-5xl">
                {activity.heroTitle}
              </h1>
              
              <p className="mt-6 text-lg leading-8 text-white/90">
                {activity.heroDescription}
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                {activity.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-sm text-white/80"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* City-specific booking CTAs */}
              <div className="mt-10 flex flex-wrap gap-4">
                {cities.map((city: City) => {
                  const bookingUrl = activity.booking?.customUrl || buildBookingLink(city, activity);
                  return (
                    <ButtonPill key={city.param} href={bookingUrl} variant="primary">
                      Book in {city.label}
                    </ButtonPill>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="mx-auto max-w-7xl px-6 py-16">
          <div className="grid gap-12 lg:grid-cols-3">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2">
              {/* What You'll Do / Value Cards */}
              <section className="mb-12">
                <h2 className="font-serif text-2xl font-bold">What Makes It Great</h2>
                <div className="mt-6 grid gap-4 sm:grid-cols-3">
                  {activity.valueCards.map((card, idx) => (
                    <GlassCard key={idx} className="p-4">
                      <div className="text-xs font-semibold uppercase tracking-wide text-white/50">
                        {card.label}
                      </div>
                      <h3 className="mt-2 font-serif text-lg font-semibold">{card.title}</h3>
                      <p className="mt-1 text-sm text-white/70">{card.body}</p>
                    </GlassCard>
                  ))}
                </div>
              </section>

              {/* Schedule */}
              {activity.scheduleRows.length > 0 && (
                <section className="mb-12">
                  <h2 className="font-serif text-2xl font-bold">{activity.scheduleTitle}</h2>
                  <p className="mt-1 text-sm text-white/60">{activity.scheduleLabel}</p>
                  <GlassCard className="mt-4 overflow-hidden">
                    <div className="divide-y divide-white/10">
                      {activity.scheduleRows.map((row, idx) => (
                        <div key={idx} className="flex items-center justify-between p-4">
                          <div>
                            <div className="font-semibold">{row.time}</div>
                            {row.note && (
                              <div className="mt-0.5 text-sm text-white/60">{row.note}</div>
                            )}
                          </div>
                          {row.href && (
                            <ButtonPill href={row.href} variant="secondary">
                              Book
                            </ButtonPill>
                          )}
                        </div>
                      ))}
                    </div>
                  </GlassCard>
                </section>
              )}

              {/* FAQs */}
              <section className="mb-12">
                <h2 className="font-serif text-2xl font-bold">Frequently Asked Questions</h2>
                <div className="mt-6 space-y-4">
                  {activity.faqs.map((faq, idx) => (
                    <GlassCard key={idx} className="p-5">
                      <h3 className="font-semibold text-white">{faq.q}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-white/75">{faq.a}</p>
                    </GlassCard>
                  ))}
                </div>
              </section>

              {/* Internal Links - Contextual */}
              <section className="mb-12">
                <GlassCard className="p-6">
                  <h3 className="font-semibold">More Ways to Create</h3>
                  <p className="mt-2 text-sm text-white/70">
                    Looking for something different? Check out our{" "}
                    <Link href="/gift-cards" className="font-semibold text-white underline decoration-white/30 underline-offset-2 hover:decoration-white">
                      gift cards
                    </Link>{" "}
                    (perfect for any occasion) or plan a{" "}
                    <Link href="/activities/private-parties" className="font-semibold text-white underline decoration-white/30 underline-offset-2 hover:decoration-white">
                      private event
                    </Link>{" "}
                    for your team or celebration.
                  </p>
                  <p className="mt-3 text-sm text-white/70">
                    Browse all our{" "}
                    <Link href="/activities" className="font-semibold text-white underline decoration-white/30 underline-offset-2 hover:decoration-white">
                      classes and workshops
                    </Link>{" "}
                    to explore pottery, glass, nature crafts, and more.
                  </p>
                </GlassCard>
              </section>
            </div>

            {/* Right Column - Related Activities */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <h3 className="font-serif text-xl font-bold">Related Activities</h3>
                <p className="mt-1 text-sm text-white/60">You might also enjoy</p>
                
                <div className="mt-6 space-y-3">
                  {relatedActivities.map((related) => (
                    <Link
                      key={related.slug}
                      href={`/activities/${related.slug}`}
                      className="group block"
                    >
                      <GlassCard className="p-4 transition-all hover:border-white/25 hover:bg-white/10">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <div className="text-xs font-semibold uppercase tracking-wide text-white/50">
                              {related.badge.split(" · ")[0]}
                            </div>
                            <h4 className="mt-1 text-sm font-semibold leading-tight group-hover:text-white">
                              {related.navLabel}
                            </h4>
                            <p className="mt-1 text-xs text-white/60 line-clamp-2">
                              {related.heroDescription}
                            </p>
                          </div>
                          <span className="text-lg opacity-0 transition-opacity group-hover:opacity-100">
                            →
                          </span>
                        </div>
                      </GlassCard>
                    </Link>
                  ))}
                </div>

                {/* Category Link */}
                <div className="mt-6">
                  <Link
                    href={`/activities#${category}`}
                    className="block rounded-2xl border border-white/15 bg-white/5 p-4 text-center text-sm font-semibold hover:bg-white/10"
                  >
                    View all {categoryInfo.label} →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
