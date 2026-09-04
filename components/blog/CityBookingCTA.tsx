import GlassCard from "@/components/ui/GlassCard";
import ButtonPill from "@/components/ui/ButtonPill";

type Props = {
  headline?: string;
  message?: string;
  /** Which city button appears first / uses the primary style. */
  primaryCity?: "chicago" | "eugene";
};

/**
 * Reusable Chicago + Eugene booking CTA for blog posts.
 * Links go to the on-site city pages so the booking layer stays
 * consistent with the rest of the site.
 */
export default function CityBookingCTA({
  headline = "Book a Class in Chicago or Eugene",
  message = "Beginner-friendly, all materials included. Pick a city to see available times.",
  primaryCity = "chicago",
}: Props) {
  const chicagoFirst = primaryCity === "chicago";
  return (
    <GlassCard className="bg-gradient-to-br from-purple-500/20 to-pink-500/20">
      <div className="p-8 text-center">
        <h2 className="font-serif text-2xl font-bold">{headline}</h2>
        <p className="mx-auto mt-3 max-w-2xl leading-relaxed text-white/85">
          {message}
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          {chicagoFirst ? (
            <>
              <ButtonPill href="/chicago" variant="primary">
                See Chicago Classes
              </ButtonPill>
              <ButtonPill href="/eugene" variant="secondary">
                See Eugene Classes
              </ButtonPill>
            </>
          ) : (
            <>
              <ButtonPill href="/eugene" variant="primary">
                See Eugene Classes
              </ButtonPill>
              <ButtonPill href="/chicago" variant="secondary">
                See Chicago Classes
              </ButtonPill>
            </>
          )}
        </div>
      </div>
    </GlassCard>
  );
}
