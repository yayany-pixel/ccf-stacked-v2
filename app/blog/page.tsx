import type { Metadata } from "next";
import Link from "next/link";
import GlassCard from "@/components/ui/GlassCard";
import { getAllBlogPosts } from "@/lib/blogPosts";
import { getAllActivityDetails, getActivityDetailBySlug } from "@/lib/activityRegistry";
import { getWorkshopGuidesForActivity } from "@/lib/workshopGuides";

const PAGE_SIZE = 24;

export const metadata: Metadata = {
  title: "Creative Workshop Blog: Pottery, Glass, Painting & More",
  description:
    "Practical step-by-step pottery, glass, candle, plant and painting guides from Color Cocktail Factory. Browse creative ideas for Chicago and Eugene workshops.",
  alternates: { canonical: "https://colorcocktailfactory.com/blog" },
  openGraph: {
    title: "Creative Workshop Guides | Color Cocktail Factory",
    description:
      "Ideas, techniques and creative projects connected to real studio workshops in Chicago and Eugene.",
    url: "https://colorcocktailfactory.com/blog",
    type: "website",
    images: ["/og-image.jpg"],
  },
};

type Props = { searchParams?: { activity?: string; page?: string } };

export default function BlogPage({ searchParams }: Props) {
  const activities = getAllActivityDetails()
    .filter((activity) => getWorkshopGuidesForActivity(activity.slug).length > 0)
    .sort((a, b) => a.title.localeCompare(b.title));
  const validSlugs = new Set(activities.map((item) => item.slug));
  const selected = searchParams?.activity && validSlugs.has(searchParams.activity)
    ? searchParams.activity
    : "";

  const posts = getAllBlogPosts().filter(
    (post) => !selected || post.relatedActivitySlugs.includes(selected),
  );
  const totalPages = Math.max(1, Math.ceil(posts.length / PAGE_SIZE));
  const requestedPage = Number(searchParams?.page || 1);
  const page = Number.isInteger(requestedPage) && requestedPage >= 1
    ? Math.min(requestedPage, totalPages)
    : 1;
  const visiblePosts = posts.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const pageHref = (n: number): string => {
    const query = new URLSearchParams();
    if (selected) query.set("activity", selected);
    if (n > 1) query.set("page", String(n));
    const result = query.toString();
    return result ? `/blog?${result}` : "/blog";
  };

  return (
    <main id="main-content" tabIndex={-1} className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/40 to-slate-900">
      <section className="px-6 pb-12 pt-16 sm:pt-20">
        <div className="mx-auto max-w-6xl">
          <Link href="/activities" className="text-sm font-semibold text-purple-200 hover:text-white">
            ← Explore Creative Workshops
          </Link>
          <p className="mt-8 text-xs font-bold uppercase tracking-[0.2em] text-purple-200">
            Ideas, Techniques &amp; Inspiration
          </p>
          <h1 className="mt-3 max-w-4xl font-serif text-4xl font-bold leading-tight text-white sm:text-6xl">
            The Color Cocktail Factory Blog
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-white/75">
            Get inspired, learn a practical technique, and find the workshop where you can make something yourself.
            Explore articles on ceramics, glass, botanical arts, painting, creative dates, and groups in Chicago and Eugene.
          </p>
        </div>
      </section>

      <section className="px-6 pb-20" aria-labelledby="article-list-heading">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-5 rounded-2xl border border-white/10 bg-white/5 p-5 sm:p-6">
            <div>
              <h2 id="article-list-heading" className="font-serif text-2xl font-bold text-white">Browse Articles</h2>
              <p className="mt-1 text-sm text-white/60">
                {posts.length} {posts.length === 1 ? "guide" : "guides"}
                {selected ? " for this workshop" : " across our creative studio collection"}
                {" · "}Page {page} of {totalPages}
              </p>
            </div>
            <form method="get" action="/blog" className="flex flex-wrap items-end gap-2">
              <div>
                <label htmlFor="blog-activity" className="mb-2 block text-xs font-semibold uppercase tracking-wide text-white/70">
                  Filter by workshop
                </label>
                <select
                  id="blog-activity"
                  name="activity"
                  defaultValue={selected}
                  className="max-w-[260px] rounded-xl border border-white/20 bg-slate-900 px-4 py-3 text-sm text-white"
                >
                  <option value="">All workshops</option>
                  {activities.map((activity) => (
                    <option key={activity.slug} value={activity.slug}>
                      {activity.title}
                    </option>
                  ))}
                </select>
              </div>
              <button type="submit" className="rounded-xl bg-purple-600 px-5 py-3 text-sm font-semibold text-white hover:bg-purple-500">
                Show Guides
              </button>
              {selected ? (
                <Link href="/blog" className="rounded-xl border border-white/20 px-4 py-3 text-sm font-semibold text-white/80 hover:bg-white/10">
                  Clear
                </Link>
              ) : null}
            </form>
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {visiblePosts.map((post) => {
              const activity = getActivityDetailBySlug(post.relatedActivitySlugs[0] || "");
              return (
                <Link key={post.slug} href={`/blog/${post.slug}`} className="group block focus-visible:rounded-2xl focus-visible:outline-2 focus-visible:outline-purple-300">
                  <GlassCard interactive className="h-full">
                    <div className="flex h-full flex-col p-6">
                      <div className="flex flex-wrap items-center gap-2 text-xs text-white/60">
                        <span className="rounded-full bg-purple-500/20 px-3 py-1 font-semibold text-purple-200">
                          {post.category}
                        </span>
                        {activity?.adultThemed ? (
                          <span className="rounded-full border border-rose-400/30 px-3 py-1 font-semibold text-rose-200">
                            {activity.ageRestriction || "Adults only"}
                          </span>
                        ) : null}
                      </div>
                      <h3 className="mt-5 font-serif text-xl font-bold leading-snug text-white group-hover:text-purple-200">
                        {post.title}
                      </h3>
                      <p className="mt-3 flex-1 text-sm leading-7 text-white/70">{post.description}</p>
                      {activity ? (
                        <p className="mt-4 text-xs font-semibold text-white/55">
                          Workshop: {activity.title}
                        </p>
                      ) : null}
                      <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4 text-sm">
                        <span className="text-white/60">{post.readTime}</span>
                        <span className="font-semibold text-purple-200 group-hover:text-white">Read Guide →</span>
                      </div>
                    </div>
                  </GlassCard>
                </Link>
              );
            })}
          </div>

          {totalPages > 1 ? (
            <nav aria-label="Blog pagination" className="mt-12 flex flex-wrap items-center justify-center gap-2">
              {page > 1 && <Link href={pageHref(page - 1)} className="rounded-xl border border-white/20 px-4 py-3 text-sm text-white hover:bg-white/10">← Previous</Link>}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <Link
                  key={n}
                  href={pageHref(n)}
                  aria-current={n === page ? "page" : undefined}
                  className={`rounded-xl border px-4 py-3 text-sm font-semibold ${n === page
                    ? "border-purple-400 bg-purple-600 text-white"
                    : "border-white/20 text-white/80 hover:bg-white/10"}`}
                >
                  {n}
                </Link>
              ))}
              {page < totalPages && <Link href={pageHref(page + 1)} className="rounded-xl border border-white/20 px-4 py-3 text-sm text-white hover:bg-white/10">Next →</Link>}
            </nav>
          ) : null}

          <div className="mt-14 rounded-3xl border border-white/15 bg-white/5 p-8 text-center">
            <h2 className="font-serif text-2xl font-bold text-white">Ready to Make Something?</h2>
            <p className="mx-auto mt-3 max-w-2xl text-white/75">Browse actual sessions, compare your studio location, and reserve the workshop that fits your interests.</p>
            <Link href="/activities" className="mt-6 inline-flex rounded-full bg-purple-600 px-6 py-3 font-semibold text-white hover:bg-purple-500">
              Explore All Workshops →
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
