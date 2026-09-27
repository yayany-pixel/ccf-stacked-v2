import { cityBookingUrl } from "@/lib/booking";

export default function PricingDisplay({ variant = "full", bookingUrl }: { variant?: "full" | "compact"; bookingUrl?: string }) {
  if (variant === "compact") return <p className="text-xl font-semibold text-white">6 live sessions · $150 total</p>;
  return (
    <div className="rounded-2xl border border-white/20 bg-gradient-to-br from-purple-900/40 to-pink-900/40 p-8 text-center backdrop-blur-sm">
      <p className="text-sm font-semibold uppercase tracking-wide text-purple-200">Six-session online pottery course</p>
      <p className="mt-4 font-serif text-5xl font-bold text-white">$150</p>
      <p className="mt-3 text-white/75">One payment for all six live sessions, a tabletop wheel, tools, and clay for your first session.</p>
      {!bookingUrl && <p className="mt-4 text-sm text-white/70">Enrollment is currently closed. Check our online schedule for new offerings.</p>}
      <a href={bookingUrl ?? cityBookingUrl("online")} target="_blank" rel="noopener noreferrer"
        className="mt-6 block rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-4 font-semibold text-white">
        {bookingUrl ? "Enroll in Six Sessions — $150" : "View Current Online Classes"}
      </a>
    </div>
  );
}
