import Link from "next/link";
import Image from "next/image";
import type { BlogPost } from "@/lib/blogPosts";
import { getPostImage, getPostImageAlt } from "@/lib/blogPosts";
import { getAuthorBySlug } from "@/lib/authors";
import { getActivityDetailBySlug } from "@/lib/activityRegistry";
import type { WorkshopGuide } from "@/lib/workshopGuides";
import AuthorBio from "@/components/blog/AuthorBio";
import RelatedArticles from "@/components/blog/RelatedArticles";

type Props = {
  post: BlogPost;
  guide: WorkshopGuide;
};

export default function WorkshopGuidePage({ post, guide }: Props) {
  const activity = getActivityDetailBySlug(guide.activitySlug);
  const author = getAuthorBySlug(post.authorSlug);
  const activityHref = `/activities/${guide.activitySlug}${guide.city ? `?city=${guide.city}` : ""}`;
  const activityName = activity?.title || "this creative workshop";
  const publishedLabel = new Date(`${post.publishedAt}T12:00:00Z`).toLocaleDateString("en-US", {
    month: "long", day: "numeric", year: "numeric", timeZone: "UTC",
  });

  return (
    <main id="main-content" tabIndex={-1} className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/30 to-slate-900">
      <div className="mx-auto max-w-6xl px-5 pb-20 pt-10 sm:px-6 sm:pt-16">
        <nav className="text-sm text-white/60" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-white">Home</Link>
          <span className="mx-2" aria-hidden="true">/</span>
          <Link href="/blog" className="hover:text-white">Blog</Link>
          <span className="mx-2" aria-hidden="true">/</span>
          <span className="text-white/90">{guide.category}</span>
        </nav>

        <header className="mt-9 max-w-4xl">
          <div className="flex flex-wrap items-center gap-3 text-sm text-white/60">
            <span className="rounded-full border border-purple-400/30 bg-purple-400/10 px-3 py-1 font-semibold text-purple-200">{guide.category}</span>
            {activity?.adultThemed ? (
              <span className="rounded-full border border-rose-400/30 px-3 py-1 text-rose-200">{activity.ageRestriction || "Adults only"}</span>
            ) : null}
            <time dateTime={post.publishedAt}>{publishedLabel}</time>
            <span aria-hidden="true">•</span>
            <span>{post.readTime}</span>
          </div>
          <h1 className="mt-5 font-serif text-4xl font-bold leading-tight text-white sm:text-5xl">{guide.title}</h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-white/75">{guide.description}</p>
        </header>

        <div className="mt-9 max-w-5xl overflow-hidden rounded-3xl border border-white/10 bg-white/5">
          <Image
            src={getPostImage(post)}
            alt={getPostImageAlt(post)}
            width={1200}
            height={675}
            className="max-h-[460px] w-full object-cover"
            priority
          />
        </div>

        <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,1fr)_280px] lg:gap-14">
          <article className="min-w-0 text-base leading-8 text-white/85">
            <div className="space-y-5 text-lg leading-9">
              {guide.intro.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
            </div>

            <div className="my-9 rounded-2xl border border-purple-400/25 bg-purple-500/10 p-6">
              <p className="text-sm font-semibold uppercase tracking-wider text-purple-200">Learn it in the studio</p>
              <p className="mt-2 font-serif text-xl font-semibold text-white">
                Make something yourself at Color Cocktail Factory
              </p>
              <p className="mt-2 text-sm leading-7 text-white/75">
                Explore {activityName.toLowerCase()}, see which studios are offering sessions,
                and review current ticket and finishing details before you book.
              </p>
              <Link href={activityHref} className="mt-4 inline-flex rounded-full bg-purple-600 px-5 py-3 text-sm font-semibold text-white hover:bg-purple-500">
                Explore {activityName} →
              </Link>
            </div>

            {guide.sections.map((section, index) => (
              <section key={section.heading} className="mb-11" aria-labelledby={`workshop-guide-section-${index}`}>
                <h2 id={`workshop-guide-section-${index}`} className="mb-4 font-serif text-2xl font-bold leading-snug text-white sm:text-3xl">
                  {section.heading}
                </h2>
                <div className="space-y-4">
                  {section.paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
                </div>
                {section.tips && section.tips.length > 0 ? (
                  <ul className="mt-5 list-disc space-y-2 rounded-2xl border border-white/10 bg-white/5 py-5 pl-11 pr-6 text-sm leading-7 text-white/80">
                    {section.tips.map((tip) => <li key={tip}>{tip}</li>)}
                  </ul>
                ) : null}
              </section>
            ))}

            <section aria-labelledby="workshop-guide-faq" className="border-t border-white/10 pt-9">
              <h2 id="workshop-guide-faq" className="font-serif text-2xl font-bold text-white sm:text-3xl">
                Frequently Asked Questions
              </h2>
              <div className="mt-5 divide-y divide-white/10">
                {guide.faqs.map((faq) => (
                  <div key={faq.question} className="py-5">
                    <h3 className="font-semibold text-white">{faq.question}</h3>
                    <p className="mt-2 text-white/75">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="mt-10 rounded-3xl border border-pink-400/20 bg-gradient-to-r from-pink-900/40 to-purple-900/40 p-7 sm:p-9">
              <h2 className="font-serif text-2xl font-bold text-white">Ready to try it yourself?</h2>
              <p className="mt-3 leading-7 text-white/80">
                Visit the {activityName} activity page to choose your city, compare available dates,
                and review what is included in the current class.
              </p>
              <Link href={activityHref} className="mt-5 inline-flex rounded-full bg-pink-600 px-6 py-3 text-sm font-semibold text-white hover:bg-pink-500">
                See class details and dates →
              </Link>
            </section>
          </article>

          <aside className="space-y-6 lg:self-start lg:sticky lg:top-24" aria-label="Workshop booking and related resources">
            <div className="rounded-2xl border border-white/15 bg-white/5 p-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-purple-200">Related workshop</p>
              <h2 className="mt-2 font-serif text-xl font-bold text-white">{activityName}</h2>
              <p className="mt-2 text-sm leading-6 text-white/70">
                Find actual dates and pricing for your chosen studio. Pottery finishing may be optional.
              </p>
              <Link href={activityHref} className="mt-5 block rounded-xl bg-purple-600 px-4 py-3 text-center text-sm font-semibold text-white hover:bg-purple-500">
                Visit activity page →
              </Link>
              {guide.city ? <p className="mt-3 text-xs text-white/50">This article focuses on {guide.city === "chicago" ? "Chicago" : "Eugene"}.</p> : null}
            </div>
            {guide.category.includes("Group") || guide.category.includes("Bachelorette") ? (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <h2 className="font-semibold text-white">Planning a group?</h2>
                <p className="mt-2 text-sm text-white/70">Ask about a private event instead of assuming a public session can hold everyone.</p>
                <Link href="/private-events" className="mt-3 inline-block text-sm font-semibold text-purple-200 underline">Explore private events →</Link>
              </div>
            ) : null}
          </aside>
        </div>

        <div className="mt-14 space-y-7">
          <RelatedArticles slugs={post.relatedPostSlugs} heading="More Ideas, Techniques & Inspiration" />
          {author ? <AuthorBio author={author} /> : null}
        </div>
      </div>
    </main>
  );
}
