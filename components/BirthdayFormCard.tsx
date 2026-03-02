"use client";

import { useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface FormState {
  yourName: string;
  email: string;
  phone: string;
  city: string;
  preferredDate: string;
  alternateDate: string;
  guestCount: string;
  experience: string;
  notes: string;
}

const INITIAL: FormState = {
  yourName: "",
  email: "",
  phone: "",
  city: "",
  preferredDate: "",
  alternateDate: "",
  guestCount: "",
  experience: "",
  notes: "",
};

const INPUT =
  "w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/35 backdrop-blur-sm transition focus:border-purple-400/60 focus:bg-white/8 focus:outline-none focus:ring-2 focus:ring-purple-500/20";

const LABEL = "mb-1.5 block text-xs font-semibold uppercase tracking-wider text-white/55";

const EXPERIENCES = [
  "Pottery Wheel Night",
  "Paint & Sip (Canvas)",
  "Paint & Sip (Wine Glasses)",
  "Turkish Lamp Workshop",
  "Mosaic Art",
  "Candle Pour",
  "Terrarium Build",
  "Not sure — help me pick",
];

// ─── Props ────────────────────────────────────────────────────────────────────

interface BirthdayFormCardProps {
  /** Passed from page.tsx config flag — used in success message */
  byobEnabled?: boolean;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function BirthdayFormCard({ byobEnabled = true }: BirthdayFormCardProps) {
  const [form, setForm] = useState<FormState>(INITIAL);
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  function set(field: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    try {
      const body = new URLSearchParams({
        "form-name": "birthday-party",
        ...form,
      }).toString();
      const res = await fetch("/netlify-forms.html", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body,
      });
      if (!res.ok) throw new Error("Network response not ok");
      setStatus("success");
      setForm(INITIAL);
    } catch {
      setStatus("error");
    }
  }

  // ── Success State ──────────────────────────────────────────────────────────
  if (status === "success") {
    return (
      <div className="rounded-3xl border border-emerald-400/25 bg-emerald-500/10 p-10 text-center backdrop-blur-xl">
        <div className="mb-3 text-4xl">🎉</div>
        <h3 className="font-serif text-2xl font-light text-white">
          Your inquiry is in!
        </h3>
        <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-white/65">
          We'll reply within 24 hours with availability and your custom quote. Keep an eye on your inbox.
          {byobEnabled && " Don't forget — BYOB is welcome, so start planning your drink list."}
        </p>
        <p className="mt-5 text-xs text-white/40">
          Questions right now?{" "}
          <a href="tel:3128819929" className="text-purple-400 hover:text-purple-300">
            (312) 881-9929
          </a>
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="mt-6 rounded-full border border-white/15 bg-white/5 px-6 py-2.5 text-sm font-semibold text-white/70 transition hover:bg-white/10"
        >
          Submit another inquiry
        </button>
      </div>
    );
  }

  // ── Form ───────────────────────────────────────────────────────────────────
  return (
    <form
      name="birthday-party"
      method="POST"
      data-netlify="true"
      data-netlify-honeypot="bot-field"
      onSubmit={handleSubmit}
      className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl"
    >
      {/* Netlify hidden fields */}
      <input type="hidden" name="form-name" value="birthday-party" />
      <div hidden aria-hidden="true">
        <label>
          Don&apos;t fill this out: <input name="bot-field" tabIndex={-1} />
        </label>
      </div>

      <div className="space-y-5">
        {/* Row 1: Name + Email */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="bf-name" className={LABEL}>Your Name *</label>
            <input
              id="bf-name"
              name="yourName"
              type="text"
              autoComplete="name"
              required
              placeholder="e.g. Sarah"
              value={form.yourName}
              onChange={(e) => set("yourName", e.target.value)}
              className={INPUT}
            />
          </div>
          <div>
            <label htmlFor="bf-email" className={LABEL}>Email *</label>
            <input
              id="bf-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
              className={INPUT}
            />
          </div>
        </div>

        {/* Row 2: Phone + City */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="bf-phone" className={LABEL}>Phone</label>
            <input
              id="bf-phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              placeholder="(312) 555-0123"
              value={form.phone}
              onChange={(e) => set("phone", e.target.value)}
              className={INPUT}
            />
          </div>
          <div>
            <label htmlFor="bf-city" className={LABEL}>Studio Location *</label>
            <select
              id="bf-city"
              name="city"
              required
              value={form.city}
              onChange={(e) => set("city", e.target.value)}
              className={INPUT}
            >
              <option value="">Select a studio</option>
              <option value="Chicago">Chicago (Pilsen)</option>
              <option value="Eugene">Eugene, OR</option>
            </select>
          </div>
        </div>

        {/* Row 3: Preferred Date + Alternate */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="bf-date" className={LABEL}>Preferred Date *</label>
            <input
              id="bf-date"
              name="preferredDate"
              type="date"
              required
              value={form.preferredDate}
              onChange={(e) => set("preferredDate", e.target.value)}
              className={INPUT}
            />
          </div>
          <div>
            <label htmlFor="bf-alt-date" className={LABEL}>Alternate Date</label>
            <input
              id="bf-alt-date"
              name="alternateDate"
              type="date"
              value={form.alternateDate}
              onChange={(e) => set("alternateDate", e.target.value)}
              className={INPUT}
            />
          </div>
        </div>

        {/* Row 4: Guests + Experience */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="bf-guests" className={LABEL}>Estimated Guest Count *</label>
            <select
              id="bf-guests"
              name="guestCount"
              required
              value={form.guestCount}
              onChange={(e) => set("guestCount", e.target.value)}
              className={INPUT}
            >
              <option value="">Select a range</option>
              <option value="2-5">2–5 guests</option>
              <option value="6-10">6–10 guests</option>
              <option value="11-20">11–20 guests</option>
              <option value="21-35">21–35 guests</option>
              <option value="36-60">36–60 guests</option>
            </select>
          </div>
          <div>
            <label htmlFor="bf-exp" className={LABEL}>Experience *</label>
            <select
              id="bf-exp"
              name="experience"
              required
              value={form.experience}
              onChange={(e) => set("experience", e.target.value)}
              className={INPUT}
            >
              <option value="">Choose an activity</option>
              {EXPERIENCES.map((exp) => (
                <option key={exp} value={exp}>{exp}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Notes */}
        <div>
          <label htmlFor="bf-notes" className={LABEL}>Anything else? (optional)</label>
          <textarea
            id="bf-notes"
            name="notes"
            rows={3}
            placeholder="e.g. it's a surprise, we need accessibility accommodations, interested in add-ons..."
            value={form.notes}
            onChange={(e) => set("notes", e.target.value)}
            className={INPUT + " resize-none"}
          />
        </div>
      </div>

      {/* Error */}
      {status === "error" && (
        <p className="mt-4 rounded-xl border border-red-400/25 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          Something went wrong — please try again or call us at (312) 881-9929.
        </p>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={status === "sending"}
        className="mt-6 w-full rounded-full bg-gradient-to-r from-pink-500 to-purple-600 py-4 text-base font-bold text-white shadow-lg shadow-purple-600/25 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-purple-500/30 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {status === "sending" ? "Sending…" : "Get My Birthday Quote →"}
      </button>

      <p className="mt-3 text-center text-xs text-white/35">
        No deposit required · We reply within 24 hours
      </p>
    </form>
  );
}
