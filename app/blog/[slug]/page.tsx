import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import GlassCard from "@/components/ui/GlassCard";
import ButtonPill from "@/components/ui/ButtonPill";
import Reveal from "@/components/motion/Reveal";
import { getBlogPostBySlug, getAllBlogPosts } from "@/lib/blogPosts";

type Props = {
  params: { slug: string };
};

export async function generateStaticParams() {
  const posts = getAllBlogPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

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

  // Eugene Date Night Ideas content
  if (params.slug === "eugene-date-night-ideas") {
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
                        Piece together a colorful masterpiece! Our <Link href="/eugene/mosaics" className="text-orange-300 underline">Mosaic class</Link> teaches you to create intricate patterns and designs. Perfect for artistic couples who love working with color.
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
  if (params.slug === "pilsen-student-guide") {
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

  return <div>Blog post not found</div>;
}
