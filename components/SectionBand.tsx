import type { SectionConfig } from "@/lib/config";

export default function SectionBand({
  section,
  children
}: {
  section: SectionConfig;
  children: React.ReactNode;
}) {
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 parallax-float">
        <video
          className="h-full w-full opacity-25"
          src={section.videoSrc}
          autoPlay
          muted
          loop
          playsInline
          loading="lazy"
          preload="none"
        />
        <div className={`absolute inset-0 ${section.overlayClass}`} />
        <div className="ccf-grain absolute inset-0" />
        <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/25 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/30 to-transparent" />
      </div>

      <div className="relative">{children}</div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-white/10 shimmer-drift" />
    </section>
  );
}
