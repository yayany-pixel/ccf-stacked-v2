import type { Metadata } from "next";
import HomePageClient from "@/components/HomePageClient";

export const metadata: Metadata = {
  title: { absolute: "Color Cocktail Factory | Pottery & Creative Workshops in Chicago & Eugene" },
  description: "Choose your location: Expert-guided pottery, glass fusion, mosaics & more in Chicago (Pilsen) and Eugene, Oregon. BYOB, beginner-friendly creative experiences.",
  alternates: {
    canonical: "https://colorcocktailfactory.com/"
  },
  openGraph: {
    title: "Color Cocktail Factory | Pottery & Creative Workshops",
    description: "Expert-guided pottery, glass fusion, mosaics & more in Chicago & Eugene. BYOB, beginner-friendly.",
    url: "https://colorcocktailfactory.com/",
    type: "website",
    images: ["/og-image.jpg"]
  },
  twitter: {
    card: "summary_large_image",
    title: "Color Cocktail Factory | Pottery & Creative Workshops",
    description: "Expert-guided pottery, glass fusion, mosaics & more in Chicago & Eugene."
  }
};

export default function HomePage() {
  return (
    <>
      {/* Week 2: Use client component for A/B testing + analytics */}
      <HomePageClient />
    </>
  );
}

