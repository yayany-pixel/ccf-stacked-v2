"use client";

import * as React from "react";
import type { City } from "@/lib/config";
import { PRIVATE_EVENT_EMAIL } from "@/lib/config";

type FormState = {
  name: string;
  email: string;
  state: string;
  date: string;
  groupSize: string;
  occasion: string;
  preferredProject: string;
  budget: string;
  details: string;
};

const initial: FormState = {
  name: "",
  email: "",
  state: "IL",
  date: "",
  groupSize: "",
  occasion: "",
  preferredProject: "Choose or leave blank",
  budget: "$75",
  details: ""
};

function mailtoFromForm(city: City, s: FormState) {
  const subject = `Private Event Inquiry — ${s.preferredProject}`;
  const body = [
    `NAME: ${s.name}`,
    `EMAIL: ${s.email}`,
    `STATE: ${s.state}`,
    `DATE: ${s.date}`,
    `GROUP SIZE: ${s.groupSize}`,
    `BUDGET PER PERSON: ${s.budget}`,
    `OCCASION: ${s.occasion}`,
    `PREFERRED PROJECT: ${s.preferredProject}`,
    "",
    "DETAILS:",
    s.details || "(none)",
    "",
    "We typically reply within 24 hours with dates/options, project ideas, and a commitment."
  ].join("\n");

  return `mailto:${PRIVATE_EVENT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export default function PrivateEventFormCard({
  city,
  timeWindows
}: {
  city: City;
  timeWindows: string[];
}) {
  const [s, setS] = React.useState<FormState>(() => ({
    ...initial,
    state: city.param === "chicago" ? "IL" : "OR"
  }));

  const href = mailtoFromForm(city, s);

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

      <div className="mt-5 grid gap-3 md:grid-cols-2">
        <label className="grid gap-1">
          <span className="text-xs font-semibold uppercase tracking-wide text-white/65">Name</span>
          <input
            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white outline-none focus:border-white/20"
            value={s.name}
            onChange={(e) => setS((p) => ({ ...p, name: e.target.value }))}
            placeholder="How would we reach you?"
          />
        </label>

        <label className="grid gap-1">
          <span className="text-xs font-semibold uppercase tracking-wide text-white/65">Email</span>
          <input
            type="email"
            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white outline-none focus:border-white/20"
            value={s.email}
            onChange={(e) => setS((p) => ({ ...p, email: e.target.value }))}
            placeholder="your@email.com"
          />
        </label>

        <label className="grid gap-1">
          <span className="text-xs font-semibold uppercase tracking-wide text-white/65">State</span>
          <select
            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white outline-none focus:border-white/20 [&>option]:bg-slate-800 [&>option]:text-white"
            value={s.state}
            onChange={(e) => setS((p) => ({ ...p, state: e.target.value }))}
          >
            <option value="IL">IL (Illinois)</option>
            <option value="OR">OR (Oregon)</option>
          </select>
        </label>

        <label className="grid gap-1">
          <span className="text-xs font-semibold uppercase tracking-wide text-white/65">Date</span>
          <input
            type="text"
            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white outline-none focus:border-white/20"
            value={s.date}
            onChange={(e) => setS((p) => ({ ...p, date: e.target.value }))}
            placeholder="Estimated: mm-dd-yyyy"
          />
        </label>

        <label className="grid gap-1">
          <span className="text-xs font-semibold uppercase tracking-wide text-white/65">Group Size</span>
          <input
            type="text"
            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white outline-none focus:border-white/20"
            value={s.groupSize}
            onChange={(e) => setS((p) => ({ ...p, groupSize: e.target.value }))}
            placeholder="Example: 12, 15-18 etc"
          />
        </label>

        <label className="grid gap-1">
          <span className="text-xs font-semibold uppercase tracking-wide text-white/65">Occasion</span>
          <input
            type="text"
            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white outline-none focus:border-white/20"
            value={s.occasion}
            onChange={(e) => setS((p) => ({ ...p, occasion: e.target.value }))}
            placeholder="Birthday, bachelorette, team outing, offsite, etc."
          />
        </label>

        <label className="grid gap-1">
          <span className="text-xs font-semibold uppercase tracking-wide text-white/65">Budget Per Person</span>
          <select
            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white outline-none focus:border-white/20 [&>option]:bg-slate-800 [&>option]:text-white"
            value={s.budget}
            onChange={(e) => setS((p) => ({ ...p, budget: e.target.value }))}
          >
            <option value="$50">$50</option>
            <option value="$60">$60</option>
            <option value="$70">$70</option>
            <option value="$75">$75</option>
            <option value="$80">$80</option>
            <option value="$90">$90</option>
            <option value="$100">$100</option>
            <option value="$110">$110</option>
            <option value="$120">$120</option>
          </select>
        </label>

        <label className="grid gap-1 md:col-span-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-white/65">Preferred Project</span>
          <select
            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white outline-none focus:border-white/20 [&>option]:bg-slate-800 [&>option]:text-white"
            value={s.preferredProject}
            onChange={(e) => setS((p) => ({ ...p, preferredProject: e.target.value }))}
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
            className="min-h-[96px] rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white outline-none focus:border-white/20"
            value={s.details}
            onChange={(e) => setS((p) => ({ ...p, details: e.target.value }))}
            placeholder="Tell us about your vibe, timing flexibility, budget, accessibility needs, or anything else."
          />
        </label>
      </div>

      <p className="mt-4 text-xs text-white/55">
        We typically reply within 24 hours with dates/options, project ideas, and a commitment.
      </p>

      <div className="mt-4">
        <a
          className="inline-flex w-full items-center justify-center rounded-full border border-white/15 bg-pink-600 px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white hover:bg-pink-700"
          href={href}
        >
          Send Private Event Inquiry
        </a>
      </div>
    </div>
  );
}
