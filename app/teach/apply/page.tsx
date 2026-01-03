import type { Metadata } from "next";
import TeachApplicationForm from "@/components/teach/TeachApplicationForm";

export const metadata: Metadata = {
  title: "Apply Now — Join CCF's Instructor Team",
  description: "Submit your application to become a creative instructor at Color Cocktail Factory. We're looking for passionate teachers in Chicago and Eugene.",
  alternates: {
    canonical: "https://colorcocktailfactory.com/teach/apply"
  }
};

export default function ApplyPage() {
  return (
    <div className="relative">
      <div className="mx-auto max-w-4xl px-4 py-12">
        <h1 className="mb-4 bg-gradient-to-r from-purple-200 via-pink-200 to-cyan-200 bg-clip-text text-4xl font-bold text-transparent md:text-5xl">
          Apply to Teach
        </h1>
        <p className="mb-12 text-lg text-white/70">
          Ready to join our creative team? Tell us about yourself and your teaching experience.
        </p>
      </div>

      <div className="mx-auto max-w-3xl px-4 pb-24">
        <TeachApplicationForm />
      </div>
    </div>
  );
}
