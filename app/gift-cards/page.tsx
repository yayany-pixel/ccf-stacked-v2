import type { Metadata } from "next";
import GiftCardsStorefront from "@/components/GiftCardsStorefront";
import type { CityParam } from "@/lib/config";
import {
  fetchLiveAcuityProducts,
  GIFT_FAQS,
  resolveGiftExperiences,
  type GiftExperienceId,
} from "@/lib/gifts";
import { faqJsonLd, breadcrumbJsonLd } from "@/lib/structuredData";

export const metadata: Metadata = {
  title:
    "Gift Experiences & Pottery Gift Cards | Chicago & Eugene | Color Cocktail Factory",
  description:
    "Give them something to look forward to. Gift Pottery Date Night for Two, Their First Pottery Class, or Choose Your Gift Card Amount ($50–$250) at Color Cocktail Factory in Chicago and Eugene. Let them choose the date.",
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
  const experiences = resolveGiftExperiences(rawProducts);

  const rawCity = searchParams?.city || searchParams?.location;
  const initialCity: CityParam = rawCity === "eugene" ? "eugene" : "chicago";

  const rawGift = searchParams?.gift;
  const initialGiftId: GiftExperienceId | null =
    rawGift === "pottery-date-night-for-two" ||
    rawGift === "their-first-pottery-class" ||
    rawGift === "let-them-choose"
      ? rawGift
      : null;

  const initialWorkshopSlug = searchParams?.workshop ?? null;
  const parsedAmount = searchParams?.amount ? Number(searchParams.amount) : NaN;
  const initialAmount = Number.isFinite(parsedAmount) ? parsedAmount : null;

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
        experiences={experiences}
        initialCity={initialCity}
        initialGiftId={initialGiftId}
        initialWorkshopSlug={initialWorkshopSlug}
        initialAmount={initialAmount}
      />
    </main>
  );
}
