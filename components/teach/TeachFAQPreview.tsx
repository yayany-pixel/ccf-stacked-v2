import Link from "next/link";
import GlassCard from "@/components/ui/GlassCard";
import Reveal from "@/components/motion/Reveal";

export default function TeachFAQPreview() {
  const faqs = [
    {
      question: "Do I need my own kiln?",
      answer: "Yes, kiln access is required. You need to handle both bisque and glaze firing for your students' pieces."
    },
    {
      question: "What if I don't have a pottery wheel?",
      answer: "No problem! CCF offers a wheel lease-to-own program: $300 deposit, $45/month. After it's paid off, the wheel is yours."
    },
    {
      question: "Where can I teach from?",
      answer: "Anywhere in the USA or Canada! You teach from your own space (home studio, garage, dedicated room) as long as it's clean, safe, and professional."
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
