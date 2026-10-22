import type { Metadata } from "next";
import HomePageClient from "@/components/HomePageClient";
import HomepageStructuredData from "@/components/HomepageStructuredData";
import { getHomepageData } from "@/lib/homepage/server";

export const revalidate = 120;
export const metadata: Metadata = {
  title: { absolute: "Creative Workshops & Pottery in Chicago | Color Cocktail Factory" },
  description: "Beginner-friendly pottery, mosaics, glass art, and creative BYOB workshops in Chicago’s Pilsen neighborhood.",
  alternates: { canonical: "https://colorcocktailfactory.com/chicago" },
  openGraph: { title: "Creative Workshops & Pottery in Chicago | Color Cocktail Factory", description: "Beginner-friendly pottery, mosaics, glass art, and creative BYOB workshops in Chicago’s Pilsen neighborhood.", url: "https://colorcocktailfactory.com/chicago" },
};
export default async function CityHomepage() {
  const data = await getHomepageData();
  return <><HomepageStructuredData data={{ ...data, activities: data.activities.filter(activity => activity.city === "chicago" || activity.city === "online") }} /><HomePageClient initialData={data} initialCity="chicago" /></>;
}
