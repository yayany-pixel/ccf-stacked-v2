import type { Metadata } from "next";
import Link from "next/link";
import GlassCard from "@/components/ui/GlassCard";
import ButtonPill from "@/components/ui/ButtonPill";
import { giftCardUrl } from "@/lib/config";

export const metadata: Metadata = {
  title: "Gift Cards",
  description: "Give the gift of creativity. Gift cards for Color Cocktail Factory pottery, glass, and art workshops."
};

export default function GiftCardsPage() {
  return (
    <main className="min-h-screen px-6">
      <div className="h-24" />
      <div className="mx-auto max-w-4xl">
        <GlassCard className="p-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-semibold tracking-wide text-white/80">
            GIFT CARDS
          </div>
          <h1 className="mt-4 font-serif text-5xl leading-tight">Gift Cards</h1>
          <p className="mt-4 max-w-2xl text-white/80">
            Let them choose the workshop. You get the credit for being thoughtful.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <ButtonPill href={giftCardUrl} variant="primary">Buy gift cards</ButtonPill>
            <ButtonPill href={giftCardUrl} variant="secondary">Share link</ButtonPill>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {["$50", "$100", "$200"].map((amt) => (
              <div key={amt} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="text-xs text-white/60">POPULAR PICK</div>
                <div className="mt-2 text-2xl font-semibold">{amt}</div>
                <p className="mt-2 text-sm text-white/70">
                  Great for date nights, quick workshops, or a creative surprise.
                </p>
                <div className="mt-4">
                  <ButtonPill href={giftCardUrl} variant="primary" full>
                    Select →
                  </ButtonPill>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 border-t border-white/10 pt-6 text-sm text-white/70">
            Want city schedules? Visit{" "}
            <Link className="text-white/85 underline decoration-white/30 underline-offset-4" href="/chicago">
              Chicago
            </Link>{" "}
            or{" "}
            <Link className="text-white/85 underline decoration-white/30 underline-offset-4" href="/eugene">
              Eugene
            </Link>.
          </div>
        </GlassCard>
      </div>
    </main>
  );
}
