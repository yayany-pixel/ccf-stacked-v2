import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/motion/Reveal";
import { sections } from "@/lib/config";
import PrivatePartyCTA from "@/components/PrivatePartyCTA";

export const metadata: Metadata = {
  title: "Bachelorette Party Workshops | Creative Events in Chicago & Eugene",
  description: "Make your bachelorette party unforgettable with hands-on pottery, mosaics, glass fusion & more! BYOB friendly, Instagram-worthy, and totally unique. Chicago & Eugene locations.",
  keywords: [
    "bachelorette party ideas",
    "bachelorette party activities",
    "unique bachelorette party",
    "girls night out",
    "bridal shower alternatives",
    "pottery bachelorette",
    "creative bachelorette party",
    "Chicago bachelorette party",
    "Eugene bachelorette party",
    "BYOB bachelorette",
    "Instagram worthy bachelorette",
    "artsy bachelorette party"
  ],
  openGraph: {
    title: "Bachelorette Party Workshops | Color Cocktail Factory",
    description: "Make your bachelorette party unforgettable with hands-on art workshops! BYOB friendly and Instagram-worthy.",
    type: "website",
    url: "https://colorcocktailfactory.com/bachelorette-parties",
  },
};

export default function BachelorettePartiesPage() {
  // Filter for bachelorette-friendly workshops - fun, social, photo-worthy
  const bacheloretteWorkshops = sections.filter(section => 
    ['beginner-wheel', 'handbuilding', 'turkish', 'mosaic', 'glass-fusion', 
     'candle', 'terrarium'].includes(section.id)
  );

  // Simple emoji mapping
  const emojiMap: Record<string, string> = {
    'beginner-wheel': '🏺',
    'handbuilding': '🎨',
    'turkish': '✨',
    'mosaic': '🎨',
    'glass-fusion': '🌈',
    'candle': '🕯️',
    'terrarium': '🌱'
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* FAQ Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "What makes your workshops perfect for bachelorette parties?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Our workshops are hands-on, social, and create amazing photo opportunities! You'll work together, laugh together, and create unique keepsakes from the celebration. Plus, we're BYOB friendly so you can bring champagne, wine, or cocktails to enjoy while you create. The vibe is fun, relaxed, and totally Instagram-worthy."
                }
              },
              {
                "@type": "Question",
                "name": "Can we bring alcohol and decorations?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Absolutely! We're fully BYOB - bring champagne, wine, cocktails, whatever you'd like to drink while creating. You're also welcome to bring decorations like banners, balloons, or sashes to make it extra festive. Many groups bring matching outfits or bride-themed accessories for photos!"
                }
              },
              {
                "@type": "Question",
                "name": "How many people can we bring?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "We can accommodate bachelorette parties from 4 to 20+ people! Small intimate groups and larger bridal parties are both welcome. For groups of 10 or more, we offer special pricing and can provide private studio space for your celebration."
                }
              },
              {
                "@type": "Question",
                "name": "How long is a bachelorette party workshop?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Most bachelorette workshops run 2-3 hours, which is the perfect length for a fun activity without taking up your whole night. You'll have time to create, socialize, take photos, and enjoy drinks. We can also customize timing if you need to fit it into a packed bachelorette itinerary."
                }
              },
              {
                "@type": "Question",
                "name": "Do we need any art experience?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Not at all! Our workshops are designed for complete beginners. Our expert instructors will guide you step-by-step, and the focus is on having fun together, not being perfect. Even if your group has never touched clay or glass before, you'll create something beautiful to remember the celebration."
                }
              }
            ]
          })
        }}
      />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-600 text-white py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Bachelorette Parties with a Creative Twist 💕
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-white/90">
                Skip the typical bar crawl! Make pottery, mosaics, or glass art together. BYOB, Instagram-worthy, and unforgettable.
              </p>
              
              {/* Benefits */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 text-center">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                  <div className="text-4xl mb-3">🍾</div>
                  <h3 className="font-bold text-lg mb-2">BYOB Vibes</h3>
                  <p className="text-sm text-white/80">Bring champagne, wine, or cocktails to sip while you create</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                  <div className="text-4xl mb-3">📸</div>
                  <h3 className="font-bold text-lg mb-2">Insta-Worthy</h3>
                  <p className="text-sm text-white/80">Beautiful studio spaces perfect for photos & memories</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                  <div className="text-4xl mb-3">✨</div>
                  <h3 className="font-bold text-lg mb-2">Totally Unique</h3>
                  <p className="text-sm text-white/80">Create custom keepsakes from the celebration</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link 
                  href="/private-events"
                  className="bg-white text-pink-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Plan Your Bachelorette 💍
                </Link>
                <Link 
                  href="#workshops"
                  className="bg-white/20 backdrop-blur-sm text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white/30 transition-all"
                >
                  See Workshop Ideas
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Why Brides Love Our Bachelorette Workshops
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                More meaningful than another bar, more creative than the usual brunch, and way more memorable than anything generic!
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: "🎉",
                title: "Actually Fun for Everyone",
                description: "No experience needed! Even if half your crew is artsy and half isn't, everyone will have a blast creating together."
              },
              {
                icon: "🥂",
                title: "Fully BYOB",
                description: "Bring your favorite drinks (champagne, anyone?) and snacks. We provide glasses, plates, and the perfect creative atmosphere."
              },
              {
                icon: "💕",
                title: "Meaningful Keepsakes",
                description: "Everyone goes home with handmade art they actually made - a real memory from the celebration, not just another hangover."
              },
              {
                icon: "📱",
                title: "Perfect Photo Ops",
                description: "Our colorful studios and your gorgeous creations make for amazing Instagram content. Matching outfits encouraged!"
              },
              {
                icon: "👰",
                title: "Bride Gets the Spotlight",
                description: "Want to customize something special for the bride? We can arrange personalized pieces or bride-themed projects."
              },
              {
                icon: "🌟",
                title: "Stress-Free Planning",
                description: "We handle all the setup, materials, and instruction. You just show up, sip, create, and celebrate!"
              }
            ].map((item, index) => (
              <Reveal key={item.title} delay={index * 0.1}>
                <div className="text-center p-6 bg-gradient-to-br from-pink-50 to-purple-50 rounded-xl">
                  <div className="text-5xl mb-4">{item.icon}</div>
                  <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Workshop Options */}
      <section id="workshops" className="py-20 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Bachelorette Workshop Ideas
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Choose the vibe that matches your group! All workshops include expert instruction, materials, and plenty of time for photos & celebrating.
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {bacheloretteWorkshops.map((workshop, index) => (
              <Reveal key={workshop.id} delay={index * 0.1}>
                <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all border-2 border-pink-200">
                  <div className="aspect-[4/3] bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center text-6xl">
                    {emojiMap[workshop.id] || '🎨'}
                  </div>
                  <div className="p-6">
                    <h3 className="text-2xl font-bold mb-3">{workshop.heroTitle}</h3>
                    <p className="text-gray-600 mb-4">{workshop.heroDescription}</p>
                    
                    <div className="space-y-3">
                      {/* Chicago Link */}
                      <Link
                        href={`/chicago/${workshop.slug}`}
                        className="block w-full bg-pink-500 text-white text-center py-3 rounded-lg font-semibold hover:bg-pink-600 transition-colors"
                      >
                        Book in Chicago (Pilsen)
                      </Link>
                      
                      {/* Eugene Link */}
                      <Link
                        href={`/eugene/${workshop.slug}`}
                        className="block w-full bg-purple-500 text-white text-center py-3 rounded-lg font-semibold hover:bg-purple-600 transition-colors"
                      >
                        Book in Eugene, OR
                      </Link>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.3}>
            <div className="text-center mt-12">
              <Link
                href="/private-events"
                className="inline-block bg-gradient-to-r from-pink-500 to-purple-600 text-white px-10 py-5 rounded-full font-bold text-lg hover:shadow-xl transition-all transform hover:scale-105"
              >
                Book Your Bachelorette Workshop
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                How Your Bachelorette Workshop Works
              </h2>
              <p className="text-xl text-gray-600">Easy planning, epic memories</p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                step: "1",
                title: "Pick Your Vibe",
                description: "Choose pottery, mosaics, glass fusion, or mix it up! Tell us what the bride loves and we'll recommend the perfect workshop."
              },
              {
                step: "2",
                title: "Request Your Date",
                description: "Share your bachelorette weekend dates and preferred location (Chicago & Eugene). We'll check availability and send pricing."
              },
              {
                step: "3",
                title: "Bring the Party",
                description: "Show up with your crew, your drinks, and your good vibes. We'll have everything else ready to go!"
              },
              {
                step: "4",
                title: "Create & Celebrate",
                description: "Make art, take photos, toast the bride, and leave with unique keepsakes from an unforgettable celebration."
              }
            ].map((item, index) => (
              <Reveal key={item.step} delay={index * 0.1}>
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-gradient-to-br from-pink-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Bachelorette Party Pricing
              </h2>
              <p className="text-xl text-gray-600">Clear pricing, no surprises</p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <Reveal delay={0.1}>
              <div className="bg-white rounded-2xl p-8 border-2 border-pink-300 shadow-lg">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold mb-2">Small Squads</h3>
                  <p className="text-gray-600">Intimate bachelorette groups</p>
                </div>
                <div className="text-center mb-6">
                  <div className="text-5xl font-bold text-pink-600 mb-2">$55-$85</div>
                  <div className="text-gray-600">per person</div>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start">
                    <span className="text-pink-500 mr-3 mt-1">✓</span>
                    <span>4-9 guests (minimum 4 people)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-pink-500 mr-3 mt-1">✓</span>
                    <span>All materials & expert instruction</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-pink-500 mr-3 mt-1">✓</span>
                    <span>2-3 hour creative experience</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-pink-500 mr-3 mt-1">✓</span>
                    <span>BYOB (bring your own champagne!)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-pink-500 mr-3 mt-1">✓</span>
                    <span>Take-home artwork for everyone</span>
                  </li>
                </ul>
                <p className="text-sm text-gray-500 italic">
                  * Exact pricing varies by workshop. Popular choices: pottery wheel ($75-85), mosaics ($65), glass fusion ($70).
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.2}>
              <div className="bg-gradient-to-br from-pink-500 to-purple-600 text-white rounded-2xl p-8 shadow-xl">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold mb-2">Big Bride Tribes</h3>
                  <p className="text-white/90">Large bachelorette parties</p>
                </div>
                <div className="text-center mb-6">
                  <div className="text-5xl font-bold mb-2">Custom</div>
                  <div className="text-white/90">pricing & packages</div>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start">
                    <span className="mr-3 mt-1">✨</span>
                    <span>10+ guests (volume discounts!)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-3 mt-1">✨</span>
                    <span>Private studio space available</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-3 mt-1">✨</span>
                    <span>Customized bride experiences</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-3 mt-1">✨</span>
                    <span>Mix & match workshop combos</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-3 mt-1">✨</span>
                    <span>Extended time options available</span>
                  </li>
                </ul>
                <Link
                  href="/private-events"
                  className="block w-full bg-white text-pink-600 text-center py-4 rounded-lg font-bold hover:bg-gray-100 transition-all"
                >
                  Get Your Custom Quote
                </Link>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.3}>
            <div className="text-center mt-12">
              <p className="text-gray-600 max-w-2xl mx-auto">
                <strong>💡 Pro tip:</strong> Book early for bachelorette weekends! Popular dates (Friday-Sunday) fill up fast, especially in summer and fall.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Instagram Moments */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                📸 Instagram-Worthy Every Step of the Way
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                From the process to the final creations, you'll have amazing content for the 'gram (and memories that last way longer than stories!)
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Getting Your Hands Dirty",
                description: "Action shots of your crew creating together - candid, fun, and totally shareable",
                emoji: "🎨"
              },
              {
                title: "Champagne & Clay",
                description: "Toast the bride with drinks in hand and art in progress - the perfect bachelorette aesthetic",
                emoji: "🥂"
              },
              {
                title: "The Final Reveal",
                description: "Everyone showing off their finished pieces - unique keepsakes and killer group shots",
                emoji: "✨"
              }
            ].map((item, index) => (
              <Reveal key={item.title} delay={index * 0.1}>
                <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-xl p-8 text-center">
                  <div className="text-6xl mb-4">{item.emoji}</div>
                  <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.3}>
            <div className="text-center mt-12 bg-gradient-to-r from-pink-100 to-purple-100 rounded-2xl p-8">
              <p className="text-lg text-gray-700">
                <strong>🎀 Styling Tip:</strong> Coordinate matching outfits (white for the bride, pastels for the crew?), bring fun props like sashes or flower crowns, and don't forget to tag us <span className="font-bold">@colorcocktailfactory</span>!
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Bachelorette Party FAQs
              </h2>
              <p className="text-xl text-gray-600">Questions we get from every maid of honor</p>
            </div>
          </Reveal>

          <div className="space-y-6">
            {[
              {
                question: "What makes your workshops perfect for bachelorette parties?",
                answer: "Our workshops are hands-on, social, and create amazing photo opportunities! You'll work together, laugh together, and create unique keepsakes from the celebration. Plus, we're BYOB friendly so you can bring champagne, wine, or cocktails to enjoy while you create. The vibe is fun, relaxed, and totally Instagram-worthy."
              },
              {
                question: "Can we bring alcohol and decorations?",
                answer: "Absolutely! We're fully BYOB - bring champagne, wine, cocktails, whatever you'd like to drink while creating. You're also welcome to bring decorations like banners, balloons, or sashes to make it extra festive. Many groups bring matching outfits or bride-themed accessories for photos!"
              },
              {
                question: "How many people can we bring?",
                answer: "We can accommodate bachelorette parties from 4 to 20+ people! Small intimate groups and larger bridal parties are both welcome. For groups of 10 or more, we offer special pricing and can provide private studio space for your celebration."
              },
              {
                question: "How long is a bachelorette party workshop?",
                answer: "Most bachelorette workshops run 2-3 hours, which is the perfect length for a fun activity without taking up your whole night. You'll have time to create, socialize, take photos, and enjoy drinks. We can also customize timing if you need to fit it into a packed bachelorette itinerary."
              },
              {
                question: "Do we need any art experience?",
                answer: "Not at all! Our workshops are designed for complete beginners. Our expert instructors will guide you step-by-step, and the focus is on having fun together, not being perfect. Even if your group has never touched clay or glass before, you'll create something beautiful to remember the celebration."
              }
            ].map((faq, index) => (
              <Reveal key={index} delay={index * 0.1}>
                <details className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-lg p-6 group">
                  <summary className="text-xl font-bold cursor-pointer list-none flex items-center justify-between">
                    <span>{faq.question}</span>
                    <span className="text-pink-500 group-open:rotate-180 transition-transform">▼</span>
                  </summary>
                  <p className="mt-4 text-gray-600 leading-relaxed">{faq.answer}</p>
                </details>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Reveal>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Plan the Most Creative Bachelorette Ever? 💍
            </h2>
            <p className="text-xl mb-8 text-white/90">
              Let's make it memorable, meaningful, and way more fun than another generic night out.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/private-events"
                className="bg-white text-pink-600 px-10 py-5 rounded-full font-bold text-lg hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Book Your Bachelorette Workshop
              </Link>
              <a
                href="mailto:hello@colorcocktailfactory.com"
                className="bg-white/20 backdrop-blur-sm text-white px-10 py-5 rounded-full font-bold text-lg hover:bg-white/30 transition-all"
              >
                Email Us Your Ideas
              </a>
            </div>
            <p className="mt-8 text-white/80 text-sm">
              Serving bachelorette parties in Chicago & Eugene
            </p>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
