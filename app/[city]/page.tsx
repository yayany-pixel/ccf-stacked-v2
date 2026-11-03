import type { Metadata } from "next";
import { notFound } from "next/navigation";
import HomePageClient from "@/components/HomePageClient";
import { getHomepageData } from "@/lib/homepage/server";
import { getCityByParam } from "@/lib/links";
import { buildCityMetadata } from "@/lib/seo";

export const revalidate = 120;
export const dynamicParams = false;

export function generateStaticParams() {
  return [{ city: "chicago" }, { city: "eugene" }];
}

function requireCity(value: string) {
  if (value !== "chicago" && value !== "eugene") notFound();
  return value;
}

export function generateMetadata({ params }: { params: { city: string } }): Metadata {
  return buildCityMetadata(getCityByParam(requireCity(params.city)));
}

export default async function CityHomePage({ params }: { params: { city: string } }) {
  const city = requireCity(params.city);
  const data = await getHomepageData();
  return <HomePageClient initialData={data} initialCity={city} />;
}
