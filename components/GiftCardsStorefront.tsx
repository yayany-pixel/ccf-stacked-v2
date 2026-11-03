"use client";

import BookingLink from "@/components/BookingLink";
import type { CityParam } from "@/lib/config";
import {
  ACUITY_GIFT_CARDS_CATALOG_URL,
  GIFT_FAQS,
  type GiftCatalogGroup,
} from "@/lib/gifts";

export interface GiftCardsStorefrontProps {
  groups: GiftCatalogGroup[];
  initialCity?: CityParam;
}

export default function GiftCardsStorefront({
  groups,
  initialCity,
}: GiftCardsStorefrontProps) {
  // Prioritize a city deep link without hiding any of the live catalog.
  const preferredCategory =
    initialCity === "eugene" ? "Eugene" : initialCity === "chicago" ? "Chicago" : null;
  const orderedGroups = [
    ...groups.filter((group) => group.category === preferredCategory),
    ...groups.filter((group) => group.category !== preferredCategory),
  ];

  return (
    <div className="mx-auto max-w-6xl">
      <header className="mb-10 max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-widest text-pink-300">
          Give them something to look forward to
        </p>
        <h1 className="mt-3 font-serif text-4xl sm:text-5xl">
          Gift experiences &amp; gift cards
        </h1>
        <p className="mt-5 text-lg text-white/80">
          Explore gifts for Chicago, Eugene, and online experiences. Names,
          descriptions, and prices below come from our current Acuity catalog.
          Review each gift&apos;s eligibility and terms before buying.
        </p>
      </header>

      {orderedGroups.length === 0 ? (
        <section className="rounded-2xl border border-white/15 bg-white/5 p-7">
          <h2 className="text-xl font-semibold">Browse our gift catalog</h2>
          <p className="mt-3 text-white/75">
            We can&apos;t display gifts here right now. Visit Acuity for current
            availability, prices, and purchase options.
          </p>
          <a
            href={ACUITY_GIFT_CARDS_CATALOG_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex rounded-full bg-pink-600 px-6 py-3 font-semibold"
          >
            View gift catalog
          </a>
        </section>
      ) : (
        orderedGroups.map((group) => (
          <section
            key={group.category}
            aria-label={group.category}
            className="mb-12"
          >
            <h2 className="mb-5 font-serif text-3xl">{group.category}</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {group.products.map((product) => (
                <article
                  key={product.id}
                  className="flex flex-col rounded-2xl border border-white/15 bg-white/5 p-6"
                >
                  <h3 className="text-xl font-semibold">{product.name}</h3>
                  {product.sourceCategory && (
                    <p className="mt-2 text-sm text-pink-200">
                      {product.sourceCategory}
                    </p>
                  )}
                  <p className="mt-4 whitespace-pre-line text-white/75">
                    {product.description}
                  </p>
                  <p className="mb-5 mt-5 text-2xl font-semibold">
                    {product.formattedPrice}
                  </p>
                  <BookingLink
                    href={product.purchaseUrl}
                    city={product.sourceCategory || group.category}
                    classNameText={product.name}
                    classId={String(product.id)}
                    classCategory="gift_card"
                    displayedPrice={product.price}
                    ctaLocation="gift_catalog"
                    className="mt-auto inline-flex justify-center rounded-full bg-pink-600 px-5 py-3 font-semibold hover:bg-pink-500"
                  >
                    Buy gift
                  </BookingLink>
                </article>
              ))}
            </div>
          </section>
        ))
      )}

      <section className="mt-12" aria-label="Gift card questions">
        <h2 className="mb-5 font-serif text-3xl">Gift card questions</h2>
        {GIFT_FAQS.map((faq) => (
          <details
            key={faq.q}
            className="mb-3 rounded-xl border border-white/10 bg-white/5 p-5"
          >
            <summary className="cursor-pointer font-semibold">{faq.q}</summary>
            <p className="mt-3 text-white/75">{faq.a}</p>
          </details>
        ))}
      </section>
    </div>
  );
}
