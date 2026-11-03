import type { Metadata } from "next";
import Header from "@/components/Header";
import HolidayOverlay from "@/components/HolidayOverlay";
import { getCityByParam } from "@/lib/links";
import { buildCityMetadata } from "@/lib/seo";
import { localBusinessJsonLd } from "@/lib/structuredData";
import CityPageChrome from "@/components/CityPageChrome";

export async function generateMetadata({
  params
}: {
  params: { city: string };
}): Promise<Metadata> {
  const city = getCityByParam(params.city);
  return buildCityMetadata(city);
}

export default function CityLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: { city: string };
}) {
  const city = getCityByParam(params.city);

  return (
    <>
      <CityPageChrome>
        <HolidayOverlay />
        <Header city={city} />
      </CityPageChrome>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd(city)) }}
      />
      {children}
    </>
  );
}
