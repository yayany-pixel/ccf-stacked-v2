import { type HomepageData } from "@/lib/homepage/types";
import { generateLocalBusinessSchema } from "@/lib/enhancedStructuredData";
import { getCityByParam } from "@/lib/links";

export default function HomepageStructuredData({ data }: { data: HomepageData }) {
  const events = data.activities.flatMap(activity => {
    if (!activity.upcomingSessions || activity.upcomingSessions.length === 0) return [];
    
    return activity.upcomingSessions.map((sessionTime, index) => {
      const cityData = activity.city === "chicago" 
        ? { name: "Color Cocktail Factory - Chicago", address: { "@type": "PostalAddress", streetAddress: "1142 W. 18th Street", addressLocality: "Chicago", addressRegion: "IL", postalCode: "60608", addressCountry: "US" } }
        : { name: "Color Cocktail Factory - Eugene", address: { "@type": "PostalAddress", streetAddress: "3295 Cross Street", addressLocality: "Eugene", addressRegion: "OR", postalCode: "97402", addressCountry: "US" } };

      const url = `https://colorcocktailfactory.com${activity.detailUrl || `/activities/${activity.key.replace(/^(chicago|eugene|online)-/, "")}`}`;
      const price = activity.currentPrice ?? 25; // fallback
      
      return {
        "@context": "https://schema.org",
        "@type": "Event",
        name: activity.title,
        description: activity.description,
        startDate: sessionTime,
        url,
        image: activity.image?.path ? `https://colorcocktailfactory.com${activity.image.path}` : "https://colorcocktailfactory.com/og-image.jpg",
        location: {
          "@type": "Place",
          ...cityData
        },
        offers: {
          "@type": "Offer",
          url,
          price: price,
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
          validFrom: new Date().toISOString(),
          priceSpecification: {
            "@type": "UnitPriceSpecification",
            price: price,
            priceCurrency: "USD",
            referenceQuantity: {
              "@type": "QuantitativeValue",
              value: activity.priceUnit === "for two" ? 2 : 1,
              unitCode: "C62"
            }
          }
        }
      };
    });
  });

  const chicagoBusiness = generateLocalBusinessSchema(getCityByParam("chicago"));
  const eugeneBusiness = generateLocalBusinessSchema(getCityByParam("eugene"));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([chicagoBusiness, eugeneBusiness]) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(events) }}
      />
    </>
  );
}