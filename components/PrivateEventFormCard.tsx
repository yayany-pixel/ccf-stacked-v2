"use client";

import * as React from "react";
import type { City } from "@/lib/config";
import { PRIVATE_EVENT_EMAIL } from "@/lib/config";

type FormState = {
  name: string;
  email: string;
  city: string;
  date: string;
  groupSize: string;
  occasion: string;
  preferredProject: string;
  details: string;
};

const initial: FormState = {
  name: "",
  email: "",
  city: "Chicago – Phoenix",
  date: "",
  groupSize: "",
  occasion: "",
  preferredProject: "Choose or leave blank",
  details: ""
};

function mailtoFromForm(city: City, s: FormState) {
  const subject = `Private Event Inquiry — ${s.preferredProject}`;
  const body = [
    `NAME: ${s.name}`,
    `EMAIL: ${s.email}`,
    `CITY: ${s.city}`,
    `DATE: ${s.date}`,
    `GROUP SIZE: ${s.groupSize}`,
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
    city: `${city.label} – Phoenix`
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
          <span className="text-xs font-semibold uppercase tracking-wide text-white/65">City</span>
          <select
            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white outline-none focus:border-white/20"
            value={s.city}
            onChange={(e) => setS((p) => ({ ...p, city: e.target.value }))}
          >
            <option>Chicago – Phoenix</option>
            <option>Eugene – Phoenix</option>
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

        <label className="grid gap-1 md:col-span-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-white/65">Preferred Project</span>
          <select
            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white outline-none focus:border-white/20"
            value={s.preferredProject}
            onChange={(e) => setS((p) => ({ ...p, preferredProject: e.target.value }))}
          >
            <option>Choose or leave blank</option>
            <option>Wheel throwing / Date Night</option>
            <option>Handbuilt pottery (Cups, bowls, Vases, etc)</option>
            <option>Mosaics / Turkish lamp</option>
            <option>Glass fusion</option>
            <option>Terrariums</option>
            <option>Bonsai</option>
            <option>Other / Not sure yet</option>
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
