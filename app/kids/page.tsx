import type { Metadata } from "next";
import { KidsHub } from "@/components/kids/KidsPage";
import { KIDS_PHOTO } from "@/lib/kids";
export const metadata: Metadata = {
  title: "Kids Pottery Classes & Birthday Parties",
  description: "Explore kids pottery birthday parties and upcoming wheel throwing classes at Color Cocktail Factory in Chicago and Eugene. Choose your experience and city.",
  alternates: { canonical: "https://colorcocktailfactory.com/kids" },
  openGraph: { title: "Kids & Birthdays | Color Cocktail Factory", description: "Big ideas. Little hands. Explore kids pottery and creative birthdays in Chicago and Eugene.", url: "https://colorcocktailfactory.com/kids", images: [KIDS_PHOTO], type: "website" },
};
export default KidsHub;
