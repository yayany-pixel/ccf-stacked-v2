import Link from "next/link";
import type { ReactNode } from "react";
import type { BlogPost } from "@/lib/blogPosts";
import type { LocalFeature } from "@/lib/localFeatures";
import { getAuthorBySlug } from "@/lib/authors";
import { getActivityDetailBySlug } from "@/lib/activityRegistry";
import AuthorBio from "@/components/blog/AuthorBio";
import RelatedArticles from "@/components/blog/RelatedArticles";

type Props = { post: BlogPost; feature: LocalFeature };

function ResourceLink({ url, children }: { url: string; children: ReactNode }) {
  if (url.startsWith("https://colorcocktailfactory.com/")) {
    const internal = url.replace("https://colorcocktailfactory.com", "");
    return <Link href={internal} className="font-semibold text-purple-200 underline decoration-purple-300/40 underline-offset-4 hover:text-white">{children}</Link>;
  }
  return <a href={url} target="_blank" rel="noopener noreferrer" className="font-semibold text-purple-200 underline decoration-purple-300/40 underline-offset-4 hover:text-white">{children} ↗</a>;
}

export default function LocalFeaturePage({ post, feature }: Props) {
  const author = getAuthorBySlug(post.authorSlug);
  const isCostArticle = feature.slug === "what-do-creative-workshops-cost-comparison";
  const relatedActivities = feature.relatedActivitySlugs
    .map(slug => getActivityDetailBySlug(slug))
    .filter((activity): activity is NonNullable<typeof activity> => Boolean(activity))
    .slice(0, 4);
  const published = new Date(`${post.publishedAt}T12:00:00Z`).toLocaleDateString("en-US", {
    month: "long", day: "numeric", year: "numeric", timeZone: "UTC",
  });
  const cityLabel = feature.city === "chicago" ? "Chicago" : feature.city === "eugene" ? "Eugene" : "Chicago & Eugene";
  return (
    <main id="main-content" tabIndex={-1} className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/30 to-slate-900">
      <div className="mx-auto max-w-6xl px-5 pb-20 pt-10 sm:px-6 sm:pt-16">
        <nav aria-label="Breadcrumb" className="text-sm text-white/60">
          <Link href="/" className="hover:text-white">Home</Link>
          <span aria-hidden="true" className="mx-2">/</span>
          <Link href="/blog" className="hover:text-white">Blog</Link>
          <span aria-hidden="true" className="mx-2">/</span>
          <span className="text-white/90">{feature.category}</span>
        </nav>

        <header className="mt-10 max-w-5xl border-b border-white/10 pb-10">
          <div className="mb-5 flex flex-wrap items-center gap-3 text-sm text-white/60">
            <span className="rounded-full border border-purple-400/30 bg-purple-400/10 px-3 py-1 font-semibold text-purple-200">{feature.category}</span>
            <span>{cityLabel}</span>
            <time dateTime={post.publishedAt}>{published}</time>
            <span>{post.readTime}</span>
          </div>
          <h1 className="font-serif text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">{feature.title}</h1>
          <p className="mt-6 max-w-4xl text-lg leading-8 text-white/75">{feature.description}</p>
        </header>

        <div className="mt-10 grid gap-11 lg:grid-cols-[minmax(0,1fr)_280px] lg:gap-14">
          <article className="min-w-0 text-base leading-8 text-white/85">
            <div className="space-y-5 text-lg leading-9">
              {feature.intro.map((paragraph,i) => <p key={i}>{paragraph}</p>)}
            </div>

            {feature.sections.map((section,sectionIndex) => (
              <section key={section.heading} className="mt-11" aria-labelledby={`local-feature-section-${sectionIndex}`}>
                <h2 id={`local-feature-section-${sectionIndex}`} className="mb-5 font-serif text-2xl font-bold leading-snug text-white sm:text-3xl">{section.heading}</h2>
                <div className="space-y-4">
                  {section.paragraphs.map((paragraph,i) => <p key={i}>{paragraph}</p>)}
                </div>
                {section.ideas && section.ideas.length > 0 && (
                  <ol className="mt-7 space-y-4">
                    {section.ideas.map((idea,i) => (
                      <li key={idea.title} className="rounded-2xl border border-white/10 bg-white/5 p-5 sm:p-6">
                        <div className="flex items-start gap-3">
                          <span aria-hidden="true" className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-purple-500/20 text-sm font-bold text-purple-200">{i+1}</span>
                          <div>
                            <h3 className="font-serif text-lg font-bold leading-snug text-white">{idea.title}</h3>
                            <p className="mt-2 text-sm leading-7 text-white/80">{idea.detail}</p>
                            {idea.url && <p className="mt-3 text-sm"><ResourceLink url={idea.url}>{idea.url.startsWith("https://colorcocktailfactory.com/") ? "Explore this CCF experience" : "Official venue information"}</ResourceLink></p>}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ol>
                )}
              </section>
            ))}

            <section className="mt-11 rounded-3xl border border-purple-400/20 bg-purple-500/10 p-6 sm:p-8" aria-labelledby="local-feature-tips">
              <h2 id="local-feature-tips" className="font-serif text-2xl font-bold text-white">Three things to remember</h2>
              <ul className="mt-5 list-disc space-y-3 pl-5 text-white/80">
                {feature.tips.map(tip => <li key={tip}>{tip}</li>)}
              </ul>
            </section>

            <section className="mt-11" aria-labelledby="local-feature-faq">
              <h2 id="local-feature-faq" className="font-serif text-2xl font-bold text-white">Frequently Asked Questions</h2>
              <div className="mt-5 divide-y divide-white/10">
                {feature.faqs.map(faq => (
                  <div key={faq.question} className="py-5">
                    <h3 className="font-semibold text-white">{faq.question}</h3>
                    <p className="mt-2 text-white/75">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </section>

            {feature.sources && feature.sources.length > 0 && (
              <section className="mt-10 border-t border-white/10 pt-7" aria-labelledby="local-feature-sources">
                <h2 id="local-feature-sources" className="font-serif text-xl font-bold text-white">Official visitor information & resources</h2>
                <p className="mt-2 text-sm text-white/60">Schedules, fees, service alerts and venue details can change. Check these official pages before visiting.</p>
                <ul className="mt-4 list-disc space-y-2 pl-6 text-sm">
                  {feature.sources.map(source => <li key={source.url}><ResourceLink url={source.url}>{source.label}</ResourceLink></li>)}
                </ul>
              </section>
            )}

            <section className="mt-12 rounded-3xl border border-pink-400/20 bg-gradient-to-r from-pink-900/40 to-purple-900/40 p-7 sm:p-9">
              <h2 className="font-serif text-2xl font-bold text-white">Make the outing creative</h2>
              <p className="mt-3 text-white/80">
                Color Cocktail Factory offers hands-on workshops in Chicago and Eugene, with different schedules and projects at each studio.
                Check your preferred activity's live calendar and full ticket terms before buying.
                {isCostArticle ? " Ceramic firing and glaze services are optional and may be charged separately." : ""}
              </p>
              <Link href="/activities" className="mt-5 inline-flex rounded-full bg-pink-600 px-6 py-3 text-sm font-semibold text-white hover:bg-pink-500">Explore workshops →</Link>
              {feature.relatedActivitySlugs.includes("private-parties") && (
                <Link href="/private-events" className="ml-3 mt-5 inline-flex rounded-full border border-white/30 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10">Request a group event →</Link>
              )}
            </section>
          </article>

          <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start" aria-label="Related CCF creative experiences">
            <div className="rounded-2xl border border-white/15 bg-white/5 p-6">
              <h2 className="font-serif text-xl font-bold text-white">Related workshops</h2>
              <p className="mt-2 text-sm leading-6 text-white/65">Learn more and check the correct studio's current dates.</p>
              <div className="mt-4 space-y-3">
                {relatedActivities.map(activity => (
                  <Link
                    key={activity.slug}
                    href={`/activities/${activity.slug}${feature.city ? `?city=${feature.city}` : ""}`}
                    className="block rounded-xl border border-white/15 p-3 text-sm font-semibold text-purple-100 transition hover:border-purple-300/40 hover:bg-white/10"
                  >{activity.title} →</Link>
                ))}
                <Link href="/gift-cards" className="block rounded-xl border border-white/15 p-3 text-sm font-semibold text-purple-100 transition hover:border-purple-300/40 hover:bg-white/10">Creative gift cards →</Link>
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-sm leading-6 text-white/70">
              <p className="font-semibold text-white">Plan with verified information</p>
              <p className="mt-2">Prices, studio schedules, venue hours and transit conditions may change. These guides offer planning ideas, not guaranteed availability or a confirmed reservation.</p>
            </div>
          </aside>
        </div>

        <div className="mt-14 space-y-7">
          <RelatedArticles slugs={post.relatedPostSlugs} heading="Keep exploring" />
          {author && <AuthorBio author={author} />}
        </div>
      </div>
    </main>
  );
}
