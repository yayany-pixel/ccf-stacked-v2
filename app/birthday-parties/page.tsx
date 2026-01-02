import { Metadata } from "next";
import Link from "next/link";
import { sections } from "@/lib/config";
import Reveal from "@/components/motion/Reveal";
import { ArrowRight, Users, Gift, Cake, Camera, Heart, CheckCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Birthday Party Ideas - Pottery, Art & Craft Workshops | Color Cocktail Factory",
  description: "Make your birthday unforgettable with hands-on pottery and art workshops. Perfect for adults, teens, and kids. BYOB, no experience needed. Chicago & Eugene locations.",
  keywords: [
    "birthday party ideas",
    "pottery birthday party",
    "art party",
    "adult birthday party",
    "kids birthday party",
    "unique birthday party",
    "creative birthday celebration",
    "BYOB birthday party",
    "pottery wheel birthday",
    "craft party",
    "Chicago birthday party",
    "Eugene birthday party"
  ],
  openGraph: {
    title: "Birthday Party Ideas - Pottery & Art Workshops",
    description: "Celebrate birthdays with hands-on pottery and art. BYOB, all ages welcome, no experience needed.",
    type: "website",
    url: "https://colorcocktailfactory.com/birthday-parties",
  },
};

// FAQ Schema for Rich Results
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How many people can attend a birthday party?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "We can accommodate groups of all sizes! Small parties of 4-8 people can book directly online. For larger groups (9+), contact us for custom packages and private studio options."
      }
    },
    {
      "@type": "Question",
      "name": "What ages are appropriate for birthday parties?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "We welcome all ages! We have workshops suitable for kids (ages 6+), teens, and adults. Some activities like pottery wheel throwing are best for ages 10+ due to hand strength required."
      }
    },
    {
      "@type": "Question",
      "name": "Can we bring our own birthday cake and decorations?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Absolutely! You're welcome to bring birthday cake, cupcakes, snacks, and decorations. We're BYOB-friendly, so adults can bring beer, wine, or cocktails. We provide tables and cleanup."
      }
    },
    {
      "@type": "Question",
      "name": "How long do birthday party workshops last?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Most workshops are 2-3 hours, which includes instruction, creation time, and celebration. Perfect for an afternoon or evening party without feeling rushed."
      }
    },
    {
      "@type": "Question",
      "name": "Do we need any art experience for a birthday party?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "No experience necessary! Our expert instructors guide everyone through the process step-by-step. All skill levels are welcome, from complete beginners to experienced creators."
      }
    }
  ]
};

