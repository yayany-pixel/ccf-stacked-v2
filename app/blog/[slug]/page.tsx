import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import GlassCard from "@/components/ui/GlassCard";
import ButtonPill from "@/components/ui/ButtonPill";
import Reveal from "@/components/motion/Reveal";
import BlogPostSchema from "@/components/blog/BlogPostSchema";
import AuthorBio from "@/components/blog/AuthorBio";
import RelatedActivities from "@/components/blog/RelatedActivities";
import RelatedArticles from "@/components/blog/RelatedArticles";
import CityBookingCTA from "@/components/blog/CityBookingCTA";
import Breadcrumbs from "@/components/blog/Breadcrumbs";
import {
  getBlogPostBySlug,
  getAllBlogPosts,
  getPostImage,
  getPostImageAlt,
  getPostPublishedAt,
  getPostUpdatedAt,
  type BlogPost,
} from "@/lib/blogPosts";
import { getAuthorBySlug, getAuthorUrl } from "@/lib/authors";

type Props = {
  params: { slug: string };
};

// Static routes (e.g. /blog/art-classes-near-me) take priority in Next.js,
// so we exclude them from this dynamic route's static params to avoid
// generating a duplicate stale build.
const STATIC_ROUTE_SLUGS = new Set<string>(["art-classes-near-me"]);

