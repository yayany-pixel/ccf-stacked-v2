import Link from "next/link";
import GlassCard from "@/components/ui/GlassCard";
import Reveal from "@/components/motion/Reveal";

export default function TeachPayPreview() {
  const highlights = [
    {
      amount: "Per Class",
      role: "Class Revenue",
      note: "You set your pricing"
    },
    {
      amount: "+ Finishing Fees",
      role: "Additional Income",
      note: "$5 bisque + $10 glaze per piece"
    },
    {
      amount: "Supplies Included",
      role: "Clay & Glazes",
      note: "CCF ships to you"
    }
  ];

  return (
    <section className="mx-auto max-w-5xl px-4 py-16">
      <Reveal>
        <h2 className="mb-12 text-center text-3xl font-bold md:text-4xl">
          What CCF Provides
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
          <h3 className="mb-4 text-center text-xl font-bold">What We Provide vs What You Provide</h3>
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h4 className="mb-3 font-semibold text-purple-300">CCF Provides:</h4>
              <div className="space-y-2">
                <div className="flex items-start gap-3">
                  <span className="text-pink-400">✓</span>
                  <div>
                    <div className="font-semibold">Customer Bookings</div>
                    <div className="text-sm text-white/60">Marketing + reservations</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-pink-400">✓</span>
                  <div>
                    <div className="font-semibold">Clay & Glaze Shipments</div>
                    <div className="text-sm text-white/60">Supplies delivered to you</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-pink-400">✓</span>
                  <div>
                    <div className="font-semibold">Wheel Lease Option</div>
                    <div className="text-sm text-white/60">$300 deposit, $45/mo lease-to-own</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-pink-400">✓</span>
                  <div>
                    <div className="font-semibold">Program Standards</div>
                    <div className="text-sm text-white/60">Curriculum guidance</div>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h4 className="mb-3 font-semibold text-cyan-300">You Provide:</h4>
              <div className="space-y-2">
                <div className="flex items-start gap-3">
                  <span className="text-cyan-400">✓</span>
                  <div>
                    <div className="font-semibold">Teaching & Instruction</div>
                    <div className="text-sm text-white/60">Lead the 2-hour classes</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-cyan-400">✓</span>
                  <div>
                    <div className="font-semibold">Kiln Access & Firing</div>
                    <div className="text-sm text-white/60">Bisque + glaze firing workflow</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-cyan-400">✓</span>
                  <div>
                    <div className="font-semibold">Teaching Space</div>
                    <div className="text-sm text-white/60">Clean, safe, guest-ready area</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-cyan-400">✓</span>
                  <div>
                    <div className="font-semibold">Customer Support</div>
                    <div className="text-sm text-white/60">Pickup/shipping, questions</div>
                  </div>
                </div>
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
