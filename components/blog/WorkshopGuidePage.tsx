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

/** Only the local activity-link syntax used by guide copy is supported. */
function paragraphWithActivityLinks(paragraph: string) {
  return paragraph.split(/(\[[^\]]+\]\(\/activities\/[a-z0-9-]+\))/g).map((part, index) => {
    const link = part.match(/^\[([^\]]+)\]\((\/activities\/[a-z0-9-]+)\)$/);
    return link
      ? <Link key={index} href={link[2]} className="text-purple-200 underline hover:text-white">{link[1]}</Link>
      : part;
  });
}

export default function WorkshopGuidePage({ post, guide }: Props) {
  const activity = getActivityDetailBySlug(guide.activitySlug);
  const author = getAuthorBySlug(post.authorSlug);
  const activityHref = `/activities/${guide.activitySlug}${guide.city ? `?city=${guide.city}` : ""}`;
  const activityName = activity?.title || "this creative workshop";
  const isProgramHub = ["paper-pigment", "painting", "handbuilding", "parent-and-me"].includes(guide.activitySlug);
  const action = guide.activitySlug === "glass-blowing"
    ? {
        eyebrow: "Coming Soon",
        headline: "Glass Blowing Has Not Launched Yet",
        description: "The glass-blowing activity is marked coming soon. Visit the official page for any launch or waitlist updates, not an immediate booking. Glass fusion is a separate technique.",
        button: "Check Launch Status →",
        bottomHeading: "Interested in Glass Blowing?",
        bottomDescription: "This workshop is not currently presented as bookable. Check the activity page for a verified launch date or waitlist information.",
        sidebarDescription: "Coming soon: do not assume class dates or instant reservations are available.",
      }
    : guide.activitySlug === "private-parties"
    ? {
        eyebrow: "Group Events",
        headline: "Plan a Creative Private Event",
        description: "Share your city, group size, occasion and preferred dates so the studio can confirm a suitable format and provide an individual quote.",
        button: "Request Event Details →",
        bottomHeading: "Planning a Group Outing?",
        bottomDescription: "A private-event inquiry is not a confirmed booking. Tell the studio what you need and review its actual availability and quote.",
        sidebarDescription: "Custom events require a confirmed date, activity, headcount and price.",
      }
    : guide.activitySlug === "gift-cards"
    ? {
        eyebrow: "Creative Gifts",
        headline: "Give a Hands-On Experience",
        description: "Explore gift card options, redemption rules and actual workshop availability. Confirm location eligibility and any optional pottery-finishing charges.",
        button: "Explore Gift Card Options →",
        bottomHeading: "Make the Gift Personal",
        bottomDescription: "Choose a gift card amount informed by the recipient's interests and current class prices, then check the official checkout terms.",
        sidebarDescription: "Review gift card conditions and current workshop options before purchasing.",
      }
    : isProgramHub
    ? {
        eyebrow: "Explore the Program",
        headline: "Find the Right Creative Workshop",
        description: "This activity is a broader workshop category. Choose a specific scheduled project and the correct studio rather than assuming every class runs in both cities.",
        button: "Explore Related Workshops →",
        bottomHeading: "Choose an Available Session",
        bottomDescription: "Visit this workshop category, select a project and review the actual dates, materials and admission terms.",
        sidebarDescription: "This is a collection of creative formats. Actual sessions and prices vary.",
      }
    : {
        eyebrow: "Learn It in the Studio",
        headline: "Make Something Yourself at Color Cocktail Factory",
        description: `Explore ${activityName.toLowerCase()}, select your studio or online session, and review current ticket and finishing terms before booking.`,
        button: `Explore ${activityName} →`,
        bottomHeading: "Ready to Try It Yourself?",
        bottomDescription: `Visit the ${activityName} activity page to select an available session and review what is included in the current class.`,
        sidebarDescription: "Find actual dates and pricing for your chosen studio. Pottery finishing may be optional.",
      };
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
              <p className="text-sm font-semibold uppercase tracking-wider text-purple-200">{action.eyebrow}</p>
              <p className="mt-2 font-serif text-xl font-semibold text-white">
                {action.headline}
              </p>
              <p className="mt-2 text-sm leading-7 text-white/75">
                {action.description}
              </p>
              <Link href={activityHref} className="mt-4 inline-flex rounded-full bg-purple-600 px-5 py-3 text-sm font-semibold text-white hover:bg-purple-500">
                {action.button}
              </Link>
            </div>

            {guide.sections.map((section, index) => (
              <section key={section.heading} className="mb-11" aria-labelledby={`workshop-guide-section-${index}`}>
                <h2 id={`workshop-guide-section-${index}`} className="mb-4 font-serif text-2xl font-bold leading-snug text-white sm:text-3xl">
                  {section.heading}
                </h2>
                <div className="space-y-4">
                  {section.paragraphs.map((paragraph, index) => <p key={index}>{paragraphWithActivityLinks(paragraph)}</p>)}
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
              <h2 className="font-serif text-2xl font-bold text-white">{action.bottomHeading}</h2>
              <p className="mt-3 leading-7 text-white/80">
                {action.bottomDescription}
              </p>
              <Link href={activityHref} className="mt-5 inline-flex rounded-full bg-pink-600 px-6 py-3 text-sm font-semibold text-white hover:bg-pink-500">
                {action.button}
              </Link>
            </section>
          </article>

          <aside className="space-y-6 lg:self-start lg:sticky lg:top-24" aria-label="Workshop booking and related resources">
            <div className="rounded-2xl border border-white/15 bg-white/5 p-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-purple-200">Related workshop</p>
              <h2 className="mt-2 font-serif text-xl font-bold text-white">{activityName}</h2>
              <p className="mt-2 text-sm leading-6 text-white/70">
                {action.sidebarDescription}
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
