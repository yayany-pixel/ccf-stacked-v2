import type { Metadata } from "next";
import Link from "next/link";
import GlassCard from "@/components/ui/GlassCard";
import ButtonPill from "@/components/ui/ButtonPill";
import { giftCardUrl } from "@/lib/config";

export const metadata: Metadata = {
  title: "Gift Cards | Color Cocktail Factory",
  description: "Give the gift of creativity. Gift cards for Color Cocktail Factory pottery, glass, and art workshops.",
  alternates: {
    canonical: "https://colorcocktailfactory.com/gift-cards"
  }
};

export default function GiftCardsPage() {
  return (
    <main id="main-content" tabIndex={-1} className="min-h-screen px-6">
      <div className="h-24" />
      <div className="mx-auto max-w-4xl">
        <GlassCard className="p-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-semibold tracking-wide text-white/80">
            GIFT CARDS
          </div>
          <h1 className="mt-4 font-serif text-5xl leading-tight">Gift Cards</h1>
          <p className="mt-4 max-w-2xl text-white/80">
            Let them choose the workshop. You get the credit for being thoughtful. Available in any custom denomination.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <ButtonPill href={giftCardUrl} variant="primary">
              Choose Your Gift Card Amount →
            </ButtonPill>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <div className="text-xs font-semibold text-white/60">INTRO WORKSHOP</div>
              <div className="mt-2 text-2xl font-semibold">$50</div>
              <p className="mt-2 text-sm text-white/70">
                Ideal for a single beginner workshop or craft session.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <div className="text-xs font-semibold text-pink-300">POPULAR CHOICE</div>
              <div className="mt-2 text-2xl font-semibold">$100</div>
              <p className="mt-2 text-sm text-white/70">
                Great for date night pottery for two or specialty glass workshops.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <div className="text-xs font-semibold text-purple-300">CELEBRATION</div>
              <div className="mt-2 text-2xl font-semibold">$200</div>
              <p className="mt-2 text-sm text-white/70">
                Perfect for multi-person outings or premium VIP experiences.
              </p>
            </div>
          </div>

          <div className="mt-6 text-center">
            <ButtonPill href={giftCardUrl} variant="primary" className="px-8 py-3.5 text-base">
              Choose Your Gift Card Amount →
            </ButtonPill>
          </div>

          <div className="mt-8 border-t border-white/10 pt-6 space-y-3 text-sm text-white/70">
            <p>
              <strong>Redemption Notice:</strong> Gift certificates can be redeemed directly in our online booking scheduler for eligible workshops. To book in a specific studio, view the current schedules for{" "}
              <Link className="text-white/85 underline decoration-white/30 underline-offset-4" href="/chicago">
                Chicago
              </Link>{" "}
              or{" "}
              <Link className="text-white/85 underline decoration-white/30 underline-offset-4" href="/eugene">
                Eugene
              </Link>.
            </p>
            <p className="text-xs text-white/50">
              For corporate bulk certificates or custom amounts, contact{" "}
              <a className="underline hover:text-white" href="mailto:support@colorcocktailfactory.com">
                support@colorcocktailfactory.com
              </a>.
            </p>
          </div>
        </GlassCard>
      </div>
    </main>
  );
}
