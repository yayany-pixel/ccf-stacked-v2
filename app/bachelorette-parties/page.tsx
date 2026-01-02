import { Metadata } from "next";
import Link from "next/link";
import { sections } from "@/lib/config";
import Reveal from "@/components/motion/Reveal";
import { ArrowRight, Sparkles, Camera, Wine, Heart, Users, CheckCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Bachelorette Party Ideas - Pottery & Art Workshops | Color Cocktail Factory",
  description: "Unique bachelorette party ideas! Create pottery, mosaics & art with your crew. BYOB, photo-worthy moments, unforgettable memories. Chicago & Eugene.",
  keywords: [
    "bachelorette party ideas",
    "unique bachelorette party",
    "pottery bachelorette",
    "girls night out",
    "bridal shower alternative",
    "BYOB bachelorette party",
    "creative bachelorette ideas",
    "Chicago bachelorette party",
    "Eugene bachelorette party",
    "hands-on bachelorette",
    "artsy bachelorette",
    "fun bachelorette activities"
  ],
  openGraph: {
    title: "Bachelorette Party Ideas - Pottery & Art Workshops",
    description: "Skip the typical bach! Create pottery, make memories, bring drinks. The most Instagram-worthy bachelorette party in Chicago & Eugene.",
    type: "website",
    url: "https://colorcocktailfactory.com/bachelorette-parties",
  },
};

// FAQ Schema for Rich Results
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How many people can we bring for a bachelorette party?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "We accommodate groups of all sizes! Small squads (4-8) can book directly online. Larger crews (9+) can request private studio sessions with custom packages and dedicated instructors."
      }
    },
    {
      "@type": "Question",
      "name": "Can we bring champagne and decorations for a bachelorette party?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Absolutely! We're BYOB-friendly - bring champagne, wine, cocktails, or whatever you love. Decorations, banners, and sashes are all welcome. We provide the space, you bring the party vibes!"
      }
    },
    {
      "@type": "Question",
      "name": "Do we need any pottery or art experience?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Zero experience needed! Our expert instructors guide you step-by-step through the process. It's all about fun, bonding, and creating memories - not perfection. Everyone makes something beautiful!"
      }
    },
    {
      "@type": "Question",
      "name": "Is this good for Instagram photos?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "YES! Our studio spaces are aesthetically stunning with natural light, colorful art, and creative vibes. We encourage photos and videos throughout. Many bachelorette groups say it was their most Instagram-worthy activity!"
      }
    },
    {
      "@type": "Question",
      "name": "How long do bachelorette workshops last?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Most workshops run 2-3 hours, perfect for an afternoon or evening activity. Long enough to create something amazing, short enough to leave time for dinner or more celebrations!"
      }
    }
  ]
};

