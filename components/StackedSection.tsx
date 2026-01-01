import Link from "next/link";
import SectionBand from "@/components/SectionBand";
import GlassCard from "@/components/ui/GlassCard";
import TagPill from "@/components/ui/TagPill";
import ButtonPill from "@/components/ui/ButtonPill";
import MiniValueCard from "@/components/ui/MiniValueCard";
import PrivateEventFormCard from "@/components/PrivateEventFormCard";
import Reveal from "@/components/motion/Reveal";
import type { City, SectionConfig } from "@/lib/config";
import { buildBookingLink } from "@/lib/links";
import { EVENTBRITE_EVENTS_HREF } from "@/lib/constants";

function resolveHref(
  city: City,
  section: SectionConfig,
  kind: "booking" | "detail" | "custom",
  href?: string
) {
  if (kind === "custom" && href) return href;
  if (kind === "detail") return `/${city.param}/${section.slug}`;
  return buildBookingLink(city, section);
}

export default function StackedSection({
  city,
  section
}: {
  city: City;
  section: SectionConfig;
}) {
  const bookingHref = buildBookingLink(city, section);
  
  // Show Eventbrite Events link for selected curated sections
  const showEventbriteLink = [
    'date-night-wheel',
    'beginner-wheel-throwing',
    'mosaics',
    'turkish-lamp',
    'painting'
  ].includes(section.id);

  return (
    <SectionBand section={section}>
      <div id={section.anchorId} className="scroll-mt-28">
        <div className="mx-auto max-w-7xl px-6 py-14">
          {/* Single Column: Hero Card Only (left schedule removed) */}
          <div className="mx-auto max-w-5xl">
            <Reveal variant="fade-up" delay={100}>
              {section.slug === "private-parties" ? (
                <PrivateEventFormCard
                  city={city}
                  timeWindows={section.scheduleRows.map((r) => `${r.time}${r.note ? ` (${r.note})` : ""}`)}
                />
              ) : (
                <GlassCard>
                  <div className="p-7">
                    <div className="flex flex-wrap items-center gap-2">
                      <TagPill>{section.badge}</TagPill>
                      {section.tags.slice(0, 5).map((t) => (
                        <TagPill key={t} subtle>
                          {t}
                        </TagPill>
                      ))}
                    </div>

                    <h2 className="mt-4 font-serif text-4xl leading-tight md:text-5xl">
                      {section.heroTitle}
                    </h2>

                    <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/80">
                      {section.heroDescription}
                    </p>

                    <div className="mt-6 flex flex-wrap gap-3">
                      <ButtonPill
                        href={resolveHref(city, section, section.primaryCta.kind, section.primaryCta.href)}
                        variant="primary"
                        trackingData={{
                          activityName: section.heroTitle,
                          city: city.label
                        }}
                      >
                        {section.primaryCta.label}
                      </ButtonPill>
                      <ButtonPill
                        href={resolveHref(city, section, section.secondaryCta.kind, section.secondaryCta.href)}
                        variant="secondary"
                        trackingData={{
                          activityName: section.heroTitle,
                          city: city.label
                        }}
                      >
                        {section.secondaryCta.label}
                      </ButtonPill>
                    </div>

                    <div className="mt-6 flex flex-wrap gap-2">
                      {section.tags.map((t) => (
                        <TagPill key={t} subtle>
                          {t}
                        </TagPill>
                      ))}
                    </div>

                    <div className="mt-7 grid gap-3 md:grid-cols-3">
                      {section.valueCards.map((c) => (
                        <MiniValueCard key={c.label} {...c} />
                      ))}
                    </div>

                    <div className="mt-7 border-t border-white/10 pt-5 text-xs text-white/60">
                      <span className="text-white/70">Want details?</span>{" "}
                      <Link
                        href={`/activities/${section.slug}`}
                        className="font-semibold underline decoration-white/30 underline-offset-4 hover:text-white"
                      >
                        Learn more about {section.heroTitle}
                      </Link>{" "}
                      or{" "}
                      <Link
                        href={`/${city.param}/${section.slug}`}
                        className="underline decoration-white/25 underline-offset-4 hover:text-white"
                      >
                        view {city.label}-specific schedule
                      </Link>
                      .
                      {showEventbriteLink && (
                        <>
                          {" · "}
                          <Link
                            href={EVENTBRITE_EVENTS_HREF}
                            className="font-semibold text-purple-300 underline decoration-purple-400/30 underline-offset-4 hover:text-purple-200"
                          >
                            Exclusive Eventbrite Events →
                          </Link>
                        </>
                      )}
                    </div>
                  </div>
                </GlassCard>
              )}
            </Reveal>
          </div>
        </div>
      </div>
    </SectionBand>
  );
}
