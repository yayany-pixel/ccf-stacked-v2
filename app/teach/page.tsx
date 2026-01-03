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
  title: "Teach with CCF — Join Our Creative Team",
  description: "Become a pottery and creative arts instructor at Color Cocktail Factory. Lead engaging workshops in Chicago or Eugene with competitive pay, flexible schedules, and a supportive community.",
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
