import ButtonPill from "@/components/ui/ButtonPill";
import Reveal from "@/components/motion/Reveal";

export default function TeachHero() {
  return (
    <section className="relative overflow-hidden py-24">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-500/10 via-transparent to-transparent" />
      
      <div className="relative mx-auto max-w-5xl px-4 text-center">
        <Reveal>
          <h1 className="mb-6 bg-gradient-to-r from-purple-200 via-pink-200 to-cyan-200 bg-clip-text text-5xl font-bold text-transparent md:text-7xl">
            Teach Creativity.<br />Earn Great Pay.<br />Build Community.
          </h1>
        </Reveal>
        
        <Reveal delay={0.1}>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-white/70 md:text-xl">
            Join Color Cocktail Factory's instructor team and lead hands-on creative workshops 
            in pottery, glass fusion, mosaics, and more. No teaching experience required — 
            just passion and willingness to learn.
          </p>
        </Reveal>

        <Reveal delay={0.2}>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <ButtonPill href="/teach/apply" variant="primary" className="text-base px-8 py-3">
              Apply Now
            </ButtonPill>
            <ButtonPill href="/teach/how-it-works" variant="secondary" className="text-base px-8 py-3">
              How It Works
            </ButtonPill>
          </div>
        </Reveal>

        <Reveal delay={0.3}>
          <div className="mt-16 grid gap-6 text-center md:grid-cols-3">
            <div>
              <div className="mb-2 text-3xl font-bold text-pink-400">$25-50/hr</div>
              <div className="text-sm text-white/60">Competitive Pay</div>
            </div>
            <div>
              <div className="mb-2 text-3xl font-bold text-purple-400">Flexible</div>
              <div className="text-sm text-white/60">Choose Your Schedule</div>
            </div>
            <div>
              <div className="mb-2 text-3xl font-bold text-cyan-400">2 Cities</div>
              <div className="text-sm text-white/60">Chicago & Eugene</div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
