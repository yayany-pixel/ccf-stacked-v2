import type { Metadata } from "next";
import Link from "next/link";
import GlassCard from "@/components/ui/GlassCard";
import Reveal from "@/components/motion/Reveal";
import { getAllBlogPosts } from "@/lib/blogPosts";

export const metadata: Metadata = {
  title: "Blog - Pottery Tips, Creative Ideas & Workshop Guides | Color Cocktail Factory",
  description: "Expert pottery tutorials, date night ideas, creative workshop guides, and ceramic art inspiration from Color Cocktail Factory in Chicago and Eugene.",
  keywords: [
    "pottery blog",
    "pottery tutorials",
    "pottery tips for beginners",
    "date night ideas chicago",
    "creative workshop guides",
    "ceramic art blog",
    "pottery class tips",
    "handbuilding tutorials"
  ],
  alternates: {
    canonical: "https://colorcocktailfactory.com/blog"
  },
  openGraph: {
    title: "Blog | Color Cocktail Factory",
    description: "Pottery tips, creative inspiration, and workshop guides from our expert instructors.",
    url: "https://colorcocktailfactory.com/blog",
    type: "website"
  }
};

export default function BlogPage() {
  const posts = getAllBlogPosts();

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/40 to-slate-900">
      <div className="sparkle-noise absolute inset-0 opacity-20" />
      
      {/* Hero */}
      <section className="relative overflow-hidden py-20">
        <div className="mx-auto max-w-7xl px-6">
          <Reveal variant="fade-up">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold backdrop-blur-xl">
                <span>📝</span>
                <span>Creative Insights & Tutorials</span>
              </div>
              <h1 className="mt-6 font-serif text-5xl font-bold sm:text-6xl">
                CCF Blog
              </h1>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-white/75">
                Pottery tips, creative inspiration, date night ideas, and workshop guides from our expert instructors in Chicago and Eugene.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="relative px-6 pb-20">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-8 md:grid-cols-2">
            {posts.map((post, idx) => (
              <Reveal key={post.slug} delay={idx * 100} variant="fade-up">
                <Link href={`/blog/${post.slug}`}>
                  <GlassCard interactive className="h-full transition-all hover:scale-[1.02]">
                    <div className="flex h-full flex-col p-6">
                      <div className="mb-4 flex flex-wrap items-center gap-2 text-sm text-white/60">
                        <span className="rounded-full bg-purple-500/20 px-3 py-1 text-purple-200">
                          {post.category}
                        </span>
                        <span>{new Date(post.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                        <span>•</span>
                        <span>{post.readTime}</span>
                      </div>

                      <h2 className="font-serif text-2xl font-bold leading-tight">
                        {post.title}
                      </h2>

                      <p className="mt-3 flex-1 leading-relaxed text-white/75">
                        {post.description}
                      </p>

                      <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-purple-300">
                        Read Article
                        <span>→</span>
                      </div>

                      {/* Keywords for SEO */}
                      <div className="sr-only">
                        {post.keywords.join(", ")}
                      </div>
                    </div>
                  </GlassCard>
                </Link>
              </Reveal>
            ))}
          </div>

          {/* Coming Soon Tease */}
          <Reveal delay={300} variant="fade-up">
            <div className="mt-12 text-center">
              <GlassCard>
                <div className="p-8">
                  <h3 className="font-serif text-xl font-semibold">More Articles Coming Soon!</h3>
                  <p className="mt-2 text-white/70">
                    Subscribe to our newsletter to get notified when we publish new pottery tips, creative ideas, and workshop guides.
                  </p>
                  <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-sm text-white/60">
                    <span>Coming up:</span>
                    <span className="rounded-full border border-white/20 bg-white/5 px-3 py-1">Glazing 101</span>
                    <span className="rounded-full border border-white/20 bg-white/5 px-3 py-1">Eugene Date Spots</span>
                    <span className="rounded-full border border-white/20 bg-white/5 px-3 py-1">Handbuilding Tips</span>
                  </div>
                </div>
              </GlassCard>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
