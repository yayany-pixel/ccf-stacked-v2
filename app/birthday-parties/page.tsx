import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/motion/Reveal";
import { sections } from "@/lib/config";
import PrivatePartyCTA from "@/components/PrivatePartyCTA";

export const metadata: Metadata = {
  title: "Birthday Party Workshops | Private Art Events in Chicago & Eugene",
  description: "Celebrate your birthday with hands-on art workshops! Pottery, mosaics, glass fusion & more. Perfect for adults, teens & kids. BYOB friendly. Chicago & Eugene locations.",
  keywords: [
    "birthday party ideas",
    "adult birthday party",
    "kids birthday party",
    "art party",
    "pottery party",
    "creative birthday celebration",
    "Chicago birthday party",
    "Eugene birthday party",
    "unique birthday ideas",
    "BYOB birthday party",
    "group art class",
    "birthday workshop"
  ],
  openGraph: {
    title: "Birthday Party Workshops | Color Cocktail Factory",
    description: "Celebrate your birthday with hands-on art workshops! Pottery, mosaics, glass fusion & more. BYOB friendly.",
    type: "website",
    url: "https://colorcocktailfactory.com/birthday-parties",
  },
};

export default function BirthdayPartiesPage() {
  // Filter for birthday-friendly workshops
  const birthdayWorkshops = sections.filter(section => 
    ['beginner-wheel', 'handbuilding', 'turkish', 'mosaic', 'glass-fusion', 
     'candle', 'terrarium', 'bonsai'].includes(section.id)
  );

  // Simple emoji mapping
  const emojiMap: Record<string, string> = {
    'beginner-wheel': '🏺',
    'handbuilding': '🎨',
    'turkish': '✨',
    'mosaic': '🎨',
    'glass-fusion': '🌈',
    'bonsai': '🌿',
    'terrarium': '🌱',
    'candle': '🕯️'
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
                "name": "What ages are your birthday party workshops suitable for?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "We offer workshops for all ages! Many of our activities are perfect for kids (ages 8+) with adult supervision, teens, and adults. Pottery wheel and glass fusion are popular for teens and adults, while terrarium building and candle making work great for younger guests. We can customize the experience based on your group's age range."
                }
              },
              {
                "@type": "Question",
                "name": "How much does a birthday party workshop cost?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Birthday party workshops typically range from $55-$85 per person depending on the activity. For larger groups (10+ people) or custom packages, we offer special pricing. Contact us for a personalized quote based on your preferred workshop and group size."
                }
              },
              {
                "@type": "Question",
                "name": "Can I bring my own food and drinks?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes! We're BYOB friendly and you can bring your own snacks, cake, and beverages (including alcohol for 21+ events). We provide plates, cups, and basic utensils. Many guests bring cupcakes, pizza, or light refreshments to enjoy during creative breaks."
                }
              },
              {
                "@type": "Question",
                "name": "How long does a birthday party workshop last?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Most birthday party workshops run 2-3 hours, which includes instruction time, hands-on creation, and time for food/drinks if you bring them. We can adjust timing based on your needs and schedule."
                }
              },
              {
                "@type": "Question",
                "name": "Do we get to take home what we make?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Absolutely! Everyone takes home their finished artwork. For pottery and ceramics, pieces need to be glazed and fired, so you'll pick them up about 2-3 weeks after your party. Glass fusion, mosaics, terrariums, and candles can be taken home the same day."
                }
              }
            ]
          })
        }}
      />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 text-white py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="text-center max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Unforgettable Birthday Party Workshops
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-white/90">
                Create memories & art! Perfect for adults, teens, and kids who love hands-on creativity.
              </p>
              
              {/* Benefits */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 text-center">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                  <div className="text-4xl mb-3">🎨</div>
                  <h3 className="font-bold text-lg mb-2">All Ages Welcome</h3>
                  <p className="text-sm text-white/80">Kids, teens & adults - we have the perfect workshop for your group</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                  <div className="text-4xl mb-3">🥂</div>
                  <h3 className="font-bold text-lg mb-2">BYOB Friendly</h3>
                  <p className="text-sm text-white/80">Bring cake, snacks & drinks to celebrate while you create</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                  <div className="text-4xl mb-3">🎁</div>
                  <h3 className="font-bold text-lg mb-2">Take Home Art</h3>
                  <p className="text-sm text-white/80">Everyone leaves with a unique handmade creation</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link 
                  href="/private-events"
                  className="bg-white text-purple-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Plan Your Birthday Party
                </Link>
                <Link 
                  href="#workshops"
                  className="bg-white/20 backdrop-blur-sm text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white/30 transition-all"
                >
                  Browse Workshops
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Workshop Options */}
      <section id="workshops" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Perfect Birthday Workshop Ideas
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Choose from our most popular birthday party workshops. Each includes expert instruction, all materials, and a fun, memorable experience!
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {birthdayWorkshops.map((workshop, index) => (
              <Reveal key={workshop.id} delay={index * 0.1}>
                <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all border border-gray-100">
                  <div className="aspect-[4/3] bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center text-6xl">
                    {emojiMap[workshop.id] || '🎨'}
                  </div>
                  <div className="p-6">
                    <h3 className="text-2xl font-bold mb-3">{workshop.heroTitle}</h3>
                    <p className="text-gray-600 mb-4">{workshop.heroDescription}</p>
                    
                    <div className="space-y-3">
                      {/* Chicago Link */}
                      <Link
                        href={`/chicago/${workshop.slug}`}
                        className="block w-full bg-purple-600 text-white text-center py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
                      >
                        Book in Chicago (Pilsen)
                      </Link>
                      
                      {/* Eugene Link */}
                      <Link
                        href={`/eugene/${workshop.slug}`}
                        className="block w-full bg-green-600 text-white text-center py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
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
                className="inline-block bg-gradient-to-r from-purple-600 to-pink-500 text-white px-10 py-5 rounded-full font-bold text-lg hover:shadow-xl transition-all transform hover:scale-105"
              >
                Request a Custom Birthday Package
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                How Your Birthday Party Works
              </h2>
              <p className="text-xl text-gray-600">Simple planning, unforgettable celebration</p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                step: "1",
                title: "Choose Your Workshop",
                description: "Pick from pottery, mosaics, glass fusion, terrariums & more based on your group's interests and age range"
              },
              {
                step: "2",
                title: "Request a Quote",
                description: "Tell us your preferred date, location (Chicago & Eugene), and group size for personalized pricing"
              },
              {
                step: "3",
                title: "We'll Confirm Details",
                description: "Our team will finalize timing, prepare materials, and answer any questions about food/drinks"
              },
              {
                step: "4",
                title: "Celebrate & Create",
                description: "Enjoy guided instruction, hands-on fun, and take home unique birthday memories!"
              }
            ].map((item, index) => (
              <Reveal key={item.step} delay={index * 0.1}>
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
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
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Birthday Party Pricing
              </h2>
              <p className="text-xl text-gray-600">Transparent pricing for groups of all sizes</p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <Reveal delay={0.1}>
              <div className="bg-gradient-to-br from-purple-50 to-white rounded-2xl p-8 border-2 border-purple-200">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold mb-2">Small Birthday Groups</h3>
                  <p className="text-gray-600">Perfect for intimate celebrations</p>
                </div>
                <div className="text-center mb-6">
                  <div className="text-5xl font-bold text-purple-600 mb-2">$55-$85</div>
                  <div className="text-gray-600">per person</div>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start">
                    <span className="text-purple-500 mr-3 mt-1">✓</span>
                    <span>4-9 guests (minimum 4 people)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-500 mr-3 mt-1">✓</span>
                    <span>All materials & instruction included</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-500 mr-3 mt-1">✓</span>
                    <span>2-3 hour workshop experience</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-purple-500 mr-3 mt-1">✓</span>
                    <span>BYOB friendly (bring cake & drinks)</span>
                  </li>
                </ul>
                <p className="text-sm text-gray-500 italic">
                  * Pricing varies by workshop type. Contact us for exact pricing for your chosen activity.
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.2}>
              <div className="bg-gradient-to-br from-pink-50 to-white rounded-2xl p-8 border-2 border-pink-200">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold mb-2">Large Birthday Parties</h3>
                  <p className="text-gray-600">Big celebrations deserve special pricing</p>
                </div>
                <div className="text-center mb-6">
                  <div className="text-5xl font-bold text-pink-600 mb-2">Custom</div>
                  <div className="text-gray-600">pricing available</div>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start">
                    <span className="text-pink-500 mr-3 mt-1">✓</span>
                    <span>10+ guests (volume discounts apply)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-pink-500 mr-3 mt-1">✓</span>
                    <span>Private studio space available</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-pink-500 mr-3 mt-1">✓</span>
                    <span>Extended time options</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-pink-500 mr-3 mt-1">✓</span>
                    <span>Custom workshop combinations</span>
                  </li>
                </ul>
                <Link
                  href="/private-events"
                  className="block w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white text-center py-4 rounded-lg font-bold hover:shadow-lg transition-all"
                >
                  Get Custom Quote
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* What's Included */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                What's Included in Every Birthday Party
              </h2>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: "👨‍🏫",
                title: "Expert Instruction",
                description: "Professional artists guide your group through every step with patience and enthusiasm"
              },
              {
                icon: "🎨",
                title: "All Materials Provided",
                description: "Clay, glazes, glass, tools, and everything needed for your chosen workshop"
              },
              {
                icon: "🎁",
                title: "Take-Home Creations",
                description: "Everyone leaves with their unique handmade artwork (pottery ready in 2-3 weeks)"
              },
              {
                icon: "🥂",
                title: "BYOB Welcome",
                description: "Bring your own cake, snacks, and beverages (21+ for alcohol). We provide plates & cups!"
              },
              {
                icon: "📸",
                title: "Photo-Worthy Moments",
                description: "Beautiful studio spaces perfect for birthday photos and social media memories"
              },
              {
                icon: "♿",
                title: "Accessible Venues",
                description: "Both Chicago & Eugene locations are wheelchair accessible and family-friendly"
              }
            ].map((item, index) => (
              <Reveal key={item.title} delay={index * 0.1}>
                <div className="text-center p-6">
                  <div className="text-5xl mb-4">{item.icon}</div>
                  <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4">
                Birthday Party FAQs
              </h2>
              <p className="text-xl text-gray-600">Everything you need to know about hosting your party with us</p>
            </div>
          </Reveal>

          <div className="space-y-6">
            {[
              {
                question: "What ages are your birthday party workshops suitable for?",
                answer: "We offer workshops for all ages! Many of our activities are perfect for kids (ages 8+) with adult supervision, teens, and adults. Pottery wheel and glass fusion are popular for teens and adults, while terrarium building and candle making work great for younger guests. We can customize the experience based on your group's age range."
              },
              {
                question: "How much does a birthday party workshop cost?",
                answer: "Birthday party workshops typically range from $55-$85 per person depending on the activity. For larger groups (10+ people) or custom packages, we offer special pricing. Contact us for a personalized quote based on your preferred workshop and group size."
              },
              {
                question: "Can I bring my own food and drinks?",
                answer: "Yes! We're BYOB friendly and you can bring your own snacks, cake, and beverages (including alcohol for 21+ events). We provide plates, cups, and basic utensils. Many guests bring cupcakes, pizza, or light refreshments to enjoy during creative breaks."
              },
              {
                question: "How long does a birthday party workshop last?",
                answer: "Most birthday party workshops run 2-3 hours, which includes instruction time, hands-on creation, and time for food/drinks if you bring them. We can adjust timing based on your needs and schedule."
              },
              {
                question: "Do we get to take home what we make?",
                answer: "Absolutely! Everyone takes home their finished artwork. For pottery and ceramics, pieces need to be glazed and fired, so you'll pick them up about 2-3 weeks after your party. Glass fusion, mosaics, terrariums, and candles can be taken home the same day."
              }
            ].map((faq, index) => (
              <Reveal key={index} delay={index * 0.1}>
                <details className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-6 group">
                  <summary className="text-xl font-bold cursor-pointer list-none flex items-center justify-between">
                    <span>{faq.question}</span>
                    <span className="text-purple-500 group-open:rotate-180 transition-transform">▼</span>
                  </summary>
                  <p className="mt-4 text-gray-600 leading-relaxed">{faq.answer}</p>
                </details>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Reveal>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Plan an Unforgettable Birthday?
            </h2>
            <p className="text-xl mb-8 text-white/90">
              Let's create a celebration filled with art, laughter, and memories that last forever.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/private-events"
                className="bg-white text-purple-600 px-10 py-5 rounded-full font-bold text-lg hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Request Your Birthday Quote
              </Link>
              <a
                href="mailto:hello@colorcocktailfactory.com"
                className="bg-white/20 backdrop-blur-sm text-white px-10 py-5 rounded-full font-bold text-lg hover:bg-white/30 transition-all"
              >
                Email Us Questions
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
