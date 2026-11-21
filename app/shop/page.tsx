import MerchandiseStorefront from "@/components/MerchandiseStorefront";
import { merchandiseEnabled } from "@/lib/merchandise";
export const revalidate = 60;
export const metadata = { title: "Shop | Color Cocktail Factory", robots: { index: merchandiseEnabled, follow: true } };
export default function ShopPage() { return <MerchandiseStorefront />; }
