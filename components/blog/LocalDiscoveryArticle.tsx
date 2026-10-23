import Link from "next/link";
import Image from "next/image";
import type { BlogPost } from "@/lib/blogPosts";
import { getPostImage, getPostImageAlt } from "@/lib/blogPosts";
import { getAuthorBySlug } from "@/lib/authors";
import { STUDIO_LOCATIONS } from "@/lib/locations";
import type { DiscoveryGuide, DiscoveryLink, DiscoveryCTA } from "@/lib/localDiscovery";
import AuthorBio from "@/components/blog/AuthorBio";
import RelatedArticles from "@/components/blog/RelatedArticles";

type Props = { post: BlogPost; guide: DiscoveryGuide };

function ResourceLink({ item, label }: { item: DiscoveryLink; label?: string }) {
  const external = /^https?:\/\//i.test(item.href);
  const content = label || item.label;
  return external
    ? <a href={item.href} target="_blank" rel="noopener noreferrer" className="font-semibold text-purple-200 underline decoration-purple-300/40 underline-offset-4 hover:text-white">{content} <span className="sr-only">(opens a new tab)</span>↗</a>
    : <Link href={item.href} className="font-semibold text-purple-200 underline decoration-purple-300/40 underline-offset-4 hover:text-white">{content} →</Link>;
}

function StudioCTA({ cta }: { cta: DiscoveryCTA }) {
  const location = STUDIO_LOCATIONS[cta.city];
  return (
    <div className="rounded-2xl border border-purple-400/25 bg-gradient-to-br from-purple-900/55 to-slate-900/65 p-6">
      <p className="text-xs font-semibold uppercase tracking-wider text-purple-200">
        {cta.city === "eugene" ? "Eugene, Oregon" : "Chicago, Illinois"} Studio
      </p>
      <h3 className="mt-3 font-serif text-2xl font-bold text-white">{cta.headline}</h3>
      <p className="mt-3 text-sm leading-7 text-white/75">{cta.description}</p>
      <p className="mt-3 text-xs font-semibold text-white/60">{location.address}</p>
      <div className="mt-5 flex flex-wrap gap-3">
        <Link href={cta.href} className="inline-flex rounded-full bg-purple-600 px-5 py-3 text-sm font-semibold text-white hover:bg-purple-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
          {cta.label}
        </Link>
        {cta.secondaryHref && cta.secondaryLabel ? (
          <Link href={cta.secondaryHref} className="inline-flex rounded-full border border-white/25 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10">
            {cta.secondaryLabel} →
          </Link>
        ) : null}
      </div>
    </div>
  );
}

