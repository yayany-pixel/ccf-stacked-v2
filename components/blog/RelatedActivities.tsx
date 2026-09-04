import Link from "next/link";
import { sections, type SectionConfig } from "@/lib/config";
import GlassCard from "@/components/ui/GlassCard";

type Props = {
  slugs: string[];
  city: "chicago" | "eugene" | null;
  heading?: string;
};

/**
 * Renders a grid of activity cards from a list of section slugs.
 * When `city` is set, links go to /{city}/{slug}; otherwise to
 * /activities/{slug}.
 */
export default function RelatedActivities({
  slugs,
  city,
  heading = "Related Workshops",
}: Props) {
  const items: SectionConfig[] = slugs
    .map((slug) => sections.find((s) => s.slug === slug))
    .filter((s): s is SectionConfig => Boolean(s));

  if (items.length === 0) return null;

  const hrefFor = (slug: string) =>
    city ? `/${city}/${slug}` : `/activities/${slug}`;

  return (
    <GlassCard>
      <div className="p-6 sm:p-8">
        <h2 className="font-serif text-2xl font-bold">{heading}</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {items.map((s) => (
            <Link
              key={s.slug}
              href={hrefFor(s.slug)}
              className="block rounded-xl border border-white/10 bg-white/5 p-4 transition hover:border-white/25 hover:bg-white/10"
            >
              <div className="font-semibold text-white">{s.heroTitle}</div>
              <p className="mt-1 line-clamp-2 text-sm text-white/70">
                {s.heroDescription}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </GlassCard>
  );
}
