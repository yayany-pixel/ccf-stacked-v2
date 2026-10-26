import MerchandiseStorefront from "@/components/MerchandiseStorefront";
import { MERCHANDISE, merchandiseEnabled } from "@/lib/merchandise";
export const revalidate = 60;
export const metadata = { title: `${MERCHANDISE.title} | Color Cocktail Factory`, robots: { index: merchandiseEnabled, follow: true } };
export default function ProductPage() { return <MerchandiseStorefront detail />; }
