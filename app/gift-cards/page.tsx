import type { Metadata } from "next";
import GiftCardsStorefront from "@/components/GiftCardsStorefront";
import type { CityParam } from "@/lib/config";
import {
  fetchLiveAcuityProducts,
  GIFT_FAQS,
  resolveGiftCatalog,
} from "@/lib/gifts";
import { faqJsonLd, breadcrumbJsonLd } from "@/lib/structuredData";

export const metadata: Metadata = {
  title: {
    absolute: "Gift Experiences & Gift Cards | Color Cocktail Factory",
  },
  description:
    "Explore the current Acuity gift catalog for Chicago, Eugene, and online experiences. Browse live gift descriptions and prices, then buy securely in Acuity.",
  alternates: {
    canonical: "https://colorcocktailfactory.com/gift-cards",
  },
  openGraph: {
    title: "Give them something to look forward to | Color Cocktail Factory Gift Cards",
    description:
      "A first spin on the pottery wheel. A date together. Something beautiful made by hand. Choose their experience—let them choose the date.",
    url: "https://colorcocktailfactory.com/gift-cards",
    type: "website",
    images: [
      {
        url: "https://colorcocktailfactory.com/images/classes/approved-07-Go6xn9-08daf172fdf1.webp",
        width: 1200,
        height: 630,
        alt: "Pottery Date Night for Two and Creative Gift Experiences at Color Cocktail Factory",
      },
    ],
  },
};

export default async function GiftCardsPage({
  searchParams,
}: {
  searchParams?: {
    city?: string;
    location?: string;
    gift?: string;
    workshop?: string;
    amount?: string;
  };
}) {
  const rawProducts = await fetchLiveAcuityProducts();
  const groups = resolveGiftCatalog(rawProducts);

  const rawCity = searchParams?.city || searchParams?.location;
  const initialCity: CityParam | undefined =
    rawCity === "eugene" || rawCity === "chicago" ? rawCity : undefined;

  const faqSchema = faqJsonLd([...GIFT_FAQS]);
  const breadcrumbs = breadcrumbJsonLd([
    { name: "Home", url: "https://colorcocktailfactory.com" },
    {
      name: "Gift Experiences & Choose Your Gift Card Amount",
      url: "https://colorcocktailfactory.com/gift-cards",
    },
  ]);

  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="min-h-screen px-4 pb-20 pt-28 sm:px-6"
    >
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />
      <GiftCardsStorefront
        groups={groups}
        initialCity={initialCity}
      />
    </main>
  );
}
