import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import GlassCard from "@/components/ui/GlassCard";
import ButtonPill from "@/components/ui/ButtonPill";
import Reveal from "@/components/motion/Reveal";
import { getBlogPostBySlug } from "@/lib/blogPosts";

type Props = {
  params: { slug: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = getBlogPostBySlug(params.slug);
  
  if (!post) {
    return {
      title: "Post Not Found | Color Cocktail Factory Blog"
    };
  }

  return {
    title: `${post.title} | CCF Blog`,
    description: post.description,
    keywords: post.keywords,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
      authors: [post.author],
      images: [post.image]
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: [post.image]
    }
  };
}

export default function BlogPostPage({ params }: Props) {
  const post = getBlogPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  // Pottery 101 content
  if (params.slug === "pottery-101-beginners-guide") {
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
                    Join us in Chicago or Eugene for a hands-on pottery experience. All skill levels welcome - we provide everything you need!
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
  if (params.slug === "chicago-date-night-ideas") {
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
                        Create colorful mosaic artwork together! Our <Link href="/chicago/mosaics" className="text-orange-300 underline">Mosaic class</Link> teaches you to design and assemble beautiful patterns. Perfect for couples who love color and creativity.
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

  return <div>Blog post not found</div>;
}
