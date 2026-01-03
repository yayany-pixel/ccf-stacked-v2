import type { Metadata } from "next";
import TeachRoles from "@/components/teach/TeachRoles";
import TeachCTA from "@/components/teach/TeachCTA";

export const metadata: Metadata = {
  title: "Instructor Roles — Teach at CCF",
  description: "Explore instructor opportunities at Color Cocktail Factory. From pottery wheel specialists to multi-medium instructors, find the role that fits your creative expertise.",
  alternates: {
    canonical: "https://colorcocktailfactory.com/teach/roles"
  }
};

export default function RolesPage() {
  return (
    <div className="relative">
      <div className="mx-auto max-w-4xl px-4 py-12">
        <h1 className="mb-4 bg-gradient-to-r from-purple-200 via-pink-200 to-cyan-200 bg-clip-text text-4xl font-bold text-transparent md:text-5xl">
          Instructor Roles
        </h1>
        <p className="mb-12 text-lg text-white/70">
          We're looking for passionate instructors across multiple creative disciplines.
        </p>
      </div>

      <TeachRoles />
      <TeachCTA />
    </div>
  );
}
