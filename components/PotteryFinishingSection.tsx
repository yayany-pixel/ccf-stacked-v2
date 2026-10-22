import React from "react";

export default function PotteryFinishingSection({ activitySlug }: { activitySlug?: string }) {
  const hasIncludedFinishing = activitySlug === "cauldron-pottery" || activitySlug === "date-night-on-fire";
  return (
    <section className="my-12" aria-labelledby="pottery-finishing-title">
      <div className="rounded-2xl border border-white/15 bg-white/[0.04] p-6 sm:p-8">
        <h2 id="pottery-finishing-title" className="font-serif text-2xl font-bold text-white">Firing, Glazing &amp; Pickup</h2>
        <p className="mt-3 text-base leading-relaxed text-white/80">
          {hasIncludedFinishing
            ? "This workshop’s class listing includes glazing. Review the selected studio’s booking description for the included finish and pickup timing."
            : "Finishing options vary by workshop and studio. Review your selected class description for what is included, optional finishing charges, and pickup timing."}
        </p>
        <p className="mt-3 text-sm leading-relaxed text-white/70">
          Where offered, the booking checkout lists an optional Glaze + Kiln Firing add-on at $25 for one piece or $50 for two pieces. Ask the studio about other finishes and any additional charges before choosing them.
        </p>
      </div>
    </section>
  );
}
