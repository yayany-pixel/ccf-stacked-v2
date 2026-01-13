import type { Metadata } from "next";
import Link from "next/link";
import SectionBand from "@/components/SectionBand";
import GlassCard from "@/components/ui/GlassCard";
import TagPill from "@/components/ui/TagPill";
import ButtonPill from "@/components/ui/ButtonPill";
import BookingLink from "@/components/BookingLink";
import PrivateEventFormCard from "@/components/PrivateEventFormCard";
import { sections, type SectionConfig } from "@/lib/config";
import { getCityByParam, buildBookingLink } from "@/lib/links";
import { buildActivityMetadata } from "@/lib/seo";
import { activityJsonLd, faqJsonLd, breadcrumbJsonLd } from "@/lib/structuredData";
import { generateFAQSchema, generateCourseSchema, generateBreadcrumbSchema } from "@/lib/enhancedStructuredData";

function getSection(slug: string): SectionConfig | undefined {
  return sections.find((s) => s.slug === slug);
}

export async function generateMetadata({
  params
}: {
  params: { city: string; slug: string };
}): Promise<Metadata> {
  const city = getCityByParam(params.city);
  const section = getSection(params.slug);
  if (!section) return { title: "Class", description: "Explore classes and workshops." };
  return buildActivityMetadata(city, section);
}

export default function DetailPage({ params }: { params: { city: string; slug: string } }) {
  const city = getCityByParam(params.city);
  const section = getSection(params.slug);

  if (!section) {
    return (
      <main className="min-h-screen px-6">
        <div className="h-24" />
        <div className="mx-auto max-w-3xl">
          <GlassCard className="p-6">
            <h1 className="text-2xl font-semibold">Not found</h1>
            <p className="mt-2 text-white/75">This activity page doesn’t exist in config yet.</p>
            <div className="mt-4">
              <Link className="text-white/80 underline decoration-white/30 underline-offset-4" href={`/${city.param}`}>
                Back home
              </Link>
            </div>
          </GlassCard>
        </div>
      </main>
    );
  }

  const booking = buildBookingLink(city, section);
  const related = sections
    .filter((s) => s.id !== section.id)
    .filter((s) => section.relatedSlugs?.includes(s.slug))
    .slice(0, 3);

  // Generate structured data
  const faqSchema = generateFAQSchema(section);
  const courseSchema = generateCourseSchema(city, section);
  const breadcrumbs = generateBreadcrumbSchema([
    { name: "Home", url: "https://colorcocktailfactory.com" },
    { name: city.label, url: `https://colorcocktailfactory.com/${city.param}` },
    { name: section.heroTitle, url: `https://colorcocktailfactory.com/${city.param}/${section.slug}` }
  ]);

  return (
    <main className="min-h-screen">
      {/* JSON-LD Structured Data */}
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(courseSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />
      
      <div className="h-20" />
      <SectionBand section={section}>
        <div className="mx-auto grid max-w-6xl gap-6 px-6 py-10 md:grid-cols-12">
          <div className="md:col-span-7">
            <GlassCard className="p-7">
              <div className="flex flex-wrap items-center gap-2">
                <TagPill>{section.badge}</TagPill>
                {section.tags.slice(0, 5).map((t) => (
                  <TagPill key={t} subtle>
                    {t}
                  </TagPill>
                ))}
              </div>

              <h1 className="mt-5 font-serif text-4xl leading-tight md:text-5xl">{section.heroTitle}</h1>

              <p className="mt-4 text-base leading-relaxed text-white/80">{section.heroDescription}</p>

              <div className="mt-6 flex flex-wrap gap-3">
                <BookingLink
                  href={booking}
                  city={city.label}
                  classNameText={section.heroTitle}
                  classId={section.slug}
                  className="btn-interactive inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-white/20 border-0 bg-gradient-to-r from-pink-500/80 via-purple-500/80 to-indigo-500/80 text-white shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50"
                >
                  Open booking
                </BookingLink>
                <ButtonPill href="/gift-cards" variant="secondary">
                  Gift cards
                </ButtonPill>
                <ButtonPill href={`/${city.param}/private-parties`} variant="ghost">
                  Private events
                </ButtonPill>
              </div>

              <div className="mt-8 border-t border-white/10 pt-6">
                <h2 className="text-sm font-semibold tracking-wide text-white/85">Fast FAQs</h2>
                <div className="mt-4 grid gap-3">
                  {section.faqs.map((f) => (
                    <details key={f.q} className="group rounded-xl border border-white/10 bg-white/5 p-4">
                      <summary className="cursor-pointer list-none text-sm font-semibold text-white/90">
                        {f.q}
                        <span className="float-right text-white/50 transition group-open:rotate-45">+</span>
                      </summary>
                      <p className="mt-2 text-sm text-white/75">{f.a}</p>
                    </details>
                  ))}
                </div>
              </div>
            </GlassCard>
          </div>

          <div className="md:col-span-5">
            {section.slug === "private-parties" ? (
              <PrivateEventFormCard
                city={city}
                timeWindows={[
                  "Sat · 2:30–5:00 PM (Best overall slot)",
                  "Fri · 5:30–7:30 PM (After-work win)",
                  "Sun · 1:00–4:30 PM (Easy daytime)"
                ]}
              />
            ) : (
              <GlassCard className="p-6">
                <div className="text-xs font-semibold tracking-wide text-white/70">CITY-AWARE BOOKING</div>
                <p className="mt-2 text-sm text-white/80">
                  Links on this page automatically switch based on the city.
                </p>

                <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="text-sm font-semibold">Quick links</div>
                  <div className="mt-3 grid gap-2">
                    <BookingLink
                      href={booking}
                      city={city.label}
                      classNameText={section.heroTitle}
                      classId={section.slug}
                      className="btn-interactive inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-white/20 w-full border-0 bg-gradient-to-r from-pink-500/80 via-purple-500/80 to-indigo-500/80 text-white shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50"
                    >
                      Open calendar
                    </BookingLink>
                    {related.map((r) => (
                      <ButtonPill key={r.id} href={`/${city.param}/${r.slug}`} variant="secondary" full>
                        Related: {r.navLabel}
                      </ButtonPill>
                    ))}
                  </div>
                </div>

                <div className="mt-6 text-xs text-white/55">
                  Edit content, keywords, videos, and sample schedules in{" "}
                  <span className="rounded bg-white/10 px-1.5 py-0.5 font-mono">lib/config.ts</span>.
                </div>
              </GlassCard>
            )}
          </div>
        </div>
      </SectionBand>

      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(activityJsonLd(city, section)) }}
      />
      
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(section.faqs)) }}
      />
      
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbJsonLd([
              { name: "Home", url: `https://colorcocktailfactory.com/${city.param}` },
              { name: section.heroTitle, url: `https://colorcocktailfactory.com/${city.param}/${section.slug}` }
            ])
          )
        }}
      />

      <div className="px-6 pb-16">
        <div className="mx-auto max-w-6xl">
          <GlassCard className="p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="text-sm font-semibold">Explore more</div>
                <div className="text-xs text-white/60">Internal links help Google and humans.</div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Link
                  href={`/${city.param}`}
                  className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-white/85 hover:bg-white/10"
                >
                  Home
                </Link>
                <Link
                  href={`/${city.param}/beginner-wheel`}
                  className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-white/85 hover:bg-white/10"
                >
                  Beginner Wheel
                </Link>
                <Link
                  href={`/${city.param}/handbuilding`}
                  className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-white/85 hover:bg-white/10"
                >
                  Handbuilding
                </Link>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </main>
  );
}
