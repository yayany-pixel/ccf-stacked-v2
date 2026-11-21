import Link from "next/link";
import { MERCHANDISE, merchandiseEnabled } from "@/lib/merchandise";
export default function MerchandisePromotion({ category, title }: { category: string; title: string }) {
  if (!merchandiseEnabled || !(category === "mud-room" || /pottery|clay|wheel/i.test(title))) return null;
  return <aside className="mx-auto mb-24 max-w-6xl rounded-2xl border border-white/15 p-6" aria-label="Pottery merchandise">
    <p className="text-sm uppercase tracking-widest text-pink-200">For your next studio day</p>
    <h2 className="mt-2 text-2xl font-semibold">Good with your hands? Wear it.</h2>
    <p className="mt-3">Meet our vintage pottery tee, made for clay lovers and creative days.</p>
    <Link href={`${MERCHANDISE.path}?utm_source=class-page&utm_medium=website&utm_campaign=good-with-my-hands`} className="mt-4 inline-flex min-h-12 items-center rounded-full bg-pink-600 px-6 py-3 font-semibold">Explore the pottery tee →</Link>
  </aside>;
}