export default function BirthdayPartiesPage() {
  // Filter workshops that are great for birthday parties
  const birthdayWorkshops = sections.filter(section => 
    ['beginner-wheel', 'handbuilding', 'mosaics', 'glass-fusion', 'candle-making', 'bonsai', 'terrarium'].includes(section.id)
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
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-pink-900/20 to-orange-900/20"></div>
          <div className="relative max-w-6xl mx-auto text-center">
            <Reveal>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-pink-500/10 border border-pink-500/20 rounded-full mb-6">
                <Cake className="w-5 h-5 text-pink-400" />
                <span className="text-pink-300 text-sm font-medium">Birthday Celebrations</span>
              </div>
            </Reveal>
            
            <Reveal delay={0.1}>
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
                Make Birthdays
                <span className="block bg-gradient-to-r from-pink-400 via-purple-400 to-orange-400 bg-clip-text text-transparent">
                  Unforgettable
                </span>
              </h1>
            </Reveal>

            <Reveal delay={0.2}>
              <p className="text-xl md:text-2xl text-slate-300 mb-8 max-w-3xl mx-auto">
                Celebrate with hands-on pottery and art workshops. Create memories, not just crafts. 
                Perfect for all ages, BYOB-friendly, zero experience needed.
              </p>
            </Reveal>

            {/* Benefits Grid */}
            <Reveal delay={0.3}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto mb-10">
                <div className="flex items-center justify-center gap-2 px-4 py-3 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10">
                  <Gift className="w-5 h-5 text-pink-400" />
                  <span className="text-white font-medium">All Ages Welcome</span>
                </div>
                <div className="flex items-center justify-center gap-2 px-4 py-3 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10">
                  <Users className="w-5 h-5 text-purple-400" />
                  <span className="text-white font-medium">BYOB + Cake Friendly</span>
                </div>
                <div className="flex items-center justify-center gap-2 px-4 py-3 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10">
                  <Heart className="w-5 h-5 text-orange-400" />
                  <span className="text-white font-medium">Take Home Your Art</span>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.4}>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link
                  href="/private-events"
                  className="group inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold rounded-full hover:from-pink-600 hover:to-purple-600 transition-all shadow-lg hover:shadow-pink-500/50"
                >
                  Plan Your Birthday Party
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <a
                  href="#workshops"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-full hover:bg-white/20 transition-all border border-white/20"
                >
                  Explore Workshops
                </a>
              </div>
            </Reveal>
          </div>
        </section>

        {/* Best for Birthdays - Workshop Grid */}
        <section id="workshops" className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <Reveal>
              <div className="text-center mb-12">
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                  Perfect Birthday Activities
                </h2>
                <p className="text-xl text-slate-300 max-w-3xl mx-auto">
                  Choose from our most popular workshops, all designed for fun and creativity
                </p>
              </div>
            </Reveal>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {birthdayWorkshops.map((workshop, index) => (
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
                <p className="text-slate-300 mb-4">Need help choosing the perfect activity?</p>
                <Link
                  href="/private-events"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-full hover:bg-white/20 transition-all border border-white/20"
                >
                  Get Custom Recommendations
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
                How It Works
              </h2>
            </Reveal>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                {
                  step: "1",
                  title: "Pick Your Activity",
                  description: "Choose from pottery wheel, handbuilding, mosaics, glass fusion, and more",
                  icon: Gift
                },
                {
                  step: "2",
                  title: "Choose Your Date",
                  description: "Select from available times or request a custom private session",
                  icon: Cake
                },
                {
                  step: "3",
                  title: "Bring the Party",
                  description: "BYOB, bring cake, decorations - we provide tables, cleanup & instruction",
                  icon: Users
                },
                {
                  step: "4",
                  title: "Create & Celebrate",
                  description: "Make art, take photos, celebrate - everyone takes home their creation",
                  icon: Camera
                }
              ].map((item, index) => (
                <Reveal key={index} delay={index * 0.1}>
                  <div className="relative">
                    <div className="flex flex-col items-center text-center">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center mb-4 shadow-lg shadow-pink-500/30">
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
                Birthday Party Pricing
              </h2>
              <p className="text-xl text-slate-300 text-center mb-16">
                Flexible options for celebrations of all sizes
              </p>
            </Reveal>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Reveal delay={0.1}>
                <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-pink-500/50 transition-all">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-white mb-2">Small Groups</h3>
                    <div className="text-slate-300 mb-4">4-8 people</div>
                    <div className="text-4xl font-bold text-pink-400 mb-2">$55-$85</div>
                    <div className="text-slate-400">per person</div>
                  </div>
                  <ul className="space-y-3 mb-8">
                    <li className="flex items-start gap-3 text-slate-300">
                      <CheckCircle className="w-5 h-5 text-pink-400 flex-shrink-0 mt-0.5" />
                      <span>Book directly online</span>
                    </li>
                    <li className="flex items-start gap-3 text-slate-300">
                      <CheckCircle className="w-5 h-5 text-pink-400 flex-shrink-0 mt-0.5" />
                      <span>All materials included</span>
                    </li>
                    <li className="flex items-start gap-3 text-slate-300">
                      <CheckCircle className="w-5 h-5 text-pink-400 flex-shrink-0 mt-0.5" />
                      <span>BYOB & cake welcome</span>
                    </li>
                    <li className="flex items-start gap-3 text-slate-300">
                      <CheckCircle className="w-5 h-5 text-pink-400 flex-shrink-0 mt-0.5" />
                      <span>2-3 hour workshop</span>
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
                <div className="bg-gradient-to-br from-pink-500/10 to-purple-500/10 backdrop-blur-sm rounded-2xl p-8 border border-pink-500/30 relative overflow-hidden">
                  <div className="absolute top-4 right-4 px-3 py-1 bg-pink-500 text-white text-sm font-bold rounded-full">
                    POPULAR
                  </div>
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-white mb-2">Large Groups</h3>
                    <div className="text-slate-300 mb-4">9+ people</div>
                    <div className="text-4xl font-bold text-pink-400 mb-2">Custom</div>
                    <div className="text-slate-400">pricing available</div>
                  </div>
                  <ul className="space-y-3 mb-8">
                    <li className="flex items-start gap-3 text-slate-300">
                      <CheckCircle className="w-5 h-5 text-pink-400 flex-shrink-0 mt-0.5" />
                      <span>Private studio options</span>
                    </li>
                    <li className="flex items-start gap-3 text-slate-300">
                      <CheckCircle className="w-5 h-5 text-pink-400 flex-shrink-0 mt-0.5" />
                      <span>Dedicated instructor</span>
                    </li>
                    <li className="flex items-start gap-3 text-slate-300">
                      <CheckCircle className="w-5 h-5 text-pink-400 flex-shrink-0 mt-0.5" />
                      <span>Flexible scheduling</span>
                    </li>
                    <li className="flex items-start gap-3 text-slate-300">
                      <CheckCircle className="w-5 h-5 text-pink-400 flex-shrink-0 mt-0.5" />
                      <span>Group discounts available</span>
                    </li>
                  </ul>
                  <div className="text-center">
                    <Link
                      href="/private-events"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full hover:from-pink-600 hover:to-purple-600 transition-all font-medium shadow-lg shadow-pink-500/30"
                    >
                      Request Custom Quote
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </Reveal>
            </div>

            <Reveal delay={0.3}>
              <div className="mt-8 text-center">
                <p className="text-sm text-slate-400">
                  * Pricing varies by activity. Pottery wheel classes typically $75-$85/person, other workshops $55-$75/person.
                  <br />
                  Contact us for exact pricing and availability.
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
                What&apos;s Included
              </h2>
            </Reveal>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  title: "Expert Instruction",
                  description: "Professional artists guide you through every step",
                  icon: "🎨"
                },
                {
                  title: "All Materials",
                  description: "Clay, glazes, tools, kiln firing - everything provided",
                  icon: "🏺"
                },
                {
                  title: "Take Home Your Art",
                  description: "Everyone leaves with their handmade creation",
                  icon: "🎁"
                },
                {
                  title: "BYOB Friendly",
                  description: "Bring your favorite drinks - wine, beer, cocktails welcome",
                  icon: "🍷"
                },
                {
                  title: "Party Space",
                  description: "Tables for cake, decorations, and celebration",
                  icon: "🎂"
                },
                {
                  title: "Photo Opportunities",
                  description: "Instagram-worthy moments throughout the experience",
                  icon: "📸"
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
                Frequently Asked Questions
              </h2>
              <p className="text-xl text-slate-300 text-center mb-16">
                Everything you need to know about birthday parties
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

        {/* Final CTA */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <Reveal>
              <div className="bg-gradient-to-br from-pink-500/20 to-purple-500/20 backdrop-blur-sm rounded-3xl p-12 border border-pink-500/30 text-center">
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                  Ready to Plan Your Birthday?
                </h2>
                <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
                  Let&apos;s create an unforgettable celebration filled with creativity, laughter, and memories.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <Link
                    href="/private-events"
                    className="group inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold rounded-full hover:from-pink-600 hover:to-purple-600 transition-all shadow-lg shadow-pink-500/30"
                  >
                    Request a Quote
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
                  Questions? Call us or send a message - we&apos;re here to help!
                </p>
              </div>
            </Reveal>
          </div>
        </section>

      </div>
    </>
  );
}
