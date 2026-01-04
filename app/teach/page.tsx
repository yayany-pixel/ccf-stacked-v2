import type { Metadata } from "next";
import Link from "next/link";
import ButtonPill from "@/components/ui/ButtonPill";
import GlassCard from "@/components/ui/GlassCard";
import Reveal from "@/components/motion/Reveal";
import TeachHero from "@/components/teach/TeachHero";
import TeachHowItWorks from "@/components/teach/TeachHowItWorks";
import TeachRoles from "@/components/teach/TeachRoles";
import TeachPayPreview from "@/components/teach/TeachPayPreview";
import TeachTestimonials from "@/components/teach/TeachTestimonials";
import TeachFAQPreview from "@/components/teach/TeachFAQPreview";
import TeachCTA from "@/components/teach/TeachCTA";

export const metadata: Metadata = {
  title: "Teach with CCF — Wheel Throwing Partnership",
  description: "Become a wheel throwing instructor partner with Color Cocktail Factory. Teach pottery date nights from your own space across USA & Canada. Kiln required. Portable wheels available for purchase.",
  alternates: {
    canonical: "https://colorcocktailfactory.com/teach"
  }
};

export default function TeachPage() {
  return (
    <div className="relative">
      {/* Hero Section */}
      <TeachHero />

      {/* How It Works */}
      <TeachHowItWorks />

      {/* Partner Roles */}
      <TeachRoles preview />

      {/* Pay Preview */}
      <TeachPayPreview />

      {/* Testimonials */}
      <TeachTestimonials />

      {/* FAQ Preview */}
      <TeachFAQPreview />

      {/* Final CTA */}
      <TeachCTA />
    </div>
  );
}
