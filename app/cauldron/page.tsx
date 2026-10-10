import type { Metadata } from "next";
import CauldronExperience from "@/components/cauldron/CauldronExperience";
import { getCatalog, type CatalogClass } from "@/lib/askccf/catalog";

export const revalidate = 300;
export const metadata: Metadata = {
  title: { absolute: "The Cauldron Factory | Color Cocktail Factory" },
  description: "Make your own clay cauldron. Explore date night pottery, private parties, wheel throwing and creative classes at Color Cocktail Factory.",
  alternates: { canonical: "https://colorcocktailfactory.com/cauldron" },
  // Review page only. Remove noindex after the owner approves the campaign.
  robots: { index: false, follow: true },
  openGraph: {
    title: "The Cauldron Factory",
    description: "Make your own clay cauldron. A pottery experience by Color Cocktail Factory.",
    url: "https://colorcocktailfactory.com/cauldron",
    type: "website",
  },
};
export default async function CauldronPage() {
  let classes: CatalogClass[] = [];
  let catalogAvailable = false;
  try {
    classes = await getCatalog();
    catalogAvailable = true;
  } catch {
    console.warn("Cauldron review page: live class catalog temporarily unavailable.");
  }
  // Root layout supplies analytics, footer and AskCCFWidget. Homepage stays unchanged.
  return <CauldronExperience classes={classes} catalogAvailable={catalogAvailable} />;
}
