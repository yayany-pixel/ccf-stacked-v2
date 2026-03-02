"use client";

import * as React from "react";

function getDateString(daysFromNow: number): string {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  return d.toISOString().split("T")[0];
}

type FormState = {
  birthdayPersonName: string;
  ageTurning: string;
  yourName: string;
  email: string;
  phone: string;
  city: string;
  preferredDate: string;
  alternateDate: string;
  guestCount: string;
  experience: string;
  budget: string;
  isSurprise: boolean;
  foodPlans: string;
  specialRequests: string;
};

const initial: FormState = {
  birthdayPersonName: "",
  ageTurning: "",
  yourName: "",
  email: "",
  phone: "",
  city: "Chicago",
  preferredDate: getDateString(14),
  alternateDate: "",
  guestCount: "",
  experience: "",
  budget: "$65 (Classic)",
  isSurprise: false,
  foodPlans: "",
  specialRequests: "",
};

const inputClass =
  "rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none transition focus:border-pink-400/40 focus:bg-white/8 disabled:opacity-50";
const labelClass = "grid gap-1";
const labelTextClass = "text-xs font-semibold uppercase tracking-wide text-white/65";

export default function BirthdayFormCard() {
  const [s, setS] = React.useState<FormState>(initial);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [error, setError] = React.useState("");

  const minDate = getDateString(7);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    const form = e.currentTarget;
    const formData = new FormData(form);
    // Add survey checkbox state manually since FormData doesn't capture unchecked boxes
    formData.set("isSurprise", s.isSurprise ? "Yes" : "No");

    try {
      const resp = await fetch("/netlify-forms.html", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(formData as unknown as Record<string, string>).toString(),
      });
      if (resp.ok || resp.status === 404) {
        // Netlify intercepts at CDN level; 404 on the static file is expected in dev
        setIsSuccess(true);
      } else {
        throw new Error("submission failed");
      }
    } catch (err) {
      console.error(err);
      setError(
        "Something went wrong. Please email us at support@colorcocktailfactory.com or call (312) 881-9929."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="rounded-3xl border border-green-400/30 bg-green-500/10 p-10 text-center shadow-glass backdrop-blur-xl">
        <div className="mb-4 text-6xl">🎉</div>
        <h3 className="mb-3 text-2xl font-bold text-green-300">
          Birthday Inquiry Received!
        </h3>
        <p className="mx-auto max-w-md text-white/75 leading-relaxed">
          We&apos;ll email you within <strong className="text-white">24 hours</strong> with
          your custom quote and available dates. Once everything&apos;s agreed, we&apos;ll send
          a registration link so each guest can book their own spot individually.
        </p>
        <p className="mt-6 text-xs text-white/40">
          Questions in the meantime? Email support@colorcocktailfactory.com or call (312) 881-9929.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-glass backdrop-blur-xl sm:p-8">
      <div className="mb-6">
        <div className="text-xs font-semibold uppercase tracking-widest text-pink-300">
          Birthday Party Inquiry
        </div>
        <div className="mt-1.5 text-sm text-white/65 leading-relaxed">
          Fill this out and we&apos;ll reply within 24 hours with your quote, available dates,
          and everything else you need. No deposit required upfront.
        </div>
      </div>

      <form
        name="birthday-party"
        method="POST"
        data-netlify="true"
        data-netlify-honeypot="bot-field"
        onSubmit={handleSubmit}
      >
        <input type="hidden" name="form-name" value="birthday-party" />
        <input type="hidden" name="bot-field" style={{ display: "none" }} aria-hidden="true" />

        <div className="grid gap-4 md:grid-cols-2">
          {/* Birthday Person's Name */}
          <label className={labelClass}>
            <span className={labelTextClass}>Birthday Person&apos;s Name *</span>
            <input
              name="birthdayPersonName"
              className={inputClass}
              value={s.birthdayPersonName}
              onChange={(e) => setS((p) => ({ ...p, birthdayPersonName: e.target.value }))}
              placeholder="Who&apos;s celebrating?"
              required
              disabled={isSubmitting}
              aria-label="Birthday person's name"
            />
          </label>

          {/* Age Turning */}
          <label className={labelClass}>
            <span className={labelTextClass}>Age Turning *</span>
            <input
              type="number"
              name="ageTurning"
              min="1"
              max="120"
              className={inputClass}
              value={s.ageTurning}
              onChange={(e) => setS((p) => ({ ...p, ageTurning: e.target.value }))}
              placeholder="e.g. 30"
              required
              disabled={isSubmitting}
              aria-label="Age turning"
            />
          </label>

          {/* Your Name */}
          <label className={labelClass}>
            <span className={labelTextClass}>Your Name (Organizer) *</span>
            <input
              name="yourName"
              className={inputClass}
              value={s.yourName}
              onChange={(e) => setS((p) => ({ ...p, yourName: e.target.value }))}
              placeholder="Who&apos;s planning this?"
              required
              disabled={isSubmitting}
              aria-label="Organizer name"
            />
          </label>

          {/* Email */}
          <label className={labelClass}>
            <span className={labelTextClass}>Email *</span>
            <input
              type="email"
              name="email"
              className={inputClass}
              value={s.email}
              onChange={(e) => setS((p) => ({ ...p, email: e.target.value }))}
              placeholder="your@email.com"
              required
              disabled={isSubmitting}
              aria-label="Email address"
            />
          </label>

          {/* Phone */}
          <label className={labelClass}>
            <span className={labelTextClass}>Phone *</span>
            <input
              type="tel"
              name="phone"
              className={inputClass}
              value={s.phone}
              onChange={(e) => setS((p) => ({ ...p, phone: e.target.value }))}
              placeholder="(555) 000-0000"
              required
              disabled={isSubmitting}
              aria-label="Phone number"
            />
          </label>

          {/* Studio Location */}
          <label className={labelClass}>
            <span className={labelTextClass}>Studio Location *</span>
            <select
              name="city"
              className={`${inputClass} [&>option]:bg-slate-800 [&>option]:text-white`}
              value={s.city}
              onChange={(e) => setS((p) => ({ ...p, city: e.target.value }))}
              disabled={isSubmitting}
              aria-label="Studio location"
            >
              <option value="Chicago">📍 Chicago — Pilsen (1142 W. 18th St)</option>
              <option value="Eugene">📍 Eugene, Oregon (1162 Lorella Ave)</option>
            </select>
          </label>

          {/* Preferred Date */}
          <label className={labelClass}>
            <span className={labelTextClass}>Preferred Date *</span>
            <input
              type="date"
              name="preferredDate"
              min={minDate}
              className={`${inputClass} [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-60`}
              value={s.preferredDate}
              onChange={(e) => setS((p) => ({ ...p, preferredDate: e.target.value }))}
              required
              disabled={isSubmitting}
              aria-label="Preferred party date"
            />
          </label>

          {/* Alternate Date */}
          <label className={labelClass}>
            <span className={labelTextClass}>Alternate Date (optional)</span>
            <input
              type="date"
              name="alternateDate"
              min={minDate}
              className={`${inputClass} [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-60`}
              value={s.alternateDate}
              onChange={(e) => setS((p) => ({ ...p, alternateDate: e.target.value }))}
              disabled={isSubmitting}
              aria-label="Alternate party date"
            />
          </label>

          {/* Guest Count */}
          <label className={labelClass}>
            <span className={labelTextClass}>Number of Guests *</span>
            <input
              type="number"
              name="guestCount"
              min="1"
              max="60"
              className={inputClass}
              value={s.guestCount}
              onChange={(e) => setS((p) => ({ ...p, guestCount: e.target.value }))}
              placeholder="Up to 60 guests"
              required
              disabled={isSubmitting}
              aria-label="Number of guests"
            />
          </label>

          {/* Experience Type */}
          <label className={labelClass}>
            <span className={labelTextClass}>Birthday Activity *</span>
            <select
              name="experience"
              className={`${inputClass} [&>option]:bg-slate-800 [&>option]:text-white`}
              value={s.experience}
              onChange={(e) => setS((p) => ({ ...p, experience: e.target.value }))}
              required
              disabled={isSubmitting}
              aria-label="Birthday activity"
            >
              <option value="">Choose the vibe...</option>
              <option value="Pottery Wheel (Wheel Throwing)">🏺 Pottery Wheel — Wheel Throwing</option>
              <option value="Handbuilt Pottery (Cups, Bowls, Vases)">🎨 Handbuilt Pottery — Cups, Bowls, Vases</option>
              <option value="Mosaic / Turkish Lamp">✨ Mosaic / Turkish Lamp Making</option>
              <option value="Glass Fusion">🌈 Glass Fusion</option>
              <option value="Candle Making">🕯️ Candle Making</option>
              <option value="Terrarium Building">🌿 Terrarium Building</option>
              <option value="Not sure — help us choose!">💬 Not sure — help us choose!</option>
            </select>
          </label>

          {/* Budget Per Person */}
          <label className={labelClass}>
            <span className={labelTextClass}>Budget Per Person</span>
            <select
              name="budget"
              className={`${inputClass} [&>option]:bg-slate-800 [&>option]:text-white`}
              value={s.budget}
              onChange={(e) => setS((p) => ({ ...p, budget: e.target.value }))}
              disabled={isSubmitting}
              aria-label="Budget per person"
            >
              <option value="$55 (Essential)">$55 — Essential Experience</option>
              <option value="$65 (Classic)">$65 — Classic Experience</option>
              <option value="$75 (Elevated)">$75 — Elevated Experience</option>
              <option value="$85 (Premium)">$85 — Premium Experience</option>
              <option value="$95 (Ultimate)">$95 — Ultimate Experience</option>
            </select>
            <span className="text-xs text-white/40">
              Higher budget = more special touches, premium materials, and extras.
            </span>
          </label>

          {/* Surprise Toggle */}
          <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 transition hover:bg-white/8 md:col-span-2">
            <input
              type="checkbox"
              name="isSurprise"
              className="mt-0.5 h-4 w-4 rounded accent-pink-500"
              checked={s.isSurprise}
              onChange={(e) => setS((p) => ({ ...p, isSurprise: e.target.checked }))}
              disabled={isSubmitting}
              aria-label="Is this a surprise party?"
            />
            <div>
              <div className="text-sm font-semibold text-white/90">
                🤫 Is this a surprise party?
                {s.isSurprise && (
                  <span className="ml-2 animate-pulse text-pink-300">
                    Got it — we&apos;ll keep it secret! 🎊
                  </span>
                )}
              </div>
              <div className="text-xs text-white/45 mt-0.5">
                We&apos;ll mark your booking confidential and coordinate discreetly.
              </div>
            </div>
          </label>

          {/* Food Plans */}
          <label className={labelClass}>
            <span className={labelTextClass}>Food / Cake Plans</span>
            <input
              name="foodPlans"
              className={inputClass}
              value={s.foodPlans}
              onChange={(e) => setS((p) => ({ ...p, foodPlans: e.target.value }))}
              placeholder="e.g. Cupcakes + BYOB wine, pizza, etc."
              disabled={isSubmitting}
              aria-label="Food and cake plans"
            />
          </label>

          {/* Special Requests */}
          <label className={`${labelClass} md:col-span-2`}>
            <span className={labelTextClass}>Anything Else?</span>
            <textarea
              name="specialRequests"
              className={`${inputClass} min-h-[80px] resize-none`}
              value={s.specialRequests}
              onChange={(e) => setS((p) => ({ ...p, specialRequests: e.target.value }))}
              placeholder="Accessibility needs, decoration preferences, timing flexibility, or anything else..."
              disabled={isSubmitting}
              aria-label="Special requests"
            />
          </label>
        </div>

        <p className="mt-4 text-xs leading-relaxed text-white/45">
          We reply within 24 hours with a custom quote, available dates, and next steps.
          After agreeing on details, we&apos;ll send your guests a registration link to book
          their own spots. No deposit required to inquire.
        </p>

        {error && (
          <div
            role="alert"
            className="mt-4 rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-300"
          >
            {error}
          </div>
        )}

        <div className="mt-5">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex w-full items-center justify-center gap-2.5 rounded-full border border-pink-400/30 bg-gradient-to-r from-pink-500 to-purple-600 px-6 py-4 text-sm font-bold uppercase tracking-wider text-white shadow-lg shadow-pink-500/25 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-pink-400/40 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Sending...
              </>
            ) : (
              "🎉 Plan My Birthday Party"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
