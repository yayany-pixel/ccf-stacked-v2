import type { Metadata } from "next";
import Link from "next/link";
import { Check, Clock, Users, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Thanks for Your Inquiry! | Color Cocktail Factory",
  description: "We received your private party request and will get back to you within 24 hours with available dates and project ideas.",
  robots: "noindex, nofollow"
};

export default function PrivatePartyThanksPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-800 to-orange-700 px-4 py-16">
      <div className="mx-auto max-w-4xl">
        {/* Success Message */}
        <div className="mb-12 text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-500/20 backdrop-blur-xl">
            <Check className="h-10 w-10 text-green-300" strokeWidth={3} />
          </div>
          <h1 className="mb-4 text-4xl font-bold text-white md:text-5xl">
            Your inquiry is on its way!
          </h1>
          <p className="text-lg text-white/80 md:text-xl">
            We received your private party request and are excited to help you create an unforgettable experience for your group.
          </p>
        </div>

        {/* What's Next */}
        <div className="mb-12 rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
          <div className="mb-6 flex items-center gap-3">
            <Clock className="h-6 w-6 text-purple-300" />
            <h2 className="text-2xl font-bold text-white">What happens next?</h2>
          </div>
          <ul className="space-y-3 text-white/90">
            <li className="flex items-start gap-3">
              <span className="mt-1 text-purple-300">•</span>
              <span>Our team will <strong>review your request</strong> and check availability for your preferred date and city.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 text-purple-300">•</span>
              <span>We'll <strong>reply within 24 hours</strong> (usually much faster!) with available time slots, project recommendations, and a custom quote.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 text-purple-300">•</span>
              <span>Once you confirm, we'll <strong>reserve your date</strong> and send you a detailed planning guide with everything you need to know.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 text-purple-300">•</span>
              <span>Check your email (including spam folder) for our response from <strong>support@colorcocktailfactory.com</strong>.</span>
            </li>
          </ul>
        </div>

        {/* Popular Private Party Ideas */}
        <div className="mb-8 rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
          <div className="mb-6 flex items-center gap-3">
            <Users className="h-6 w-6 text-pink-300" />
            <h2 className="text-2xl font-bold text-white">Popular private party projects</h2>
          </div>
          <p className="mb-6 text-white/80">
            While you wait, check out some of our most popular group activities. We can customize any workshop for your party!
          </p>
          
          <div className="grid gap-4 sm:grid-cols-2">
            {/* Wheel Throwing */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <div className="mb-3 text-sm font-semibold uppercase tracking-wide text-purple-300">
                Wheel Throwing
              </div>
              <div className="text-lg font-semibold text-white">
                Date Night Pottery
              </div>
              <div className="mt-2 text-sm text-white/60">
                Perfect for couples, birthdays, or bachelorette parties. Everyone gets to make 2-3 pieces on the wheel.
              </div>
              <div className="mt-3 text-sm font-semibold text-purple-300">
                From $65/person
              </div>
            </div>

            {/* Mosaics */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <div className="mb-3 text-sm font-semibold uppercase tracking-wide text-pink-300">
                Turkish Lamps
              </div>
              <div className="text-lg font-semibold text-white">
                Mosaic Lamp Making
              </div>
              <div className="mt-2 text-sm text-white/60">
                Create stunning glowing lamps with colorful glass mosaics. Take your finished piece home the same day!
              </div>
              <div className="mt-3 text-sm font-semibold text-pink-300">
                From $75/person
              </div>
            </div>

            {/* Handbuilt Pottery */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <div className="mb-3 text-sm font-semibold uppercase tracking-wide text-orange-300">
                Handbuilding
              </div>
              <div className="text-lg font-semibold text-white">
                Cups, Bowls & Vases
              </div>
              <div className="mt-2 text-sm text-white/60">
                Build functional pottery using coil, slab, and pinch techniques. Great for team building!
              </div>
              <div className="mt-3 text-sm font-semibold text-orange-300">
                From $55/person
              </div>
            </div>

            {/* Glass Fusion */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <div className="mb-3 text-sm font-semibold uppercase tracking-wide text-blue-300">
                Glass Fusion
              </div>
              <div className="text-lg font-semibold text-white">
                Fused Glass Dishes
              </div>
              <div className="mt-2 text-sm text-white/60">
                Design colorful glass dishes fired in a kiln. Perfect for corporate events and creative team bonding.
              </div>
              <div className="mt-3 text-sm font-semibold text-blue-300">
                From $65/person
              </div>
            </div>
          </div>
        </div>

        {/* Browse More */}
        <div className="mb-8 text-center">
          <Link 
            href="/activities"
            className="inline-flex items-center gap-2 rounded-full border border-purple-400/40 bg-gradient-to-r from-purple-500/30 to-pink-500/30 px-6 py-3 font-semibold text-white shadow-lg shadow-purple-500/20 transition-all hover:border-purple-400/60 hover:shadow-purple-500/30"
          >
            <Sparkles className="h-5 w-5" />
            Browse All Workshop Types
          </Link>
        </div>

        {/* Additional Resources */}
        <div className="mb-8 rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
          <h3 className="mb-4 text-xl font-bold text-white">More information</h3>
          <div className="grid gap-4 sm:grid-cols-3">
            <Link 
              href="/team-building"
              className="block rounded-xl border border-white/10 bg-white/5 p-4 text-center transition-all hover:border-purple-400/40 hover:bg-white/10"
            >
              <div className="text-sm font-semibold text-white">Team Building</div>
              <div className="mt-1 text-xs text-white/60">Corporate events & offsites</div>
            </Link>
            <Link 
              href="/birthday-parties"
              className="block rounded-xl border border-white/10 bg-white/5 p-4 text-center transition-all hover:border-pink-400/40 hover:bg-white/10"
            >
              <div className="text-sm font-semibold text-white">Birthday Parties</div>
              <div className="mt-1 text-xs text-white/60">Celebrate with creativity</div>
            </Link>
            <Link 
              href="/bachelorette-parties"
              className="block rounded-xl border border-white/10 bg-white/5 p-4 text-center transition-all hover:border-orange-400/40 hover:bg-white/10"
            >
              <div className="text-sm font-semibold text-white">Bachelorette Parties</div>
              <div className="mt-1 text-xs text-white/60">Unforgettable experiences</div>
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