export async function generateStaticParams() {
  const posts = getAllBlogPosts();
  return posts
    .filter((post) => !STATIC_ROUTE_SLUGS.has(post.slug))
    .map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = getBlogPostBySlug(params.slug);

  if (!post) {
    return { title: "Post Not Found" };
  }

  const url = `https://colorcocktailfactory.com/blog/${post.slug}`;
  const image = getPostImage(post);
  const imageAlt = getPostImageAlt(post);
  const author = getAuthorBySlug(post.authorSlug);
  const publishedTime = getPostPublishedAt(post);
  const modifiedTime = getPostUpdatedAt(post);
  // Prefer a short seoTitle for <title> and search snippets when the
  // display title is long; fall back to the display title otherwise.
  const metaTitle = post.seoTitle && post.seoTitle.length > 0 ? post.seoTitle : post.title;

  return {
    title: metaTitle,
    description: post.description,
    keywords: post.keywords,
    authors: author
      ? [{ name: author.name, url: getAuthorUrl(author.slug) }]
      : undefined,
    alternates: { canonical: url },
    openGraph: {
      title: metaTitle,
      description: post.description,
      url,
      type: "article",
      siteName: "Color Cocktail Factory",
      locale: "en_US",
      publishedTime,
      modifiedTime,
      authors: author ? [getAuthorUrl(author.slug)] : undefined,
      section: post.category,
      tags: post.keywords,
      images: [
        {
          url: image,
          alt: imageAlt,
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: metaTitle,
      description: post.description,
      images: [image],
    },
  };
}

export default function BlogPostPage({ params }: Props) {
  const post = getBlogPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <>
      <BlogPostSchema post={post as BlogPost} />
      {renderBlogPostContent(params.slug, post as BlogPost)}
    </>
  );
}

function renderBlogPostContent(slug: string, post: BlogPost) {
  // Pottery 101 content
  if (slug === "pottery-101-beginners-guide") {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/40 to-slate-900">
        <div className="sparkle-noise absolute inset-0 opacity-20" />
        
        <div className="relative mx-auto max-w-4xl px-6 py-20">
          <Reveal variant="fade-up">
            <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-purple-300 hover:text-purple-200">
              ← Back to Blog
            </Link>
          </Reveal>

          <Reveal delay={100} variant="fade-up">
            <div className="mt-6">
              <div className="mb-4 flex flex-wrap items-center gap-3 text-sm text-white/60">
                <span className="rounded-full bg-purple-500/20 px-3 py-1 text-purple-200">{post.category}</span>
                <span>{new Date(post.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>
                <span>•</span>
                <span>{post.readTime}</span>
              </div>
              
              <h1 className="font-serif text-4xl font-bold leading-tight sm:text-5xl">
                {post.title}
              </h1>
              
              <p className="mt-4 text-xl text-white/75">
                {post.description}
              </p>
            </div>
          </Reveal>

          <Reveal delay={200} variant="fade-up">
            <div className="mt-12 space-y-8 text-white/85">
              <GlassCard>
                <div className="p-8">
                  <h2 className="font-serif text-2xl font-bold">What is Pottery?</h2>
                  <p className="mt-4 leading-relaxed">
                    Pottery is the art of shaping clay into functional or decorative objects and hardening them through firing. It's one of humanity's oldest crafts, dating back over 20,000 years. Today, pottery combines ancient techniques with modern creativity, making it accessible to everyone - no experience needed!
                  </p>
                </div>
              </GlassCard>

              <GlassCard>
                <div className="p-8">
                  <h2 className="font-serif text-2xl font-bold">Essential Pottery Techniques</h2>
                  <div className="mt-6 space-y-6">
                    <div>
                      <h3 className="text-xl font-semibold text-purple-200">1. Wheel Throwing</h3>
                      <p className="mt-2 leading-relaxed text-white/75">
                        The most iconic pottery technique! You center clay on a spinning wheel and use your hands to shape it into bowls, cups, vases, and more. It takes practice but is incredibly rewarding. Our <Link href="/chicago/date-night-wheel" className="text-purple-300 underline">Date Night Pottery classes</Link> are perfect for beginners.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold text-cyan-200">2. Handbuilding</h3>
                      <p className="mt-2 leading-relaxed text-white/75">
                        No wheel required! Handbuilding uses techniques like pinching, coiling, and slab construction. It's great for creating unique shapes and sculptural pieces. Check out our <Link href="/chicago/handbuilding" className="text-cyan-300 underline">Handbuilding Pottery classes</Link>.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold text-pink-200">3. Glazing & Firing</h3>
                      <p className="mt-2 leading-relaxed text-white/75">
                        After shaping your piece, it needs to dry, get fired in a kiln (bisque firing), then glazed and fired again. The glaze transforms into a glass-like coating, adding color and making your piece waterproof.
                      </p>
                    </div>
                  </div>
                </div>
              </GlassCard>

              <GlassCard>
                <div className="p-8">
                  <h2 className="font-serif text-2xl font-bold">Types of Clay</h2>
                  <ul className="mt-4 space-y-3 leading-relaxed text-white/75">
                    <li><strong className="text-white">Earthenware:</strong> Low-fire clay, porous, great for decorative pieces</li>
                    <li><strong className="text-white">Stoneware:</strong> Mid-to-high fire, durable, perfect for functional pottery</li>
                    <li><strong className="text-white">Porcelain:</strong> High-fire, smooth, translucent when thin - the "fancy" clay</li>
                  </ul>
                </div>
              </GlassCard>

              <GlassCard>
                <div className="p-8">
                  <h2 className="font-serif text-2xl font-bold">Getting Started with Pottery</h2>
                  <div className="mt-6 space-y-4 leading-relaxed text-white/75">
                    <p>
                      The best way to learn pottery is hands-on with expert guidance. You don't need to buy any equipment - our studios provide everything!
                    </p>
                    <p>
                      <strong className="text-white">For Absolute Beginners:</strong> Start with our <Link href="/chicago/beginner-wheel" className="text-purple-300 underline">Beginner Wheel Throwing class</Link>. You'll learn centering, pulling walls, and basic shaping.
                    </p>
                    <p>
                      <strong className="text-white">For Couples:</strong> Our <Link href="/chicago/date-night-wheel" className="text-purple-300 underline">Date Night Pottery</Link> is the perfect introduction - fun, romantic, and no pressure!
                    </p>
                    <p>
                      <strong className="text-white">For Groups:</strong> Book a <Link href="/chicago/private-parties" className="text-cyan-300 underline">private pottery party</Link> for birthdays, team building, or celebrations.
                    </p>
                  </div>
                </div>
              </GlassCard>

              <GlassCard>
                <div className="p-8">
                  <h2 className="font-serif text-2xl font-bold">Common Beginner Mistakes (And How to Avoid Them)</h2>
                  <ul className="mt-4 list-inside list-disc space-y-2 leading-relaxed text-white/75">
                    <li>Using too much water - your clay will get too soft</li>
                    <li>Not centering properly before shaping</li>
                    <li>Pulling walls too thin - they'll collapse</li>
                    <li>Rushing the drying process - slow and even prevents cracks</li>
                    <li>Being afraid to mess up - pottery is all about practice!</li>
                  </ul>
                </div>
              </GlassCard>

              <GlassCard className="bg-gradient-to-br from-purple-500/20 to-pink-500/20">
                <div className="p-8 text-center">
                  <h2 className="font-serif text-2xl font-bold">Ready to Try Pottery?</h2>
                  <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-white/85">
                    Join us in Chicago & Eugene for a hands-on pottery experience. All skill levels welcome - we provide everything you need!
                  </p>
                  <div className="mt-6 flex flex-wrap justify-center gap-3">
                    <ButtonPill href="/chicago" variant="primary">
                      Book Chicago Class
                    </ButtonPill>
                    <ButtonPill href="/eugene" variant="secondary">
                      Book Eugene Class
                    </ButtonPill>
                  </div>
                </div>
              </GlassCard>
            </div>
          </Reveal>
        </div>
      </main>
    );
  }

  // Date Night Ideas content
  if (slug === "chicago-date-night-ideas") {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-900 via-pink-900/40 to-slate-900">
        <div className="sparkle-noise absolute inset-0 opacity-20" />
        
        <div className="relative mx-auto max-w-4xl px-6 py-20">
          <Reveal variant="fade-up">
            <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-pink-300 hover:text-pink-200">
              ← Back to Blog
            </Link>
          </Reveal>

          <Reveal delay={100} variant="fade-up">
            <div className="mt-6">
              <div className="mb-4 flex flex-wrap items-center gap-3 text-sm text-white/60">
                <span className="rounded-full bg-pink-500/20 px-3 py-1 text-pink-200">{post.category}</span>
                <span>{new Date(post.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>
                <span>•</span>
                <span>{post.readTime}</span>
              </div>
              
              <h1 className="font-serif text-4xl font-bold leading-tight sm:text-5xl">
                {post.title}
              </h1>
              
              <p className="mt-4 text-xl text-white/75">
                {post.description}
              </p>
            </div>
          </Reveal>

          <Reveal delay={200} variant="fade-up">
            <div className="mt-12 space-y-8 text-white/85">
              <GlassCard>
                <div className="p-8">
                  <p className="leading-relaxed">
                    Tired of the same dinner-and-a-movie routine? Chicago offers incredible creative experiences that'll make your date night unforgettable. Here are our top 10 picks for couples looking to try something new!
                  </p>
                </div>
              </GlassCard>

              <GlassCard>
                <div className="p-8">
                  <div className="flex items-start gap-4">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-purple-500/20 font-serif text-2xl font-bold text-purple-300">1</span>
                    <div>
                      <h2 className="text-xl font-bold">Pottery Wheel Date Night</h2>
                      <p className="mt-2 leading-relaxed text-white/75">
                        Channel your inner Ghost movie moment! Our <Link href="/chicago/date-night-wheel" className="text-purple-300 underline">Date Night Pottery class</Link> in Pilsen is romantic, hands-on, and seriously fun. You'll make bowls or cups on the pottery wheel and take home your creations. BYOB welcome!
                      </p>
                      <p className="mt-2 text-sm text-purple-300">📍 Pilsen, Chicago • $75/couple</p>
                    </div>
                  </div>
                </div>
              </GlassCard>

              <GlassCard>
                <div className="p-8">
                  <div className="flex items-start gap-4">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-cyan-500/20 font-serif text-2xl font-bold text-cyan-300">2</span>
                    <div>
                      <h2 className="text-xl font-bold">Turkish Lamp Making</h2>
                      <p className="mt-2 leading-relaxed text-white/75">
                        Create a stunning mosaic lamp together that'll light up your home for years. Our <Link href="/chicago/turkish-lamp" className="text-cyan-300 underline">Turkish Lamp workshop</Link> teaches you ancient mosaic techniques. The perfect unique gift you made together!
                      </p>
                      <p className="mt-2 text-sm text-cyan-300">📍 Pilsen, Chicago • $120/couple</p>
                    </div>
                  </div>
                </div>
              </GlassCard>

              <GlassCard>
                <div className="p-8">
                  <div className="flex items-start gap-4">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-pink-500/20 font-serif text-2xl font-bold text-pink-300">3</span>
                    <div>
                      <h2 className="text-xl font-bold">Glass Fusion Art</h2>
                      <p className="mt-2 leading-relaxed text-white/75">
                        Design and create beautiful fused glass coasters, jewelry dishes, or suncatchers. Our <Link href="/chicago/glass-fusion" className="text-pink-300 underline">Glass Fusion class</Link> is beginner-friendly and you'll love seeing your design come to life!
                      </p>
                      <p className="mt-2 text-sm text-pink-300">📍 Pilsen, Chicago • $85/couple</p>
                    </div>
                  </div>
                </div>
              </GlassCard>

              <GlassCard>
                <div className="p-8">
                  <div className="flex items-start gap-4">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-green-500/20 font-serif text-2xl font-bold text-green-300">4</span>
                    <div>
                      <h2 className="text-xl font-bold">Bonsai Workshop</h2>
                      <p className="mt-2 leading-relaxed text-white/75">
                        Calm, meditative, and totally unique. Learn the ancient art of bonsai cultivation in our <Link href="/chicago/bonsai" className="text-green-300 underline">Bonsai class</Link>. You'll each create and take home a living work of art that grows with your relationship!
                      </p>
                      <p className="mt-2 text-sm text-green-300">📍 Pilsen, Chicago • $90/couple</p>
                    </div>
                  </div>
                </div>
              </GlassCard>

              <GlassCard>
                <div className="p-8">
                  <div className="flex items-start gap-4">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-orange-500/20 font-serif text-2xl font-bold text-orange-300">5</span>
                    <div>
                      <h2 className="text-xl font-bold">Mosaic Art Making</h2>
                      <p className="mt-2 leading-relaxed text-white/75">
                        Create colorful mosaic artwork together! Our <Link href="/chicago/mosaic" className="text-orange-300 underline">Mosaic class</Link> teaches you to design and assemble beautiful patterns. Perfect for couples who love color and creativity.
                      </p>
                      <p className="mt-2 text-sm text-orange-300">📍 Pilsen, Chicago • $80/couple</p>
                    </div>
                  </div>
                </div>
              </GlassCard>

              <GlassCard>
                <div className="p-8">
                  <div className="space-y-6 text-white/75">
                    <div>
                      <h3 className="text-lg font-semibold text-white">6. Handbuilding Pottery</h3>
                      <p className="mt-1">No wheel needed - create sculptural pieces using hand techniques. Great for those who want more creative freedom!</p>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">7. Terrarium Building</h3>
                      <p className="mt-1">Design your own mini ecosystem in glass. It's like gardening meets art - and it lives on your coffee table!</p>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">8. Candle Making</h3>
                      <p className="mt-1">Create custom scented candles together. Choose your fragrances and colors for a truly personalized keepsake.</p>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">9. Wine Glass Painting</h3>
                      <p className="mt-1">Paint and personalize wine glasses, then toast to your creativity. BYOB encouraged!</p>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">10. Private Workshop</h3>
                      <p className="mt-1">Want the whole studio to yourselves? Book a <Link href="/chicago/private-parties" className="text-purple-300 underline">private pottery party</Link> for an intimate, customized experience.</p>
                    </div>
                  </div>
                </div>
              </GlassCard>

              <GlassCard className="bg-gradient-to-br from-pink-500/20 to-purple-500/20">
                <div className="p-8 text-center">
                  <h2 className="font-serif text-2xl font-bold">Why Creative Date Nights Work</h2>
                  <div className="mx-auto mt-4 max-w-2xl space-y-3 text-left leading-relaxed text-white/85">
                    <p>✨ <strong>Conversation Flows Naturally:</strong> Working with your hands takes the pressure off forced conversation</p>
                    <p>💑 <strong>Teamwork & Bonding:</strong> Creating together strengthens your connection</p>
                    <p>🎁 <strong>Lasting Memories:</strong> You take home something you made together - way better than a restaurant receipt!</p>
                    <p>📸 <strong>Instagram-Worthy:</strong> Your friends will be jealous of your creative date pics</p>
                    <p>🍷 <strong>BYOB Friendly:</strong> Bring your favorite bottle and make it extra special</p>
                  </div>
                </div>
              </GlassCard>

              <GlassCard className="bg-gradient-to-br from-purple-500/20 to-pink-500/20">
                <div className="p-8 text-center">
                  <h2 className="font-serif text-2xl font-bold">Book Your Creative Date Night</h2>
                  <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-white/85">
                    All classes welcome beginners - no experience needed! We provide all materials, instruction, and fun vibes. Same-day bookings available.
                  </p>
                  <div className="mt-6 flex flex-wrap justify-center gap-3">
                    <ButtonPill href="/chicago/date-night-wheel" variant="primary">
                      Book Date Night Pottery
                    </ButtonPill>
                    <ButtonPill href="/chicago" variant="secondary">
                      See All Chicago Classes
                    </ButtonPill>
                  </div>
                </div>
              </GlassCard>
            </div>
          </Reveal>
        </div>
      </main>
    );
  }

  // Eugene Date Night Ideas content
  if (slug === "eugene-date-night-ideas") {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-900 via-green-900/40 to-slate-900">
        <div className="sparkle-noise absolute inset-0 opacity-20" />
        
        <div className="relative mx-auto max-w-4xl px-6 py-20">
          <Reveal variant="fade-up">
            <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-green-300 hover:text-green-200">
              ← Back to Blog
            </Link>
          </Reveal>

          <Reveal delay={100} variant="fade-up">
            <div className="mt-6">
              <div className="mb-4 flex flex-wrap items-center gap-3 text-sm text-white/60">
                <span className="rounded-full bg-green-500/20 px-3 py-1 text-green-200">{post.category}</span>
                <span>{new Date(post.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>
                <span>•</span>
                <span>{post.readTime}</span>
              </div>
              
              <h1 className="font-serif text-4xl font-bold leading-tight sm:text-5xl">
                {post.title}
              </h1>
              
              <p className="mt-4 text-xl text-white/75">
                {post.description}
              </p>
            </div>
          </Reveal>

          <Reveal delay={200} variant="fade-up">
            <div className="mt-12 space-y-8 text-white/85">
              <GlassCard>
                <div className="p-8">
                  <p className="leading-relaxed">
                    Eugene, Oregon is known for its creative spirit, natural beauty, and artistic community. Skip the typical dinner date and explore these unique, hands-on experiences that'll make your date night truly memorable!
                  </p>
                </div>
              </GlassCard>

              <GlassCard>
                <div className="p-8">
                  <div className="flex items-start gap-4">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-purple-500/20 font-serif text-2xl font-bold text-purple-300">1</span>
                    <div>
                      <h2 className="text-xl font-bold">Pottery Wheel Date Night</h2>
                      <p className="mt-2 leading-relaxed text-white/75">
                        Get romantic at the pottery wheel! Our <Link href="/eugene/date-night-wheel" className="text-purple-300 underline">Date Night Pottery class</Link> in downtown Eugene is the perfect blend of creativity and connection. Make bowls, cups, or vases together and take home your handmade creations. BYOB welcome!
                      </p>
                      <p className="mt-2 text-sm text-purple-300">📍 Downtown Eugene • $75/couple</p>
                    </div>
                  </div>
                </div>
              </GlassCard>

              <GlassCard>
                <div className="p-8">
                  <div className="flex items-start gap-4">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-cyan-500/20 font-serif text-2xl font-bold text-cyan-300">2</span>
                    <div>
                      <h2 className="text-xl font-bold">Turkish Lamp Making</h2>
                      <p className="mt-2 leading-relaxed text-white/75">
                        Create a mesmerizing mosaic lamp that'll light up your space for years to come. Our <Link href="/eugene/turkish-lamp" className="text-cyan-300 underline">Turkish Lamp workshop</Link> teaches traditional techniques in a modern, relaxed setting. A truly unique gift you crafted together!
                      </p>
                      <p className="mt-2 text-sm text-cyan-300">📍 Downtown Eugene • $120/couple</p>
                    </div>
                  </div>
                </div>
              </GlassCard>

              <GlassCard>
                <div className="p-8">
                  <div className="flex items-start gap-4">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-pink-500/20 font-serif text-2xl font-bold text-pink-300">3</span>
                    <div>
                      <h2 className="text-xl font-bold">Glass Fusion Art</h2>
                      <p className="mt-2 leading-relaxed text-white/75">
                        Design stunning fused glass art pieces - from coasters to jewelry dishes to suncatchers. Our <Link href="/eugene/glass-fusion" className="text-pink-300 underline">Glass Fusion class</Link> is beginner-friendly and absolutely mesmerizing to create!
                      </p>
                      <p className="mt-2 text-sm text-pink-300">📍 Downtown Eugene • $85/couple</p>
                    </div>
                  </div>
                </div>
              </GlassCard>

              <GlassCard>
                <div className="p-8">
                  <div className="flex items-start gap-4">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-green-500/20 font-serif text-2xl font-bold text-green-300">4</span>
                    <div>
                      <h2 className="text-xl font-bold">Bonsai Workshop</h2>
                      <p className="mt-2 leading-relaxed text-white/75">
                        Perfect for nature-loving Eugene couples! Learn the ancient art of bonsai in our <Link href="/eugene/bonsai" className="text-green-300 underline">Bonsai class</Link>. You'll each create a living miniature tree that grows alongside your relationship - how poetic is that?
                      </p>
                      <p className="mt-2 text-sm text-green-300">📍 Downtown Eugene • $90/couple</p>
                    </div>
                  </div>
                </div>
              </GlassCard>

              <GlassCard>
                <div className="p-8">
                  <div className="flex items-start gap-4">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-orange-500/20 font-serif text-2xl font-bold text-orange-300">5</span>
                    <div>
                      <h2 className="text-xl font-bold">Mosaic Art Making</h2>
                      <p className="mt-2 leading-relaxed text-white/75">
                        Piece together a colorful masterpiece! Our <Link href="/eugene/mosaic" className="text-orange-300 underline">Mosaic class</Link> teaches you to create intricate patterns and designs. Perfect for artistic couples who love working with color.
                      </p>
                      <p className="mt-2 text-sm text-orange-300">📍 Downtown Eugene • $80/couple</p>
                    </div>
                  </div>
                </div>
              </GlassCard>

              <GlassCard>
                <div className="p-8">
                  <div className="space-y-6 text-white/75">
                    <div>
                      <h3 className="text-lg font-semibold text-white">6. Handbuilding Pottery</h3>
                      <p className="mt-1">Skip the wheel and create sculptural ceramic art using ancient hand techniques. Great for couples who want to explore their artistic side!</p>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">7. Terrarium Workshop</h3>
                      <p className="mt-1">Build your own miniature Pacific Northwest ecosystem! Perfect for Eugene's nature-loving vibe. Your terrarium becomes a living reminder of your creative date.</p>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">8. Candle Making</h3>
                      <p className="mt-1">Craft custom scented candles together. Choose from Oregon-inspired fragrances like cedar, pine, and lavender for a truly local touch.</p>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">9. Wine Glass Painting</h3>
                      <p className="mt-1">Paint personalized wine glasses, then toast with local Oregon wine. BYOB encouraged - support local Willamette Valley wineries!</p>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">10. Private Workshop Experience</h3>
                      <p className="mt-1">Want the whole studio to yourselves? Book a <Link href="/eugene/private-parties" className="text-purple-300 underline">private creative session</Link> for an intimate, customized date night.</p>
                    </div>
                  </div>
                </div>
              </GlassCard>

              <GlassCard className="bg-gradient-to-br from-green-500/20 to-purple-500/20">
                <div className="p-8 text-center">
                  <h2 className="font-serif text-2xl font-bold">Why Eugene Couples Love Creative Dates</h2>
                  <div className="mx-auto mt-4 max-w-2xl space-y-3 text-left leading-relaxed text-white/85">
                    <p>🌲 <strong>Fits Eugene's Vibe:</strong> Hands-on, creative, and eco-conscious - totally Eugene!</p>
                    <p>💬 <strong>Easy Conversation:</strong> Creating together makes talking feel natural and fun</p>
                    <p>🎨 <strong>Support Local Arts:</strong> Your date night supports Eugene's thriving creative community</p>
                    <p>🏡 <strong>Take Home Art:</strong> Every piece tells the story of your date night</p>
                    <p>🍷 <strong>BYOB Welcome:</strong> Bring local Oregon wine or craft beer!</p>
                    <p>☔ <strong>Rain-Proof Fun:</strong> Perfect indoor activity for those rainy Eugene days</p>
                  </div>
                </div>
              </GlassCard>

              <GlassCard className="bg-gradient-to-br from-purple-500/20 to-green-500/20">
                <div className="p-8 text-center">
                  <h2 className="font-serif text-2xl font-bold">Book Your Eugene Date Night</h2>
                  <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-white/85">
                    All classes welcome beginners - zero experience required! We provide everything you need. Located in downtown Eugene, easy access from Whiteaker, University District, and beyond.
                  </p>
                  <div className="mt-6 flex flex-wrap justify-center gap-3">
                    <ButtonPill href="/eugene/date-night-wheel" variant="primary">
                      Book Date Night Pottery
                    </ButtonPill>
                    <ButtonPill href="/eugene" variant="secondary">
                      See All Eugene Classes
                    </ButtonPill>
                  </div>
                </div>
              </GlassCard>
            </div>
          </Reveal>
        </div>
      </main>
    );
  }

  // Pilsen Student Guide
  if (slug === "pilsen-student-guide") {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-900 via-orange-900/30 to-slate-900">
        <div className="sparkle-noise absolute inset-0 opacity-20" />
        
        <div className="relative mx-auto max-w-4xl px-6 py-20">
          <Reveal variant="fade-up">
            <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-orange-300 hover:text-orange-200">
              ← Back to Blog
            </Link>
          </Reveal>

          <Reveal delay={100} variant="fade-up">
            <div className="mt-6">
              <div className="mb-4 flex flex-wrap items-center gap-3 text-sm text-white/60">
                <span className="rounded-full bg-orange-500/20 px-3 py-1 text-orange-200">{post.category}</span>
                <span>{new Date(post.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>
                <span>•</span>
                <span>{post.readTime}</span>
              </div>
              
              <h1 className="font-serif text-4xl font-bold leading-tight sm:text-5xl">
                {post.title}
              </h1>
              
              <p className="mt-4 text-xl text-white/75">
                {post.description}
              </p>
            </div>
          </Reveal>

          <Reveal delay={200} variant="fade-up">
            <div className="mt-12 space-y-8 text-white/85">
              <GlassCard>
                <div className="p-8">
                  <p className="leading-relaxed">
                    Pilsen is Chicago's most vibrant artistic neighborhood—a colorful blend of Mexican heritage, street art, community-owned businesses, and creative energy. Whether you have a morning break between classes or a free evening to explore, this South Side gem offers everything from legendary carnitas to world-class murals, cozy coffee shops to historic music halls. Here's your complete guide to making the most of Pilsen before and after your pottery class at <Link href="/chicago" className="text-orange-300 underline">Color Cocktail Factory</Link>.
                  </p>
                </div>
              </GlassCard>

              <GlassCard>
                <div className="p-8">
                  <h2 className="font-serif text-3xl font-bold text-orange-200">Morning & Daytime Hangouts</h2>
                  
                  <div className="mt-6 space-y-6">
                    <div>
                      <h3 className="text-2xl font-semibold text-white">Coffee & Breakfast</h3>
                      
                      <div className="mt-4 space-y-4 border-l-2 border-orange-500/30 pl-4">
                        <div>
                          <h4 className="font-semibold text-orange-200">Café Jumping Bean (1439 W. 18th St.)</h4>
                          <p className="mt-2 text-sm leading-relaxed text-white/75">
                            Opened in 1994 by Eleazar Delgado, this colorful coffeehouse has become a community anchor and art gallery. The café serves fresh sandwiches, salads, and Mexican-inspired drinks like the "Choco-expresso" (Mexican hot chocolate with a shot of espresso). Best of all? Local artists exhibit their work for free on the walls, making every visit a new gallery experience. The prices stay affordable for working-class regulars, and the vibe is warm and welcoming.
                          </p>
                          <p className="mt-2 text-xs italic text-white/60">
                            Great for: grabbing breakfast or espresso before class, admiring rotating art shows, meeting neighbors
                          </p>
                        </div>

                        <div>
                          <h4 className="font-semibold text-orange-200">Anticonquista Café (952 W. 18th St.)</h4>
                          <p className="mt-2 text-sm leading-relaxed text-white/75">
                            Opened in 2025, this coffeehouse "decolonizes the morning latte." Owners Elmer Fajardo Pacheco and Lauren Reese source beans from their family farm in Guatemala, pay employees above Chicago's minimum wage, and serve café de olla spiced with cardamom alongside Guatemalan conchas filled with black bean or guava and cheese. A mural of Guatemala's national bird decorates the shop.
                          </p>
                          <p className="mt-2 text-xs italic text-white/60">
                            Great for: supporting fair-trade coffee, trying authentic Guatemalan pastries
                          </p>
                        </div>

                        <div>
                          <h4 className="font-semibold text-orange-200">Sleep Walk Chocolatería (1840 S. Halsted St.)</h4>
                          <p className="mt-2 text-sm leading-relaxed text-white/75">
                            Dark Matter Coffee's bean-to-bar spin-off celebrates Latin heritage. The shop sources cacao from Mexican farmers and infuses chocolates and drinks with chiles, cinnamon, vanilla, and mezcal. Try the signature Agave Latte for something truly unique.
                          </p>
                        </div>

                        <div>
                          <h4 className="font-semibold text-orange-200">Cup of Joe Coffee House (1900 S. Carpenter St.)</h4>
                          <p className="mt-2 text-sm leading-relaxed text-white/75">
                            Founded to give the Southwest Side a hip coffeehouse, Cup of Joe reflects Pilsen's culture with artwork and poetry nights. The shop brews fresh coffee and espresso and offers soups, sandwiches, and Mexican street food.
                          </p>
                        </div>

                        <div>
                          <h4 className="font-semibold text-orange-200">Panadería Nuevo León (1634 W. 18th St.)</h4>
                          <p className="mt-2 text-sm leading-relaxed text-white/75">
                            Family-owned Mexican bakery since 1973. Pick up conchas, empanadas, or churros to enjoy with your coffee. Many locals grab pan dulce here before strolling the murals.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-2xl font-semibold text-white">Parks & Outdoor Breaks</h3>
                      
                      <div className="mt-4 space-y-4 border-l-2 border-green-500/30 pl-4">
                        <div>
                          <h4 className="font-semibold text-green-200">Harrison Park (18 acres)</h4>
                          <p className="mt-2 text-sm leading-relaxed text-white/75">
                            This park features a fieldhouse with a gymnastics center, indoor swimming pool, gymnasium, and meeting rooms. Outdoors you'll find tennis and basketball courts, baseball fields, a playground, and an artificial turf field. Perfect for a quick jog, open swim, or study break between classes.
                          </p>
                        </div>

                        <div>
                          <h4 className="font-semibold text-green-200">Dvorak Park (6.56 acres)</h4>
                          <p className="mt-2 text-sm leading-relaxed text-white/75">
                            Features an auditorium, two gyms, computer room, art room, swimming pool with interactive water feature, baseball fields, athletic fields for football/soccer, playgrounds, and picnic areas. Great for sports or meeting friends.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </GlassCard>

              <GlassCard>
                <div className="p-8">
                  <h2 className="font-serif text-3xl font-bold text-cyan-200">Mid-Day Exploration & Lunch</h2>
                  
                  <div className="mt-6 space-y-6">
                    <div>
                      <h3 className="text-2xl font-semibold text-white">Bookstores & Shops</h3>
                      
                      <div className="mt-4 space-y-4 border-l-2 border-cyan-500/30 pl-4">
                        <div>
                          <h4 className="font-semibold text-cyan-200">Pilsen Community Books (1102 W. 18th St.)</h4>
                          <p className="mt-2 text-sm leading-relaxed text-white/75">
                            Founded in 2016, this independent bookstore became Chicago's only employee-owned shop in 2020. The worker-owners host film screenings, fundraisers, and community events, modeling a business where profits are shared. Browse radical literature, children's books, and new releases while supporting cooperative ownership.
                          </p>
                        </div>

                        <div>
                          <h4 className="font-semibold text-cyan-200">Mestiza Shop</h4>
                          <p className="mt-2 text-sm leading-relaxed text-white/75">
                            Gift shop selling goods made by Latinx artisans—handmade jewelry, apparel, and art. Perfect for finding unique gifts or supporting local makers.
                          </p>
                        </div>

                        <div>
                          <h4 className="font-semibold text-cyan-200">Semillas Plant Studio</h4>
                          <p className="mt-2 text-sm leading-relaxed text-white/75">
                            Plant store with handcrafted items. Add a green break between classes!
                          </p>
                        </div>

                        <div>
                          <h4 className="font-semibold text-cyan-200">Pilsen Vintage</h4>
                          <p className="mt-2 text-sm leading-relaxed text-white/75">
                            Retro clothing and décor for the vintage enthusiast.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-2xl font-semibold text-white">Cultural Venues & Museums</h3>
                      
                      <div className="mt-4 space-y-4 border-l-2 border-purple-500/30 pl-4">
                        <div>
                          <h4 className="font-semibold text-purple-200">National Museum of Mexican Art (1852 W. 19th St.)</h4>
                          <p className="mt-2 text-sm leading-relaxed text-white/75">
                            <strong>Free admission!</strong> Considered one of Chicago's top cultural institutions, the museum holds more than 10,000 works in its permanent collection spanning thousands of years—textiles, folk art, prints, and photographs. The museum hosts rotating exhibits like Day of the Dead and Christmas markets and offers educational programs for families and teachers. Don't miss the Día de Muertos exhibition each fall.
                          </p>
                        </div>

                        <div>
                          <h4 className="font-semibold text-purple-200">Pilsen Arts & Community House (PACH)</h4>
                          <p className="mt-2 text-sm leading-relaxed text-white/75">
                            A nonprofit offering exhibition space, art instruction, and mentorship. PACH hosts weekly co-working sessions, open-studio nights, wellness classes, book clubs, and monthly open-mic events. Check their calendar for events!
                          </p>
                        </div>

                        <div>
                          <h4 className="font-semibold text-purple-200">Chicago Arts District (East Pilsen)</h4>
                          <p className="mt-2 text-sm leading-relaxed text-white/75">
                            Over 30 galleries along 18th and South Halsted streets. <strong>Second Fridays Art Walk:</strong> On the second Friday of each month, studios and galleries open their doors for free. Walk several blocks of studios, galleries, and lofts to meet artists and see diverse work. The Chicago Art Department (11,000 sq ft) is an anchor venue.
                          </p>
                          <p className="mt-2 text-xs text-white/60">
                            Highlights: Women Made Gallery (art by women/non-binary artists), House of the Apocalypse (paintings, sculptures, vintage jewelry), URI-EICHEN Gallery, Pilsen Outpost
                          </p>
                        </div>

                        <div>
                          <h4 className="font-semibold text-purple-200">Tonantzin Gallery Shop (1508 W. 18th St.)</h4>
                          <p className="mt-2 text-sm leading-relaxed text-white/75">
                            Part gallery, part gift shop celebrating Mexican artisan culture—paintings, jewelry, and books.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-2xl font-semibold text-white">Lunch & Afternoon Treats</h3>
                      
                      <div className="mt-4 space-y-4 border-l-2 border-pink-500/30 pl-4">
                        <div>
                          <h4 className="font-semibold text-pink-200">Carnitas Uruapan (1725 W. 18th St.) ⭐</h4>
                          <p className="mt-2 text-sm leading-relaxed text-white/75">
                            Founded in 1975 by Inocencio Carbajal ("El Guero"), this family-owned restaurant specializes in authentic Michoacán-style carnitas. The meat is slow-cooked in its own fat and sold by the pound. Lines often extend out the door because the crispy pork and tortillas are legendary. <strong>Perfect for a hearty lunch!</strong>
                          </p>
                        </div>

                        <div>
                          <h4 className="font-semibold text-pink-200">5 Rabanitos Restaurante & Taquería (1758 W. 18th St.)</h4>
                          <p className="mt-2 text-sm leading-relaxed text-white/75">
                            Chef Alfonso Sotelo's restaurant serves a large menu of Mexican staples including tacos and slow-cooked meats. A favorite for lunch or dinner.
                          </p>
                        </div>

                        <div>
                          <h4 className="font-semibold text-pink-200">Yvolina's Tamales (814 W. 18th St.)</h4>
                          <p className="mt-2 text-sm leading-relaxed text-white/75">
                            Known for vegan and non-traditional tamales steamed in banana leaves. The masa uses olive oil instead of lard; fillings range from quinoa and lentils to kale with mole. A lighter lunch option!
                          </p>
                        </div>

                        <div>
                          <h4 className="font-semibold text-pink-200">Carnitas Don Pedro (1113 W. 18th St.)</h4>
                          <p className="mt-2 text-sm leading-relaxed text-white/75">
                            Another Pilsen carnitas staple. Cooked in rendered pork fat until juicy and crisp. Lines are long on weekends; take-out is recommended.
                          </p>
                        </div>

                        <div>
                          <h4 className="font-semibold text-pink-200">Kristoffer's Café & Bakery (1733 W. 18th St.)</h4>
                          <p className="mt-2 text-sm leading-relaxed text-white/75">
                            Family-run café famous for its tres leches cake, served in flavors like coconut, Kahlúa, and classic chocolate. The menu also includes sandwiches, salads, Mexican breakfast dishes, horchata lattes, and Mexican hot chocolate. <strong>Don't skip the tres leches!</strong>
                          </p>
                        </div>

                        <div>
                          <h4 className="font-semibold text-pink-200">Nevería El Sabor de México & La Michoacana Premium</h4>
                          <p className="mt-2 text-sm leading-relaxed text-white/75">
                            Ice cream parlors offering paletas (Mexican popsicles) and fruit-based treats. Perfect for cooling off after exploring murals!
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </GlassCard>

              <GlassCard className="bg-gradient-to-br from-orange-500/10 to-red-500/10">
                <div className="p-8">
                  <h2 className="font-serif text-3xl font-bold text-orange-200">Street Art & Murals 🎨</h2>
                  <p className="mt-4 leading-relaxed text-white/75">
                    Pilsen is Chicago's outdoor art gallery. Here's where to find the neighborhood's most iconic murals:
                  </p>

                  <div className="mt-6 space-y-4">
                    <div className="rounded-lg border border-orange-500/20 bg-orange-500/5 p-4">
                      <h3 className="font-semibold text-orange-200">16th Street Murals (Two-Mile Corridor)</h3>
                      <p className="mt-2 text-sm leading-relaxed text-white/75">
                        A railroad embankment from Halsted to Western Avenue hosts roughly 50 murals as part of Chicago's Art in Public Places initiative. Featured artists include Hebru Brantley, Sam Kirk, Chris Silva, and Amuse. Grab your camera and stroll along 16th Street to see colorful works on the rail embankment and nearby viaducts.
                      </p>
                    </div>

                    <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-4">
                      <h3 className="font-semibold text-red-200">Hector Duarte's "Gulliver in Wonderland" (1900 W. Cullerton St.)</h3>
                      <p className="mt-2 text-sm leading-relaxed text-white/75">
                        The prolific muralist's home is wrapped in a 3,000 sq ft mural depicting a giant Latino immigrant entangled in barbed wire—a powerful commentary on immigration. Duarte's work has become a favorite stop on mural tours.
                      </p>
                    </div>

                    <div className="rounded-lg border border-purple-500/20 bg-purple-500/5 p-4">
                      <h3 className="font-semibold text-purple-200">Declaration of Immigration (18th & Blue Island)</h3>
                      <p className="mt-2 text-sm leading-relaxed text-white/75">
                        An overtly political 30-foot-wide mural created in 2009 by Salvador Jimenez-Flores and students from the National Museum of Mexican Art. The piece addresses immigration and human rights.
                      </p>
                    </div>

                    <div className="rounded-lg border border-cyan-500/20 bg-cyan-500/5 p-4">
                      <h3 className="font-semibold text-cyan-200">Pink Line Station Murals</h3>
                      <p className="mt-2 text-sm leading-relaxed text-white/75">
                        The 18th Street Pink Line station steps are painted in a colorful patchwork. Nearby you'll find "Quetzalcoatl and the Stork" (16th & Halsted) depicting mythic figures from Mexican and Polish cultures, and Hector Duarte's "Ice Cream Dream" at Western Avenue Pink Line station featuring Pilsen landmarks.
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 rounded-lg border border-white/10 bg-white/5 p-4 text-center">
                    <p className="text-sm text-white/75">
                      💡 <strong>Pro Tip:</strong> Start at the 18th Street Pink Line station and walk west along 18th Street, then north on 16th for the full mural experience. Allow 1-2 hours for photos!
                    </p>
                  </div>
                </div>
              </GlassCard>

              <GlassCard>
                <div className="p-8">
                  <h2 className="font-serif text-3xl font-bold text-purple-200">Dinner, Evening & Nightlife</h2>
                  
                  <div className="mt-6 space-y-6">
                    <div>
                      <h3 className="text-2xl font-semibold text-white">Dinner & Drinks</h3>
                      
                      <div className="mt-4 space-y-4 border-l-2 border-purple-500/30 pl-4">
                        <div>
                          <h4 className="font-semibold text-purple-200">La Luna (1726 S. Racine Ave.)</h4>
                          <p className="mt-2 text-sm leading-relaxed text-white/75">
                            Restaurant and mezcal bar with an artsy interior, living walls, and an open kitchen. A bifold garage door opens onto 18th Street, blending indoor and outdoor seating. The bar serves creative cocktails and traditional Mexican dishes—a great start to an evening out.
                          </p>
                        </div>

                        <div>
                          <h4 className="font-semibold text-purple-200">Pilsen Yards & The Alderman (1163 W. 18th St.) ⭐</h4>
                          <p className="mt-2 text-sm leading-relaxed text-white/75">
                            A bar-centric hangout with an open-air patio, radiant-heated floors, and overhead heaters for year-round comfort. Executive chef Juan Gutierrez serves Latin street food (tacos, ceviches, carne asada) with a mezcal-, tequila-, and whiskey-focused bar program. Inside the same space is <strong>The Alderman</strong>, an award-winning 16-seat speakeasy decorated with velvet banquettes and offering a rotating seasonal cocktail list.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-2xl font-semibold text-white">Craft Beer & Breweries</h3>
                      
                      <div className="mt-4 space-y-4 border-l-2 border-amber-500/30 pl-4">
                        <div>
                          <h4 className="font-semibold text-amber-200">Monochrome Brewing (2101 S. Carpenter St.)</h4>
                          <p className="mt-2 text-sm leading-relaxed text-white/75">
                            Latinx-owned brewery that took over the Lo Rez space in 2024. Warehouse-style taproom, dog-friendly, BYO snacks. Known for sessionable beers and community vibes.
                          </p>
                        </div>

                        <div>
                          <h4 className="font-semibold text-amber-200">Alulu Brewery & Pub (2011 S. Laflin St.)</h4>
                          <p className="mt-2 text-sm leading-relaxed text-white/75">
                            Craft brewery with a broad range of beer styles and pub fare. Praised for unique brews and friendly staff.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-2xl font-semibold text-white">Live Music & Entertainment</h3>
                      
                      <div className="mt-4 space-y-4 border-l-2 border-pink-500/30 pl-4">
                        <div>
                          <h4 className="font-semibold text-pink-200">Thalia Hall (1807 S. Allport St.) 🎵</h4>
                          <p className="mt-2 text-sm leading-relaxed text-white/75">
                            Historic music and community hall built in 1892 by John Dusek as a multi-purpose property for the immigrant community. After decades of closure, the hall was restored in 2013 and now hosts concerts and cultural events. The property also houses:
                          </p>
                          <ul className="mt-2 ml-4 space-y-1 text-sm text-white/70">
                            <li>• <strong>Punch House:</strong> Cocktail bar focusing on classic and contemporary punches</li>
                            <li>• <strong>Tack Room:</strong> Cozy piano bar with craft cocktails</li>
                          </ul>
                          <p className="mt-2 text-xs text-white/60">Thalia Hall remains a landmark of Pilsen's nightlife and culture.</p>
                        </div>

                        <div>
                          <h4 className="font-semibold text-pink-200">Other Nightlife Spots</h4>
                          <p className="mt-2 text-sm leading-relaxed text-white/75">
                            <strong>La Vaca & Del Toro:</strong> Margaritas and Latin-inspired drinks along 18th Street<br/>
                            <strong>Simone's Bar:</strong> Funky bar with recycled décor, 21+ atmosphere
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </GlassCard>

              <GlassCard className="bg-gradient-to-br from-green-500/10 to-cyan-500/10">
                <div className="p-8">
                  <h2 className="font-serif text-3xl font-bold text-green-200">Student-Friendly Itinerary</h2>
                  <p className="mt-4 text-sm italic text-white/75">
                    Here's a perfect day in Pilsen for students with classes at Color Cocktail Factory:
                  </p>

                  <div className="mt-6 space-y-4">
                    <div className="rounded-lg border border-orange-500/20 bg-orange-500/5 p-4">
                      <h3 className="font-semibold text-orange-200">☕ Morning (8am-12pm)</h3>
                      <p className="mt-2 text-sm leading-relaxed text-white/75">
                        Start at <strong>Café Jumping Bean</strong> or <strong>Anticonquista Café</strong> for coffee and breakfast. Pick up pan dulce from <strong>Panadería Nuevo León</strong>. Explore 18th Street's murals and browse <strong>Pilsen Community Books</strong> and <strong>Mestiza Shop</strong>.
                      </p>
                    </div>

                    <div className="rounded-lg border border-purple-500/20 bg-purple-500/5 p-4">
                      <h3 className="font-semibold text-purple-200">🎨 Midday (12pm-3pm)</h3>
                      <p className="mt-2 text-sm leading-relaxed text-white/75">
                        Visit the <strong>National Museum of Mexican Art</strong> (free!) and check out local galleries. Take your <Link href="/chicago/date-night-wheel" className="text-purple-300 underline">pottery class at CCF</Link>! Grab lunch at <strong>Carnitas Uruapan</strong> or <strong>Yvolina's Tamales</strong>.
                      </p>
                    </div>

                    <div className="rounded-lg border border-cyan-500/20 bg-cyan-500/5 p-4">
                      <h3 className="font-semibold text-cyan-200">🌳 Afternoon (3pm-6pm)</h3>
                      <p className="mt-2 text-sm leading-relaxed text-white/75">
                        Treat yourself to <strong>Kristoffer's tres leches cake</strong>. Spend a study break in <strong>Harrison Park</strong> or walk the <strong>16th Street mural corridor</strong> for Instagram photos.
                      </p>
                    </div>

                    <div className="rounded-lg border border-pink-500/20 bg-pink-500/5 p-4">
                      <h3 className="font-semibold text-pink-200">🍻 Evening (6pm-late)</h3>
                      <p className="mt-2 text-sm leading-relaxed text-white/75">
                        Dinner and drinks at <strong>La Luna</strong>, <strong>Pilsen Yards</strong>, or <strong>5 Rabanitos</strong>. Catch a show at <strong>Thalia Hall</strong> or explore the speakeasy scene at <strong>The Alderman</strong> and <strong>Punch House</strong>. End with craft beer at <strong>Monochrome Brewing</strong> and a paleta from <strong>La Michocana Premium</strong>.
                      </p>
                    </div>
                  </div>
                </div>
              </GlassCard>

              <GlassCard className="bg-gradient-to-br from-orange-500/10 to-purple-500/10">
                <div className="p-8">
                  <h2 className="font-serif text-3xl font-bold">Seasonal Events in Pilsen</h2>
                  
                  <div className="mt-6 space-y-3">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">🎨</span>
                      <div>
                        <h3 className="font-semibold text-white">Second Fridays Art Walk</h3>
                        <p className="text-sm text-white/75">Monthly gallery openings along South Halsted (Chicago Arts District)</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <span className="text-2xl">💀</span>
                      <div>
                        <h3 className="font-semibold text-white">Día de Muertos (October-November)</h3>
                        <p className="text-sm text-white/75">Exhibition and market at National Museum of Mexican Art</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <span className="text-2xl">🇲🇽</span>
                      <div>
                        <h3 className="font-semibold text-white">Mexican Independence Day Parade (September)</h3>
                        <p className="text-sm text-white/75">Neighborhood-wide celebration with floats, music, and food</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <span className="text-2xl">☀️</span>
                      <div>
                        <h3 className="font-semibold text-white">Fiesta del Sol (Summer)</h3>
                        <p className="text-sm text-white/75">Chicago's largest Latino street festival</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <span className="text-2xl">🥬</span>
                      <div>
                        <h3 className="font-semibold text-white">Sunday Farmers Markets (Summer)</h3>
                        <p className="text-sm text-white/75">Local produce and crafts near 18th Street</p>
                      </div>
                    </div>
                  </div>
                </div>
              </GlassCard>

              <GlassCard className="bg-gradient-to-br from-purple-500/20 to-pink-500/20">
                <div className="p-8 text-center">
                  <h2 className="font-serif text-3xl font-bold">Take a Creative Class in Pilsen</h2>
                  <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-white/85">
                    After exploring the neighborhood's murals and street art, why not create your own? <Link href="/chicago" className="text-purple-300 underline">Color Cocktail Factory</Link> is located right in Pilsen and offers pottery, mosaics, glass fusion, and more. Perfect for date nights, friend gatherings, or solo creative time.
                  </p>
                  <div className="mt-6 flex flex-wrap justify-center gap-3">
                    <ButtonPill href="/chicago/date-night-wheel" variant="primary">
                      Book Pottery Class
                    </ButtonPill>
                    <ButtonPill href="/chicago" variant="secondary">
                      See All Chicago Classes
                    </ButtonPill>
                  </div>
                </div>
              </GlassCard>

              <GlassCard>
                <div className="p-8">
                  <h2 className="font-serif text-3xl font-bold">Why Students Love Pilsen</h2>
                  
                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                      <h3 className="font-semibold text-orange-200">💰 Affordable</h3>
                      <p className="mt-2 text-sm text-white/75">Student-friendly prices at cafés, restaurants, and shops</p>
                    </div>

                    <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                      <h3 className="font-semibold text-purple-200">🎨 Artistic</h3>
                      <p className="mt-2 text-sm text-white/75">World-class murals, galleries, and creative community</p>
                    </div>

                    <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                      <h3 className="font-semibold text-pink-200">🌮 Authentic</h3>
                      <p className="mt-2 text-sm text-white/75">Family-owned Mexican restaurants with decades of history</p>
                    </div>

                    <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                      <h3 className="font-semibold text-cyan-200">🚇 Accessible</h3>
                      <p className="mt-2 text-sm text-white/75">Pink Line L train connects Pilsen to the Loop in 15 minutes</p>
                    </div>

                    <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                      <h3 className="font-semibold text-green-200">🤝 Community</h3>
                      <p className="mt-2 text-sm text-white/75">Worker-owned businesses, grassroots organizations, tight-knit neighbors</p>
                    </div>

                    <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                      <h3 className="font-semibold text-amber-200">🎵 Vibrant</h3>
                      <p className="mt-2 text-sm text-white/75">Live music, breweries, speakeasies, and cultural events year-round</p>
                    </div>
                  </div>
                </div>
              </GlassCard>

              <div className="rounded-lg border border-orange-500/30 bg-gradient-to-br from-orange-500/10 to-red-500/10 p-6 text-center">
                <p className="text-sm leading-relaxed text-white/85">
                  <strong>Pilsen's blend of art, culture, and long-established eateries makes it one of Chicago's most vibrant neighborhoods for students.</strong> Whether you have a morning break between classes or a free evening to explore, you can savor traditional Mexican cuisine, discover local literature, take in murals that tell stories of heritage and immigration, and enjoy live music or craft beers in historic venues. The neighborhood's strong community spirit and affordability make it an ideal destination for learners looking to expand their horizons outside the classroom.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </main>
    );
  }

  // Chicago pottery beginner's guide — uses the reusable blog components
  // (Breadcrumbs, AuthorBio, RelatedActivities, RelatedArticles, CityBookingCTA).
  // Content policy: no invented prices, competitor names, survey data,
  // locations, credentials, availability, or ranking claims.
  if (slug === "pottery-classes-chicago-guide") {
    const author = getAuthorBySlug(post.authorSlug);
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/40 to-slate-900">
        <div className="sparkle-noise absolute inset-0 opacity-20" />

        <div className="relative mx-auto max-w-4xl px-6 py-20">
          <Reveal variant="fade-up">
            <Breadcrumbs
              items={[
                { name: "Home", href: "/" },
                { name: "Blog", href: "/blog" },
                { name: post.title },
              ]}
            />
          </Reveal>

          <Reveal delay={100} variant="fade-up">
            <div className="mt-6">
              <div className="mb-4 flex flex-wrap items-center gap-3 text-sm text-white/60">
                <span className="rounded-full bg-purple-500/20 px-3 py-1 text-purple-200">
                  {post.category}
                </span>
                <span>
                  {new Date(post.date).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
                <span>•</span>
                <span>{post.readTime}</span>
              </div>

              <h1 className="font-serif text-4xl font-bold leading-tight sm:text-5xl">
                {post.title}
              </h1>

              <p className="mt-4 text-xl text-white/75">{post.description}</p>
            </div>
          </Reveal>

          <Reveal delay={200} variant="fade-up">
            <div className="mt-12 space-y-8 text-white/85">
              <GlassCard>
                <div className="p-8">
                  <h2 className="font-serif text-2xl font-bold">
                    Why Try Pottery in Chicago?
                  </h2>
                  <p className="mt-4 leading-relaxed">
                    Chicago is a city that has always made room for people who
                    work with their hands. Pilsen, on the near southwest side,
                    is a neighborhood with a deep visual-arts tradition:
                    murals that line 16th and 18th Street, the National Museum
                    of Mexican Art, and a long-running Second Fridays gallery
                    walk. It&apos;s a natural place to try something creative
                    for the first time.
                  </p>
                  <p className="mt-4 leading-relaxed">
                    Pottery in particular is one of the friendlier crafts to
                    start as an adult. You don&apos;t need any drawing
                    background, you don&apos;t need to buy tools, and you
                    walk out with something you made. Our studio sits at
                    1142 W. 18th Street in the heart of Pilsen — a short walk
                    from the Pink Line 18th Street station.
                  </p>
                </div>
              </GlassCard>

              <GlassCard>
                <div className="p-8">
                  <h2 className="font-serif text-2xl font-bold">
                    What Wheel Throwing Actually Feels Like
                  </h2>
                  <p className="mt-4 leading-relaxed">
                    The wheel spins fast. The clay is cool and heavier than
                    it looks. Your first job is <em>centering</em>: pressing
                    the clay down onto the spinning wheelhead until it stops
                    wobbling and moves as one piece. Most beginners find this
                    the hardest part — not because it&apos;s complicated,
                    but because the wheel doesn&apos;t wait for you.
                  </p>
                  <p className="mt-4 leading-relaxed">
                    Once the clay is centered, you push a thumb into the top
                    to open it, then pull the walls up gently between two
                    fingers. If you use too much water, the walls soften and
                    slump. If you rush, they twist off-center. The technique
                    is really about slowing down and keeping steady pressure
                    — a muscle-memory skill more than an artistic one.
                  </p>
                  <p className="mt-4 leading-relaxed">
                    Most people wobble through their first bowl and start to
                    feel it click by the second or third try. That&apos;s
                    normal. Everyone&apos;s first pot is a little lopsided,
                    and that&apos;s part of what makes it yours.
                  </p>
                </div>
              </GlassCard>

              <GlassCard>
                <div className="p-8">
                  <h2 className="font-serif text-2xl font-bold">
                    Wheel or Handbuilding — Which Should You Start With?
                  </h2>
                  <div className="mt-4 space-y-4 leading-relaxed">
                    <p>
                      <strong className="text-white">Wheel throwing</strong>{" "}
                      is the iconic pottery experience most people picture:
                      clay spinning under your hands, walls rising as you
                      pull. It&apos;s the fastest way to make round,
                      symmetrical forms like bowls, mugs, and cups. It&apos;s
                      also the most physical — you&apos;re bracing your
                      elbows, keeping your posture steady, and getting your
                      hands wet and muddy.
                    </p>
                    <p>
                      <strong className="text-white">Handbuilding</strong>{" "}
                      skips the wheel entirely. You shape clay with pinching,
                      coiling, or slab construction. It&apos;s calmer, more
                      forgiving of hesitation, and better suited to
                      sculptural or asymmetrical pieces — planters, small
                      sculptures, textured mugs, tile-style trays.
                    </p>
                    <p>
                      If you&apos;re curious about the wheel, start there —
                      the tactile pull of centered clay is what most people
                      come to pottery for. If you want to focus on making a
                      specific object without racing the wheel, start with{" "}
                      <Link
                        href="/chicago/handbuilding"
                        className="text-purple-300 underline"
                      >
                        handbuilding
                      </Link>
                      .
                    </p>
                  </div>
                </div>
              </GlassCard>

              <GlassCard>
                <div className="p-8">
                  <h2 className="font-serif text-2xl font-bold">
                    What to Expect at Your First Class
                  </h2>
                  <div className="mt-4 space-y-4 leading-relaxed">
                    <p>
                      Every beginner class at our Pilsen studio provides the
                      clay, tools, aprons, and the wheel itself. You bring
                      yourself and, ideally, clothes you don&apos;t mind
                      getting splattered.
                    </p>
                    <p>
                      A typical arc looks like this: a short walkthrough of
                      the wheel and safety basics, a demo from your
                      instructor, then hands-on time at your own wheel with
                      guidance as you go. You&apos;ll usually make more than
                      one piece, keep the one you like best, and hand it in
                      to be fired.
                    </p>
                    <p>
                      Firing and glazing happen after class over the
                      following weeks. When your piece is finished, you pick
                      it up at the studio or arrange delivery. The exact
                      turnaround depends on the kiln schedule — your
                      instructor will tell you what to expect the day of.
                    </p>
                  </div>
                </div>
              </GlassCard>

              <GlassCard>
                <div className="p-8">
                  <h2 className="font-serif text-2xl font-bold">
                    What to Wear (And a Few Small Practicalities)
                  </h2>
                  <ul className="mt-4 list-inside list-disc space-y-2 leading-relaxed text-white/80">
                    <li>
                      Clothes you don&apos;t mind getting clay on. Aprons
                      help but they don&apos;t catch everything.
                    </li>
                    <li>
                      Short or clipped-back fingernails make wheel work a lot
                      easier — long nails catch on the clay walls.
                    </li>
                    <li>
                      Take off rings and bracelets before you start; clay
                      finds every seam.
                    </li>
                    <li>
                      Tie back long hair. Wheels move fast and dry clay is
                      dusty.
                    </li>
                    <li>
                      Come a few minutes early — most people want a moment
                      to settle in before the wheel starts turning.
                    </li>
                  </ul>
                </div>
              </GlassCard>

              <GlassCard>
                <div className="p-8">
                  <h2 className="font-serif text-2xl font-bold">
                    Common First-Timer Worries
                  </h2>
                  <div className="mt-4 space-y-4 leading-relaxed">
                    <p>
                      <strong className="text-white">
                        &ldquo;I&apos;m not artistic.&rdquo;
                      </strong>{" "}
                      Wheel throwing is closer to a physical skill than a
                      drawing skill. Being calm, keeping your hands steady,
                      and following a demo carefully will get you further
                      than raw artistic talent.
                    </p>
                    <p>
                      <strong className="text-white">
                        &ldquo;What if I mess up?&rdquo;
                      </strong>{" "}
                      You will, and it&apos;s fine. Collapsed walls, off-center
                      pulls, and wobbly rims are how everyone starts. Clay is
                      reusable — if a piece doesn&apos;t work, we ball it up
                      and start again.
                    </p>
                    <p>
                      <strong className="text-white">
                        &ldquo;I&apos;m coming alone. Will that be weird?&rdquo;
                      </strong>{" "}
                      Not at all. Group classes are a mix of couples, solo
                      students, and small friend groups. You get your own
                      wheel and your own instructor attention regardless of
                      who you came with.
                    </p>
                    <p>
                      <strong className="text-white">
                        &ldquo;How long until I&apos;m good?&rdquo;
                      </strong>{" "}
                      Good is a moving target. Most people can produce a
                      recognizable bowl in their first class and something
                      they&apos;re actively proud of within a few sessions.
                      Steady practice matters more than talent.
                    </p>
                  </div>
                </div>
              </GlassCard>

              <GlassCard>
                <div className="p-8">
                  <h2 className="font-serif text-2xl font-bold">
                    Types of Pottery Classes We Offer in Chicago
                  </h2>
                  <div className="mt-6 space-y-6">
                    <div>
                      <h3 className="text-xl font-semibold text-purple-200">
                        Date Night Wheel
                      </h3>
                      <p className="mt-2 leading-relaxed text-white/75">
                        A short, low-pressure intro to the wheel designed for
                        two. Good if you want to try pottery without
                        committing to a full course.{" "}
                        <Link
                          href="/chicago/date-night-wheel"
                          className="text-purple-300 underline"
                        >
                          See Date Night Wheel details
                        </Link>
                        .
                      </p>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-cyan-200">
                        Beginner Wheel Throwing
                      </h3>
                      <p className="mt-2 leading-relaxed text-white/75">
                        A focused first class on centering, opening, and
                        pulling walls — the three fundamentals of wheel
                        work.{" "}
                        <Link
                          href="/chicago/beginner-wheel"
                          className="text-cyan-300 underline"
                        >
                          See Beginner Wheel details
                        </Link>
                        .
                      </p>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-pink-200">
                        Handbuilding
                      </h3>
                      <p className="mt-2 leading-relaxed text-white/75">
                        Shape clay by hand — pinching, coiling, and slab
                        techniques. No wheel involved.{" "}
                        <Link
                          href="/chicago/handbuilding"
                          className="text-pink-300 underline"
                        >
                          See Handbuilding details
                        </Link>
                        .
                      </p>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-orange-200">
                        Private Parties
                      </h3>
                      <p className="mt-2 leading-relaxed text-white/75">
                        Book the studio for a group — birthdays, showers,
                        team outings, or a small celebration.{" "}
                        <Link
                          href="/chicago/private-parties"
                          className="text-orange-300 underline"
                        >
                          See Private Party options
                        </Link>
                        .
                      </p>
                    </div>
                  </div>
                </div>
              </GlassCard>

              <GlassCard>
                <div className="p-8">
                  <h2 className="font-serif text-2xl font-bold">
                    Getting to the Studio
                  </h2>
                  <p className="mt-4 leading-relaxed">
                    We&apos;re at 1142 W. 18th Street in Pilsen. The Pink Line
                    18th Street station is a short walk away, and the 18
                    bus runs along 18th Street itself. If you&apos;re
                    driving, street parking is usually available on the
                    surrounding blocks — check posted signs.
                  </p>
                  <p className="mt-4 leading-relaxed">
                    If it&apos;s your first time in the neighborhood, it&apos;s
                    worth arriving early to grab coffee or a bite beforehand.
                    We put together a{" "}
                    <Link
                      href="/blog/pilsen-student-guide"
                      className="text-purple-300 underline"
                    >
                      Pilsen guide
                    </Link>{" "}
                    with places we like within walking distance.
                  </p>
                </div>
              </GlassCard>

              <CityBookingCTA
                headline="Ready to Try the Wheel in Chicago?"
                message="Pick a class in Pilsen and see the current schedule. Beginner-friendly — everything is provided."
                primaryCity="chicago"
              />

              <RelatedActivities
                slugs={post.relatedActivitySlugs}
                city={post.city}
                heading="Chicago Classes to Try Next"
              />

              <RelatedArticles slugs={post.relatedPostSlugs} />

              {author ? <AuthorBio author={author} /> : null}
            </div>
          </Reveal>
        </div>
      </main>
    );
  }

  // Chicago pottery classes — first-timer's guide to choosing the right class.
  // Uses the reusable blog components. Content policy: no invented competitor
  // information, survey data, or ranking claims. Prices and instructor
  // credentials are supplied by the site owner from their own live pages
  // and CV, respectively.
  if (slug === "chicago-pottery-classes-beginners-guide") {
    const author = getAuthorBySlug(post.authorSlug);
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/40 to-slate-900">
        <div className="sparkle-noise absolute inset-0 opacity-20" />

        <div className="relative mx-auto max-w-4xl px-6 py-20">
          <Reveal variant="fade-up">
            <Breadcrumbs
              items={[
                { name: "Home", href: "/" },
                { name: "Blog", href: "/blog" },
                { name: post.title },
              ]}
            />
          </Reveal>

          <Reveal delay={100} variant="fade-up">
            <div className="mt-6">
              <div className="mb-4 flex flex-wrap items-center gap-3 text-sm text-white/60">
                <span className="rounded-full bg-purple-500/20 px-3 py-1 text-purple-200">
                  {post.category}
                </span>
                <span>
                  {new Date(post.date).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
                <span>•</span>
                <span>{post.readTime}</span>
              </div>

              <h1 className="font-serif text-4xl font-bold leading-tight sm:text-5xl">
                {post.title}
              </h1>

              <p className="mt-4 text-xl text-white/75">{post.description}</p>
            </div>
          </Reveal>

          <Reveal delay={200} variant="fade-up">
            <div className="mt-12 space-y-8 text-white/85">
              <GlassCard>
                <div className="p-8 leading-relaxed">
                  <p>Pottery classes in Chicago are not all the same.</p>
                  <p className="mt-4">
                    Some are serious multi-week courses built around repetition
                    and technical development. Others are one-time experiences
                    designed to let you try the wheel without reorganizing your
                    entire life around clay. Some begin with a spinning wheel.
                    Others give you a slab of clay, a few tools, and the freedom
                    to build almost anything.
                  </p>
                  <p className="mt-4">
                    The best first pottery class is not necessarily the longest
                    or most advanced. It is the one that matches{" "}
                    <strong className="text-white">
                      why you want to try pottery in the first place
                    </strong>
                    .
                  </p>
                  <p className="mt-4">
                    Maybe you want to learn a real skill. Maybe you need a date
                    that does not involve silently studying a menu. Maybe your
                    friends want to make things together. Maybe you have watched
                    enough pottery videos to believe centering clay looks easy.
                  </p>
                  <p className="mt-4">
                    The wheel will address that last misunderstanding
                    personally.
                  </p>
                  <p className="mt-4">
                    Here is how to choose the right beginner pottery class in
                    Chicago.
                  </p>
                </div>
              </GlassCard>

              <GlassCard>
                <div className="p-8">
                  <h2 className="font-serif text-2xl font-bold">
                    The Three Main Types of Beginner Pottery Classes
                  </h2>
                  <p className="mt-4 leading-relaxed">
                    For most first-timers, the choice comes down to wheel
                    throwing, date night pottery, or handbuilding.
                  </p>

                  <div className="mt-6 overflow-x-auto">
                    <table className="w-full min-w-[560px] border-collapse text-left text-sm">
                      <thead>
                        <tr className="border-b border-white/15 text-white/70">
                          <th className="py-2 pr-4 font-semibold">Class format</th>
                          <th className="py-2 pr-4 font-semibold">Best for</th>
                          <th className="py-2 pr-4 font-semibold">What you&apos;ll do</th>
                          <th className="py-2 font-semibold">Atmosphere</th>
                        </tr>
                      </thead>
                      <tbody className="text-white/80">
                        <tr className="border-b border-white/10 align-top">
                          <td className="py-3 pr-4 font-semibold text-white">Beginner wheel throwing</td>
                          <td className="py-3 pr-4">Solo guests, friends, and skill seekers</td>
                          <td className="py-3 pr-4">Center, open, pull, and shape clay on a wheel</td>
                          <td className="py-3">Active and technical</td>
                        </tr>
                        <tr className="border-b border-white/10 align-top">
                          <td className="py-3 pr-4 font-semibold text-white">Date night on the wheel</td>
                          <td className="py-3 pr-4">Couples and double dates</td>
                          <td className="py-3 pr-4">Share the pottery experience while learning basic wheel techniques</td>
                          <td className="py-3">Playful and social</td>
                        </tr>
                        <tr className="align-top">
                          <td className="py-3 pr-4 font-semibold text-white">Handbuilding pottery</td>
                          <td className="py-3 pr-4">Groups, beginners, and sculptural thinkers</td>
                          <td className="py-3 pr-4">Build with slabs, coils, and pinch techniques</td>
                          <td className="py-3">Relaxed and flexible</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <p className="mt-6 leading-relaxed text-white/80">
                    All three involve clay, but they feel surprisingly
                    different.
                  </p>
                </div>
              </GlassCard>

              <GlassCard>
                <div className="p-8">
                  <h2 className="font-serif text-2xl font-bold">
                    Option 1: Beginner Wheel Throwing
                  </h2>
                  <p className="mt-4 leading-relaxed">
                    Wheel throwing is the version of pottery most people
                    picture first: wet clay spinning in the center of a wheel
                    while two hands slowly convince it to become a vessel.
                  </p>
                  <p className="mt-4 leading-relaxed">
                    A beginner wheel class usually introduces several
                    foundational steps:
                  </p>
                  <ol className="mt-3 list-decimal space-y-1 pl-6 leading-relaxed text-white/80">
                    <li>Preparing the clay</li>
                    <li>Attaching it securely to the wheel</li>
                    <li>Centering it</li>
                    <li>Opening the center</li>
                    <li>Pulling up the walls</li>
                    <li>Shaping the form</li>
                  </ol>
                  <p className="mt-4 leading-relaxed">
                    Centering is the first major challenge. You are trying to
                    bring the clay into perfect alignment with the spinning
                    wheel so it stops wobbling. Once it is centered, you can
                    begin opening and raising the form.
                  </p>
                  <p className="mt-4 leading-relaxed">
                    Your first piece might become a bowl, cup, vase, cylinder,
                    or something without a recognized name. That is normal.
                    First pieces tend to have personality.
                  </p>
                  <p className="mt-4 leading-relaxed">
                    At Color Cocktail Factory, the{" "}
                    <Link href="/chicago/beginner-wheel" className="text-purple-300 underline">
                      beginner wheel throwing class
                    </Link>{" "}
                    is designed for people with no previous experience. The
                    class introduces clay preparation, centering, pulling, and
                    basic shaping with hands-on instruction.
                  </p>

                  <h3 className="mt-6 text-xl font-semibold text-purple-200">
                    Choose beginner wheel throwing when:
                  </h3>
                  <ul className="mt-3 list-disc space-y-2 pl-6 leading-relaxed text-white/80">
                    <li>You want to learn an actual pottery technique, not simply decorate a premade object.</li>
                    <li>You enjoy physical, hands-on activities.</li>
                    <li>You are comfortable making mistakes while an object spins rapidly in front of you.</li>
                    <li>You want to attend alone, with a friend, or as part of a small group.</li>
                    <li>You are curious about continuing pottery after your first class.</li>
                  </ul>
                  <p className="mt-4 leading-relaxed">
                    Wheel throwing is especially satisfying for people who like
                    the combination of precision and unpredictability. You
                    control the clay, except during the moments when the clay
                    reminds you that this relationship is still new.
                  </p>
                </div>
              </GlassCard>

              <GlassCard>
                <div className="p-8">
                  <h2 className="font-serif text-2xl font-bold">
                    Option 2: Date Night Pottery
                  </h2>
                  <p className="mt-4 leading-relaxed">
                    A pottery date works because it gives both people something
                    to do.
                  </p>
                  <p className="mt-4 leading-relaxed">
                    You are not sitting directly across from each other trying
                    to keep a conversation alive through appetizers. You are
                    working side by side, getting messy, comparing pieces,
                    helping each other, and laughing when one person
                    accidentally creates a very elegant ashtray instead of a
                    coffee cup.
                  </p>
                  <p className="mt-4 leading-relaxed">
                    At Color Cocktail Factory&apos;s{" "}
                    <Link href="/chicago/date-night-wheel" className="text-purple-300 underline">
                      Date Night on the Wheel
                    </Link>
                    , two people share the wheel experience and receive
                    step-by-step guidance. It is designed for beginners, so
                    neither person needs to arrive knowing pottery terminology
                    or pretending they once took ceramics in college.
                  </p>

                  <h3 className="mt-6 text-xl font-semibold text-pink-200">
                    Choose date night pottery when:
                  </h3>
                  <ul className="mt-3 list-disc space-y-2 pl-6 leading-relaxed text-white/80">
                    <li>You want an activity rather than a conventional dinner date.</li>
                    <li>It is a first date and you want natural conversation.</li>
                    <li>You are celebrating an anniversary or birthday.</li>
                    <li>You want photos, memories, and something physical connected to the evening.</li>
                    <li>You are booking with several couples.</li>
                  </ul>
                  <p className="mt-4 leading-relaxed">
                    Pottery is also a useful compatibility test. You quickly
                    learn who reads instructions, who improvises, who steals
                    the sponge, and who becomes emotionally attached to a
                    leaning bowl after eleven minutes.
                  </p>
                </div>
              </GlassCard>

              <GlassCard>
                <div className="p-8">
                  <h2 className="font-serif text-2xl font-bold">
                    Option 3: Handbuilding Pottery
                  </h2>
                  <p className="mt-4 leading-relaxed">
                    Handbuilding means shaping clay without a pottery wheel.
                  </p>
                  <p className="mt-4 leading-relaxed">
                    Instead of centering clay on a spinning surface, you
                    construct forms using techniques such as pinching, coiling,
                    and slab building. This allows you to make cups, bowls,
                    planters, vases, tiles, sculptures, and irregular objects
                    that would be difficult to create on a wheel.
                  </p>
                  <p className="mt-4 leading-relaxed">
                    Handbuilding is not an easier or lesser version of pottery.
                    It is simply a different language.
                  </p>
                  <p className="mt-4 leading-relaxed">
                    The wheel naturally encourages round forms. Handbuilding
                    lets you make square, angular, architectural, figurative,
                    or deliberately strange forms.
                  </p>
                  <p className="mt-4 leading-relaxed">
                    Color Cocktail Factory&apos;s{" "}
                    <Link href="/chicago/handbuilding" className="text-purple-300 underline">
                      handbuilding pottery classes
                    </Link>{" "}
                    introduce slab and pinch techniques and may include bowls,
                    planters, vases, or rotating themed projects.
                  </p>

                  <h3 className="mt-6 text-xl font-semibold text-cyan-200">
                    Choose handbuilding when:
                  </h3>
                  <ul className="mt-3 list-disc space-y-2 pl-6 leading-relaxed text-white/80">
                    <li>You want more freedom over the final shape.</li>
                    <li>You enjoy sculpture, illustration, architecture, or character design.</li>
                    <li>You prefer a calmer pace.</li>
                    <li>You are attending with a group that wants to talk while working.</li>
                    <li>You have tried the wheel and discovered that spinning is not currently your spiritual path.</li>
                  </ul>
                  <p className="mt-4 leading-relaxed">
                    Handbuilding is often a strong choice for birthday groups,
                    private events, coworkers, families, and guests who want
                    every finished piece to look completely different.
                  </p>
                </div>
              </GlassCard>

              <GlassCard>
                <div className="p-8">
                  <h2 className="font-serif text-2xl font-bold">
                    One-Time Class or Multi-Week Course?
                  </h2>
                  <p className="mt-4 leading-relaxed">
                    A one-time pottery class and a multi-week ceramics course
                    serve different purposes.
                  </p>
                  <p className="mt-4 leading-relaxed">
                    A one-time class lets you experience clay, learn the
                    central steps, and determine whether you enjoy the process.
                    It is ideal for dates, celebrations, visitors, busy adults,
                    and curious beginners.
                  </p>
                  <p className="mt-4 leading-relaxed">
                    A multi-week course gives you repetition. You may learn
                    trimming, handles, surface decoration, glazing, kiln
                    processes, and how to reproduce a form with greater
                    control.
                  </p>

                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    <div className="rounded-xl border border-white/10 bg-white/5 p-5">
                      <h3 className="font-semibold text-purple-200">
                        Choose a one-time class when you want:
                      </h3>
                      <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-white/80">
                        <li>A creative night out</li>
                        <li>A low-commitment introduction</li>
                        <li>A date or group activity</li>
                        <li>A chance to try pottery before investing further</li>
                      </ul>
                    </div>
                    <div className="rounded-xl border border-white/10 bg-white/5 p-5">
                      <h3 className="font-semibold text-cyan-200">
                        Choose a multi-week course when you want:
                      </h3>
                      <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-white/80">
                        <li>Consistent technical practice</li>
                        <li>A deeper understanding of the ceramic process</li>
                        <li>Independent studio skills</li>
                        <li>Time to develop a personal body of work</li>
                      </ul>
                    </div>
                  </div>

                  <p className="mt-6 leading-relaxed">
                    You do not need to begin with a long course. One good
                    introductory class can tell you whether you want pottery to
                    become a hobby or whether you simply enjoyed one heroic
                    evening with a bowl.
                  </p>
                </div>
              </GlassCard>

              <GlassCard>
                <div className="p-8">
                  <h2 className="font-serif text-2xl font-bold">
                    What Happens During Your First Wheel Class?
                  </h2>
                  <p className="mt-4 leading-relaxed">
                    Every studio organizes its classes differently, but a
                    beginner session generally begins with a demonstration.
                  </p>
                  <p className="mt-4 leading-relaxed">
                    The instructor explains body position, hand placement,
                    wheel speed, and water use. You then prepare the clay and
                    begin centering.
                  </p>
                  <p className="mt-4 leading-relaxed">
                    Once centered, you press into the clay to create an
                    opening. You widen the interior, establish the floor, and
                    pull the clay upward to form walls. From there, you can
                    shape the piece into a cylinder, cup, bowl, or vase.
                  </p>
                  <p className="mt-4 leading-relaxed">
                    The instructor may help rescue a collapsing form, but a
                    good beginner class should also let you feel what the clay
                    is doing. Pottery is partly instruction and partly learning
                    to recognize pressure, moisture, speed, and timing.
                  </p>
                  <p className="mt-4 leading-relaxed">
                    By the end, your piece may not look like the object you
                    imagined at the beginning. That does not mean the class
                    failed. Learning how clay responds is the real first
                    result.
                  </p>
                  <p className="mt-4 leading-relaxed">The cup is a bonus.</p>
                </div>
              </GlassCard>

              <GlassCard>
                <div className="p-8">
                  <h2 className="font-serif text-2xl font-bold">
                    What Can You Realistically Make in Your First Class?
                  </h2>
                  <p className="mt-4 leading-relaxed">
                    Most beginners can create a small vessel during an
                    introductory wheel class, especially with direct
                    instruction.
                  </p>
                  <p className="mt-4 leading-relaxed">
                    Common first projects include:
                  </p>
                  <ul className="mt-3 list-disc space-y-1 pl-6 leading-relaxed text-white/80">
                    <li>A small bowl</li>
                    <li>A cup without a handle</li>
                    <li>A cylinder</li>
                    <li>A bud vase</li>
                    <li>A decorative vessel</li>
                  </ul>
                  <p className="mt-4 leading-relaxed">
                    Handbuilding allows a wider range of first projects,
                    including planters, mugs, sculptural objects, trays,
                    animals, candleholders, and seasonal pieces.
                  </p>
                  <p className="mt-4 leading-relaxed">
                    The exact project depends on the class length, the amount
                    of clay provided, and whether the workshop follows a
                    specific theme.
                  </p>
                  <p className="mt-4 leading-relaxed">
                    Do not judge your first piece against professional pottery
                    online. A professional potter may have made thousands of
                    cylinders before filming the thirty-second video in which
                    everything appears effortless.
                  </p>
                  <p className="mt-4 leading-relaxed">
                    Your first piece only needs to prove that you made it.
                  </p>
                </div>
              </GlassCard>

              <GlassCard>
                <div className="p-8">
                  <h2 className="font-serif text-2xl font-bold">
                    Do You Get to Keep What You Make?
                  </h2>
                  <p className="mt-4 leading-relaxed">
                    This is one of the most important questions to ask before
                    booking.
                  </p>
                  <p className="mt-4 leading-relaxed">
                    Clay must normally dry and go through a kiln process before
                    it becomes durable ceramic. Functional pottery may also
                    require glazing and another firing.
                  </p>
                  <p className="mt-4 leading-relaxed">
                    Some studios include firing and glazing in the ticket
                    price. Others charge separately. Some let guests choose
                    between taking an unfired decorative piece home or leaving
                    it for professional finishing.
                  </p>
                  <p className="mt-4 leading-relaxed">
                    At the time of publication, Color Cocktail Factory&apos;s
                    Chicago pottery pages list same-day decorative pickup or
                    optional firing and glazing beginning at $5 per item. Check
                    the live{" "}
                    <Link href="/activities/date-night-wheel" className="text-purple-300 underline">
                      class page
                    </Link>{" "}
                    when booking, because finishing choices, prices, and pickup
                    timelines can change.
                  </p>

                  <p className="mt-4 leading-relaxed">
                    Before paying for any pottery class, check:
                  </p>
                  <ul className="mt-3 list-disc space-y-1 pl-6 leading-relaxed text-white/80">
                    <li>Whether you keep the piece</li>
                    <li>Whether firing is included</li>
                    <li>Whether glazing is included</li>
                    <li>When finished work will be ready</li>
                    <li>How long the studio holds completed pottery</li>
                    <li>Whether shipping is available</li>
                  </ul>
                  <p className="mt-4 leading-relaxed">
                    A pottery class price is difficult to compare until you
                    know what happens after the class.
                  </p>
                </div>
              </GlassCard>

              <GlassCard>
                <div className="p-8">
                  <h2 className="font-serif text-2xl font-bold">
                    What Should You Wear to a Pottery Class?
                  </h2>
                  <p className="mt-4 leading-relaxed">
                    Wear comfortable clothes that can survive a little clay and
                    water.
                  </p>
                  <p className="mt-4 leading-relaxed">
                    You do not need to dress like you are entering a mine.
                    Pottery is messy, but it is usually a controlled kind of
                    messy.
                  </p>
                  <p className="mt-4 leading-relaxed">
                    A practical outfit includes:
                  </p>
                  <ul className="mt-3 list-disc space-y-1 pl-6 leading-relaxed text-white/80">
                    <li>Comfortable pants</li>
                    <li>A shirt with sleeves that can be rolled up</li>
                    <li>Shoes suitable for a studio</li>
                    <li>Tied-back hair</li>
                    <li>Minimal rings, bracelets, and watches</li>
                  </ul>
                  <p className="mt-4 leading-relaxed">
                    Shorter nails make wheel throwing easier because long nails
                    can cut into the clay while you shape it. Long nails do not
                    automatically prevent participation, but handbuilding may
                    feel more comfortable.
                  </p>
                  <p className="mt-4 leading-relaxed">
                    Avoid wearing anything that would cause emotional or
                    financial damage if a muddy handprint appeared on it.
                  </p>
                </div>
              </GlassCard>

              <GlassCard>
                <div className="p-8">
                  <h2 className="font-serif text-2xl font-bold">
                    How Much Does a Pottery Class in Chicago Cost?
                  </h2>
                  <p className="mt-4 leading-relaxed">
                    Pottery class pricing varies because studios package their
                    experiences differently.
                  </p>
                  <p className="mt-4 leading-relaxed">
                    A lower ticket price may cover instruction only. Another
                    class may include clay, tools, glazing, firing, and finished
                    piece pickup. Date night tickets may be priced per person,
                    per couple, or per wheel.
                  </p>
                  <p className="mt-4 leading-relaxed">
                    Instead of comparing only the headline price, compare what
                    is included:
                  </p>

                  <div className="mt-6 overflow-x-auto">
                    <table className="w-full min-w-[480px] border-collapse text-left text-sm">
                      <thead>
                        <tr className="border-b border-white/15 text-white/70">
                          <th className="py-2 pr-4 font-semibold">Cost factor</th>
                          <th className="py-2 font-semibold">Question to ask</th>
                        </tr>
                      </thead>
                      <tbody className="text-white/80">
                        <tr className="border-b border-white/10 align-top">
                          <td className="py-3 pr-4 font-semibold text-white">Clay</td>
                          <td className="py-3">Is clay included, and how much?</td>
                        </tr>
                        <tr className="border-b border-white/10 align-top">
                          <td className="py-3 pr-4 font-semibold text-white">Tools</td>
                          <td className="py-3">Are studio tools provided?</td>
                        </tr>
                        <tr className="border-b border-white/10 align-top">
                          <td className="py-3 pr-4 font-semibold text-white">Instruction</td>
                          <td className="py-3">Is the class guided throughout?</td>
                        </tr>
                        <tr className="border-b border-white/10 align-top">
                          <td className="py-3 pr-4 font-semibold text-white">Firing</td>
                          <td className="py-3">Is kiln firing included or optional?</td>
                        </tr>
                        <tr className="border-b border-white/10 align-top">
                          <td className="py-3 pr-4 font-semibold text-white">Glazing</td>
                          <td className="py-3">Do I glaze it, choose a color, or pay separately?</td>
                        </tr>
                        <tr className="border-b border-white/10 align-top">
                          <td className="py-3 pr-4 font-semibold text-white">Finished work</td>
                          <td className="py-3">Is pickup included?</td>
                        </tr>
                        <tr className="align-top">
                          <td className="py-3 pr-4 font-semibold text-white">Ticket structure</td>
                          <td className="py-3">Is the price per person or per pair?</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <p className="mt-6 leading-relaxed">
                    The best value is the class that clearly explains the full
                    experience before checkout.
                  </p>
                  <p className="mt-4 leading-relaxed">
                    A mysterious twelve-dollar pottery class can become
                    considerably less mysterious after six add-ons.
                  </p>
                </div>
              </GlassCard>

              <GlassCard>
                <div className="p-8">
                  <h2 className="font-serif text-2xl font-bold">
                    Which Pottery Class Is Best for Your Occasion?
                  </h2>

                  <div className="mt-6 space-y-5 leading-relaxed">
                    <div>
                      <h3 className="text-xl font-semibold text-purple-200">
                        Going alone
                      </h3>
                      <p className="mt-2 text-white/80">
                        Choose beginner wheel throwing. Pottery is easy to
                        attend alone because everyone is concentrating on a
                        shared process. You do not need a partner, and you will
                        naturally interact with the instructor and other
                        guests.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold text-pink-200">
                        First date
                      </h3>
                      <p className="mt-2 text-white/80">
                        Choose date night on the wheel. The activity creates
                        conversation without requiring constant conversation.
                        It also gives both people a common problem to solve,
                        which is usually more revealing than discussing
                        favorite television shows.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold text-cyan-200">
                        Anniversary or birthday date
                      </h3>
                      <p className="mt-2 text-white/80">
                        Choose date night pottery or a themed handbuilding
                        project. A finished piece can become a physical record
                        of the occasion, especially when both people contribute
                        to it.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold text-orange-200">
                        Friend group
                      </h3>
                      <p className="mt-2 text-white/80">
                        Choose handbuilding or reserve several beginner wheel
                        seats. Handbuilding makes it easier for guests to talk
                        continuously, while wheel throwing creates more
                        individual moments of concentration.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold text-green-200">
                        Bachelorette party, birthday, or company outing
                      </h3>
                      <p className="mt-2 text-white/80">
                        Consider a{" "}
                        <Link href="/chicago/private-parties" className="text-green-300 underline">
                          private pottery event
                        </Link>
                        . Private sessions make it easier to seat a group
                        together, select an appropriate project, and coordinate
                        timing. CCF&apos;s current private event form
                        accommodates occasions including birthdays,
                        bachelorette parties, team outings, and company events.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold text-purple-200">
                        Serious skill development
                      </h3>
                      <p className="mt-2 text-white/80">
                        Begin with a wheel class, then seek repeated practice
                        through additional sessions, open studio time, a
                        membership, or a multi-week course. Pottery improves
                        through repetition. Your hands need time to understand
                        what the instructor explained in five minutes.
                      </p>
                    </div>
                  </div>
                </div>
              </GlassCard>

              <GlassCard>
                <div className="p-8">
                  <h2 className="font-serif text-2xl font-bold">
                    Turn Your Pottery Class Into a Pilsen Afternoon
                  </h2>
                  <p className="mt-4 leading-relaxed">
                    Color Cocktail Factory&apos;s Chicago studio is located in
                    Pilsen, so your pottery class does not have to be the only
                    part of the outing.
                  </p>
                  <p className="mt-4 leading-relaxed">
                    You can visit neighborhood murals, get coffee, have dinner,
                    or explore local galleries before or after class. For a
                    longer itinerary, read our{" "}
                    <Link href="/blog/pilsen-student-guide" className="text-purple-300 underline">
                      guide to exploring Pilsen before and after your class
                    </Link>
                    .
                  </p>
                  <p className="mt-4 leading-relaxed">
                    The neighborhood already has its own visual energy.
                    Arriving early and walking around can put you in a better
                    frame of mind for making something.
                  </p>
                  <p className="mt-4 leading-relaxed">
                    Just do the eating before the wheel begins. Clay is many
                    things, but it is not a garnish.
                  </p>
                </div>
              </GlassCard>

              <GlassCard>
                <div className="p-8">
                  <h2 className="font-serif text-2xl font-bold">
                    Frequently Asked Questions
                  </h2>

                  <div className="mt-6 space-y-5 leading-relaxed">
                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        Do I need artistic experience?
                      </h3>
                      <p className="mt-2 text-white/80">
                        No. Beginner pottery classes teach the process from the
                        beginning. Drawing ability is not required.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        Is wheel throwing difficult?
                      </h3>
                      <p className="mt-2 text-white/80">
                        It requires coordination and patience, particularly
                        during centering. A guided beginner class makes the
                        process much more approachable.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        Can I attend a pottery class by myself?
                      </h3>
                      <p className="mt-2 text-white/80">
                        Yes. Beginner wheel and handbuilding classes work well
                        for solo guests.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        Is pottery good for couples?
                      </h3>
                      <p className="mt-2 text-white/80">
                        Yes. It provides a shared activity, natural
                        conversation, and something memorable to make together.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        Can children take pottery classes?
                      </h3>
                      <p className="mt-2 text-white/80">
                        Some sessions may be appropriate for children, while
                        others are designed for adults. Check the individual
                        class description and age requirements before booking.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        Will I finish a perfect cup?
                      </h3>
                      <p className="mt-2 text-white/80">
                        Possibly. You might also make a bowl, vase, cylinder,
                        or historic new category of object. All are acceptable
                        outcomes.
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        Can I use my piece for food or drinks?
                      </h3>
                      <p className="mt-2 text-white/80">
                        Only use a ceramic piece functionally when the studio
                        confirms that the clay and glaze have been properly
                        fired and are suitable for that purpose. Unfired
                        decorative pieces should not be used for food, liquids,
                        or plants that require watering.
                      </p>
                    </div>
                  </div>

                  <p className="mt-6 text-xs text-white/50">
                    Note: This FAQ is presented as on-page content only. FAQPage
                    structured data is intentionally not emitted — Google
                    discontinued FAQ rich results in general search in
                    May 2026.
                  </p>
                </div>
              </GlassCard>

              <GlassCard className="bg-gradient-to-br from-purple-500/20 to-pink-500/20">
                <div className="p-8">
                  <h2 className="font-serif text-2xl font-bold">
                    Ready to Try Pottery in Chicago?
                  </h2>
                  <p className="mt-4 leading-relaxed text-white/85">
                    Choose the experience that matches what you actually want
                    from the day:
                  </p>
                  <ul className="mt-4 space-y-3">
                    <li>
                      <Link href="/chicago/beginner-wheel" className="text-purple-200 underline hover:text-white">
                        Learn wheel throwing for the first time →
                      </Link>
                    </li>
                    <li>
                      <Link href="/chicago/date-night-wheel" className="text-purple-200 underline hover:text-white">
                        Plan a pottery date night →
                      </Link>
                    </li>
                    <li>
                      <Link href="/chicago/handbuilding" className="text-purple-200 underline hover:text-white">
                        Try handbuilding pottery →
                      </Link>
                    </li>
                    <li>
                      <Link href="/chicago" className="text-purple-200 underline hover:text-white">
                        Browse all Chicago classes and workshops →
                      </Link>
                    </li>
                  </ul>
                  <p className="mt-6 leading-relaxed text-white/80">
                    You do not need experience, special equipment, or a secret
                    talent for clay. You only need to choose a class and allow
                    your first bowl to be slightly strange.
                  </p>
                  <p className="mt-4 leading-relaxed text-white/80">
                    That is how most pottery begins.
                  </p>
                </div>
              </GlassCard>

              <CityBookingCTA
                headline="See Available Chicago Classes"
                message="Pick a format, pick a time, and book in minutes. Beginner-friendly — everything is provided."
                primaryCity="chicago"
              />

              <RelatedActivities
                slugs={post.relatedActivitySlugs}
                city={post.city}
                heading="Chicago Classes Referenced in This Guide"
              />

              <RelatedArticles slugs={post.relatedPostSlugs} />

              {author ? <AuthorBio author={author} /> : null}
            </div>
          </Reveal>
        </div>
      </main>
    );
  }

  return <div>Blog post not found</div>;
}
