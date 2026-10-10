import type { Metadata } from "next";
import HomePageClient from "@/components/HomePageClient";
import { getHomepageData } from "@/lib/homepage/server";

export const revalidate = 120;

export const metadata: Metadata = {
  title: { absolute: "Color Cocktail Factory | Pottery & Art Classes" },
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

export default async function HomePage({ searchParams }: { searchParams: { location?: string } }) {
  return <HomePageClient initialData={await getHomepageData()} initialCity={searchParams.location === "eugene" ? "eugene" : "chicago"} />;
}