export default function LocalDiscoveryArticle({ post, guide }: Props) {
  const isEugene = guide.city === "eugene";
  const isChicago = guide.city === "chicago";
  const isTwoCity = guide.city === null;
  const dateLabel = new Date(`${post.publishedAt}T12:00:00Z`).toLocaleDateString("en-US", {
    month: "long", day: "numeric", year: "numeric", timeZone: "UTC",
  });

  return (
    <main id="main-content" tabIndex={-1} className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/25 to-slate-900">
      <div className="mx-auto max-w-6xl px-5 pb-20 pt-10 sm:px-6 sm:pt-16">
        <nav aria-label="Breadcrumb" className="text-sm text-white/65">
          <Link href="/" className="hover:text-white">Home</Link>
          <span className="mx-2" aria-hidden="true">/</span>
          <Link href="/blog" className="hover:text-white">Blog</Link>
          <span className="mx-2" aria-hidden="true">/</span>
          <span className="text-white/90">{isEugene ? "Eugene Guides" : isChicago ? "Chicago Guides" : "Holiday Events"}</span>
        </nav>

        <header className="mt-9 max-w-4xl">
          <div className="flex flex-wrap items-center gap-3 text-sm text-white/65">
            <span className="rounded-full border border-purple-400/30 bg-purple-400/10 px-3 py-1 font-semibold text-purple-200">{guide.category}</span>
            {guide.city ? (
              <span className="rounded-full border border-white/20 px-3 py-1 font-semibold text-white">
                {isEugene ? "Eugene, Oregon Only" : "Chicago, Illinois"}
              </span>
            ) : <span className="rounded-full border border-white/20 px-3 py-1 text-white">Two Separate Studios</span>}
            <time dateTime={post.publishedAt}>{dateLabel}</time>
            <span>{post.readTime}</span>
          </div>
          <h1 className="mt-5 font-serif text-4xl font-bold leading-tight text-white sm:text-5xl">{guide.title}</h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-white/80">{guide.description}</p>
        </header>

        <div className="mt-9 max-w-5xl overflow-hidden rounded-3xl border border-white/10 bg-white/5">
          <Image
            src={getPostImage(post)}
            alt={getPostImageAlt(post)}
            width={1200}
            height={675}
            className="max-h-[420px] w-full object-cover"
            priority
          />
        </div>

        <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,1fr)_280px] lg:gap-14">
          <article className="min-w-0 text-base leading-8 text-white/85">
            <div className="space-y-5 text-lg leading-9">
              {guide.intro.map((paragraph, i) => <p key={i}>{paragraph}</p>)}
            </div>

            {isEugene ? (
              <div className="my-9 rounded-2xl border border-emerald-400/25 bg-emerald-900/20 p-5 text-sm leading-7">
                <strong className="text-white">Eugene booking only:</strong> Color Cocktail Factory's Oregon studio is at
                {" "}{STUDIO_LOCATIONS.eugene.address}. Class and group links in this guide point to Eugene options, never Chicago appointments.
              </div>
            ) : isTwoCity ? (
              <div className="my-9 rounded-2xl border border-white/20 bg-white/5 p-5 text-sm leading-7">
                <strong className="text-white">Choose the correct city:</strong> Chicago is at {STUDIO_LOCATIONS.chicago.address};
                Eugene is at {STUDIO_LOCATIONS.eugene.address}. Each has its own booking availability.
              </div>
            ) : null}

            <nav aria-label="On this page" className="my-10 rounded-2xl border border-white/10 bg-white/5 p-6">
              <h2 className="font-serif text-xl font-bold text-white">In This Guide</h2>
              <ol className="mt-3 list-decimal space-y-1 pl-5 text-sm">
                {guide.sections.map((section, i) => (
                  <li key={i}>
                    <a href={`#local-section-${i}`} className="text-purple-200 hover:text-white">{section.heading}</a>
                  </li>
                ))}
              </ol>
            </nav>

            {guide.sections.map((section, index) => (
              <section key={index} id={`local-section-${index}`} className="mb-12 scroll-mt-28" aria-labelledby={`local-heading-${index}`}>
                {section.city ? (
                  <p className="mb-2 text-xs font-bold uppercase tracking-wider text-purple-200">
                    {section.city === "eugene" ? "Eugene, Oregon" : "Chicago, Illinois"}
                  </p>
                ) : null}
                <h2 id={`local-heading-${index}`} className="font-serif text-2xl font-bold leading-snug text-white sm:text-3xl">{section.heading}</h2>
                <div className="mt-4 space-y-4">
                  {section.paragraphs.map((paragraph, i) => <p key={i}>{paragraph}</p>)}
                </div>
                {section.picks && section.picks.length > 0 ? (
                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    {section.picks.map((pick, i) => (
                      <div key={i} className="rounded-xl border border-white/10 bg-white/5 p-5">
                        <h3 className="font-semibold leading-6 text-white">{pick.title}</h3>
                        <p className="mt-2 text-sm leading-6 text-white/75">{pick.description}</p>
                        {pick.href ? (
                          <div className="mt-3 text-sm">
                            <ResourceLink item={{ label: pick.title, href: pick.href }} label={pick.href.startsWith("/") ? "Explore CCF activity" : "View venue details"} />
                          </div>
                        ) : null}
                      </div>
                    ))}
                  </div>
                ) : null}
                {section.tips && section.tips.length > 0 ? (
                  <ul className="mt-5 list-disc space-y-2 rounded-2xl border border-white/10 bg-white/5 py-5 pl-10 pr-6 text-sm leading-7 text-white/80">
                    {section.tips.map((tip) => <li key={tip}>{tip}</li>)}
                  </ul>
                ) : null}
              </section>
            ))}

            <section className="border-t border-white/10 pt-9" aria-labelledby="discovery-faq-heading">
              <h2 id="discovery-faq-heading" className="font-serif text-2xl font-bold text-white sm:text-3xl">Frequently Asked Questions</h2>
              <div className="mt-4 divide-y divide-white/10">
                {guide.faqs.map((item) => (
                  <div key={item.question} className="py-5">
                    <h3 className="font-semibold text-white">{item.question}</h3>
                    <p className="mt-2 text-white/75">{item.answer}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="mt-10" aria-labelledby="discovery-booking-heading">
              <h2 id="discovery-booking-heading" className="mb-5 font-serif text-2xl font-bold text-white">Make a Creative Experience Part of Your Plans</h2>
              <div className={guide.ctas.length > 1 ? "grid gap-4" : "space-y-4"}>
                {guide.ctas.map((cta) => <StudioCTA key={cta.city} cta={cta} />)}
              </div>
            </section>

            {guide.sources.length > 0 ? (
              <section className="mt-12 border-t border-white/10 pt-7" aria-labelledby="discovery-resources-heading">
                <h2 id="discovery-resources-heading" className="font-serif text-xl font-bold text-white">Plan with Official Resources</h2>
                <p className="mt-2 text-sm leading-7 text-white/65">Restaurants, museums, attractions and events set their own schedules and prices. Confirm details directly before traveling.</p>
                <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-7">
                  {guide.sources.map((source, i) => <li key={i}><ResourceLink item={source} /></li>)}
                </ul>
              </section>
            ) : null}
          </article>

          <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start" aria-label="Studio booking and reading">
            <div className="rounded-2xl border border-white/15 bg-white/5 p-6">
              <h2 className="font-serif text-xl font-bold text-white">{isEugene ? "Eugene Studio" : isChicago ? "Chicago Studio" : "Two Studio Locations"}</h2>
              {isTwoCity ? (
                <>
                  <p className="mt-3 text-sm leading-6 text-white/70">Chicago: {STUDIO_LOCATIONS.chicago.streetAddress}, Chicago, IL</p>
                  <p className="mt-2 text-sm leading-6 text-white/70">Eugene: {STUDIO_LOCATIONS.eugene.streetAddress}, Eugene, OR</p>
                  <p className="mt-3 text-xs text-white/60">Choose your city before opening a booking calendar or inquiry.</p>
                </>
              ) : (
                <>
                  <p className="mt-3 text-sm leading-6 text-white/70">{STUDIO_LOCATIONS[guide.city!].address}</p>
                  <p className="mt-2 text-xs leading-5 text-white/60">This article is about the {isEugene ? "Eugene, Oregon" : "Chicago, Illinois"} location.</p>
                </>
              )}
              {guide.ctas.map((cta) => (
                <Link key={cta.city} href={cta.href} className="mt-4 block rounded-xl bg-purple-600 px-4 py-3 text-center text-sm font-semibold text-white hover:bg-purple-500">
                  {cta.city === "eugene" ? "Eugene" : "Chicago"}: {cta.label}
                </Link>
              ))}
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <h2 className="font-semibold text-white">Another guide?</h2>
              <p className="mt-2 text-sm leading-6 text-white/70">Explore more neighborhood, event and creative ideas.</p>
              <Link href="/blog" className="mt-4 inline-block text-sm font-semibold text-purple-200 underline underline-offset-4">Browse the Blog →</Link>
            </div>
          </aside>
        </div>

        <div className="mt-12 space-y-8">
          <RelatedArticles slugs={post.relatedPostSlugs} heading={isEugene ? "More Eugene Ideas" : isChicago ? "More Chicago Ideas" : "Explore Local Guides"} />
          {(() => { const author = getAuthorBySlug(post.authorSlug); return author ? <AuthorBio author={author} /> : null; })()}
        </div>
      </div>
    </main>
  );
}
