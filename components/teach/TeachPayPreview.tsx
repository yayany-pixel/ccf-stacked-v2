import Link from "next/link";
import GlassCard from "@/components/ui/GlassCard";
import Reveal from "@/components/motion/Reveal";

export default function TeachPayPreview() {
  const highlights = [
    {
      amount: "$25-35/hr",
      role: "Lead Instructor",
      note: "Most common starting rate"
    },
    {
      amount: "$30-40/hr",
      role: "Multi-Medium",
      note: "Teach 2+ mediums"
    },
    {
      amount: "$35-50/hr",
      role: "Master Instructor",
      note: "Train others + curriculum"
    }
  ];

  return (
    <section className="mx-auto max-w-5xl px-4 py-16">
      <Reveal>
        <h2 className="mb-12 text-center text-3xl font-bold md:text-4xl">
          Competitive Pay & Benefits
        </h2>
      </Reveal>

      <div className="mb-8 grid gap-6 md:grid-cols-3">
        {highlights.map((item, index) => (
          <Reveal key={item.role} delay={index * 0.1}>
            <GlassCard className="p-6 text-center">
              <div className="mb-2 bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-3xl font-bold text-transparent">
                {item.amount}
              </div>
              <div className="mb-1 font-semibold text-white/90">{item.role}</div>
              <div className="text-xs text-white/50">{item.note}</div>
            </GlassCard>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.4}>
        <GlassCard className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 p-8">
          <h3 className="mb-4 text-center text-xl font-bold">Plus Benefits</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-start gap-3">
              <span className="text-pink-400">✓</span>
              <div>
                <div className="font-semibold">Free Studio Access</div>
                <div className="text-sm text-white/60">Off-hours for personal projects</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-pink-400">✓</span>
              <div>
                <div className="font-semibold">Materials Discount</div>
                <div className="text-sm text-white/60">30% off clay, glazes, supplies</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-pink-400">✓</span>
              <div>
                <div className="font-semibold">Paid Training</div>
                <div className="text-sm text-white/60">All certifications compensated</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-pink-400">✓</span>
              <div>
                <div className="font-semibold">Flexible Schedule</div>
                <div className="text-sm text-white/60">Choose shifts that fit your life</div>
              </div>
            </div>
          </div>
          <div className="mt-6 text-center">
            <Link
              href="/teach/pay"
              className="inline-flex items-center gap-2 text-sm font-medium text-purple-400 hover:text-purple-300"
            >
              See full compensation details →
            </Link>
          </div>
        </GlassCard>
      </Reveal>
    </section>
  );
}
