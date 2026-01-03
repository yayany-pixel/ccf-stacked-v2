import ButtonPill from "@/components/ui/ButtonPill";
import Reveal from "@/components/motion/Reveal";

export default function TeachCTA() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-16">
      <Reveal>
        <div className="rounded-3xl bg-gradient-to-br from-purple-500/20 via-pink-500/20 to-cyan-500/20 p-12 text-center backdrop-blur-sm">
          <h2 className="mb-4 bg-gradient-to-r from-purple-200 via-pink-200 to-cyan-200 bg-clip-text text-3xl font-bold text-transparent md:text-4xl">
            Ready to Join Our Team?
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-white/70">
            We're actively hiring instructors in Chicago and Eugene. Apply today and start your creative teaching journey.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <ButtonPill href="/teach/apply" variant="primary" className="text-base px-8 py-3">
              Apply Now
            </ButtonPill>
            <ButtonPill href="/teach/faq" variant="secondary" className="text-base px-8 py-3">
              Read FAQ
            </ButtonPill>
          </div>
          <p className="mt-6 text-sm text-white/50">
            Questions? Email us at <a href="mailto:teach@colorcocktailfactory.com" className="text-purple-400 hover:text-purple-300">teach@colorcocktailfactory.com</a>
          </p>
        </div>
      </Reveal>
    </section>
  );
}
