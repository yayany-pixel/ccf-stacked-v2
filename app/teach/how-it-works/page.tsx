import type { Metadata } from "next";
import TeachHowItWorks from "@/components/teach/TeachHowItWorks";
import TeachCTA from "@/components/teach/TeachCTA";

export const metadata: Metadata = {
  title: "How It Works — Teaching at CCF",
  description: "Learn about our instructor onboarding process, training program, and what to expect when teaching at Color Cocktail Factory.",
  alternates: {
    canonical: "https://colorcocktailfactory.com/teach/how-it-works"
  }
};

export default function HowItWorksPage() {
  return (
    <div className="relative">
      <div className="mx-auto max-w-4xl px-4 py-12">
        <h1 className="mb-4 bg-gradient-to-r from-purple-200 via-pink-200 to-cyan-200 bg-clip-text text-4xl font-bold text-transparent md:text-5xl">
          How It Works
        </h1>
        <p className="mb-12 text-lg text-white/70">
          From application to your first class, here's what to expect when joining our creative team.
        </p>
      </div>

      <TeachHowItWorks detailed />
      <TeachCTA />
    </div>
  );
}
