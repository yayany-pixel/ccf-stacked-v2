"use client";

import * as React from "react";
import type { City } from "@/lib/config";

type FormState = {
  name: string;
  email: string;
  city: string;
  date: string;
  groupSize: string;
  occasion: string;
  preferredProject: string;
  budget: string;
  details: string;
};

// Helper: Get date string in YYYY-MM-DD format
function getDateString(daysFromNow: number): string {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return date.toISOString().split('T')[0];
}

const initial: FormState = {
  name: "",
  email: "",
  city: "Chicago",
  date: getDateString(7), // Default to 7 days from today
  groupSize: "",
  occasion: "",
  preferredProject: "Choose or leave blank",
  budget: "$55",
  details: ""
};

export default function PrivateEventFormCard({
  city,
  timeWindows
}: {
  city: City;
  timeWindows: string[];
}) {
  const minDate = getDateString(7); // Minimum selectable date is 7 days from today
  
  const [s, setS] = React.useState<FormState>(() => ({
    ...initial,
    city: city.label, // Use city.label (Chicago or Eugene)
    date: getDateString(7) // Default to 7 days from today
  }));

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch("/netlify-forms.html", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(formData as any).toString()
      });

      if (response.ok) {
        // Redirect to thank you page
        window.location.href = "/thanks/private-party";
      } else {
        throw new Error("Form submission failed");
      }
    } catch (err) {
      setError("Something went wrong. Please try again or email us directly.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-glass backdrop-blur-xl">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <div className="text-xs font-semibold tracking-wide text-white/70">PRIVATE PARTY INQUIRY FORM</div>
          <div className="mt-1 text-sm text-white/75">
            Send us a few quick details and we'll follow up with available dates, project ideas, and a custom quote for your group.
          </div>
        </div>
      </div>

      <form 
        name="private-party" 
        method="POST" 
        data-netlify="true" 
        data-netlify-honeypot="bot-field"
        onSubmit={handleSubmit}
      >
        <input type="hidden" name="form-name" value="private-party" />
        <input type="hidden" name="bot-field" style={{ display: 'none' }} aria-hidden="true" />

        <div className="mt-5 grid gap-3 md:grid-cols-2">
          <label className="grid gap-1">
            <span className="text-xs font-semibold uppercase tracking-wide text-white/65">Name</span>
            <input
              name="name"
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white outline-none focus:border-white/20"
              value={s.name}
              onChange={(e) => setS((p) => ({ ...p, name: e.target.value }))}
              placeholder="How would we reach you?"
              required
              disabled={isSubmitting}
              aria-label="Your name"
            />
          </label>

          <label className="grid gap-1">
            <span className="text-xs font-semibold uppercase tracking-wide text-white/65">Email</span>
            <input
              type="email"
              name="email"
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white outline-none focus:border-white/20"
              value={s.email}
              onChange={(e) => setS((p) => ({ ...p, email: e.target.value }))}
              placeholder="your@email.com"
              required
              disabled={isSubmitting}
              aria-label="Your email address"
            />
          </label>

          <label className="grid gap-1">
            <span className="text-xs font-semibold uppercase tracking-wide text-white/65">City</span>
            <select
              name="city"
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white outline-none focus:border-white/20 [&>option]:bg-slate-800 [&>option]:text-white"
              value={s.city}
              onChange={(e) => setS((p) => ({ ...p, city: e.target.value }))}
              disabled={isSubmitting}
              aria-label="Preferred city location"
            >
              <option value="Chicago">Chicago</option>
              <option value="Eugene">Eugene</option>
            </select>
          </label>

          <label className="grid gap-1">
            <span className="text-xs font-semibold uppercase tracking-wide text-white/65">Date</span>
            <input
              type="date"
              name="date"
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white outline-none focus:border-white/20 [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-70 [&::-webkit-calendar-picker-indicator]:hover:opacity-100"
              value={s.date}
              min={minDate}
              onChange={(e) => setS((p) => ({ ...p, date: e.target.value }))}
              required
              disabled={isSubmitting}
              aria-label="Preferred event date"
            />
          </label>

          <label className="grid gap-1">
            <span className="text-xs font-semibold uppercase tracking-wide text-white/65">Group Size</span>
            <input
              type="text"
              name="groupSize"
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white outline-none focus:border-white/20"
              value={s.groupSize}
              onChange={(e) => setS((p) => ({ ...p, groupSize: e.target.value }))}
              placeholder="Example: 12, 15-18 etc"
              required
              disabled={isSubmitting}
              aria-label="Expected group size"
            />
          </label>

          <label className="grid gap-1">
            <span className="text-xs font-semibold uppercase tracking-wide text-white/65">Occasion</span>
            <input
              type="text"
              name="occasion"
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white outline-none focus:border-white/20"
              value={s.occasion}
              onChange={(e) => setS((p) => ({ ...p, occasion: e.target.value }))}
              placeholder="Birthday, bachelorette, team outing, offsite, etc."
              required
              disabled={isSubmitting}
              aria-label="Event occasion"
            />
          </label>

          <label className="grid gap-1">
            <span className="text-xs font-semibold uppercase tracking-wide text-white/65">Budget Per Person</span>
            <select
              name="budget"
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white outline-none focus:border-white/20 [&>option]:bg-slate-800 [&>option]:text-white"
              value={s.budget}
              onChange={(e) => setS((p) => ({ ...p, budget: e.target.value }))}
              disabled={isSubmitting}
              aria-label="Budget per person"
            >
              <option value="$45">$45</option>
              <option value="$55">$55</option>
              <option value="$65">$65</option>
              <option value="$75">$75</option>
              <option value="$85">$85</option>
            </select>
          </label>

          <label className="grid gap-1 md:col-span-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-white/65">Preferred Project</span>
            <select
              name="preferredProject"
              className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white outline-none focus:border-white/20 [&>option]:bg-slate-800 [&>option]:text-white"
              value={s.preferredProject}
              onChange={(e) => setS((p) => ({ ...p, preferredProject: e.target.value }))}
              disabled={isSubmitting}
              aria-label="Preferred project type"
            >
              <option value="Choose or leave blank">Choose or leave blank</option>
              <option value="Wheel throwing / Date Night">Wheel throwing / Date Night</option>
              <option value="Handbuilt pottery (Cups, bowls, Vases, etc)">Handbuilt pottery (Cups, bowls, Vases, etc)</option>
              <option value="Mosaics / Turkish lamp">Mosaics / Turkish lamp</option>
              <option value="Glass fusion">Glass fusion</option>
              <option value="Terrariums">Terrariums</option>
              <option value="Bonsai">Bonsai</option>
              <option value="Other / Not sure yet">Other / Not sure yet</option>
            </select>
          </label>

          <label className="grid gap-1 md:col-span-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-white/65">Details</span>
            <textarea
              name="details"
              className="min-h-[96px] rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white outline-none focus:border-white/20"
              value={s.details}
              onChange={(e) => setS((p) => ({ ...p, details: e.target.value }))}
              placeholder="Tell us about your vibe, timing flexibility, budget, accessibility needs, or anything else."
              disabled={isSubmitting}
              aria-label="Additional details"
            />
          </label>
        </div>

        <p className="mt-4 text-xs text-white/55">
          We typically reply within 24 hours with dates/options, project ideas, and a commitment.
        </p>

        {error && (
          <div role="alert" className="mt-4 rounded-lg border border-red-400/30 bg-red-500/10 px-4 py-2 text-sm text-red-300">
            {error}
          </div>
        )}

        <div className="mt-4">
          <button
            type="submit"
            className="inline-flex w-full items-center justify-center rounded-full border border-white/15 bg-pink-600 px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white hover:bg-pink-700 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Sending..." : "Send Private Event Inquiry"}
          </button>
        </div>
      </form>
    </div>
  );
}