export default function BachelorettePartiesPage() {
  // Filter workshops that are perfect for bachelorette parties
  const bacheloretteWorkshops = sections.filter(section => 
    ['beginner-wheel', 'handbuilding', 'mosaics', 'glass-fusion', 'candle-making', 'terrarium'].includes(section.id)
  );

  return (
    <>
      {/* FAQ Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
        
        {/* Hero Section */}
        <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-pink-900/30 via-purple-900/30 to-rose-900/30"></div>
          <div className="relative max-w-6xl mx-auto text-center">
            <Reveal>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-pink-500/10 border border-pink-500/20 rounded-full mb-6">
                <Sparkles className="w-5 h-5 text-pink-400" />
                <span className="text-pink-300 text-sm font-medium">Bachelorette Experiences</span>
              </div>
            </Reveal>
            
            <Reveal delay={0.1}>
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
                Skip the Typical Bach
                <span className="block bg-gradient-to-r from-pink-400 via-rose-400 to-purple-400 bg-clip-text text-transparent">
                  Make Something Epic
                </span>
              </h1>
            </Reveal>

            <Reveal delay={0.2}>
              <p className="text-xl md:text-2xl text-slate-300 mb-8 max-w-3xl mx-auto">
                Pottery wheels, champagne, and your best crew. Create unforgettable memories 
                (and Instagram content) with hands-on art workshops. BYOB, photo-worthy, totally unique.
              </p>
            </Reveal>

            {/* Benefits Grid */}
            <Reveal delay={0.3}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto mb-10">
                <div className="flex items-center justify-center gap-2 px-4 py-3 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10">
                  <Wine className="w-5 h-5 text-pink-400" />
                  <span className="text-white font-medium">BYOB Champagne</span>
                </div>
                <div className="flex items-center justify-center gap-2 px-4 py-3 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10">
                  <Camera className="w-5 h-5 text-purple-400" />
                  <span className="text-white font-medium">Insta-Worthy Vibes</span>
                </div>
                <div className="flex items-center justify-center gap-2 px-4 py-3 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10">
                  <Heart className="w-5 h-5 text-rose-400" />
                  <span className="text-white font-medium">Zero Experience Needed</span>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.4}>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link
                  href="/private-events"
                  className="group inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-pink-500 via-rose-500 to-purple-500 text-white font-semibold rounded-full hover:from-pink-600 hover:via-rose-600 hover:to-purple-600 transition-all shadow-lg hover:shadow-pink-500/50"
                >
                  Plan Your Bachelorette
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <a
                  href="#workshops"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-full hover:bg-white/20 transition-all border border-white/20"
                >
                  See Activities
                </a>
              </div>
            </Reveal>
          </div>
        </section>

        {/* Why This is Perfect Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-800/50 to-transparent">
          <div className="max-w-6xl mx-auto">
            <Reveal>
              <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-16">
                Why Bachelorette Parties Love Us
              </h2>
            </Reveal>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: "🍾",
                  title: "BYOB Heaven",
                  description: "Bring champagne, wine, cocktails - whatever your squad loves. No corkage fees, no rules."
                },
                {
                  icon: "📸",
                  title: "Content Gold",
                  description: "Aesthetic studio spaces, creative process, finished art - your Instagram stories will be 🔥"
                },
                {
                  icon: "💕",
                  title: "Bonding Magic",
                  description: "Creating together brings your crew closer. Laughter, teamwork, and memories that last."
                },
                {
                  icon: "🎨",
                  title: "Take Home Art",
                  description: "Everyone leaves with handmade pieces - way better than matching t-shirts you'll never wear again."
                }
              ].map((item, index) => (
                <Reveal key={index} delay={index * 0.1}>
                  <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 text-center">
                    <div className="text-5xl mb-4">{item.icon}</div>
                    <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                    <p className="text-slate-300">{item.description}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Workshop Grid */}
        <section id="workshops" className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <Reveal>
              <div className="text-center mb-12">
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                  Choose Your Experience
                </h2>
                <p className="text-xl text-slate-300 max-w-3xl mx-auto">
                  From pottery wheel throwing to mosaics - all designed for fun, drinks, and memories
                </p>
              </div>
            </Reveal>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bacheloretteWorkshops.map((workshop, index) => (
                <Reveal key={workshop.id} delay={index * 0.1}>
                  <div className="group relative bg-white/5 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10 hover:border-pink-500/50 transition-all hover:scale-105">
                    <div className="aspect-[4/3] bg-gradient-to-br from-slate-700 to-slate-800 relative overflow-hidden">
                      {workshop.image && (
                        <img 
                          src={workshop.image} 
                          alt={workshop.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      <div className="absolute top-4 right-4 px-3 py-1 bg-pink-500 text-white text-xs font-bold rounded-full">
                        POPULAR
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <h3 className="text-2xl font-bold text-white mb-2">{workshop.title}</h3>
                      <p className="text-slate-300 mb-4 line-clamp-2">{workshop.description}</p>
                      
                      <div className="flex flex-col sm:flex-row gap-2">
                        {workshop.chicagoLink && (
                          <a
                            href={workshop.chicagoLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-pink-500/20 text-pink-300 rounded-lg hover:bg-pink-500/30 transition-colors text-sm font-medium border border-pink-500/30"
                          >
                            Chicago
                          </a>
                        )}
                        {workshop.eugeneLink && (
                          <a
                            href={workshop.eugeneLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-purple-500/20 text-purple-300 rounded-lg hover:bg-purple-500/30 transition-colors text-sm font-medium border border-purple-500/30"
                          >
                            Eugene
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal delay={0.3}>
              <div className="text-center mt-12">
                <p className="text-slate-300 mb-4">Can&apos;t decide? We&apos;ll help you choose the perfect vibe for your crew</p>
                <Link
                  href="/private-events"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-full hover:bg-white/20 transition-all border border-white/20"
                >
                  Get Personalized Recommendations
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </Reveal>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-800/50 to-transparent">
          <div className="max-w-6xl mx-auto">
            <Reveal>
              <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-16">
                How Your Bach Party Works
              </h2>
            </Reveal>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                {
                  step: "1",
                  title: "Pick Your Vibe",
                  description: "Pottery wheel for hands-on fun? Mosaics for chill creativity? You choose!",
                  icon: Sparkles
                },
                {
                  step: "2",
                  title: "Grab Your Squad",
                  description: "Small group? Book online. Big crew? Request private studio time with custom packages",
                  icon: Users
                },
                {
                  step: "3",
                  title: "Bring the Party",
                  description: "Champagne, decorations, matching sashes - you bring it, we provide the creative space",
                  icon: Wine
                },
                {
                  step: "4",
                  title: "Create & Celebrate",
                  description: "2-3 hours of making, laughing, and capturing epic memories for the 'gram",
                  icon: Camera
                }
              ].map((item, index) => (
                <Reveal key={index} delay={index * 0.1}>
                  <div className="relative">
                    <div className="flex flex-col items-center text-center">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-500 via-rose-500 to-purple-500 flex items-center justify-center mb-4 shadow-lg shadow-pink-500/30">
                        <item.icon className="w-8 h-8 text-white" />
                      </div>
                      <div className="text-sm font-bold text-pink-400 mb-2">STEP {item.step}</div>
                      <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                      <p className="text-slate-300">{item.description}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <Reveal>
              <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-4">
                Bachelorette Pricing
              </h2>
              <p className="text-xl text-slate-300 text-center mb-16">
                Flexible options to match your squad size and vibe
              </p>
            </Reveal>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Reveal delay={0.1}>
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-pink-500/50 transition-all">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-white mb-2">Small Squad</h3>
                    <div className="text-slate-300 mb-4">4-8 people</div>
                    <div className="text-4xl font-bold text-pink-400 mb-2">$55-$85</div>
                    <div className="text-slate-400">per person</div>
                  </div>
                  <ul className="space-y-3 mb-8">
                    <li className="flex items-start gap-3 text-slate-300">
                      <CheckCircle className="w-5 h-5 text-pink-400 flex-shrink-0 mt-0.5" />
                      <span>Book instantly online</span>
                    </li>
                    <li className="flex items-start gap-3 text-slate-300">
                      <CheckCircle className="w-5 h-5 text-pink-400 flex-shrink-0 mt-0.5" />
                      <span>All materials & firing included</span>
                    </li>
                    <li className="flex items-start gap-3 text-slate-300">
                      <CheckCircle className="w-5 h-5 text-pink-400 flex-shrink-0 mt-0.5" />
                      <span>BYOB champagne & drinks</span>
                    </li>
                    <li className="flex items-start gap-3 text-slate-300">
                      <CheckCircle className="w-5 h-5 text-pink-400 flex-shrink-0 mt-0.5" />
                      <span>2-3 hour experience</span>
                    </li>
                  </ul>
                  <div className="text-center">
                    <Link
                      href="/activities"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-pink-500/20 text-pink-300 rounded-full hover:bg-pink-500/30 transition-colors font-medium border border-pink-500/30"
                    >
                      Browse Workshops
                    </Link>
                  </div>
                </div>
              </Reveal>

              <Reveal delay={0.2}>
                <div className="bg-gradient-to-br from-pink-500/10 via-rose-500/10 to-purple-500/10 backdrop-blur-sm rounded-2xl p-8 border border-pink-500/30 relative overflow-hidden">
                  <div className="absolute top-4 right-4 px-3 py-1 bg-gradient-to-r from-pink-500 to-purple-500 text-white text-sm font-bold rounded-full">
                    MOST POPULAR
                  </div>
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-white mb-2">Big Crew</h3>
                    <div className="text-slate-300 mb-4">9+ people</div>
                    <div className="text-4xl font-bold text-pink-400 mb-2">Custom</div>
                    <div className="text-slate-400">group packages</div>
                  </div>
                  <ul className="space-y-3 mb-8">
                    <li className="flex items-start gap-3 text-slate-300">
                      <CheckCircle className="w-5 h-5 text-pink-400 flex-shrink-0 mt-0.5" />
                      <span>Private studio options</span>
                    </li>
                    <li className="flex items-start gap-3 text-slate-300">
                      <CheckCircle className="w-5 h-5 text-pink-400 flex-shrink-0 mt-0.5" />
                      <span>Dedicated instructor just for you</span>
                    </li>
                    <li className="flex items-start gap-3 text-slate-300">
                      <CheckCircle className="w-5 h-5 text-pink-400 flex-shrink-0 mt-0.5" />
                      <span>Flexible scheduling & timing</span>
                    </li>
                    <li className="flex items-start gap-3 text-slate-300">
                      <CheckCircle className="w-5 h-5 text-pink-400 flex-shrink-0 mt-0.5" />
                      <span>Group discounts available</span>
                    </li>
                  </ul>
                  <div className="text-center">
                    <Link
                      href="/private-events"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 via-rose-500 to-purple-500 text-white rounded-full hover:from-pink-600 hover:via-rose-600 hover:to-purple-600 transition-all font-medium shadow-lg shadow-pink-500/30"
                    >
                      Request Custom Package
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </Reveal>
            </div>

            <Reveal delay={0.3}>
              <div className="mt-8 text-center">
                <p className="text-sm text-slate-400">
                  * Pricing varies by activity. Pottery wheel $75-$85/person, other workshops $55-$75/person.
                  <br />
                  Contact us for custom bachelorette packages and exact pricing.
                </p>
              </div>
            </Reveal>
          </div>
        </section>

        {/* What's Included */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-800/50 to-transparent">
          <div className="max-w-6xl mx-auto">
            <Reveal>
              <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-16">
                What Your Squad Gets
              </h2>
            </Reveal>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: "Expert Guidance",
                  description: "Professional artists who make everyone feel like a creative genius",
                  icon: "🎨"
                },
                {
                  title: "All the Supplies",
                  description: "Clay, glazes, tools, kiln firing - we've got everything covered",
                  icon: "🏺"
                },
                {
                  title: "Keepsake Art",
                  description: "Everyone takes home handmade pieces from your celebration",
                  icon: "🎁"
                },
                {
                  title: "BYOB Paradise",
                  description: "Champagne, wine, cocktails - bring your favorites, we supply the vibes",
                  icon: "🍾"
                },
                {
                  title: "Photo Heaven",
                  description: "Aesthetic spaces and creative moments perfect for Instagram stories",
                  icon: "📸"
                },
                {
                  title: "Celebration Space",
                  description: "Tables, cleanup, and room for your decorations and party energy",
                  icon: "✨"
                }
              ].map((item, index) => (
                <Reveal key={index} delay={index * 0.1}>
                  <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                    <div className="text-4xl mb-4">{item.icon}</div>
                    <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                    <p className="text-slate-300">{item.description}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <Reveal>
              <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-4">
                Your Questions Answered
              </h2>
              <p className="text-xl text-slate-300 text-center mb-16">
                Everything you need to know about bachelorette parties at CCF
              </p>
            </Reveal>

            <div className="space-y-4">
              {faqSchema.mainEntity.map((faq, index) => (
                <Reveal key={index} delay={index * 0.1}>
                  <details className="group bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden">
                    <summary className="flex items-center justify-between px-6 py-4 cursor-pointer hover:bg-white/5 transition-colors">
                      <h3 className="text-lg font-semibold text-white pr-4">{faq.name}</h3>
                      <span className="text-pink-400 text-2xl group-open:rotate-45 transition-transform">+</span>
                    </summary>
                    <div className="px-6 pb-4 text-slate-300 border-t border-white/10 pt-4 mt-2">
                      {faq.acceptedAnswer.text}
                    </div>
                  </details>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Social Proof / Testimonials */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-800/50 to-transparent">
          <div className="max-w-4xl mx-auto">
            <Reveal>
              <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-16">
                What Bachelorette Crews Are Saying
              </h2>
            </Reveal>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Reveal delay={0.1}>
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-pink-400 text-xl">★</span>
                    ))}
                  </div>
                  <p className="text-slate-300 mb-4 italic">
                    &quot;Best bachelorette activity hands down! Way more fun than another bar crawl. 
                    We got amazing photos, made pottery while drinking champagne, and everyone loved it. 
                    The instructor was so patient with us!&quot;
                  </p>
                  <p className="text-pink-400 font-semibold">Sarah&apos;s Bach Party - Chicago</p>
                </div>
              </Reveal>

              <Reveal delay={0.2}>
                <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-pink-400 text-xl">★</span>
                    ))}
                  </div>
                  <p className="text-slate-300 mb-4 italic">
                    &quot;Perfect for our group of 10! They gave us private space and the vibe was incredible. 
                    So aesthetic for photos. My bridesmaids are still talking about it months later. 
                    Highly recommend for any bachelorette!&quot;
                  </p>
                  <p className="text-pink-400 font-semibold">Emma&apos;s Squad - Eugene</p>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <Reveal>
              <div className="bg-gradient-to-br from-pink-500/20 via-rose-500/20 to-purple-500/20 backdrop-blur-sm rounded-3xl p-12 border border-pink-500/30 text-center">
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                  Ready for the Best Bach Ever?
                </h2>
                <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
                  Let&apos;s plan an unforgettable celebration with pottery, drinks, laughs, 
                  and memories your crew will cherish forever.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <Link
                    href="/private-events"
                    className="group inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-pink-500 via-rose-500 to-purple-500 text-white font-semibold rounded-full hover:from-pink-600 hover:via-rose-600 hover:to-purple-600 transition-all shadow-lg shadow-pink-500/30"
                  >
                    Request Your Bachelorette Package
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <a
                    href="mailto:info@colorcocktailfactory.com"
                    className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-full hover:bg-white/20 transition-all border border-white/20"
                  >
                    Email Us
                  </a>
                </div>
                <p className="text-slate-400 mt-6">
                  Questions? Reach out - we&apos;re here to make your bachelorette perfect!
                </p>
              </div>
            </Reveal>
          </div>
        </section>

      </div>
    </>
  );
}
