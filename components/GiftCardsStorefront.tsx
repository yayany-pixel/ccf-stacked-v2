"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import GlassCard from "@/components/ui/GlassCard";
import TagPill from "@/components/ui/TagPill";
import BookingLink from "@/components/BookingLink";
import PotteryFinishingSection from "@/components/PotteryFinishingSection";
import type { CityParam } from "@/lib/config";
import { STUDIO_LOCATIONS } from "@/lib/locations";
import { PRICING } from "@/lib/constants";
import {
  ACUITY_GIFT_CARDS_CATALOG_URL,
  GIFT_FAQS,
  MANUAL_ACUITY_SETUP_SPECS,
  VERIFIED_CHICAGO_GIFT_WORKSHOPS,
  type GiftExperienceCardData,
  type GiftExperienceId,
} from "@/lib/gifts";
import {
  trackCardSelect,
  trackCitySelection,
  trackEvent,
} from "@/lib/analytics";

export interface GiftCardsStorefrontProps {
  experiences: GiftExperienceCardData[];
  initialCity?: CityParam;
  initialGiftId?: GiftExperienceId | null;
  initialWorkshopSlug?: string | null;
  initialAmount?: number | null;
}

export default function GiftCardsStorefront({
  experiences,
  initialCity = "chicago",
  initialGiftId = null,
  initialWorkshopSlug = null,
  initialAmount = null,
}: GiftCardsStorefrontProps) {
  const [city, setCity] = useState<CityParam>(initialCity);
  const [highlightedGift, setHighlightedGift] =
    useState<GiftExperienceId | null>(initialGiftId);
  const [highlightedWorkshopSlug, setHighlightedWorkshopSlug] = useState<
    string | null
  >(initialWorkshopSlug);
  const [selectedAmount, setSelectedAmount] = useState<number>(
    initialAmount && [50, 100, 150, 200, 250].includes(initialAmount)
      ? initialAmount
      : 100,
  );
  const [studioConfirmed, setStudioConfirmed] = useState<boolean>(true);

  // Printable keepsake gift card state
  const [recipientName, setRecipientName] = useState("");
  const [senderName, setSenderName] = useState("");
  const [certificateGiftLabel, setCertificateGiftLabel] = useState(
    "Pottery Date Night for Two",
  );
  const [personalMessage, setPersonalMessage] = useState(
    "Can’t wait to see what you make on the wheel! Pick any date that works for you.",
  );
  const [certificateCode, setCertificateCode] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const urlCity = params.get("city") || params.get("location");
    const urlGift = params.get("gift") as GiftExperienceId | null;
    const urlWorkshop = params.get("workshop");
    const urlAmount = Number(params.get("amount"));

    if (urlCity === "chicago" || urlCity === "eugene") {
      setCity(urlCity);
      try {
        localStorage.setItem("preferredCity", urlCity);
        localStorage.setItem("ccf-city", urlCity);
      } catch {}
    } else {
      try {
        const stored =
          localStorage.getItem("preferredCity") ||
          localStorage.getItem("ccf-city");
        if (stored === "chicago" || stored === "eugene") {
          setCity(stored);
        }
      } catch {}
    }

    if (
      urlGift &&
      [
        "pottery-date-night-for-two",
        "their-first-pottery-class",
        "let-them-choose",
      ].includes(urlGift)
    ) {
      setHighlightedGift(urlGift);
      if (urlGift === "pottery-date-night-for-two") {
        setCertificateGiftLabel("Pottery Date Night for Two");
      } else if (urlGift === "their-first-pottery-class") {
        setCertificateGiftLabel("Their First Pottery Class");
      } else {
        setCertificateGiftLabel("Let Them Choose — Studio Gift Certificate");
      }
    }

    if (urlWorkshop) {
      setHighlightedWorkshopSlug(urlWorkshop);
    }

    if (
      Number.isFinite(urlAmount) &&
      [50, 100, 150, 200, 250].includes(urlAmount)
    ) {
      setSelectedAmount(urlAmount);
    }
  }, []);

  const handleCitySelect = useCallback(
    (nextCity: CityParam, source: string = "gift_storefront_toggle") => {
      if (nextCity === city) return;
      const previous = city;
      setCity(nextCity);
      setStudioConfirmed(true);
      trackCitySelection({
        city: nextCity,
        previous_city: previous,
        placement: "gift_cards_page",
        selection_source: source,
      });
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("preferredCity", nextCity);
          localStorage.setItem("ccf-city", nextCity);
        } catch {}
        const url = new URL(window.location.href);
        url.searchParams.set("city", nextCity);
        window.history.replaceState(window.history.state, "", url);
        window.dispatchEvent(new Event("ccf-city-change"));
      }
    },
    [city],
  );

  const studio = STUDIO_LOCATIONS[city];

  const experienceCards = useMemo(
    () => experiences.filter((e) => e.isExperienceCard),
    [experiences],
  );
  const dollarCard = useMemo(
    () => experiences.find((e) => e.id === "let-them-choose")!,
    [experiences],
  );
  const dollarOffering = dollarCard.offerings[city];
  const denominations = dollarOffering.denominations ?? [];
  const activeDenomination =
    denominations.find((d) => d.amount === selectedAmount) ??
    denominations[1] ??
    denominations[0] ??
    null;

  const highlightedWorkshop = useMemo(() => {
    if (!highlightedWorkshopSlug) return null;
    const normalized =
      highlightedWorkshopSlug === "handbuilding"
        ? "mug-and-bowl"
        : highlightedWorkshopSlug;
    return (
      VERIFIED_CHICAGO_GIFT_WORKSHOPS.find((w) => w.slug === normalized) ?? null
    );
  }, [highlightedWorkshopSlug]);

  const handleExploreClick = () => {
    trackEvent("cta_click", {
      event_category: "CTA",
      cta_location: "Gift Cards Hero",
      cta_text: "Explore Gift Experiences",
      cta_type: "primary",
      city,
    });
    const el = document.getElementById("gift-experiences");
    el?.scrollIntoView({ behavior: "smooth" });
  };

  const handlePrintCertificate = () => {
    trackEvent("cta_click", {
      event_category: "CTA",
      cta_location: "Gift Cards Printable Builder",
      cta_text: "Print Keepsake Gift Certificate",
      cta_type: "secondary",
      city,
    });
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-14">
      {/* Print-only stylesheet so printing produces a clean single-page certificate */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @media print {
              body * {
                visibility: hidden;
              }
              #printable-gift-certificate-card,
              #printable-gift-certificate-card * {
                visibility: visible;
              }
              #printable-gift-certificate-card {
                position: fixed;
                inset: 24px;
                background: #fffdf8 !important;
                color: #241f19 !important;
                border: 2px solid #302c25 !important;
                border-radius: 16px !important;
                padding: 36px !important;
                box-shadow: none !important;
              }
            }
          `,
        }}
      />

      {/* 1. Hero Section with exact required copy */}
      <GlassCard className="relative overflow-hidden p-8 sm:p-12 border-pink-400/25">
        <div className="sparkle-noise absolute inset-0 opacity-15 pointer-events-none" />
        <div className="relative z-10 grid gap-8 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-7">
            <div className="flex flex-wrap items-center gap-2">
              <TagPill>🎁 Experience-First Gifting</TagPill>
              <TagPill subtle>No Date Needed Today</TagPill>
              <TagPill subtle>Never Expires</TagPill>
            </div>

            <h1 className="mt-5 font-serif text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
              Give them something to look forward to.
            </h1>

            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/90 sm:text-xl">
              A first spin on the pottery wheel. A date together. Something
              beautiful made by hand. Choose their experience—let them choose
              the date.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={handleExploreClick}
                className="btn-interactive inline-flex items-center justify-center rounded-full bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 px-8 py-4 text-base font-bold text-white shadow-xl shadow-pink-500/30 transition hover:scale-[1.02] hover:shadow-pink-500/50 focus:outline-none focus:ring-2 focus:ring-pink-300"
              >
                Explore Gift Experiences
                <span className="ml-2 text-lg" aria-hidden="true">
                  ↓
                </span>
              </button>
              <a
                href="#let-them-choose"
                onClick={() =>
                  trackEvent("cta_click", {
                    event_category: "CTA",
                    cta_location: "Gift Cards Hero",
                    cta_text: "Choose a Gift Amount",
                    cta_type: "secondary",
                    city,
                  })
                }
                className="inline-flex items-center justify-center rounded-full border border-white/25 bg-white/10 px-6 py-4 text-sm font-semibold text-white transition hover:bg-white/15"
              >
                Flexible Dollar Gift Cards ($50–$250) →
              </a>
            </div>
          </div>

          {/* Studio Selection & Confirmation Card */}
          <div className="lg:col-span-5">
            <div
              className="rounded-3xl border border-white/20 bg-black/35 p-6 backdrop-blur-md"
              role="region"
              aria-labelledby="recipient-studio-heading"
            >
              <div className="text-xs font-bold uppercase tracking-wider text-pink-300">
                Step 1 · Confirm Recipient’s Studio
              </div>
              <h2
                id="recipient-studio-heading"
                className="mt-1 font-serif text-xl font-bold text-white"
              >
                Where will they attend class?
              </h2>
              <p className="mt-1.5 text-xs leading-relaxed text-white/75">
                Chicago and Eugene have separate studio calendars and class
                pricing. Select your recipient’s studio before checkout.
              </p>

              <div
                className="mt-4 grid grid-cols-2 gap-3"
                role="group"
                aria-label="Choose recipient studio location"
              >
                {(["chicago", "eugene"] as const).map((option) => {
                  const isSelected = city === option;
                  const loc = STUDIO_LOCATIONS[option];
                  return (
                    <button
                      key={option}
                      type="button"
                      aria-pressed={isSelected}
                      onClick={() => handleCitySelect(option)}
                      className={`flex flex-col items-start rounded-2xl border p-3.5 text-left transition ${
                        isSelected
                          ? "border-pink-400 bg-gradient-to-br from-pink-500/30 to-purple-600/30 text-white shadow-lg shadow-pink-500/20"
                          : "border-white/15 bg-white/5 text-white/75 hover:border-white/30 hover:bg-white/10"
                      }`}
                    >
                      <span className="flex w-full items-center justify-between text-sm font-bold">
                        <span>{loc.label}</span>
                        {isSelected && (
                          <span
                            className="rounded-full bg-pink-500 px-2 py-0.5 text-[10px] font-bold text-white"
                            aria-hidden="true"
                          >
                            Selected
                          </span>
                        )}
                      </span>
                      <span className="mt-1 text-[11px] leading-snug text-white/70">
                        {loc.streetAddress}, {loc.addressRegion}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-3.5 text-xs text-white/85">
                <div className="font-semibold text-white">
                  📍 Active Studio: {studio.label} ({studio.address})
                </div>
                {city === "chicago" ? (
                  <p className="mt-1 text-white/75">
                    <strong className="text-emerald-300">
                      ✓ Live Acuity Gift Certificates Verified:
                    </strong>{" "}
                    $50–$250 Chicago Gift Cards are active and redeemable across
                    19 Chicago workshops. Dedicated $55 Date Night &amp; $45
                    Beginner Wheel single-class certificates are documented
                    below for manual Acuity Admin setup.
                  </p>
                ) : (
                  <p className="mt-1 text-amber-200/95">
                    <strong>⚠️ Eugene Acuity Setup Status:</strong> Existing
                    Acuity gift certificates (#2119866–#2119873) are currently
                    linked only to Chicago appointment types. Eugene purchase
                    buttons are disabled until Eugene appointment types are
                    enabled in Acuity Admin.
                  </p>
                )}
              </div>

              <label className="mt-4 flex cursor-pointer items-start gap-2.5 text-xs text-white/85">
                <input
                  type="checkbox"
                  checked={studioConfirmed}
                  onChange={(e) => setStudioConfirmed(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-white/30 bg-white/10 text-pink-500 focus:ring-pink-400"
                />
                <span>
                  I confirm my recipient will attend at the{" "}
                  <strong className="text-white">
                    {studio.label} ({studio.address})
                  </strong>{" "}
                  studio.
                </span>
              </label>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Contextual banner when arriving from a specific class page */}
      {highlightedWorkshop && (
        <div
          className="rounded-2xl border border-pink-400/40 bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-indigo-500/20 p-5 text-sm text-white shadow-lg"
          role="status"
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="inline-block rounded-full bg-pink-500/30 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider text-pink-200">
                Gifting Selected Workshop
              </span>
              <h2 className="mt-1 font-serif text-xl font-bold text-white">
                Gifting: {highlightedWorkshop.title} ({studio.label})
              </h2>
              <p className="mt-1 text-white/85">
                Verified studio price:{" "}
                <strong>
                  ${highlightedWorkshop.price} {highlightedWorkshop.priceUnit}
                </strong>{" "}
                (covers {highlightedWorkshop.guestsCovered}{" "}
                {highlightedWorkshop.guestsCovered === 2 ? "guests" : "guest"}
                ). Choose the matching gift experience or recommended{" "}
                <strong>
                  $
                  {highlightedWorkshop.price <= 50
                    ? 50
                    : highlightedWorkshop.price <= 100
                      ? 100
                      : 150}{" "}
                  Gift Card
                </strong>{" "}
                below.
              </p>
            </div>
            <a
              href={
                highlightedGift
                  ? `#${highlightedGift}`
                  : "#gift-experiences"
              }
              className="rounded-full bg-white px-5 py-2.5 text-xs font-bold text-slate-900 transition hover:bg-pink-100"
            >
              Jump to Matching Gift ↓
            </a>
          </div>
        </div>
      )}

      {/* 2. Experience Gift Cards Section (Presented BEFORE Dollar-Value Cards) */}
      <section
        id="gift-experiences"
        aria-labelledby="gift-experiences-heading"
        className="scroll-mt-24 space-y-8"
      >
        <div className="flex flex-col justify-between gap-4 border-b border-white/10 pb-5 md:flex-row md:items-end">
          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-pink-300">
              Signature Studio Experiences · {studio.label}
            </div>
            <h2
              id="gift-experiences-heading"
              className="mt-2 font-serif text-3xl font-bold text-white sm:text-4xl"
            >
              Gift a Hands-On Pottery Experience
            </h2>
            <p className="mt-2 max-w-2xl text-base text-white/80">
              Thoughtful, story-driven workshops designed for couples and
              first-time makers at our {studio.label} studio. They pick any open
              session date when they’re ready.
            </p>
          </div>
          <div className="text-xs text-white/65">
            Showing verified pricing &amp; eligibility for{" "}
            <strong className="text-white">{studio.label}</strong>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {experienceCards.map((card, idx) => {
            const offering = card.offerings[city];
            const isHighlighted = highlightedGift === card.id;
            const isReadyToBuy =
              offering.status === "active" &&
              Boolean(offering.purchaseUrl) &&
              studioConfirmed;

            return (
              <GlassCard
                key={card.id}
                id={card.id}
                className={`scroll-mt-28 flex flex-col justify-between overflow-hidden p-0 transition ${
                  isHighlighted
                    ? "ring-2 ring-pink-400 border-pink-400/50"
                    : "border-white/15"
                }`}
              >
                <div>
                  {/* Authentic Studio Photograph */}
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-black/40">
                    <Image
                      src={offering.photo.path}
                      alt={offering.photo.alt}
                      fill
                      sizes="(min-width: 1024px) 520px, 100vw"
                      className="object-cover"
                      style={{ objectPosition: offering.photo.focalPosition }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
                    <div className="absolute top-4 left-4 right-4 flex flex-wrap items-center justify-between gap-2">
                      <span className="rounded-full bg-black/70 px-3 py-1 text-xs font-bold text-white backdrop-blur-md">
                        📍 {offering.studioLabel}
                      </span>
                      <span className="rounded-full bg-pink-500/90 px-3 py-1 text-xs font-bold text-white shadow">
                        🎟️ Covers {offering.guestsCoveredLabel}
                      </span>
                    </div>
                    <div className="absolute bottom-4 left-6 right-6 flex items-baseline justify-between gap-4">
                      <div>
                        <h3 className="font-serif text-2xl font-bold text-white sm:text-3xl">
                          {card.title}
                        </h3>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="font-serif text-3xl font-bold text-amber-300">
                          {offering.formattedPrice}
                        </div>
                        <div className="text-[11px] font-medium text-white/80">
                          {offering.priceUnitLabel}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="space-y-5 p-6 sm:p-7">
                    <p className="font-serif text-lg italic leading-relaxed text-white/95">
                      “{card.supportingCopy}”
                    </p>

                    {/* Key Metadata Grid */}
                    <div className="grid grid-cols-2 gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 text-xs">
                      <div>
                        <div className="font-semibold uppercase tracking-wider text-white/50">
                          Guests Covered
                        </div>
                        <div className="mt-1 font-bold text-white">
                          {offering.guestsCoveredLabel}
                        </div>
                      </div>
                      <div>
                        <div className="font-semibold uppercase tracking-wider text-white/50">
                          Eligible Studio
                        </div>
                        <div className="mt-1 font-bold text-white">
                          {offering.studioLabel}
                        </div>
                        <div className="text-[11px] text-white/65">
                          {offering.studioAddress}
                        </div>
                      </div>
                      <div className="col-span-2 border-t border-white/10 pt-2.5">
                        <div className="font-semibold uppercase tracking-wider text-white/50">
                          Redeemable Acuity Class
                        </div>
                        <ul className="mt-1 space-y-1 text-white/90">
                          {offering.eligibleAppointmentTypes.map((apt) => (
                            <li key={apt.id}>
                              <strong>{apt.name}</strong> (Acuity ID #{apt.id} ·
                              ${apt.price} {apt.unit})
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* What Is Included */}
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-pink-300">
                        What’s Included
                      </h4>
                      <ul className="mt-2.5 space-y-2 text-sm text-white/85">
                        {offering.included.map((item) => (
                          <li key={item} className="flex items-start gap-2.5">
                            <span
                              className="mt-0.5 text-emerald-400 font-bold"
                              aria-hidden="true"
                            >
                              ✓
                            </span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Additional Finishing Costs Disclosure */}
                    <div className="rounded-2xl border border-amber-300/25 bg-amber-500/10 p-4 text-xs leading-relaxed text-amber-100/90">
                      <div className="font-bold uppercase tracking-wider text-amber-300">
                        Pottery Kiln Firing &amp; Glazing (Optional · Extra)
                      </div>
                      <p className="mt-1.5">{offering.finishingDisclosure}</p>
                    </div>
                  </div>
                </div>

                {/* Purchase CTA Footer */}
                <div className="border-t border-white/10 bg-black/25 p-6 sm:p-7 space-y-4">
                  {isReadyToBuy && offering.purchaseUrl ? (
                    <BookingLink
                      href={offering.purchaseUrl}
                      city={city}
                      classNameText={`${card.title} (${offering.studioLabel})`}
                      classId={String(offering.acuityProductId ?? card.id)}
                      appointmentTypeId={String(
                        offering.eligibleAppointmentTypes[0]?.id ?? "",
                      )}
                      cardPosition={idx + 1}
                      displayedPrice={offering.price}
                      ctaLocation="Gift Cards Experience Card"
                      ctaType="primary"
                      className="btn-interactive flex w-full items-center justify-between rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 px-6 py-4 text-base font-bold text-white shadow-xl shadow-pink-500/25 transition hover:shadow-pink-500/40"
                    >
                      <span>{card.buttonLabel}</span>
                      <span>
                        {offering.formattedPrice} · {offering.studioLabel} →
                      </span>
                    </BookingLink>
                  ) : (
                    <div className="space-y-3">
                      <button
                        type="button"
                        disabled
                        aria-disabled="true"
                        className="flex w-full cursor-not-allowed items-center justify-between rounded-2xl border border-white/15 bg-white/10 px-6 py-4 text-base font-bold text-white/55"
                      >
                        <span>{card.buttonLabel}</span>
                        <span className="rounded-full border border-amber-300/40 bg-amber-500/20 px-3 py-1 text-xs font-semibold text-amber-200">
                          {!studioConfirmed
                            ? "Confirm Studio Above"
                            : "Acuity Setup Pending"}
                        </span>
                      </button>

                      {offering.pendingSetupReason && (
                        <div className="rounded-xl border border-white/15 bg-white/5 p-3.5 text-xs leading-relaxed text-white/80">
                          <p>{offering.pendingSetupReason}</p>
                          <a
                            href="#manual-acuity-setup"
                            className="mt-1.5 inline-block font-semibold text-pink-300 underline hover:text-pink-200"
                          >
                            View exact manual Acuity setup specs ↓
                          </a>
                        </div>
                      )}

                      {/* Verified Active Dollar-Value Certificate Alternative in Chicago */}
                      {offering.verifiedDollarAlternative && studioConfirmed && (
                        <div className="rounded-2xl border border-emerald-400/35 bg-emerald-500/15 p-4 text-xs text-emerald-50">
                          <div className="font-bold text-emerald-300">
                            ✓ Available to Buy Right Now in Chicago:
                          </div>
                          <p className="mt-1 leading-relaxed text-white/90">
                            {offering.verifiedDollarAlternative.explanation}
                          </p>
                          <div className="mt-3">
                            <BookingLink
                              href={
                                offering.verifiedDollarAlternative.purchaseUrl
                              }
                              city={city}
                              classNameText={`${offering.verifiedDollarAlternative.name} for ${card.title}`}
                              classId={String(
                                offering.verifiedDollarAlternative.productId,
                              )}
                              appointmentTypeId={String(
                                offering.eligibleAppointmentTypes[0]?.id ?? "",
                              )}
                              cardPosition={idx + 1}
                              displayedPrice={
                                offering.verifiedDollarAlternative.amount
                              }
                              ctaLocation="Gift Cards Verified Dollar Alternative"
                              ctaType="secondary"
                              className="inline-flex w-full items-center justify-center rounded-xl bg-emerald-500 px-4 py-3 text-sm font-bold text-slate-950 shadow-md transition hover:bg-emerald-400"
                            >
                              Buy Active{" "}
                              {offering.verifiedDollarAlternative.name} (Covers{" "}
                              {card.title} + $
                              {
                                offering.verifiedDollarAlternative
                                  .remainingBalance
                              }{" "}
                              Credit) →
                            </BookingLink>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </GlassCard>
            );
          })}
        </div>
      </section>

      {/* 3. "Let Them Choose" Dollar-Value Gift Cards Section */}
      <section
        id="let-them-choose"
        aria-labelledby="let-them-choose-heading"
        className="scroll-mt-24"
      >
        <GlassCard
          className={`overflow-hidden p-0 transition ${
            highlightedGift === "let-them-choose"
              ? "ring-2 ring-pink-400 border-pink-400/50"
              : "border-white/15"
          }`}
        >
          <div className="grid lg:grid-cols-12">
            {/* Left Column: Photo & Overview */}
            <div className="flex flex-col justify-between border-b border-white/10 lg:col-span-5 lg:border-b-0 lg:border-r">
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-black/40">
                <Image
                  src={dollarOffering.photo.path}
                  alt={dollarOffering.photo.alt}
                  fill
                  sizes="(min-width: 1024px) 460px, 100vw"
                  className="object-cover"
                  style={{ objectPosition: dollarOffering.photo.focalPosition }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
                <div className="absolute top-4 left-4 right-4 flex flex-wrap items-center justify-between gap-2">
                  <span className="rounded-full bg-black/70 px-3 py-1 text-xs font-bold text-white backdrop-blur-md">
                    📍 {dollarOffering.studioLabel}
                  </span>
                  <span className="rounded-full bg-purple-500/90 px-3 py-1 text-xs font-bold text-white">
                    💳 Monetary Studio Credit
                  </span>
                </div>
                <div className="absolute bottom-4 left-6 right-6">
                  <h2
                    id="let-them-choose-heading"
                    className="font-serif text-3xl font-bold text-white"
                  >
                    {dollarCard.title}
                  </h2>
                  <p className="mt-1 text-sm font-medium text-amber-300">
                    {dollarOffering.formattedPrice} ·{" "}
                    {dollarOffering.priceUnitLabel}
                  </p>
                </div>
              </div>

              <div className="space-y-5 p-6 sm:p-8">
                <p className="font-serif text-lg italic leading-relaxed text-white/95">
                  “{dollarCard.supportingCopy}”
                </p>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-xs space-y-2">
                  <div className="font-bold uppercase tracking-wider text-pink-300">
                    Monetary Credit vs. Complete Experience
                  </div>
                  <p className="leading-relaxed text-white/85">
                    Unlike a single-class experience voucher, a dollar-value
                    gift certificate applies its exact dollar balance toward
                    eligible {dollarOffering.studioLabel} workshops.{" "}
                    <strong>
                      A dollar-value certificate only covers a full workshop
                      when its balance is at least the advertised class price.
                    </strong>{" "}
                    If a class costs more than the certificate, the recipient
                    simply pays the difference at checkout; if it costs less,
                    the unused balance stays on the code for next time.
                  </p>
                </div>

                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-pink-300">
                    What’s Included &amp; Terms
                  </h3>
                  <ul className="mt-2.5 space-y-2 text-sm text-white/85">
                    {dollarOffering.included.map((item) => (
                      <li key={item} className="flex items-start gap-2.5">
                        <span
                          className="mt-0.5 text-emerald-400 font-bold"
                          aria-hidden="true"
                        >
                          ✓
                        </span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-2xl border border-amber-300/25 bg-amber-500/10 p-4 text-xs leading-relaxed text-amber-100/90">
                  <div className="font-bold uppercase tracking-wider text-amber-300">
                    Materials &amp; Pottery Finishing Costs
                  </div>
                  <p className="mt-1">{dollarOffering.finishingDisclosure}</p>
                </div>
              </div>
            </div>

            {/* Right Column: Denomination Picker, Checkout Button & Eligible Classes */}
            <div className="flex flex-col justify-between p-6 sm:p-8 lg:col-span-7 space-y-6">
              {dollarOffering.status === "active" &&
              denominations.length > 0 ? (
                <div className="space-y-6">
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-pink-300">
                      Choose Your Gift Card Amount · {dollarOffering.studioLabel}
                    </div>
                    <h3 className="mt-1 font-serif text-2xl font-bold text-white">
                      Select a Verified Acuity Denomination
                    </h3>
                    <p className="mt-1 text-sm text-white/75">
                      Each button below links directly to its real, redeemable
                      Acuity Gift Certificate product for{" "}
                      <strong>{dollarOffering.studioLabel}</strong> (
                      {dollarOffering.studioAddress}).
                    </p>
                  </div>

                  {/* Denomination Pills */}
                  <div
                    className="grid grid-cols-2 gap-3 sm:grid-cols-5"
                    role="group"
                    aria-label="Select gift certificate dollar amount"
                  >
                    {denominations.map((denom) => {
                      const isSelected =
                        activeDenomination?.amount === denom.amount;
                      return (
                        <button
                          key={denom.productId}
                          type="button"
                          aria-pressed={isSelected}
                          onClick={() => {
                            setSelectedAmount(denom.amount);
                            trackCardSelect({
                              city,
                              class_name: denom.name,
                              class_id: String(denom.productId),
                              class_category: "gift_card",
                              displayed_price: denom.amount,
                              click_target: "select_denomination",
                              placement: "gift_cards_page",
                            });
                          }}
                          className={`flex flex-col items-center justify-center rounded-2xl border p-4 text-center transition ${
                            isSelected
                              ? "border-pink-400 bg-gradient-to-b from-pink-500/35 to-purple-600/35 text-white shadow-lg shadow-pink-500/20"
                              : "border-white/15 bg-white/5 text-white/80 hover:border-white/30 hover:bg-white/10"
                          }`}
                        >
                          <span className="font-serif text-2xl font-bold">
                            {denom.formattedPrice}
                          </span>
                          <span className="mt-1 text-[11px] text-white/65">
                            ID #{denom.productId}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Selected Denomination Coverage Detail & Direct Purchase Button */}
                  {activeDenomination && (
                    <div className="rounded-2xl border border-pink-400/30 bg-black/30 p-5 space-y-4">
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <div>
                          <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                            ✓ Verified Acuity Product #{activeDenomination.productId}
                          </span>
                          <h4 className="font-serif text-2xl font-bold text-white">
                            {activeDenomination.name} ({dollarOffering.studioLabel})
                          </h4>
                        </div>
                        <div className="font-serif text-3xl font-bold text-amber-300">
                          {activeDenomination.formattedPrice}.00
                        </div>
                      </div>

                      <p className="text-sm leading-relaxed text-white/85">
                        <strong className="text-white">
                          What {activeDenomination.formattedPrice} covers in{" "}
                          {dollarOffering.studioLabel}:
                        </strong>{" "}
                        {activeDenomination.coverageSummary}
                      </p>

                      {studioConfirmed ? (
                        <div className="flex flex-col gap-3 sm:flex-row">
                          <BookingLink
                            href={activeDenomination.purchaseUrl}
                            city={city}
                            classNameText={`${activeDenomination.name} (${dollarOffering.studioLabel})`}
                            classId={String(activeDenomination.productId)}
                            cardPosition={3}
                            displayedPrice={activeDenomination.amount}
                            ctaLocation="Gift Cards Let Them Choose"
                            ctaType="primary"
                            className="btn-interactive flex-1 inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 px-6 py-4 text-base font-bold text-white shadow-xl shadow-pink-500/30 transition hover:shadow-pink-500/50"
                          >
                            {dollarCard.buttonLabel} — Buy{" "}
                            {activeDenomination.formattedPrice} Gift Card →
                          </BookingLink>
                          <BookingLink
                            href={ACUITY_GIFT_CARDS_CATALOG_URL}
                            city={city}
                            classNameText="All Chicago Gift Cards Catalog"
                            classId="gift-cards-catalog"
                            displayedPrice={activeDenomination.amount}
                            ctaLocation="Gift Cards Full Catalog Link"
                            ctaType="secondary"
                            className="inline-flex items-center justify-center rounded-2xl border border-white/20 bg-white/5 px-5 py-4 text-sm font-semibold text-white/90 transition hover:bg-white/10"
                          >
                            View All in Acuity Catalog ↗
                          </BookingLink>
                        </div>
                      ) : (
                        <button
                          type="button"
                          disabled
                          aria-disabled="true"
                          className="w-full cursor-not-allowed rounded-2xl border border-white/15 bg-white/10 px-6 py-4 text-base font-bold text-white/55"
                        >
                          Confirm Recipient’s Studio Above to Enable Checkout
                        </button>
                      )}
                    </div>
                  )}

                  {/* Quick Direct Links for All 5 Verified Chicago Denominations */}
                  <div className="border-t border-white/10 pt-4">
                    <div className="text-xs font-semibold uppercase tracking-wider text-white/60">
                      Direct Acuity Checkout Links by Denomination (
                      {dollarOffering.studioLabel})
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {denominations.map((denom) => (
                        <BookingLink
                          key={denom.productId}
                          href={denom.purchaseUrl}
                          city={city}
                          classNameText={`${denom.name} Direct Pill`}
                          classId={String(denom.productId)}
                          displayedPrice={denom.amount}
                          ctaLocation="Gift Cards Denomination Quick Links"
                          ctaType="secondary"
                          className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold text-white/90 transition hover:border-pink-400/50 hover:bg-white/10"
                        >
                          Buy {denom.formattedPrice} Gift Card (#{denom.productId}) →
                        </BookingLink>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl border border-amber-300/30 bg-amber-500/10 p-6 space-y-4">
                  <div className="inline-block rounded-full bg-amber-500/25 px-3 py-1 text-xs font-bold text-amber-200">
                    Unfinished Acuity Setup · {dollarOffering.studioLabel}
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-white">
                    Eugene Dollar-Value Gift Certificates Pending Acuity Configuration
                  </h3>
                  <p className="text-sm leading-relaxed text-white/85">
                    {dollarOffering.pendingSetupReason}
                  </p>
                  <button
                    type="button"
                    disabled
                    aria-disabled="true"
                    className="w-full cursor-not-allowed rounded-2xl border border-white/15 bg-white/10 px-6 py-4 text-base font-bold text-white/55"
                  >
                    {dollarCard.buttonLabel} — Pending Eugene Acuity Setup
                  </button>
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs">
                    <a
                      href="#manual-acuity-setup"
                      className="font-semibold text-pink-300 underline hover:text-pink-200"
                    >
                      See exact Eugene Acuity setup instructions ↓
                    </a>
                    <button
                      type="button"
                      onClick={() => handleCitySelect("chicago")}
                      className="font-semibold text-white underline hover:text-pink-200"
                    >
                      Looking for Chicago? Switch to Chicago — Pilsen →
                    </button>
                  </div>
                </div>
              )}

              {/* Eligible Workshops Directory for the Selected Studio */}
              <div className="border-t border-white/10 pt-5">
                <details className="group">
                  <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-semibold text-white/90">
                    <span>
                      {city === "chicago"
                        ? `View All ${dollarOffering.eligibleAppointmentTypes.length} Verified Eligible Chicago Workshops & Prices ($39–$85)`
                        : `View Target Eugene Workshops for Acuity Gift Certificate Setup ($25–$55)`}
                    </span>
                    <span className="text-pink-300 transition group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <div className="mt-4 grid gap-2 sm:grid-cols-2 text-xs">
                    {dollarOffering.eligibleAppointmentTypes.map((apt) => (
                      <div
                        key={apt.id}
                        className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5"
                      >
                        <span className="text-white/90 font-medium">
                          {apt.name.replace(/\s*-\s*Chicago$/i, "")}
                        </span>
                        <span className="shrink-0 font-bold text-amber-300 ml-2">
                          ${apt.price} {apt.unit}
                        </span>
                      </div>
                    ))}
                  </div>
                </details>
              </div>
            </div>
          </div>
        </GlassCard>
      </section>

      {/* 4. Three-Step Purchase & Redemption Explanation (Section 5) */}
      <section
        id="how-gifting-works"
        aria-labelledby="how-gifting-works-heading"
        className="space-y-6"
      >
        <div className="text-center max-w-2xl mx-auto">
          <div className="text-xs font-bold uppercase tracking-widest text-pink-300">
            Simple &amp; Stress-Free
          </div>
          <h2
            id="how-gifting-works-heading"
            className="mt-2 font-serif text-3xl font-bold text-white sm:text-4xl"
          >
            How Purchase &amp; Redemption Work
          </h2>
          <p className="mt-2 text-base text-white/80">
            Verified against our live Acuity Scheduling checkout and booking
            flow.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <GlassCard className="p-6 flex flex-col justify-between">
            <div>
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-pink-500/25 font-serif text-lg font-bold text-pink-200 border border-pink-400/30">
                1
              </div>
              <h3 className="mt-4 font-serif text-xl font-bold text-white">
                1. Choose their experience.
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-white/80">
                Confirm your recipient’s studio ({studio.label}) and select a
                pottery experience or flexible dollar denomination. You never
                need to pick a class date or time when buying the gift.
              </p>
            </div>
            <div className="mt-4 border-t border-white/10 pt-3 text-xs text-white/60">
              Studio location &amp; guest coverage confirmed upfront
            </div>
          </GlassCard>

          <GlassCard className="p-6 flex flex-col justify-between">
            <div>
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-purple-500/25 font-serif text-lg font-bold text-purple-200 border border-purple-400/30">
                2
              </div>
              <h3 className="mt-4 font-serif text-xl font-bold text-white">
                2. Purchase and share their gift certificate.
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-white/80">
                Complete checkout securely through Acuity (Square or PayPal).
                Acuity immediately displays your 8-character redemption code and
                a printable certificate view on the confirmation page, and
                emails the receipt and code to the buyer’s email address so you
                can print or forward it when ready.
              </p>
            </div>
            <div className="mt-4 border-t border-white/10 pt-3 text-xs text-white/60">
              Note: Acuity sends confirmation to the purchaser’s email (no
              automated future-date email scheduling)
            </div>
          </GlassCard>

          <GlassCard className="p-6 flex flex-col justify-between">
            <div>
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-500/25 font-serif text-lg font-bold text-amber-200 border border-amber-400/30">
                3
              </div>
              <h3 className="mt-4 font-serif text-xl font-bold text-white">
                3. They choose an available date and redeem their code.
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-white/80">
                Your recipient visits{" "}
                <span className="font-mono text-white/95">
                  colorcocktailfactory.as.me
                </span>{" "}
                (or any eligible workshop page), selects an open session date,
                and enters their 8-character code in the{" "}
                <em>“Redeem Coupon, Package, or Gift Certificate”</em> field at
                checkout.
              </p>
            </div>
            <div className="mt-4 border-t border-white/10 pt-3 text-xs text-white/60">
              For Date Night for Two, 1 booking slot covers both guests
            </div>
          </GlassCard>
        </div>
      </section>

      {/* 5. Pottery Finishing & Glazing Fee Disclosure + Why We Don't Invent Bundles (Section 4) */}
      <section id="pottery-finishing-disclosure" className="space-y-4">
        <PotteryFinishingSection />
        <GlassCard className="p-6 text-xs leading-relaxed text-white/80 border-white/10">
          <div className="font-bold uppercase tracking-wider text-pink-300">
            Verified Fee Structure &amp; Why Finishing Is Paid Separately
          </div>
          <p className="mt-2">
            In Acuity Scheduling, gift certificates redeem toward the base
            appointment type price and do not automatically bundle variable
            per-piece kiln finishing tiers. During class, makers can choose to
            take unfired air-dry clay home the same day at no extra cost, or
            select kiln finishing per piece: in-studio options are{" "}
            <strong>${PRICING.finishing.bisque} bisque firing</strong>,{" "}
            <strong>
              ${PRICING.finishing.glazeSolid} regular solid-color glaze
            </strong>
            ,{" "}
            <strong>
              ${PRICING.finishing.glazeSpecialty} specialty glaze
            </strong>
            , or <strong>${PRICING.finishing.glazeGold} gold glaze</strong>{" "}
            (when available), while Acuity checkout also offers an optional
            combined add-on,{" "}
            <em>“Finish My Piece: Glaze + Kiln Firing”</em>, at{" "}
            <strong>$25 for 1 piece</strong> (ID #6000237) or{" "}
            <strong>$50 for 2 pieces</strong> (ID #7380494). Because piece
            counts and glaze tiers vary by guest and studio staff confirm
            in-studio finishing selections at the end of class, we do not sell
            an unverified “unlimited finishing” package. Buyers who want to help
            cover kiln glazing for a Chicago recipient can choose a{" "}
            <strong>$100 or $150 Gift Card</strong> so the extra studio balance
            stays on the recipient’s certificate code.
          </p>
        </GlassCard>
      </section>

      {/* 6. Printable Gift Certificate & Personal Message Builder (Section 5) */}
      <section
        id="printable-certificate"
        aria-labelledby="printable-certificate-heading"
        className="scroll-mt-24"
      >
        <GlassCard className="p-7 sm:p-10">
          <div className="grid gap-8 lg:grid-cols-12 lg:items-start">
            <div className="lg:col-span-5 space-y-4">
              <div className="text-xs font-bold uppercase tracking-wider text-pink-300">
                Personalize &amp; Print
              </div>
              <h2
                id="printable-certificate-heading"
                className="font-serif text-2xl font-bold text-white sm:text-3xl"
              >
                Create a Printable Keepsake Gift Card
              </h2>
              <p className="text-sm leading-relaxed text-white/80">
                Add your recipient’s name, a personal note, and (once purchased
                in Acuity) your 8-character certificate code. Print or save as a
                PDF to slip into a card or email directly to your recipient.
              </p>

              <div className="space-y-3 pt-2">
                <label className="block text-xs font-semibold text-white/85">
                  Recipient’s Name (To)
                  <input
                    type="text"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    placeholder="e.g., Maya & Jordan"
                    maxLength={80}
                    className="mt-1 w-full rounded-xl border border-white/20 bg-white/10 px-3.5 py-2.5 text-sm text-white placeholder:text-white/40 focus:border-pink-400 focus:outline-none"
                  />
                </label>

                <label className="block text-xs font-semibold text-white/85">
                  From
                  <input
                    type="text"
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    placeholder="e.g., Alex"
                    maxLength={80}
                    className="mt-1 w-full rounded-xl border border-white/20 bg-white/10 px-3.5 py-2.5 text-sm text-white placeholder:text-white/40 focus:border-pink-400 focus:outline-none"
                  />
                </label>

                <label className="block text-xs font-semibold text-white/85">
                  Gifted Experience or Amount
                  <select
                    value={certificateGiftLabel}
                    onChange={(e) => setCertificateGiftLabel(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-white/20 bg-slate-900 px-3.5 py-2.5 text-sm text-white focus:border-pink-400 focus:outline-none"
                  >
                    <option value="Pottery Date Night for Two">
                      Pottery Date Night for Two (2 Guests Sharing 1 Wheel)
                    </option>
                    <option value="Their First Pottery Class">
                      Their First Pottery Class (1 Guest · Beginner Wheel)
                    </option>
                    <option value="$50 Creative Workshop Gift Certificate">
                      $50 Creative Workshop Gift Certificate
                    </option>
                    <option value="$100 Creative Workshop Gift Certificate">
                      $100 Creative Workshop Gift Certificate
                    </option>
                    <option value="$150 Creative Workshop Gift Certificate">
                      $150 Creative Workshop Gift Certificate
                    </option>
                    <option value="$200 Creative Workshop Gift Certificate">
                      $200 Creative Workshop Gift Certificate
                    </option>
                    <option value="$250 Creative Workshop Gift Certificate">
                      $250 Creative Workshop Gift Certificate
                    </option>
                  </select>
                </label>

                <label className="block text-xs font-semibold text-white/85">
                  Personal Message
                  <textarea
                    rows={3}
                    value={personalMessage}
                    onChange={(e) => setPersonalMessage(e.target.value)}
                    maxLength={280}
                    className="mt-1 w-full rounded-xl border border-white/20 bg-white/10 px-3.5 py-2.5 text-sm text-white placeholder:text-white/40 focus:border-pink-400 focus:outline-none"
                  />
                </label>

                <label className="block text-xs font-semibold text-white/85">
                  Acuity Certificate Code (Optional — enter after checkout or
                  write in by hand)
                  <input
                    type="text"
                    value={certificateCode}
                    onChange={(e) =>
                      setCertificateCode(e.target.value.toUpperCase())
                    }
                    placeholder="e.g., 2CAF7B4A"
                    maxLength={24}
                    className="mt-1 w-full rounded-xl border border-white/20 bg-white/10 px-3.5 py-2.5 font-mono text-sm uppercase text-white placeholder:text-white/40 focus:border-pink-400 focus:outline-none"
                  />
                </label>

                <button
                  type="button"
                  onClick={handlePrintCertificate}
                  className="mt-2 inline-flex w-full items-center justify-center rounded-xl border border-pink-400/50 bg-pink-500/25 px-5 py-3 text-sm font-bold text-white transition hover:bg-pink-500/35"
                >
                  🖨️ Print / Save Keepsake Gift Certificate (PDF)
                </button>
              </div>
            </div>

            {/* Live Printable Preview Card */}
            <div className="lg:col-span-7">
              <div
                id="printable-gift-certificate-card"
                className="rounded-3xl border-2 border-amber-200/40 bg-gradient-to-br from-[#faf6ee] via-[#f5efe2] to-[#ede3d2] p-7 sm:p-10 text-[#2b2620] shadow-2xl"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#d5c8b4] pb-4">
                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#8c3b28]">
                      Color Cocktail Factory · Handmade Studio Gift
                    </div>
                    <div className="mt-0.5 font-serif text-lg font-bold text-[#2b2620]">
                      {studio.label} Studio ({studio.address})
                    </div>
                  </div>
                  <div className="rounded-full border border-[#c5b59d] bg-white/80 px-3 py-1 text-xs font-semibold text-[#5a5044]">
                    No Expiration Date
                  </div>
                </div>

                <div className="my-6 space-y-3">
                  <div className="text-xs font-semibold uppercase tracking-wider text-[#726555]">
                    Gift Experience
                  </div>
                  <div className="font-serif text-2xl sm:text-3xl font-bold text-[#241f19]">
                    {certificateGiftLabel}
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-2 text-sm">
                    <div>
                      <span className="text-xs uppercase tracking-wider text-[#726555] block">
                        For
                      </span>
                      <strong className="font-serif text-lg text-[#241f19]">
                        {recipientName.trim() || "Your Favorite Maker"}
                      </strong>
                    </div>
                    <div>
                      <span className="text-xs uppercase tracking-wider text-[#726555] block">
                        From
                      </span>
                      <strong className="font-serif text-lg text-[#241f19]">
                        {senderName.trim() || "Someone Who Loves You"}
                      </strong>
                    </div>
                  </div>

                  {personalMessage.trim() && (
                    <blockquote className="mt-4 rounded-2xl border border-[#dfd4c2] bg-white/75 p-4 font-serif text-base italic leading-relaxed text-[#3b332a]">
                      “{personalMessage.trim()}”
                    </blockquote>
                  )}
                </div>

                <div className="rounded-2xl border border-[#cfc1ab] bg-white/90 p-4 flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-wider text-[#726555]">
                      Acuity Redemption Code
                    </div>
                    <div className="mt-1 font-mono text-xl font-bold tracking-widest text-[#8c3b28]">
                      {certificateCode.trim() || "________ (8-CHAR CODE)"}
                    </div>
                  </div>
                  <div className="text-xs text-[#544a3f] max-w-xs leading-relaxed">
                    <strong>To redeem:</strong> Visit{" "}
                    <span className="font-mono">
                      colorcocktailfactory.as.me
                    </span>
                    , choose your {studio.label} session date, and enter your
                    code at checkout.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </GlassCard>
      </section>

      {/* 7. Concise Verified FAQs (Section 5) */}
      <section
        id="gift-faqs"
        aria-labelledby="gift-faqs-heading"
        className="space-y-6"
      >
        <div>
          <div className="text-xs font-bold uppercase tracking-widest text-pink-300">
            Verified Terms &amp; Details
          </div>
          <h2
            id="gift-faqs-heading"
            className="mt-1 font-serif text-3xl font-bold text-white"
          >
            Gift Certificate FAQs
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {GIFT_FAQS.map((faq) => (
            <GlassCard key={faq.q} className="p-6">
              <h3 className="font-serif text-lg font-bold text-white">
                {faq.q}
              </h3>
              <p className="mt-2.5 text-sm leading-relaxed text-white/80">
                {faq.a}
              </p>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* 8. Manual Acuity Setup Instructions for Unfinished Products (Section 2 & 7) */}
      <section
        id="manual-acuity-setup"
        aria-labelledby="manual-acuity-setup-heading"
        className="scroll-mt-24"
      >
        <GlassCard className="p-7 sm:p-8 border-amber-300/30">
          <details className="group">
            <summary className="flex cursor-pointer list-none flex-wrap items-center justify-between gap-4">
              <div>
                <span className="inline-block rounded-full bg-amber-500/20 px-3 py-1 text-xs font-bold text-amber-200 border border-amber-300/30">
                  Acuity Integration Transparency &amp; Staff Setup Guide
                </span>
                <h2
                  id="manual-acuity-setup-heading"
                  className="mt-2 font-serif text-2xl font-bold text-white"
                >
                  Manual Acuity Admin Setup Specifications (Unfinished Acuity
                  Products)
                </h2>
                <p className="mt-1 text-xs text-white/75">
                  Acuity Scheduling’s REST API exposes{" "}
                  <code className="text-amber-200">GET /api/v1/products</code>{" "}
                  as read-only and does not permit API creation of new store
                  products. Expand for exact copy-paste product specs to finish
                  creating experience certificates in Acuity Admin.
                </p>
              </div>
              <span className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold text-white group-open:bg-white/20">
                View Exact Setup Specs ↓
              </span>
            </summary>

            <div className="mt-6 space-y-6 border-t border-white/15 pt-6 text-xs leading-relaxed text-white/85">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 space-y-2">
                <div className="font-bold text-white">
                  Why Some Products Require Manual Creation in Acuity Admin (
                  <em>Packages, Gifts &amp; Subscriptions</em>):
                </div>
                <ul className="list-disc pl-5 space-y-1">
                  <li>
                    <strong>Verified Live Today:</strong> 5 Chicago dollar-value
                    Gift Cards (IDs <code className="text-emerald-300">2119866</code>{" "}
                    $50, <code className="text-emerald-300">2119869</code> $100,{" "}
                    <code className="text-emerald-300">2119870</code> $150,{" "}
                    <code className="text-emerald-300">2119872</code> $200,{" "}
                    <code className="text-emerald-300">2119873</code> $250) are
                    active in Acuity and cover 19 active Chicago workshops.
                  </li>
                  <li>
                    <strong>Preserving Existing Balances:</strong> Per safety
                    requirements, existing certificates and customer balances
                    were not altered or deleted.
                  </li>
                  <li>
                    <strong>Automatic Activation:</strong> As soon as any of the
                    products below are created in Acuity Admin,{" "}
                    <code className="text-pink-300">
                      fetchLiveAcuityProducts()
                    </code>{" "}
                    detects them via{" "}
                    <code className="text-pink-300">GET /api/v1/products</code>{" "}
                    and automatically enables their primary purchase buttons on
                    this page.
                  </li>
                  <li>
                    <strong>Why “Creative Outing for Two” Is Omitted:</strong>{" "}
                    Unlike Date Night on the Wheel (where 1 booking slot = 2
                    guests sharing 1 wheel), standard per-person workshops book 1
                    guest per appointment and vary from $25 to $85. Acuity
                    single-appointment certificates do not atomically reserve 2
                    separate seats in one redemption code. Buyers gifting a pair
                    of per-person classes in Chicago can use the verified{" "}
                    <strong>$100 Gift Card (#2119869)</strong>, which covers two
                    $45 classes ($90 total) across two bookings.
                  </li>
                </ul>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {MANUAL_ACUITY_SETUP_SPECS.map((spec) => (
                  <div
                    key={spec.key}
                    className="rounded-2xl border border-white/15 bg-black/30 p-5 space-y-2.5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="rounded-full bg-pink-500/20 px-2.5 py-0.5 text-[11px] font-bold uppercase text-pink-200">
                        {spec.city} Studio
                      </span>
                      <span className="font-mono text-amber-300 font-bold">
                        {spec.verifiedPrice}
                      </span>
                    </div>
                    <h3 className="font-serif text-lg font-bold text-white">
                      {spec.productName}
                    </h3>
                    <div>
                      <strong className="text-white">Category / Group:</strong>{" "}
                      {spec.categoryGroup}
                    </div>
                    <div>
                      <strong className="text-white">Redemption Value:</strong>{" "}
                      {spec.redemptionValue} ({spec.redemptionModel})
                    </div>
                    <div>
                      <strong className="text-white">Expiration:</strong>{" "}
                      {spec.expiration}
                    </div>
                    <div>
                      <strong className="text-white">
                        Eligible Appointment Types:
                      </strong>
                      <ul className="mt-1 list-disc pl-4 space-y-0.5">
                        {spec.eligibleAppointmentTypes.map((apt) => (
                          <li key={apt.id}>
                            <code>{apt.id}</code> — {apt.name} ({apt.price},
                            Calendar <code>{apt.calendarId}</code>)
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <strong className="text-white">Product Image:</strong>{" "}
                      <code className="break-all text-white/75">
                        {spec.imageUrl}
                      </code>
                    </div>
                    <div>
                      <strong className="text-white">Description:</strong>
                      <p className="mt-1 rounded-lg bg-white/5 p-2.5 text-white/80">
                        {spec.description}
                      </p>
                    </div>
                    <div>
                      <strong className="text-white">
                        Required Purchase Link Format:
                      </strong>{" "}
                      <code className="break-all text-emerald-300">
                        {spec.requiredPurchaseLinkPattern}
                      </code>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </details>
        </GlassCard>
      </section>

      {/* Bottom Navigation & Support */}
      <GlassCard className="p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="text-sm text-white/80">
            Questions about a gift certificate or need help combining balances?
            Email{" "}
            <a
              className="font-semibold text-white underline hover:text-pink-200"
              href="mailto:support@colorcocktailfactory.com"
            >
              support@colorcocktailfactory.com
            </a>
            .
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href={`/?location=${city}`}
              className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold text-white/90 hover:bg-white/10"
            >
              Browse {studio.label} Workshops →
            </Link>
            <Link
              href="/activities/date-night-wheel"
              className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold text-white/90 hover:bg-white/10"
            >
              Date Night Pottery Details →
            </Link>
            <Link
              href="/activities/beginner-wheel"
              className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold text-white/90 hover:bg-white/10"
            >
              Beginner Wheel Details →
            </Link>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
