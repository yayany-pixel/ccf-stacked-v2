import type { Metadata } from "next";
import TeachFAQ, { teachFaqCategories } from "@/components/teach/TeachFAQ";
import TeachCTA from "@/components/teach/TeachCTA";

export const metadata: Metadata = {
  title: "FAQ — Teaching at CCF",
  description: "Frequently asked questions about becoming an instructor at Color Cocktail Factory. Learn about requirements, scheduling, training, and more.",
  alternates: {
    canonical: "https://colorcocktailfactory.com/teach/faq"
  }
};

export default function FAQPage() {
  const allFaqs = teachFaqCategories.flatMap(c => c.questions);
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: allFaqs.map(faq => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a
      }
    }))
  };

  return (
    <div className="relative">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <div className="mx-auto max-w-4xl px-4 py-12">
        <h1 className="mb-4 bg-gradient-to-r from-purple-200 via-pink-200 to-cyan-200 bg-clip-text text-4xl font-bold text-transparent md:text-5xl">
          Frequently Asked Questions
        </h1>
        <p className="mb-12 text-lg text-white/70">
          Everything you need to know about teaching at Color Cocktail Factory.
        </p>
      </div>

      <TeachFAQ />
      <TeachCTA />
    </div>
  );
}
