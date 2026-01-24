import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import GlassCard from "@/components/ui/GlassCard";
import ButtonPill from "@/components/ui/ButtonPill";
import Reveal from "@/components/motion/Reveal";
import PricingDisplay from "@/components/PricingDisplay";

export const metadata: Metadata = {
  title: "3-Month Online Pottery Membership | Learn Wheel Throwing at Home",
  description: "Master pottery from home in 12 live sessions. Includes FREE pottery wheel, tools, clay & glazing kit. Money-back guarantee. Adults & kids classes. Expert instructors with 10+ years experience.",
  keywords: [
    "online pottery classes",
    "pottery membership",
    "learn pottery at home",
    "pottery wheel classes online",
    "beginner pottery course",
    "online wheel throwing",
    "pottery classes for adults",
    "pottery classes for kids",
    "pottery starter kit",
    "free pottery wheel"
  ],
  openGraph: {
    title: "3-Month Online Pottery Membership | Free Wheel + Money-Back Guarantee",
    description: "Master pottery from home in 12 live sessions. Includes FREE pottery wheel, tools, clay & glazing kit. Money-back guarantee.",
    type: "website",
  },
  alternates: {
    canonical: "https://colorcocktailfactory.com/pottery-membership"
  }
};

export default function PotteryMembershipPage() {
  // FAQ Schema
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Is this really beginner-friendly?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. Our instructors (Brittany and Yahya) have each taught pottery to absolute beginners for 10+ years. Most students can make simple pieces by themselves after session 1 or 2. We teach step-by-step, answer questions live, and provide supportive feedback throughout."
        }
      },
      {
        "@type": "Question",
        "name": "What if I miss a session?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Sessions are recorded, so you can watch them later. However, to qualify for the money-back guarantee, you must attend all 12 live sessions. We recommend treating this like a scheduled class to get the most value."
        }
      },
      {
        "@type": "Question",
        "name": "Is the pottery wheel mine to keep?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes! The pottery wheel is yours to keep, no matter what. Even if you don't complete the program or request a refund, the wheel and all materials shipped to you are yours."
        }
      },
      {
        "@type": "Question",
        "name": "Is this safe for kids?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. We offer separate kids classes taught at an age-appropriate pace. Kids under 10 must have an adult assistant present to help with setup, cleanup, and any heavy lifting. Pottery is a safe, tactile, screen-free activity perfect for developing fine motor skills and creativity."
        }
      },
      {
        "@type": "Question",
        "name": "What does the money-back guarantee require exactly?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "If you attend all 12 live sessions and still cannot comfortably use a pottery wheel to create a variety of shapes and objects by the end of the program, we'll refund 100% of your membership cost. You keep the wheel and materials. We offer this guarantee because our instructors have a proven track record—when students show up and practice, they succeed."
        }
      },
      {
        "@type": "Question",
        "name": "Do I need a kiln?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No. You'll create pieces during the program, and we'll guide you on air-dry clay options or local firing services if you want to fire your work. The focus is on mastering wheel technique and building confidence—not requiring expensive equipment."
        }
      },
      {
        "@type": "Question",
        "name": "How does glazing work with the included kit?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "The glazing kit includes palettes, brushes, and basic glazing materials. We'll teach you glazing fundamentals during the sessions. For firing glazed pieces, you can use local pottery studios or community kilns (we'll provide guidance). The kit gives you hands-on experience with the full pottery process."
        }
      }
    ]
  };

  const courseSchema = {
    "@context": "https://schema.org",
    "@type": "Course",
    "name": "3-Month Online Pottery Membership",
    "description": "Master pottery wheel throwing from home in 12 live online sessions. Includes FREE pottery wheel, clay, tools, and glazing kit. Money-back guarantee for students who attend all sessions.",
    "provider": {
      "@type": "Organization",
      "name": "Color Cocktail Factory",
      "url": "https://colorcocktailfactory.com"
    },
    "hasCourseInstance": {
      "@type": "CourseInstance",
      "courseMode": "online",
      "duration": "P3M",
      "instructor": [
        {
          "@type": "Person",
          "name": "Brittany"
        },
        {
          "@type": "Person",
          "name": "Yahya"
        }
      ]
    }
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(courseSchema) }} />

      <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/40 to-slate-900">
        <div className="sparkle-noise absolute inset-0 opacity-20" />
        
        <div className="relative mx-auto max-w-5xl px-6 py-20">
          
          {/* Hero Section */}
          <Reveal variant="fade-up">
            <div className="text-center">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-purple-500/20 px-4 py-2 text-sm font-semibold text-purple-200">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                100% Money-Back Guarantee
              </div>
              
              <h1 className="font-serif text-4xl font-bold leading-tight sm:text-6xl">
                Master Pottery from Home in 3 Months
              </h1>
              
              <p className="mt-6 text-xl leading-relaxed text-white/80 sm:text-2xl">
                Learn to create beautiful pottery on your own wheel. 12 live online sessions with expert instructors. Includes FREE pottery wheel, tools, clay & glazing kit shipped to your door.
              </p>

              {/* Micro-trust bullets */}
              <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-sm text-white/70">
                <div className="flex items-center gap-2">
                  <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>FREE Pottery Wheel</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>12 Live Sessions</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Adults & Kids Classes</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Beginner-Friendly</span>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Pricing Display */}
          <Reveal variant="fade-up" delay={100}>
            <div className="mt-12">
              <Suspense fallback={<div className="h-64 rounded-2xl bg-white/5 animate-pulse" />}>
                <PricingDisplay />
              </Suspense>
            </div>
          </Reveal>

          {/* How It Works */}
          <Reveal variant="fade-up" delay={200}>
            <div className="mt-20">
              <h2 className="text-center font-serif text-3xl font-bold sm:text-4xl">How It Works</h2>
              <div className="mt-10 grid gap-6 sm:grid-cols-3">
                <GlassCard>
                  <div className="p-6 text-center">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-purple-500/20 text-2xl font-bold text-purple-300">
                      1
                    </div>
                    <h3 className="mb-2 font-semibold text-white">Enroll Today</h3>
                    <p className="text-sm text-white/70">Choose your track (adults or kids) and complete enrollment. Your wheel and starter kit ship within 3-5 business days.</p>
                  </div>
                </GlassCard>
                <GlassCard>
                  <div className="p-6 text-center">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-purple-500/20 text-2xl font-bold text-purple-300">
                      2
                    </div>
                    <h3 className="mb-2 font-semibold text-white">Attend 12 Live Sessions</h3>
                    <p className="text-sm text-white/70">Join live online classes with Brittany or Yahya. Ask questions, get feedback, and practice alongside other students.</p>
                  </div>
                </GlassCard>
                <GlassCard>
                  <div className="p-6 text-center">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-purple-500/20 text-2xl font-bold text-purple-300">
                      3
                    </div>
                    <h3 className="mb-2 font-semibold text-white">Create with Confidence</h3>
                    <p className="text-sm text-white/70">By the end, you'll comfortably throw a variety of shapes and objects on your wheel. Guaranteed.</p>
                  </div>
                </GlassCard>
              </div>
            </div>
          </Reveal>

          {/* What You'll Be Able to Make */}
          <Reveal variant="fade-up">
            <GlassCard className="mt-20">
              <div className="p-8">
                <h2 className="text-center font-serif text-3xl font-bold sm:text-4xl">What You'll Be Able to Make</h2>
                <p className="mt-4 text-center text-white/70">
                  By the end of the program, you'll have comfortable control of the pottery wheel and be able to create repeatable results with these beginner-friendly forms:
                </p>
                <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {[
                    "Cups & mugs",
                    "Bowls (various sizes)",
                    "Cylinders",
                    "Simple vases",
                    "Plates & saucers",
                    "Small jars with lids",
                    "Planters",
                    "Decorative pieces"
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 rounded-lg bg-white/5 p-3">
                      <svg className="h-5 w-5 flex-shrink-0 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-white/85">{item}</span>
                    </div>
                  ))}
                </div>
                <p className="mt-6 text-center text-sm text-white/60">
                  We emphasize <strong className="text-white/80">comfortable control</strong> and <strong className="text-white/80">repeatable results</strong>—not perfection. You'll build real skills and confidence.
                </p>
              </div>
            </GlassCard>
          </Reveal>

          {/* What's Included */}
          <Reveal variant="fade-up">
            <GlassCard className="mt-20">
              <div className="p-8">
                <h2 className="text-center font-serif text-3xl font-bold sm:text-4xl">What's Included</h2>
                <p className="mt-4 text-center text-white/70">
                  Everything you need to start creating pottery from home—shipped directly to your door.
                </p>
                <div className="mt-8 space-y-3">
                  {[
                    { item: "FREE Pottery Wheel", note: "Yours to keep, no matter what" },
                    { item: "Clay for First Session", note: "Enough to get started and practice" },
                    { item: "Full Pottery Tool Kit", note: "Ribs, sponges, wire tools, trimming tools" },
                    { item: "Glazing Kit", note: "Palettes, brushes, and basic glazing materials" },
                    { item: "12 Live Online Sessions", note: "Expert instruction, Q&A, and feedback" },
                    { item: "Session Recordings", note: "Rewatch anytime" },
                    { item: "100% Money-Back Guarantee", note: "When you attend all 12 sessions" }
                  ].map((entry, idx) => (
                    <div key={idx} className="flex items-start gap-4 rounded-lg border border-white/10 bg-white/5 p-4">
                      <svg className="mt-1 h-6 w-6 flex-shrink-0 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <div className="flex-1">
                        <div className="font-semibold text-white">{entry.item}</div>
                        <div className="text-sm text-white/60">{entry.note}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </GlassCard>
          </Reveal>

          {/* Money-Back Guarantee Callout */}
          <Reveal variant="fade-up">
            <div className="mt-20 rounded-2xl border-2 border-green-500/30 bg-gradient-to-br from-green-900/20 to-emerald-900/20 p-8 text-center backdrop-blur-sm">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20">
                <svg className="h-10 w-10 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <h2 className="font-serif text-3xl font-bold text-white">The Money-Back Guarantee</h2>
              <p className="mt-4 text-lg leading-relaxed text-white/85">
                If you attend all 12 live sessions and still cannot comfortably use a pottery wheel to create a variety of shapes and objects by the end of the program, we'll refund <strong className="text-white">100% of your membership cost</strong>.
              </p>
              <p className="mt-4 text-white/70">
                <strong className="text-white/90">You keep the wheel and all materials, no matter what.</strong>
              </p>
              <p className="mt-6 text-sm text-white/60">
                We can make this guarantee because our instructors have a proven track record: when students show up and practice, they succeed. This isn't about perfection—it's about building real, repeatable skills and confidence with the pottery wheel.
              </p>
            </div>
          </Reveal>

          {/* Meet the Instructors */}
          <Reveal variant="fade-up">
            <div className="mt-20">
              <h2 className="text-center font-serif text-3xl font-bold sm:text-4xl">Meet Your Instructors</h2>
              <p className="mt-4 text-center text-white/70">
                Learn from experienced potters who specialize in teaching absolute beginners.
              </p>
              <div className="mt-10 grid gap-8 sm:grid-cols-2">
                <GlassCard>
                  <div className="p-8">
                    <h3 className="text-2xl font-bold text-white">Brittany</h3>
                    <div className="mt-2 text-sm text-purple-300">10+ Years Teaching Pottery</div>
                    <p className="mt-4 leading-relaxed text-white/75">
                      Brittany has taught thousands of beginners—from kids to retirees—how to throw their first pot. Her teaching style is patient, clear, and encouraging. She breaks down complex techniques into manageable steps and gives honest, supportive feedback that builds confidence fast.
                    </p>
                    <p className="mt-3 text-sm text-white/60">
                      "I love watching students realize they can create something beautiful with their own hands. That moment of surprise and pride never gets old."
                    </p>
                  </div>
                </GlassCard>
                <GlassCard>
                  <div className="p-8">
                    <h3 className="text-2xl font-bold text-white">Yahya</h3>
                    <div className="mt-2 text-sm text-purple-300">10+ Years Teaching Pottery</div>
                    <p className="mt-4 leading-relaxed text-white/75">
                      Yahya is known for his calm, methodical approach to teaching wheel throwing. He excels at troubleshooting common beginner mistakes and helping students develop muscle memory quickly. His classes are interactive, hands-on, and designed to build both skill and independence.
                    </p>
                    <p className="mt-3 text-sm text-white/60">
                      "Pottery is about practice and patience. My job is to give you the tools and confidence to keep improving long after our sessions end."
                    </p>
                  </div>
                </GlassCard>
              </div>
            </div>
          </Reveal>

          {/* Adults vs Kids Tracks */}
          <Reveal variant="fade-up">
            <GlassCard className="mt-20">
              <div className="p-8">
                <h2 className="text-center font-serif text-3xl font-bold sm:text-4xl">Adults vs Kids Tracks</h2>
                <p className="mt-4 text-center text-white/70">
                  We offer separate classes to ensure age-appropriate pacing and instruction.
                </p>
                <div className="mt-10 grid gap-8 sm:grid-cols-2">
                  <div className="rounded-lg border border-purple-500/30 bg-purple-500/10 p-6">
                    <h3 className="text-xl font-bold text-purple-300">Adults Track</h3>
                    <ul className="mt-4 space-y-2 text-sm text-white/75">
                      <li className="flex items-start gap-2">
                        <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>Faster pacing with deeper technical explanations</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>Focus on technique, troubleshooting, and refinement</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>Evening sessions to fit work schedules</span>
                      </li>
                    </ul>
                  </div>
                  <div className="rounded-lg border border-cyan-500/30 bg-cyan-500/10 p-6">
                    <h3 className="text-xl font-bold text-cyan-300">Kids Track</h3>
                    <ul className="mt-4 space-y-2 text-sm text-white/75">
                      <li className="flex items-start gap-2">
                        <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-cyan-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>Age-appropriate pacing with playful, creative focus</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-cyan-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>Kids under 10 must have an adult assistant present</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-cyan-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>Afternoon/weekend sessions for school-age kids</span>
                      </li>
                    </ul>
                  </div>
                </div>
                <p className="mt-6 text-center text-sm text-white/60">
                  Both tracks cover the same core techniques—we just adjust the teaching style and pacing to fit the audience.
                </p>
              </div>
            </GlassCard>
          </Reveal>

          {/* Class Format */}
          <Reveal variant="fade-up">
            <GlassCard className="mt-20">
              <div className="p-8">
                <h2 className="text-center font-serif text-3xl font-bold sm:text-4xl">Class Format & Expectations</h2>
                <div className="mt-8 space-y-6 text-white/80">
                  <div>
                    <h3 className="font-semibold text-white">Live, Interactive Sessions</h3>
                    <p className="mt-2 text-sm text-white/70">
                      Each session is live online via Zoom. You'll see your instructor's hands on the wheel, ask questions in real-time, and get personalized feedback. Sessions last 90 minutes.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Demos + Practice Time</h3>
                    <p className="mt-2 text-sm text-white/70">
                      Instructors demonstrate techniques step-by-step, then you practice while they watch and give tips. You're encouraged to share your progress via camera (optional but helpful).
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Minimal Home Requirements</h3>
                    <p className="mt-2 text-sm text-white/70">
                      You need: a sturdy table, a towel, access to water, and space for basic cleanup. No kiln required. No special room setup. Just a clean workspace and willingness to get a little messy.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Recordings Available</h3>
                    <p className="mt-2 text-sm text-white/70">
                      Can't make a session live? No problem—we record everything. But to qualify for the guarantee, you must attend all 12 live.
                    </p>
                  </div>
                </div>
              </div>
            </GlassCard>
          </Reveal>

          {/* Pricing CTA Section */}
          <Reveal variant="fade-up">
            <div className="mt-20">
              <h2 className="text-center font-serif text-3xl font-bold sm:text-4xl">Ready to Start?</h2>
              <p className="mt-4 text-center text-white/70">
                Enroll now and get everything you need to master pottery from home.
              </p>
              <div className="mt-8">
                <Suspense fallback={<div className="h-64 rounded-2xl bg-white/5 animate-pulse" />}>
                  <PricingDisplay />
                </Suspense>
              </div>
            </div>
          </Reveal>

          {/* FAQ */}
          <Reveal variant="fade-up">
            <div className="mt-20">
              <h2 className="text-center font-serif text-3xl font-bold sm:text-4xl">Frequently Asked Questions</h2>
              <div className="mt-10 space-y-6">
                {[
                  {
                    q: "Is this really beginner-friendly?",
                    a: "Yes. Our instructors (Brittany and Yahya) have each taught pottery to absolute beginners for 10+ years. Most students can make simple pieces by themselves after session 1 or 2. We teach step-by-step, answer questions live, and provide supportive feedback throughout."
                  },
                  {
                    q: "What if I miss a session?",
                    a: "Sessions are recorded, so you can watch them later. However, to qualify for the money-back guarantee, you must attend all 12 live sessions. We recommend treating this like a scheduled class to get the most value."
                  },
                  {
                    q: "Is the pottery wheel mine to keep?",
                    a: "Yes! The pottery wheel is yours to keep, no matter what. Even if you don't complete the program or request a refund, the wheel and all materials shipped to you are yours."
                  },
                  {
                    q: "Is this safe for kids?",
                    a: "Yes. We offer separate kids classes taught at an age-appropriate pace. Kids under 10 must have an adult assistant present to help with setup, cleanup, and any heavy lifting. Pottery is a safe, tactile, screen-free activity perfect for developing fine motor skills and creativity."
                  },
                  {
                    q: "What does the money-back guarantee require exactly?",
                    a: "If you attend all 12 live sessions and still cannot comfortably use a pottery wheel to create a variety of shapes and objects by the end of the program, we'll refund 100% of your membership cost. You keep the wheel and materials. We offer this guarantee because our instructors have a proven track record—when students show up and practice, they succeed."
                  },
                  {
                    q: "Do I need a kiln?",
                    a: "No. You'll create pieces during the program, and we'll guide you on air-dry clay options or local firing services if you want to fire your work. The focus is on mastering wheel technique and building confidence—not requiring expensive equipment."
                  },
                  {
                    q: "How does glazing work with the included kit?",
                    a: "The glazing kit includes palettes, brushes, and basic glazing materials. We'll teach you glazing fundamentals during the sessions. For firing glazed pieces, you can use local pottery studios or community kilns (we'll provide guidance). The kit gives you hands-on experience with the full pottery process."
                  }
                ].map((faq, idx) => (
                  <GlassCard key={idx}>
                    <div className="p-6">
                      <h3 className="font-semibold text-white">{faq.q}</h3>
                      <p className="mt-3 text-sm leading-relaxed text-white/75">{faq.a}</p>
                    </div>
                  </GlassCard>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Final CTA */}
          <Reveal variant="fade-up">
            <div className="mt-20 text-center">
              <h2 className="font-serif text-3xl font-bold sm:text-4xl">Join Thousands of Students Worldwide</h2>
              <p className="mt-4 text-lg text-white/80">
                Master pottery from home. Risk-free with our 100% money-back guarantee.
              </p>
              <div className="mt-8 flex justify-center">
                <a
                  href="https://app.acuityscheduling.com/catalog.php?owner=35932879&category=3-Month+Pottery+Membership"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-10 py-4 font-serif text-xl font-semibold text-white shadow-lg shadow-purple-500/50 transition-all hover:scale-105 hover:shadow-xl hover:shadow-purple-500/60"
                >
                  Enroll Now
                </a>
              </div>
              <p className="mt-4 text-sm text-white/60">
                Questions? <Link href="/private-events" className="text-purple-300 hover:text-purple-200 hover:underline">Contact us</Link>
              </p>
            </div>
          </Reveal>

        </div>
      </main>
    </>
  );
}
