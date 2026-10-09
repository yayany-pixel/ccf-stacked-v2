/**
 * Cross-Class Promotions & Direct Acuity Booking Callouts
 *
 * Provides standardized direct Acuity fee-saving notices and curated
 * cross-promotional class suggestions with direct scheduling links.
 */

export interface ClassPromoLink {
  title: string;
  category: string;
  acuityUrl: string;
  price: string;
  city: "Chicago" | "Eugene" | "Both";
}

/**
 * Top popular and diverse classes across Chicago and Eugene for cross-linking
 */
export const POPULAR_CROSS_CLASSES: ClassPromoLink[] = [
  {
    title: "Date Night Pottery on the Wheel",
    category: "Pottery",
    acuityUrl: "https://colorcocktailfactory.as.me/Datenight",
    price: "$50",
    city: "Both",
  },
  {
    title: "Turkish Mosaic Lamp Workshop",
    category: "Glass Art",
    acuityUrl: "https://colorcocktailfactory.as.me/schedule/a8dfb300/appointment/95416771/calendar/12216179",
    price: "$65",
    city: "Chicago",
  },
  {
    title: "Wheel Throwing for Beginners: Matcha Bowl",
    category: "Pottery",
    acuityUrl: "https://colorcocktailfactory.as.me/eugenewheelthrowing",
    price: "$25",
    city: "Both",
  },
  {
    title: "Bonsai for Beginners: Hands-On Workshop",
    category: "Botanical",
    acuityUrl: "https://colorcocktailfactory.as.me/schedule/a8dfb300/appointment/79188910/calendar/12216179",
    price: "$75",
    city: "Both",
  },
  {
    title: "Terrarium Workshop & Living Garden",
    category: "Botanical",
    acuityUrl: "https://colorcocktailfactory.as.me/terrarium",
    price: "$35",
    city: "Both",
  },
  {
    title: "Organic Candle Making Workshop",
    category: "Aroma",
    acuityUrl: "https://colorcocktailfactory.as.me/candle",
    price: "$35",
    city: "Both",
  },
  {
    title: "Wine Glass Painting",
    category: "Painting",
    acuityUrl: "https://colorcocktailfactory.as.me/schedule/a8dfb300/appointment/79374003/calendar/12216179",
    price: "$35",
    city: "Both",
  },
  {
    title: "Ceramic Mug & Bowl Handbuilding",
    category: "Pottery",
    acuityUrl: "https://colorcocktailfactory.as.me/Handbuilding101",
    price: "$35",
    city: "Both",
  },
  {
    title: "Date Night by Candlelight: Mosaic Art Experience",
    category: "Glass Art",
    acuityUrl: "https://colorcocktailfactory.as.me/MosaicVIP",
    price: "$90",
    city: "Both",
  },
];

/**
 * Generate a fee-free direct Acuity notice text for Eventbrite or description blocks
 */
export function getFeeFreeAcuityNotice(city: "Chicago" | "Eugene" = "Chicago"): string {
  const calUrl = city === "Chicago"
    ? "https://colorcocktailfactory.as.me/?calendar=12216179"
    : "https://colorcocktailfactory.as.me/?calendar=13582962";

  return `💡 BOOK DIRECT & SAVE ON FEES: To avoid third-party ticketing fees, book directly on our official studio scheduler at ${calUrl}`;
}

/**
 * Generate a formatted HTML cross-promotion block for event descriptions
 */
export function buildDescriptionHtml(options: {
  baseDescription: string;
  city?: "Chicago" | "Eugene";
  currentClassTitle?: string;
}): string {
  const city = options.city ?? "Chicago";
  const studioAddress = city === "Chicago"
    ? "1142 W. 18th Street, Chicago, IL 60608 (Pilsen)"
    : "3295 Cross Street, Eugene, OR 97402";

  const directSchedulerUrl = "https://colorcocktailfactory.as.me/";

  // Select diverse related recommendations excluding the current class
  const recommendations = POPULAR_CROSS_CLASSES.filter(
    (c) => c.title !== options.currentClassTitle && (c.city === "Both" || c.city === city)
  ).slice(0, 4);

  const recsHtml = recommendations
    .map(
      (r) =>
        `<li><a href="${r.acuityUrl}" target="_blank" rel="noopener noreferrer"><strong>${r.title}</strong></a> (${r.category} · ${r.price}) — <a href="${r.acuityUrl}">Sign up on Acuity</a></li>`
    )
    .join("\n");

  return `
${options.baseDescription}

<hr />

<p><strong>🎟️ AVOID TICKET FEES — BOOK DIRECT ON ACUITY:</strong><br />
Third-party platforms charge added service and transaction fees. You can sign up directly through our official studio reservation calendar at <a href="${directSchedulerUrl}" target="_blank" rel="noopener noreferrer"><strong>colorcocktailfactory.as.me</strong></a> to guarantee your seats with <em>no extra ticketing fees</em>!</p>

<p><strong>📍 Studio Address:</strong> ${studioAddress}<br />
<strong>🥂 BYOB Friendly:</strong> Bring your favorite wine, beer, and snacks!</p>

<hr />

<p><strong>✨ EXPLORE MORE WORKSHOPS AT COLOR COCKTAIL FACTORY:</strong><br />
Planning your next creative night out? Discover our most popular classes and register directly on Acuity:</p>
<ul>
${recsHtml}
</ul>
<p>👉 <a href="https://colorcocktailfactory.com/collections" target="_blank" rel="noopener noreferrer">Browse all class collections</a> (Beginners, Date Nights, Pottery, Glass & Mosaics, and Online Classes).</p>
`.trim();
}
