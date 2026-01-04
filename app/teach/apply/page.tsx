import type { Metadata } from "next";
import TeachApplicationForm from "@/components/teach/TeachApplicationForm";

export const metadata: Metadata = {
  title: "Apply Now — Partner with CCF",
  description: "Apply to become a wheel throwing instructor partner with Color Cocktail Factory. Teach pottery date nights from your space across USA & Canada.",
  alternates: {
    canonical: "https://colorcocktailfactory.com/teach/apply"
  }
};

export default function ApplyPage() {
  return (
    <div className="relative">
      <div className="mx-auto max-w-4xl px-4 py-12">
        <h1 className="mb-4 bg-gradient-to-r from-purple-200 via-pink-200 to-cyan-200 bg-clip-text text-4xl font-bold text-transparent md:text-5xl">
          Partner Application
        </h1>
        <p className="mb-12 text-lg text-white/70">
          Ready to teach wheel throwing from your space? Tell us about your pottery experience, teaching background, and workspace.
        </p>
      </div>

      <div className="mx-auto max-w-3xl px-4 pb-24">
        <TeachApplicationForm />
      </div>
    </div>
  );
}
