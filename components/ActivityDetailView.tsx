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

export default function ActivityDetailView({
  activity,
  relatedActivities = []
}: {
  activity: ActivityDetail;
  relatedActivities?: ActivityDetail[];
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
                <span className="font-serif text-2xl sm:text-3xl font-bold text-amber-300">
                  {activity.ticketPriceDisplay}
                </span>
                {activity.coversNote && (
                  <span className="rounded-full border border-pink-400/40 bg-pink-500/20 px-3 py-1 text-xs font-semibold text-pink-200">
                    {activity.coversNote}
                  </span>
                )}
              </div>

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

      {/* Main Content Area */}
      <div className="mx-auto max-w-7xl px-6 py-16 sm:py-20">
        <div className="grid gap-12 lg:grid-cols-12">
          {/* Main Content Column */}
          <div className="lg:col-span-8">
            {/* Key Information Bar */}
            <section className="mb-14" aria-labelledby="key-info-title">
              <h2 id="key-info-title" className="sr-only">Key Workshop Information</h2>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <GlassCard className="p-4 sm:p-5 text-center">
                  <span className="text-2xl" role="img" aria-hidden="true">⏱️</span>
                  <div className="mt-2 text-xs font-semibold uppercase tracking-wider text-white/50">Duration</div>
                  <div className="mt-1 font-semibold text-white text-sm sm:text-base">{activity.duration}</div>
                </GlassCard>

                <GlassCard className="p-4 sm:p-5 text-center">
                  <span className="text-2xl" role="img" aria-hidden="true">✨</span>
                  <div className="mt-2 text-xs font-semibold uppercase tracking-wider text-white/50">Skill Level</div>
                  <div className="mt-1 font-semibold text-white text-sm sm:text-base">
                    {activity.beginnerFriendly ? "Beginner Friendly" : "All Levels"}
                  </div>
                </GlassCard>

                <GlassCard className="p-4 sm:p-5 text-center">
                  <span className="text-2xl" role="img" aria-hidden="true">🎟️</span>
                  <div className="mt-2 text-xs font-semibold uppercase tracking-wider text-white/50">Admission</div>
                  <div className="mt-1 font-semibold text-white text-sm sm:text-base">
                    {activity.coversTwo ? "Admits 2 Guests" : "1 Participant"}
                  </div>
                </GlassCard>

                <GlassCard className="p-4 sm:p-5 text-center">
                  <span className="text-2xl" role="img" aria-hidden="true">📍</span>
                  <div className="mt-2 text-xs font-semibold uppercase tracking-wider text-white/50">Location</div>
                  <div className="mt-1 font-semibold text-white text-sm sm:text-base">{activity.locationsOffered}</div>
                </GlassCard>
              </div>

              {activity.coversTwo && (
                <div className="mt-4 rounded-xl border border-pink-500/30 bg-pink-500/10 p-4 text-center sm:text-left">
                  <p className="text-sm font-medium text-pink-200">
                    <span className="font-bold">Note for pairs:</span> One ticket reservation admits two participants sharing one wheel or workstation.
                  </p>
                </div>
              )}
            </section>

            {/* The Experience */}
            <section className="mb-14" aria-labelledby="the-experience-title">
              <h2 id="the-experience-title" className="font-serif text-3xl font-bold text-white">
                The Workshop Experience
              </h2>
              <div className="mt-6 space-y-6">
                {activity.theExperience.map((exp, idx) => (
                  <GlassCard key={idx} className="p-6 sm:p-8">
                    <h3 className="font-serif text-xl font-bold text-white mb-2">{exp.title}</h3>
                    <p className="text-base leading-relaxed text-white/80">{exp.body}</p>
                  </GlassCard>
                ))}
              </div>
            </section>

            {/* What's Included */}
            <section className="mb-14" aria-labelledby="included-title">
              <h2 id="included-title" className="font-serif text-3xl font-bold text-white">
                What’s Included
              </h2>
              <div className="mt-6 rounded-2xl border border-white/15 bg-white/5 p-6 sm:p-8">
                <ul className="grid gap-3 sm:grid-cols-2 text-white/85 text-sm sm:text-base">
                  {activity.included.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="text-pink-400 font-bold" aria-hidden="true">✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* Practical Information */}
            <section className="mb-14" aria-labelledby="practical-info-title">
              <h2 id="practical-info-title" className="font-serif text-3xl font-bold text-white">
                Practical Information
              </h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {activity.practicalInfo.map((info, idx) => (
                  <GlassCard key={idx} className="p-5">
                    <div className="text-xs font-semibold uppercase tracking-wider text-pink-400">
                      {info.label}
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-white/80">{info.text}</p>
                  </GlassCard>
                ))}
              </div>
            </section>

            {/* Optional Pottery Firing & Glazing Section (for applicable pottery classes) */}
            {activity.isPottery && <PotteryFinishingSection />}

            {/* FAQs */}
            <section className="mb-14" aria-labelledby="faqs-title">
              <h2 id="faqs-title" className="font-serif text-3xl font-bold text-white">
                Frequently Asked Questions
              </h2>
              <div className="mt-6 space-y-4">
                {activity.faqs.map((faq, idx) => (
                  <GlassCard key={idx} className="p-6">
                    <h3 className="font-serif text-lg font-semibold text-white">{faq.q}</h3>
                    <p className="mt-2 text-sm sm:text-base leading-relaxed text-white/75">{faq.a}</p>
                  </GlassCard>
                ))}
              </div>
            </section>

            {/* Bottom Call to Action Section */}
            <section className="my-14 rounded-3xl border border-pink-500/30 bg-gradient-to-br from-pink-900/30 via-purple-900/40 to-slate-900/60 p-8 sm:p-12 text-center shadow-2xl backdrop-blur-xl">
              <h2 className="font-serif text-3xl font-bold text-white sm:text-4xl">
                Ready to Create?
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-base text-white/80">
                Direct booking with zero platform fees. Choose your preferred studio location to view real-time dates and secure your spot.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                <button
                  type="button"
                  onClick={openBooking}
                  className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 px-8 py-4 text-base font-bold text-white shadow-xl shadow-pink-500/30 transition hover:scale-[1.02] hover:shadow-pink-500/50 focus:outline-none focus:ring-2 focus:ring-pink-400"
                  aria-haspopup="dialog"
                >
                  See Dates &amp; Book
                  <span className="ml-2 text-lg" aria-hidden="true">→</span>
                </button>
                <Link
                  href="/activities"
                  className="inline-flex items-center justify-center rounded-2xl border border-white/20 bg-white/10 px-6 py-4 text-sm font-semibold text-white transition hover:bg-white/20"
                >
                  Browse Other Workshops
                </Link>
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
                <p className="mt-2 text-sm text-white/75">
                  {activity.ticketPriceDisplay}
                </p>
                <button
                  type="button"
                  onClick={openBooking}
                  className="mt-5 w-full inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 px-5 py-3 text-sm font-bold text-white shadow-md hover:from-pink-600 hover:to-purple-700 transition"
                  aria-haspopup="dialog"
                >
                  See Dates &amp; Book →
                </button>
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
                                {related.ticketPriceDisplay}
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
        locations={activity.destinations}
      />
    </>
  );
}
