import Link from "next/link";
import { MERCHANDISE, merchandiseUrl } from "@/lib/merchandise";
import { getMerchandiseProduct } from "@/lib/merchandise.server";

export default async function MerchandiseStorefront({ detail = false }: { detail?: boolean }) {
  const product = await getMerchandiseProduct();
  const available = product?.variants.some(v => v.available);
  return <main id="main-content" className="mx-auto max-w-6xl px-6 py-16">
    <nav aria-label="Breadcrumb" className="mb-8 text-sm"><Link href="/">Home</Link> / <Link href="/shop">Shop</Link>{detail && " / Good With My Hands"}</nav>
    <p className="text-sm uppercase tracking-widest text-pink-200">Color Cocktail Factory · For makers</p>
    <h1 className="mt-3 text-4xl font-semibold">{detail ? MERCHANDISE.title : "Wear your creative side"}</h1>
    {!product ? <div className="mt-8 rounded-2xl border border-white/20 p-8">
      <h2 className="text-2xl">Our merchandise shop is getting ready.</h2>
      <p className="mt-3">Online ordering is temporarily unavailable. Please check back soon.</p>
      <Link className="mt-5 inline-flex min-h-11 items-center underline" href="/activities">Explore creative classes</Link>
    </div> : <div className="mt-10 grid gap-10 md:grid-cols-2">
      <div className="grid gap-4">{product.images.slice(0, detail ? 6 : 1).map((src, index) =>
        // Shopify provides the actual product mockups; no separate image catalog.
        // eslint-disable-next-line @next/next/no-img-element
        <img key={src} src={src} alt={`${MERCHANDISE.title} — product view ${index + 1}`} className="h-auto w-full rounded-2xl" loading={index ? "lazy" : "eager"} />)}</div>
      <div><h2 className="text-2xl font-semibold">{MERCHANDISE.title}</h2>
        <p className="mt-4">For people who make things with their hands. Vintage pottery artwork on a relaxed, unisex Comfort Colors® 1717 garment-dyed cotton tee.</p>
        <p className="mt-4">Pepper · Espresso · Moss / S–3XL</p>
        <p className="mt-3 text-xl font-semibold">S–XL $36 · 2XL $38 · 3XL $40 USD</p>
        <p className="mt-2 text-sm">Shipping and any applicable tax are calculated at checkout. Select your size and color in our Shopify store for current availability and the size guide.</p>
        {available ? <a href={merchandiseUrl(detail ? "product" : "shop")} className="mt-6 flex min-h-12 w-full items-center justify-center rounded-full bg-pink-600 px-6 py-3 text-center font-semibold text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4">Choose size &amp; color on Shopify →</a> : <p className="mt-6 font-semibold" role="status">Currently sold out. Please check back.</p>}
        {!detail && <Link href={MERCHANDISE.path} className="mt-4 inline-flex min-h-11 items-center underline">Product details, shipping &amp; returns</Link>}
        <section className="mt-8 space-y-4 border-t border-white/20 pt-6" aria-label="Shipping and returns">
          <h3 className="text-xl font-semibold">Made especially for you</h3>
          <p>Printed on demand and fulfilled by Printful. Production and delivery estimates are shown in Shopify checkout. Merchandise ships separately from class bookings.</p>
          <p>Read our <a className="underline" href={`${MERCHANDISE.store}/policies/shipping-policy`}>shipping policy</a> and <a className="underline" href={`${MERCHANDISE.store}/policies/refund-policy`}>returns and refund policy</a> before ordering, including eligibility and how to report a damaged or incorrect item.</p>
          <p>Questions? <a className="underline" href="mailto:support@colorcocktailfactory.com">support@colorcocktailfactory.com</a></p>
        </section>
      </div>
    </div>}
  </main>;
}
