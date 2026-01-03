import type { Metadata } from "next";
import Link from "next/link";
import { Check, Mail, Calendar, Paintbrush } from "lucide-react";

export const metadata: Metadata = {
  title: "Thanks for Subscribing! | Color Cocktail Factory",
  description: "You're all set! Check out our upcoming pottery, mosaic, and glass fusion workshops in Chicago and Eugene.",
  robots: "noindex, nofollow"
};

export default function NewsletterThanksPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-800 to-orange-700 px-4 py-16">
      <div className="mx-auto max-w-4xl">
        {/* Success Message */}
        <div className="mb-12 text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-500/20 backdrop-blur-xl">
            <Check className="h-10 w-10 text-green-300" strokeWidth={3} />
          </div>
          <h1 className="mb-4 text-4xl font-bold text-white md:text-5xl">
            You're all set!
          </h1>
          <p className="text-lg text-white/80 md:text-xl">
            Thanks for subscribing! You'll get our monthly newsletter with workshop highlights, student spotlights, and exclusive offers.
          </p>
        </div>

        {/* What's Next */}
        <div className="mb-12 rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
          <div className="mb-6 flex items-center gap-3">
            <Mail className="h-6 w-6 text-purple-300" />
            <h2 className="text-2xl font-bold text-white">What happens next?</h2>
          </div>
          <ul className="space-y-3 text-white/90">
            <li className="flex items-start gap-3">
              <span className="mt-1 text-purple-300">•</span>
              <span>You'll receive a <strong>welcome email</strong> within the next few minutes (check your spam folder just in case!).</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 text-purple-300">•</span>
              <span>Our <strong>monthly newsletter</strong> features new class announcements, student work showcases, and special promotions.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 text-purple-300">•</span>
              <span>You can <strong>unsubscribe anytime</strong> with one click from any email footer.</span>
            </li>
          </ul>
        </div>

        {/* Browse Classes CTA */}
        <div className="mb-8 rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
          <div className="mb-6 flex items-center gap-3">
            <Calendar className="h-6 w-6 text-pink-300" />
            <h2 className="text-2xl font-bold text-white">Browse upcoming classes</h2>
          </div>
          <p className="mb-6 text-white/80">
            Don't wait for the newsletter! Book your spot in one of our popular workshops today.
          </p>
          
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {/* Wheel Throwing */}
            <Link 
              href="/chicago/date-night-wheel-throwing"
              className="group rounded-2xl border border-white/10 bg-white/5 p-6 transition-all hover:border-purple-400/40 hover:bg-white/10"
            >
              <div className="mb-3 text-sm font-semibold uppercase tracking-wide text-purple-300">
                Wheel Throwing
              </div>
              <div className="text-lg font-semibold text-white group-hover:text-purple-200">
                Date Night Pottery
              </div>
              <div className="mt-2 text-sm text-white/60">
                Chicago & Eugene
              </div>
            </Link>

            {/* Mosaics */}
            <Link 
              href="/chicago/mosaic-workshop"
              className="group rounded-2xl border border-white/10 bg-white/5 p-6 transition-all hover:border-pink-400/40 hover:bg-white/10"
            >
              <div className="mb-3 text-sm font-semibold uppercase tracking-wide text-pink-300">
                Mosaics
              </div>
              <div className="text-lg font-semibold text-white group-hover:text-pink-200">
                Turkish Lamp Making
              </div>
              <div className="mt-2 text-sm text-white/60">
                Chicago & Eugene
              </div>
            </Link>

            {/* Glass Fusion */}
            <Link 
              href="/chicago/glass-fusion-workshop"
              className="group rounded-2xl border border-white/10 bg-white/5 p-6 transition-all hover:border-orange-400/40 hover:bg-white/10"
            >
              <div className="mb-3 text-sm font-semibold uppercase tracking-wide text-orange-300">
                Glass Fusion
              </div>
              <div className="text-lg font-semibold text-white group-hover:text-orange-200">
                Fused Glass Dishes
              </div>
              <div className="mt-2 text-sm text-white/60">
                Chicago & Eugene
              </div>
            </Link>

            {/* Terrariums */}
            <Link 
              href="/chicago/terrarium-workshop"
              className="group rounded-2xl border border-white/10 bg-white/5 p-6 transition-all hover:border-green-400/40 hover:bg-white/10"
            >
              <div className="mb-3 text-sm font-semibold uppercase tracking-wide text-green-300">
                Terrariums
              </div>
              <div className="text-lg font-semibold text-white group-hover:text-green-200">
                Miniature Gardens
              </div>
              <div className="mt-2 text-sm text-white/60">
                Chicago & Eugene
              </div>
            </Link>

            {/* Bonsai */}
            <Link 
              href="/chicago/bonsai-workshop"
              className="group rounded-2xl border border-white/10 bg-white/5 p-6 transition-all hover:border-teal-400/40 hover:bg-white/10"
            >
              <div className="mb-3 text-sm font-semibold uppercase tracking-wide text-teal-300">
                Bonsai
              </div>
              <div className="text-lg font-semibold text-white group-hover:text-teal-200">
                Living Sculptures
              </div>
              <div className="mt-2 text-sm text-white/60">
                Chicago & Eugene
              </div>
            </Link>

            {/* Candle Making */}
            <Link 
              href="/chicago/candle-making-workshop"
              className="group rounded-2xl border border-white/10 bg-white/5 p-6 transition-all hover:border-yellow-400/40 hover:bg-white/10"
            >
              <div className="mb-3 text-sm font-semibold uppercase tracking-wide text-yellow-300">
                Candle Making
              </div>
              <div className="text-lg font-semibold text-white group-hover:text-yellow-200">
                Custom Scents
              </div>
              <div className="mt-2 text-sm text-white/60">
                Chicago & Eugene
              </div>
            </Link>
          </div>

          <div className="mt-6 text-center">
            <Link 
              href="/activities"
              className="inline-flex items-center gap-2 rounded-full border border-purple-400/40 bg-gradient-to-r from-purple-500/30 to-pink-500/30 px-6 py-3 font-semibold text-white shadow-lg shadow-purple-500/20 transition-all hover:border-purple-400/60 hover:shadow-purple-500/30"
            >
              <Paintbrush className="h-5 w-5" />
              View All Workshops
            </Link>
          </div>
        </div>

        {/* Navigate Home */}
        <div className="text-center">
          <Link 
            href="/"
            className="inline-block text-white/60 underline decoration-white/30 underline-offset-4 transition-colors hover:text-white/90"
          >
            ← Back to homepage
          </Link>
        </div>
      </div>
    </main>
  );
}
