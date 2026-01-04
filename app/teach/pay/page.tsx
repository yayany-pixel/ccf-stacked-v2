import type { Metadata } from "next";
import GlassCard from "@/components/ui/GlassCard";
import Reveal from "@/components/motion/Reveal";
import TeachCTA from "@/components/teach/TeachCTA";

export const metadata: Metadata = {
  title: "Partnership Model — CCF Instructor Partnership",
  description: "Learn about the Color Cocktail Factory instructor partnership model, revenue structure, and what we provide vs. what you provide.",
  alternates: {
    canonical: "https://colorcocktailfactory.com/teach/pay"
  }
};

export default function PayPage() {
  const revenueStructure = [
    {
      title: "Class Revenue",
      description: "Earn from each class booking. Payment structure varies by partnership agreement.",
      highlight: "Your Business"
    },
    {
      title: "Finishing Fees",
      description: "Charge students for bisque firing ($5) and glaze finishing ($10) — these fees are yours",
      highlight: "Additional Income"
    },
    {
      title: "Flexible Schedule",
      description: "Set your availability. You control when you're open for bookings.",
      highlight: "Work-Life Balance"
    }
  ];

  const whatCCFProvides = [
    "Customer bookings through marketing",
    "Clay shipments delivered to you",
    "Glaze shipments delivered to you",
    "Wheel lease-to-own option ($300 deposit, $45/month)",
    "Curriculum guidance and program standards",
    "Booking management platform"
  ];

  const whatYouProvide = [
    "Teaching space (home studio or dedicated area)",
    "Kiln access for bisque + glaze firing",
    "Wheels (your own or leased from CCF)",
    "Basic pottery tools (ribs, sponges, wire cutters, etc.)",
    "Teaching and class facilitation",
    "Customer support (pickup/shipping coordination)",
    "Professional, guest-ready environment"
  ];

  return (
    <div className="relative">
      <div className="mx-auto max-w-4xl px-4 py-12">
        <h1 className="mb-4 bg-gradient-to-r from-purple-200 via-pink-200 to-cyan-200 bg-clip-text text-4xl font-bold text-transparent md:text-5xl">
          Partnership Model
        </h1>
        <p className="mb-12 text-lg text-white/70">
          How the CCF instructor partnership works and what each party provides.
        </p>
      </div>

      {/* Revenue Structure */}
      <section className="mx-auto max-w-5xl px-4 py-12">
        <Reveal>
          <h2 className="mb-8 text-center text-3xl font-bold">Revenue Opportunities</h2>
        </Reveal>
        <div className="grid gap-6 md:grid-cols-3">
          {revenueStructure.map((item, index) => (
            <Reveal key={item.title} delay={index * 0.1}>
              <GlassCard className="p-6">
                <div className="mb-3 rounded-full bg-purple-500/20 px-3 py-1 text-center text-xs font-semibold text-purple-300">
                  {item.highlight}
                </div>
                <h3 className="mb-2 text-lg font-semibold">{item.title}</h3>
                <p className="text-sm text-white/60">{item.description}</p>
              </GlassCard>
            </Reveal>
          ))}
        </div>
      </section>

      {/* What Each Party Provides */}
      <section className="mx-auto max-w-5xl px-4 py-12">
        <Reveal>
          <h2 className="mb-8 text-center text-3xl font-bold">What We Each Bring to the Table</h2>
        </Reveal>
        <div className="grid gap-8 md:grid-cols-2">
          <Reveal delay={0.1}>
            <GlassCard className="p-8">
              <h3 className="mb-6 text-xl font-bold text-purple-300">CCF Provides</h3>
              <ul className="space-y-3">
                {whatCCFProvides.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="mt-1 text-pink-400">✓</span>
                    <span className="text-white/80">{item}</span>
                  </li>
                ))}
              </ul>
            </GlassCard>
          </Reveal>
          <Reveal delay={0.2}>
            <GlassCard className="p-8">
              <h3 className="mb-6 text-xl font-bold text-cyan-300">You Provide</h3>
              <ul className="space-y-3">
                {whatYouProvide.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="mt-1 text-cyan-400">✓</span>
                    <span className="text-white/80">{item}</span>
                  </li>
                ))}
              </ul>
            </GlassCard>
          </Reveal>
        </div>
      </section>

      {/* Wheel Lease-to-Own Details */}
      <section className="mx-auto max-w-4xl px-4 py-12">
        <Reveal>
          <GlassCard className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 p-8">
            <h2 className="mb-4 text-2xl font-bold">Wheel Lease-to-Own Program</h2>
            <p className="mb-4 text-white/80">
              Don't have wheels yet? We make it easy to get started.
            </p>
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <div className="mb-1 text-2xl font-bold text-pink-400">$300</div>
                <div className="text-sm text-white/60">Initial deposit</div>
              </div>
              <div>
                <div className="mb-1 text-2xl font-bold text-purple-400">$45/mo</div>
                <div className="text-sm text-white/60">Monthly payment</div>
              </div>
              <div>
                <div className="mb-1 text-2xl font-bold text-cyan-400">Yours</div>
                <div className="text-sm text-white/60">After fully paid off</div>
              </div>
            </div>
            <p className="mt-6 text-sm text-white/60">
              We ship the wheel(s) to you, and once the lease is paid off, the equipment becomes yours to keep.
            </p>
          </GlassCard>
        </Reveal>
      </section>

      {/* Finishing Fees Explanation */}
      <section className="mx-auto max-w-4xl px-4 py-12">
        <Reveal>
          <GlassCard className="p-8">
            <h2 className="mb-4 text-2xl font-bold">Finishing Fees (Yours to Keep)</h2>
            <p className="mb-6 text-white/80">
              After the wheel-throwing class, students need their pieces fired and glazed. 
              You charge them directly for this service:
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-lg bg-black/30 p-4">
                <div className="mb-1 text-xl font-bold text-pink-400">$5 per piece</div>
                <div className="text-sm text-white/70">Bisque Firing</div>
                <p className="mt-2 text-xs text-white/50">Covers kiln cost and your time for first firing</p>
              </div>
              <div className="rounded-lg bg-black/30 p-4">
                <div className="mb-1 text-xl font-bold text-purple-400">$10 per piece</div>
                <div className="text-sm text-white/70">Glaze Finish</div>
                <p className="mt-2 text-xs text-white/50">For basic glaze application + glaze firing</p>
              </div>
            </div>
            <p className="mt-6 text-sm text-white/60">
              You set your exact fees within this range. These fees cover your kiln costs, time, and firing expertise — they're part of your revenue stream.
            </p>
          </GlassCard>
        </Reveal>
      </section>

      <TeachCTA />
    </div>
  );
}
