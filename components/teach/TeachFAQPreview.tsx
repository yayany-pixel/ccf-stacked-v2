import Link from "next/link";
import GlassCard from "@/components/ui/GlassCard";
import Reveal from "@/components/motion/Reveal";

export default function TeachFAQPreview() {
  const faqs = [
    {
      question: "Do I need teaching experience?",
      answer: "No! Many of our best instructors had never taught before. We provide comprehensive training."
    },
    {
      question: "How flexible is the schedule?",
      answer: "Very. You choose your availability and we match you with shifts. Most instructors work 1-3 shifts per week."
    },
    {
      question: "What if I only know one medium?",
      answer: "Perfect! You can start with one and learn more over time. We offer paid cross-training in all mediums."
    }
  ];

  return (
    <section className="mx-auto max-w-4xl px-4 py-16">
      <Reveal>
        <h2 className="mb-12 text-center text-3xl font-bold md:text-4xl">
          Common Questions
        </h2>
      </Reveal>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <Reveal key={faq.question} delay={index * 0.1}>
            <GlassCard className="p-6">
              <h3 className="mb-2 font-semibold text-purple-300">{faq.question}</h3>
              <p className="text-sm text-white/70">{faq.answer}</p>
            </GlassCard>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.4}>
        <div className="mt-8 text-center">
          <Link
            href="/teach/faq"
            className="inline-flex items-center gap-2 text-sm font-medium text-purple-400 hover:text-purple-300"
          >
            View all FAQs →
          </Link>
        </div>
      </Reveal>
    </section>
  );
}
