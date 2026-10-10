"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import GlassCard from "@/components/ui/GlassCard";
import TagPill from "@/components/ui/TagPill";
import Reveal from "@/components/motion/Reveal";
import LocationModal from "@/components/LocationModal";
import PotteryFinishingSection from "@/components/PotteryFinishingSection";
import type { ActivityDetail } from "@/lib/activityRegistry";
import type { ActivityPricing } from "@/lib/pricing";

export type RelatedActivityWithPrice = ActivityDetail & {
  displayPrice: string;
  wasPrice?: number | null;
  hasSaleBadge?: boolean;
};

export default function ActivityDetailView({
  activity,
  pricing,
  relatedActivities = [],
}: {
  activity: ActivityDetail;
  pricing: ActivityPricing;
  relatedActivities?: RelatedActivityWithPrice[];
}) {
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);

  const openBooking = () => {
    setIsLocationModalOpen(true);
  };

  return (
    <>
      {/* Top Breadcrumb Navigation */}
      <nav className="border-b border-white/10 bg-black/20 px-6 py-3" aria-label="Breadcrumb">
        <div className="mx-auto max-w-7xl">
          <ol className="flex items-center gap-2 text-sm text-white/60">
            <li>
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
            </li>
            <li aria-hidden="true">→</li>
            <li>
              <Link href="/activities" className="hover:text-white transition-colors">Activities</Link>
            </li>
            <li aria-hidden="true">→</li>
            <li className="text-white/90 font-medium truncate" aria-current="page">{activity.title}</li>
          </ol>
        </div>
      </nav>

      {/* Hero Section */}
      <section className={`relative overflow-hidden ${activity.overlayClass} py-16 sm:py-24`}>
        <div className="sparkle-noise absolute inset-0 opacity-20 pointer-events-none" />
        <div className="relative mx-auto max-w-7xl px-6">
          <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
            {/* Left Column: Heading, Intro, CTAs */}
            <div className="lg:col-span-7">
              <div className="flex flex-wrap items-center gap-2">
                <TagPill>{activity.categoryIcon} {activity.categoryLabel}</TagPill>
                <TagPill>{activity.locationsOffered}</TagPill>
                {pricing.hasSaleBadge && (
                  <span className="rounded-full border border-amber-400/40 bg-amber-500/20 px-3 py-1 text-xs font-bold text-amber-200">
                    ⚡ Limited-Time Sale
                  </span>
                )}
                {activity.adultThemed && (
                  <span className="rounded-full border border-red-500/40 bg-red-500/20 px-3 py-1 text-xs font-bold text-red-200">
                    🔞 18+ Adults Only
                  </span>
                )}
                {activity.beginnerFriendly && <TagPill>✨ Beginner Friendly</TagPill>}
                {activity.coversTwo && <TagPill>💕 Ticket for Two</TagPill>}
              </div>

              <h1 className="mt-4 font-serif text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl leading-[1.1]">
                {activity.heroTitle}
              </h1>

              <p className="mt-6 text-lg sm:text-xl leading-relaxed text-white/90 max-w-2xl">
                {activity.heroDescription}
              </p>

              {/* Price & Coverage Highlight */}
              <div className="mt-6 flex flex-wrap items-baseline gap-3">
                {pricing.wasPrice && pricing.displayPrice !== "See price at checkout" && (
                  <del className="font-serif text-xl sm:text-2xl text-white/50" aria-label="Original price">
                    ${pricing.wasPrice}{" "}
                  </del>
                )}
                <span className="font-serif text-2xl sm:text-3xl font-bold text-amber-300">
                  {pricing.displayPrice}
                </span>
                {activity.coversNote && (
                  <span className="rounded-full border border-pink-400/40 bg-pink-500/20 px-3 py-1 text-xs font-semibold text-pink-200">
                    {activity.coversNote}
                  </span>
                )}
              </div>

              {/* Turkish Lamp Options Direct Links */}
              {pricing.variants && pricing.variants.length > 1 && (
                <div className="mt-6 grid gap-3 sm:grid-cols-3 max-w-3xl">
                  {pricing.variants.map((v) => (
                    <div
                      key={v.id}
                      className="rounded-2xl border border-white/20 bg-white/10 p-4 flex flex-col justify-between backdrop-blur-sm"
                    >
                      <div>
                        <div className="font-semibold text-white text-sm">{v.title}</div>
                        <div className="mt-1 text-xs font-bold text-amber-300">{v.formattedPrice}</div>
                      </div>
                      <a
                        href={v.bookingUrl}
                        className="mt-3 inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 px-3 py-2 text-xs font-bold text-white shadow-md hover:from-pink-600 hover:to-purple-700 transition"
                      >
                        Book {v.title} →
                      </a>
                    </div>
                  ))}
                </div>
              )}

              {/* Top Booking CTA Button */}
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={openBooking}
                  className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 px-8 py-4 text-base font-bold text-white shadow-xl shadow-pink-500/25 transition-all duration-200 hover:scale-[1.02] hover:shadow-pink-500/40 focus:outline-none focus:ring-2 focus:ring-pink-400"
                  aria-haspopup="dialog"
                >
                  See Dates &amp; Book
                  <span className="ml-2 text-lg" aria-hidden="true">→</span>
                </button>
                <Link
                  href="/gift-cards"
                  className="inline-flex items-center justify-center rounded-2xl border border-white/20 bg-white/5 px-6 py-4 text-sm font-semibold text-white/90 backdrop-blur-sm transition hover:bg-white/10 hover:text-white"
                >
                  🎁 Give as a Gift
                </Link>
              </div>
            </div>

            {/* Right Column: Strong Activity Image */}
            <div className="lg:col-span-5">
              <div className="relative aspect-[4/3] sm:aspect-square overflow-hidden rounded-3xl border border-white/20 bg-white/5 shadow-2xl backdrop-blur-md">
                <Image
                  src={activity.image.path}
                  alt={activity.image.alt}
                  fill
                  priority
                  sizes="(min-width: 1024px) 480px, 100vw"
                  className="object-cover"
                  style={{ objectPosition: activity.image.focalPosition || "center" }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Layout */}
      <div className="mx-auto max-w-7xl px-6 py-16 sm:py-24">
        <div className="grid gap-16 lg:grid-cols-12">
          {/* Left Column: Details & Practical Info */}
          <div className="lg:col-span-8 space-y-16">
            {/* Value Highlights */}
            <section aria-labelledby="highlights-heading">
              <h2 id="highlights-heading" className="sr-only">Workshop Highlights</h2>
              <div className="grid gap-4 sm:grid-cols-3">
                {activity.valueCards.map((card, idx) => (
                  <Reveal key={idx} delay={idx * 80}>
                    <GlassCard className="p-5 h-full flex flex-col justify-between">
                      <div>
                        <div className="text-xs font-bold uppercase tracking-wider text-pink-400">
                          {card.label}
                        </div>
                        <h3 className="mt-2 font-serif text-lg font-bold text-white">
                          {card.title}
                        </h3>
                        <p className="mt-2 text-sm text-white/70 leading-relaxed">
                          {card.body}
                        </p>
                      </div>
                    </GlassCard>
                  </Reveal>
                ))}
              </div>
            </section>

            {/* What You Make / The Experience */}
            <section aria-labelledby="experience-heading" className="space-y-6">
              <div className="border-b border-white/10 pb-4">
                <h2 id="experience-heading" className="font-serif text-2xl sm:text-3xl font-bold text-white">
                  The Experience
                </h2>
                <p className="mt-2 text-base text-white/75">
                  What to expect when you step into the studio for {activity.title.toLowerCase()}.
                </p>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                {activity.theExperience.map((item, idx) => (
                  <div key={idx} className="rounded-2xl border border-white/10 bg-white/5 p-6">
                    <h3 className="font-serif text-lg font-bold text-white">
                      {item.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-white/80">
                      {item.body}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Pottery Kiln & Glazing Section (Only for pottery workshops) */}
            {activity.isPottery && (
              <PotteryFinishingSection />
            )}

            {/* Key Practical Info Grid */}
            <section aria-labelledby="practical-heading" className="space-y-6">
              <div className="border-b border-white/10 pb-4">
                <h2 id="practical-heading" className="font-serif text-2xl sm:text-3xl font-bold text-white">
                  Good to Know
                </h2>
                <p className="mt-2 text-base text-white/75">
                  Essential details about admission, timing, drinks, and studio location.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {/* Duration */}
                <div className="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/5 p-5">
                  <div className="rounded-xl bg-pink-500/20 p-3 text-pink-300 text-xl shrink-0">⏱️</div>
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wider text-white/50">Duration</div>
                    <div className="mt-1 font-semibold text-white text-sm sm:text-base">{activity.duration}</div>
                  </div>
                </div>

                {/* Admission */}
                <div className="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/5 p-5">
                  <div className="rounded-xl bg-purple-500/20 p-3 text-purple-300 text-xl shrink-0">🎟️</div>
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wider text-white/50">Admission</div>
                    <div className="mt-1 font-semibold text-white text-sm sm:text-base">
                      {activity.coversTwo ? "Admits 2 Guests" : "1 Participant"}
                    </div>
                  </div>
                </div>

                {/* Practical Info Items */}
                {activity.practicalInfo.map((info, idx) => (
                  <div key={idx} className="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/5 p-5">
                    <div className="rounded-xl bg-amber-500/20 p-3 text-amber-300 text-xl shrink-0">
                      {info.label.toLowerCase().includes("byob") ? "🍷" : "📍"}
                    </div>
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-wider text-white/50">{info.label}</div>
                      <div className="mt-1 text-sm text-white/80 leading-relaxed">{info.text}</div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Included in Workshop */}
            <section aria-labelledby="included-heading" className="space-y-4">
              <h2 id="included-heading" className="font-serif text-xl sm:text-2xl font-bold text-white">
                What&apos;s Included
              </h2>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <ul className="grid gap-3 sm:grid-cols-2">
                  {activity.included.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-3 text-sm text-white/80">
                      <span className="text-pink-400 font-bold">✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* FAQs */}
            {activity.faqs.length > 0 && (
              <section aria-labelledby="faqs-heading" className="space-y-6">
                <div className="border-b border-white/10 pb-4">
                  <h2 id="faqs-heading" className="font-serif text-2xl sm:text-3xl font-bold text-white">
                    Frequently Asked Questions
                  </h2>
                </div>
                <div className="space-y-4">
                  {activity.faqs.map((faq, idx) => (
                    <div key={idx} className="rounded-2xl border border-white/10 bg-white/5 p-6">
                      <h3 className="font-serif text-base sm:text-lg font-bold text-white">
                        {faq.q}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-white/75">
                        {faq.a}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Final CTA Banner */}
            <section className="rounded-3xl border border-pink-500/30 bg-gradient-to-r from-pink-900/40 via-purple-900/30 to-slate-900/40 p-8 text-center sm:p-12">
              <h2 className="font-serif text-2xl sm:text-4xl font-bold text-white">
                Ready to Create?
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-base text-white/80">
                Pick your studio location and reserve your spot in minutes. Direct studio booking with zero convenience fees.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <button
                  type="button"
                  onClick={openBooking}
                  className="rounded-full bg-gradient-to-r from-pink-500 to-purple-600 px-8 py-4 font-semibold text-white shadow-lg shadow-pink-500/30 transition hover:from-pink-600 hover:to-purple-700"
                  aria-haspopup="dialog"
                >
                  See Dates &amp; Book →
                </button>
              </div>
            </section>
          </div>

          {/* Right Column: Related Workshops & Navigation */}
          <div className="lg:col-span-4">
            <div className="sticky top-28 space-y-8">
              {/* Quick Booking Box */}
              <GlassCard className="p-6 text-center border-pink-500/30 shadow-lg">
                <div className="text-xs font-semibold uppercase tracking-wider text-pink-400">
                  Join A Session
                </div>
                <h3 className="mt-2 font-serif text-xl font-bold text-white">
                  {activity.title}
                </h3>
                <div className="mt-2 text-sm text-white/75 flex items-center justify-center gap-2">
                  {pricing.wasPrice && pricing.displayPrice !== "See price at checkout" && (
                    <del className="text-white/50 text-xs" aria-label="Original price">${pricing.wasPrice}</del>
                  )}
                  <span className="font-semibold text-amber-300">{pricing.displayPrice}</span>
                </div>
                {pricing.hasSaleBadge && (
                  <div className="mt-2">
                    <span className="inline-block rounded-full border border-amber-400/40 bg-amber-500/20 px-2.5 py-0.5 text-[11px] font-bold text-amber-200">
                      ⚡ Limited-Time Sale
                    </span>
                  </div>
                )}
                {pricing.variants && pricing.variants.length > 1 ? (
                  <div className="mt-4 space-y-2 text-left">
                    {pricing.variants.map((v) => (
                      <div key={v.id} className="rounded-xl border border-white/10 bg-white/5 p-3 flex items-center justify-between gap-2">
                        <div>
                          <div className="text-xs font-semibold text-white">{v.title}</div>
                          <div className="text-[11px] font-bold text-amber-300">{v.formattedPrice}</div>
                        </div>
                        <a
                          href={v.bookingUrl}
                          className="rounded-lg bg-pink-500 px-3 py-1.5 text-xs font-bold text-white hover:bg-pink-600 transition shrink-0"
                        >
                          Book →
                        </a>
                      </div>
                    ))}
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={openBooking}
                    className="mt-5 w-full inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 px-5 py-3 text-sm font-bold text-white shadow-md hover:from-pink-600 hover:to-purple-700 transition"
                    aria-haspopup="dialog"
                  >
                    See Dates &amp; Book →
                  </button>
                )}
              </GlassCard>

              {/* Related Activities */}
              {relatedActivities.length > 0 && (
                <div>
                  <h3 className="font-serif text-xl font-bold text-white">More Workshops</h3>
                  <p className="mt-1 text-sm text-white/60">You might also enjoy</p>
                  <div className="mt-4 space-y-3">
                    {relatedActivities.slice(0, 4).map((related) => (
                      <Link
                        key={related.slug}
                        href={`/activities/${related.slug}`}
                        className="group block"
                      >
                        <GlassCard className="p-4 transition hover:border-white/30 hover:bg-white/10">
                          <div className="flex items-center justify-between gap-2">
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="text-xs font-semibold text-pink-400 uppercase tracking-wide">
                                  {related.categoryLabel}
                                </span>
                                {related.adultThemed && (
                                  <span className="rounded bg-red-500/30 px-1 py-0.5 text-[10px] font-bold text-red-200">
                                    18+
                                  </span>
                                )}
                              </div>
                              <h4 className="mt-1 text-sm font-semibold text-white group-hover:text-pink-200 transition">
                                {related.title}
                              </h4>
                              <p className="mt-0.5 text-xs text-white/60">
                                {related.wasPrice && <del className="text-white/40 mr-1">${related.wasPrice}</del>}
                                {related.displayPrice}
                              </p>
                            </div>
                            <span className="text-white/40 group-hover:text-white transition">→</span>
                          </div>
                        </GlassCard>
                      </Link>
                    ))}
                  </div>

                  <div className="mt-4">
                    <Link
                      href="/activities"
                      className="block text-center text-xs text-white/60 hover:text-white underline"
                    >
                      View all workshops →
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Booking Bar */}
      <div className="fixed bottom-4 left-4 right-4 z-40 sm:hidden">
        <button
          type="button"
          onClick={openBooking}
          className="w-full flex items-center justify-between rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 px-6 py-3.5 text-sm font-bold text-white shadow-2xl shadow-pink-500/50 backdrop-blur-md active:scale-95 transition"
          aria-haspopup="dialog"
        >
          <span>{activity.title}</span>
          <span className="inline-flex items-center gap-1 font-semibold">
            See Dates &amp; Book →
          </span>
        </button>
      </div>

      {/* Location Selection Panel (Modal) */}
      <LocationModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        activityTitle={activity.title}
        activitySlug={activity.slug}
        locations={pricing.destinations}
        variants={pricing.variants}
      />
    </>
  );
}
