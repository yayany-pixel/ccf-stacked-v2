import type { Metadata } from "next";
import HomePageClient from "@/components/HomePageClient";
import HomepageStructuredData from "@/components/HomepageStructuredData";
import { getHomepageData } from "@/lib/homepage/server";

export const revalidate = 120;
export const metadata: Metadata = {
  title: { absolute: "Creative Workshops & Pottery in Eugene | Color Cocktail Factory" },
  description: "Explore pottery, painting, and hands-on creative workshops at Color Cocktail Factory in Eugene, Oregon.",
  alternates: { canonical: "https://colorcocktailfactory.com/eugene" },
  openGraph: { title: "Creative Workshops & Pottery in Eugene | Color Cocktail Factory", description: "Explore pottery, painting, and hands-on creative workshops at Color Cocktail Factory in Eugene, Oregon.", url: "https://colorcocktailfactory.com/eugene" },
};
export default async function CityHomepage() {
  const data = await getHomepageData();
  return <><HomepageStructuredData data={{ ...data, activities: data.activities.filter(activity => activity.city === "eugene" || activity.city === "online") }} /><HomePageClient initialData={data} initialCity="eugene" /></>;
}
