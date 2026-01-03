import type { Metadata } from "next";
import GlassCard from "@/components/ui/GlassCard";
import Reveal from "@/components/motion/Reveal";
import TeachCTA from "@/components/teach/TeachCTA";

export const metadata: Metadata = {
  title: "Pay & Growth — CCF Instructor Compensation",
  description: "Competitive pay structure, growth opportunities, and benefits for Color Cocktail Factory instructors. Transparent compensation and clear advancement paths.",
  alternates: {
    canonical: "https://colorcocktailfactory.com/teach/pay"
  }
};

export default function PayPage() {
  const payStructure = [
    {
      role: "Assistant Instructor",
      hourly: "$18-22/hr",
      description: "Support lead instructors, prep materials, and learn workshop management"
    },
    {
      role: "Lead Instructor (Single Medium)",
      hourly: "$25-35/hr",
      description: "Teach pottery OR glass OR mosaic workshops independently"
    },
    {
      role: "Lead Instructor (Multi-Medium)",
      hourly: "$30-40/hr",
      description: "Certified to teach across 2+ mediums with demonstrated expertise"
    },
    {
      role: "Master Instructor / Mentor",
      hourly: "$35-50/hr",
      description: "Train new instructors, develop curriculum, and lead premium experiences"
    }
  ];

  const benefits = [
    "Flexible scheduling — choose shifts that fit your life",
    "Free studio access during off-hours for personal projects",
    "Materials discount (30% off clay, glazes, and supplies)",
    "Professional development stipend ($200/year for workshops/conferences)",
    "Paid training and certification programs",
    "Performance bonuses for outstanding class ratings",
    "Health insurance stipend for full-time instructors (20+ hrs/week)"
  ];

  const growthPath = [
    { stage: "Months 1-3", title: "Onboarding & Certification", description: "Shadow experienced instructors, complete medium-specific training, earn your first teaching cert" },
    { stage: "Months 4-12", title: "Independent Teaching", description: "Lead your own classes, build your student following, refine your teaching style" },
    { stage: "Year 2+", title: "Specialization & Leadership", description: "Expand to additional mediums, mentor new instructors, or develop signature workshops" }
  ];

  return (
    <div className="relative">
      <div className="mx-auto max-w-4xl px-4 py-12">
        <h1 className="mb-4 bg-gradient-to-r from-purple-200 via-pink-200 to-cyan-200 bg-clip-text text-4xl font-bold text-transparent md:text-5xl">
          Pay & Growth
        </h1>
        <p className="mb-12 text-lg text-white/70">
          Transparent compensation, real benefits, and clear advancement opportunities.
        </p>
      </div>

      {/* Pay Structure */}
      <section className="mx-auto max-w-5xl px-4 py-12">
        <Reveal>
          <h2 className="mb-8 text-center text-3xl font-bold">Competitive Hourly Rates</h2>
        </Reveal>
        <div className="grid gap-6 md:grid-cols-2">
          {payStructure.map((tier, index) => (
            <Reveal key={tier.role} delay={index * 0.1}>
              <GlassCard className="p-6">
                <div className="mb-2 flex items-baseline justify-between">
                  <h3 className="text-lg font-semibold">{tier.role}</h3>
                  <span className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-xl font-bold text-transparent">
                    {tier.hourly}
                  </span>
                </div>
                <p className="text-sm text-white/60">{tier.description}</p>
              </GlassCard>
            </Reveal>
          ))}
        </div>
        <Reveal delay={0.4}>
          <p className="mt-6 text-center text-sm text-white/50">
            Rates vary by location, experience, and certifications. All instructors start with paid training.
          </p>
        </Reveal>
      </section>

      {/* Benefits */}
      <section className="mx-auto max-w-4xl px-4 py-12">
        <Reveal>
          <h2 className="mb-8 text-center text-3xl font-bold">Beyond the Paycheck</h2>
        </Reveal>
        <Reveal delay={0.1}>
          <GlassCard className="p-8">
            <ul className="space-y-4">
              {benefits.map((benefit, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="mt-1 text-pink-400">✓</span>
                  <span className="text-white/80">{benefit}</span>
                </li>
              ))}
            </ul>
          </GlassCard>
        </Reveal>
      </section>

      {/* Growth Path */}
      <section className="mx-auto max-w-5xl px-4 py-12">
        <Reveal>
          <h2 className="mb-8 text-center text-3xl font-bold">Your Growth Path</h2>
        </Reveal>
        <div className="grid gap-6 md:grid-cols-3">
          {growthPath.map((phase, index) => (
            <Reveal key={phase.stage} delay={index * 0.1}>
              <GlassCard className="p-6">
                <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-purple-400">
                  {phase.stage}
                </div>
                <h3 className="mb-3 text-lg font-semibold">{phase.title}</h3>
                <p className="text-sm text-white/60">{phase.description}</p>
              </GlassCard>
            </Reveal>
          ))}
        </div>
      </section>

      <TeachCTA />
    </div>
  );
}
