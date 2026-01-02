import type { Metadata } from "next";
import Link from "next/link";
import GlassCard from "@/components/ui/GlassCard";
import Reveal from "@/components/motion/Reveal";

export const metadata: Metadata = {
  title: "Analytics Dashboard | Color Cocktail Factory",
  description: "Internal analytics and performance dashboard",
  robots: {
    index: false,
    follow: false
  }
};

export default function AnalyticsPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/40 to-slate-900">
      <div className="sparkle-noise absolute inset-0 opacity-20" />
      
      <div className="relative mx-auto max-w-7xl px-6 py-20">
        <Reveal variant="fade-up">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold backdrop-blur-xl">
              📊 Analytics Hub
            </div>
            <h1 className="mt-6 font-serif text-5xl font-bold">
              Performance Dashboard
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-white/75">
              Your centralized analytics, metrics, and insights
            </p>
          </div>
        </Reveal>

        {/* Quick Links */}
        <section className="mt-12 grid gap-6 md:grid-cols-3">
          <Reveal delay={100}>
            <a 
              href="https://analytics.google.com/analytics/web/#/p123456789/reports/intelligenthome" 
              target="_blank" 
              rel="noopener noreferrer"
              className="block"
            >
              <GlassCard interactive className="h-full p-6 text-center transition-all hover:scale-105">
                <div className="text-4xl">📈</div>
                <h2 className="mt-3 text-xl font-bold">Google Analytics</h2>
                <p className="mt-2 text-sm text-white/70">Real-time traffic & conversions</p>
                <div className="mt-4 text-xs font-mono text-purple-300">G-CPKCDF56W2</div>
              </GlassCard>
            </a>
          </Reveal>

          <Reveal delay={200}>
            <a 
              href="https://business.facebook.com/events_manager" 
              target="_blank" 
              rel="noopener noreferrer"
              className="block"
            >
              <GlassCard interactive className="h-full p-6 text-center transition-all hover:scale-105">
                <div className="text-4xl">📱</div>
                <h2 className="mt-3 text-xl font-bold">Meta Pixel</h2>
                <p className="mt-2 text-sm text-white/70">Facebook/Instagram insights</p>
                <div className="mt-4 text-xs font-mono text-cyan-300">1554498828184467</div>
              </GlassCard>
            </a>
          </Reveal>

          <Reveal delay={300}>
            <a 
              href="https://app.netlify.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="block"
            >
              <GlassCard interactive className="h-full p-6 text-center transition-all hover:scale-105">
                <div className="text-4xl">🚀</div>
                <h2 className="mt-3 text-xl font-bold">Netlify Analytics</h2>
                <p className="mt-2 text-sm text-white/70">Deployment & bandwidth</p>
                <div className="mt-4 text-xs text-green-300">Production stats</div>
              </GlassCard>
            </a>
          </Reveal>
        </section>

        {/* Key Metrics to Track */}
        <section className="mt-16">
          <Reveal>
            <h2 className="mb-8 text-center font-serif text-3xl font-bold">Daily Metrics Checklist</h2>
          </Reveal>

          <div className="grid gap-8 md:grid-cols-2">
            {/* Traffic Metrics */}
            <Reveal delay={100}>
              <GlassCard>
                <div className="p-6">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">👥</span>
                    <h3 className="text-xl font-bold">Traffic Metrics</h3>
                  </div>
                  <ul className="mt-4 space-y-2 text-sm text-white/75">
                    <li className="flex items-center gap-2">
                      <span className="text-purple-400">▸</span>
                      <strong className="text-white">Daily Users:</strong> Unique visitors today
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-purple-400">▸</span>
                      <strong className="text-white">Sessions:</strong> Total visits
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-purple-400">▸</span>
                      <strong className="text-white">Pageviews:</strong> Total pages viewed
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-purple-400">▸</span>
                      <strong className="text-white">Bounce Rate:</strong> Target: 40-60%
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-purple-400">▸</span>
                      <strong className="text-white">Avg. Session Duration:</strong> Target: 1-3 min
                    </li>
                  </ul>
                </div>
              </GlassCard>
            </Reveal>

            {/* Engagement Metrics */}
            <Reveal delay={200}>
              <GlassCard>
                <div className="p-6">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">🎯</span>
                    <h3 className="text-xl font-bold">Engagement Metrics</h3>
                  </div>
                  <ul className="mt-4 space-y-2 text-sm text-white/75">
                    <li className="flex items-center gap-2">
                      <span className="text-cyan-400">▸</span>
                      <strong className="text-white">Top Pages:</strong> Most visited content
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-cyan-400">▸</span>
                      <strong className="text-white">RezClick Conversions:</strong> Booking clicks
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-cyan-400">▸</span>
                      <strong className="text-white">Traffic Sources:</strong> Where users come from
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-cyan-400">▸</span>
                      <strong className="text-white">Device Breakdown:</strong> Mobile vs Desktop
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-cyan-400">▸</span>
                      <strong className="text-white">City Preference:</strong> Chicago vs Eugene clicks
                    </li>
                  </ul>
                </div>
              </GlassCard>
            </Reveal>

            {/* Conversion Tracking */}
            <Reveal delay={300}>
              <GlassCard>
                <div className="p-6">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">💰</span>
                    <h3 className="text-xl font-bold">Conversion Events</h3>
                  </div>
                  <ul className="mt-4 space-y-2 text-sm text-white/75">
                    <li className="flex items-center gap-2">
                      <span className="text-green-400">▸</span>
                      <strong className="text-white">Book Now Clicks:</strong> Primary CTA
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-400">▸</span>
                      <strong className="text-white">Gift Card Clicks:</strong> Revenue opportunity
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-400">▸</span>
                      <strong className="text-white">Private Event Inquiries:</strong> Form submissions
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-400">▸</span>
                      <strong className="text-white">Newsletter Signups:</strong> Email list growth
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-green-400">▸</span>
                      <strong className="text-white">Outbound Clicks:</strong> Social media, Eventbrite
                    </li>
                  </ul>
                </div>
              </GlassCard>
            </Reveal>

            {/* Performance Metrics */}
            <Reveal delay={400}>
              <GlassCard>
                <div className="p-6">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">⚡</span>
                    <h3 className="text-xl font-bold">Performance Metrics</h3>
                  </div>
                  <ul className="mt-4 space-y-2 text-sm text-white/75">
                    <li className="flex items-center gap-2">
                      <span className="text-orange-400">▸</span>
                      <strong className="text-white">Page Load Speed:</strong> Target: &lt;3s
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-orange-400">▸</span>
                      <strong className="text-white">Core Web Vitals:</strong> LCP, FID, CLS scores
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-orange-400">▸</span>
                      <strong className="text-white">Error Rate:</strong> 404s and server errors
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-orange-400">▸</span>
                      <strong className="text-white">Mobile Performance:</strong> Separate score
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-orange-400">▸</span>
                      <strong className="text-white">Bandwidth Usage:</strong> Netlify limits
                    </li>
                  </ul>
                </div>
              </GlassCard>
            </Reveal>
          </div>
        </section>

        {/* Custom Reports Setup */}
        <section className="mt-16">
          <Reveal>
            <h2 className="mb-8 text-center font-serif text-3xl font-bold">Recommended Custom Reports</h2>
          </Reveal>

          <div className="space-y-6">
            <Reveal delay={100}>
              <GlassCard>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-purple-200">📊 Daily Performance Report</h3>
                  <p className="mt-2 text-sm text-white/75">
                    Track daily trends and identify patterns
                  </p>
                  <div className="mt-4 space-y-2 text-sm">
                    <p className="text-white/60"><strong>Metrics:</strong> Users, Sessions, Bounce Rate, Avg. Duration</p>
                    <p className="text-white/60"><strong>Dimensions:</strong> Date, Source/Medium, Device Category</p>
                    <p className="text-white/60"><strong>Filters:</strong> Last 30 days, exclude internal traffic</p>
                  </div>
                  <a 
                    href="https://analytics.google.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="mt-4 inline-block text-sm text-purple-300 hover:text-purple-200"
                  >
                    Set up in Google Analytics →
                  </a>
                </div>
              </GlassCard>
            </Reveal>

            <Reveal delay={200}>
              <GlassCard>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-cyan-200">🎨 Content Performance Report</h3>
                  <p className="mt-2 text-sm text-white/75">
                    See which activities and blog posts drive traffic
                  </p>
                  <div className="mt-4 space-y-2 text-sm">
                    <p className="text-white/60"><strong>Metrics:</strong> Pageviews, Unique Pageviews, Time on Page, Exit Rate</p>
                    <p className="text-white/60"><strong>Dimensions:</strong> Page Path, Page Title</p>
                    <p className="text-white/60"><strong>Segments:</strong> Group by /chicago vs /eugene, /blog vs activities</p>
                  </div>
                  <a 
                    href="https://analytics.google.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="mt-4 inline-block text-sm text-cyan-300 hover:text-cyan-200"
                  >
                    Set up in Google Analytics →
                  </a>
                </div>
              </GlassCard>
            </Reveal>

            <Reveal delay={300}>
              <GlassCard>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-green-200">💸 Conversion Funnel Report</h3>
                  <p className="mt-2 text-sm text-white/75">
                    Track user journey from landing to booking
                  </p>
                  <div className="mt-4 space-y-2 text-sm">
                    <p className="text-white/60"><strong>Steps:</strong> Landing → Activity Page → Booking Click → External Site</p>
                    <p className="text-white/60"><strong>Events:</strong> RezClick, Eventbrite Click, Private Event Form Submit</p>
                    <p className="text-white/60"><strong>Goal:</strong> Measure drop-off at each step</p>
                  </div>
                  <a 
                    href="https://analytics.google.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="mt-4 inline-block text-sm text-green-300 hover:text-green-200"
                  >
                    Set up in Google Analytics →
                  </a>
                </div>
              </GlassCard>
            </Reveal>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="mt-16">
          <Reveal>
            <GlassCard>
              <div className="p-8 text-center">
                <h3 className="font-serif text-2xl font-bold">Need Help?</h3>
                <p className="mx-auto mt-2 max-w-2xl text-white/75">
                  Access detailed setup guides and documentation
                </p>
                <div className="mt-6 flex flex-wrap justify-center gap-3">
                  <Link 
                    href="/analytics/setup-guide" 
                    className="rounded-full border border-purple-400/30 bg-purple-500/10 px-6 py-2 text-sm font-semibold text-purple-300 transition hover:bg-purple-500/20"
                  >
                    📖 Setup Guide
                  </Link>
                  <Link 
                    href="/analytics/kpis" 
                    className="rounded-full border border-cyan-400/30 bg-cyan-500/10 px-6 py-2 text-sm font-semibold text-cyan-300 transition hover:bg-cyan-500/20"
                  >
                    🎯 KPI Definitions
                  </Link>
                  <Link 
                    href="/" 
                    className="rounded-full border border-white/20 bg-white/10 px-6 py-2 text-sm font-semibold transition hover:bg-white/20"
                  >
                    ← Back to Site
                  </Link>
                </div>
              </div>
            </GlassCard>
          </Reveal>
        </section>
      </div>
    </main>
  );
}
