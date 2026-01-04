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
            Teach Pottery.<br />Earn Great Pay.<br />Work from Your Space.
          </h1>
        </Reveal>
        
        <Reveal delay={0.1}>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-white/70 md:text-xl">
            Partner with Color Cocktail Factory to teach wheel-throwing date night workshops from your own studio. 
            We bring the customers, you bring the instruction. Some teaching experience required.
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
              <div className="mb-2 text-3xl font-bold text-pink-400">Your Space</div>
              <div className="text-sm text-white/60">Teach from Home</div>
            </div>
            <div>
              <div className="mb-2 text-3xl font-bold text-purple-400">Wheel Throwing</div>
              <div className="text-sm text-white/60">Date Night Focus</div>
            </div>
            <div>
              <div className="mb-2 text-3xl font-bold text-cyan-400">USA & Canada</div>
              <div className="text-sm text-white/60">Anywhere in North America</div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
