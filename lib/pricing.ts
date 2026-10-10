import { getCatalog, type CatalogClass } from "@/lib/askccf/catalog";
import { EXPLICIT_FORMER_PRICES } from "@/lib/homepage/data";
import { ACTIVITY_MANIFEST } from "@/lib/homepage/manifest";
import type { ActivityDetail } from "@/lib/activityRegistry";

export type PriceUnit = "for two" | "per person" | "per ticket";

export type LivePriceInfo = {
  currentPrice: number | null;
  priceUnit: PriceUnit;
  wasPrice: number | null;
  formattedPrice: string;
};

export type DestinationPricing = {
  city: "chicago" | "eugene" | "online";
  appointmentTypeId: number;
  calendarIds?: number[];
  bookingUrl: string;
  currentPrice: number | null;
  priceUnit: PriceUnit;
  wasPrice: number | null;
  formattedPrice: string;
  verifiedTitle?: string;
};

export type VariantPricing = {
  id: number;
  title: string;
  city: "chicago" | "eugene" | "online";
  calendarIds?: number[];
  bookingUrl: string;
  currentPrice: number | null;
  priceUnit: PriceUnit;
  wasPrice: number | null;
  formattedPrice: string;
};

export type ActivityPricing = {
  displayPrice: string;
  wasPrice: number | null;
  hasSaleBadge: boolean;
  destinations: {
    chicago?: DestinationPricing;
    eugene?: DestinationPricing;
    online?: DestinationPricing;
  };
  variants?: VariantPricing[];
};

export const TURKISH_LAMP_OPTIONS = [
  {
    id: 95416771,
    title: "Table Lamp",
    city: "chicago" as const,
    calendarIds: [12216179],
    bookingUrl: "https://colorcocktailfactory.as.me/?appointmentType=95416771",
  },
  {
    id: 79374537,
    title: "Hanging Lamp",
    city: "chicago" as const,
    calendarIds: [12216179],
    bookingUrl: "https://colorcocktailfactory.as.me/?appointmentType=79374537",
  },
  {
    id: 95894050,
    title: "Date Night for Two",
    city: "chicago" as const,
    calendarIds: [12216179],
    bookingUrl: "https://colorcocktailfactory.as.me/?appointmentType=95894050",
  },
];

/**
 * Returns the live Acuity price, ticket unit, and wasPrice (if strictly higher)
 * for an appointment type ID and city.
 */
export async function getLivePrice(
  appointmentTypeId: number | string,
  city: string,
  cachedCatalog?: CatalogClass[] | null,
): Promise<LivePriceInfo> {
  const numId = Number(appointmentTypeId);
  let catalog = cachedCatalog;
  if (catalog === undefined) {
    try {
      catalog = await getCatalog();
    } catch {
      catalog = null;
    }
  }

  const live = catalog ? catalog.find((c) => Number(c.id) === numId) : null;
  const price = live?.pricing.price;
  const currentPrice =
    typeof price === "number" && Number.isFinite(price) && price >= 0 ? price : null;

  // Determine ticket unit from live catalog covers count
  const priceUnit: PriceUnit =
    live && live.pricing.covers === 2
      ? "for two"
      : live && live.pricing.covers === 1
      ? "per person"
      : "per ticket";

  // Look up was price from EXPLICIT_FORMER_PRICES via ACTIVITY_MANIFEST
  let formerAmount: number | null = null;
  const manifestEntry =
    ACTIVITY_MANIFEST.find(
      (m) =>
        m.appointmentTypeId === numId &&
        (!city || m.city.toLowerCase() === city.toLowerCase()),
    ) ?? ACTIVITY_MANIFEST.find((m) => m.appointmentTypeId === numId);

  if (manifestEntry) {
    formerAmount = EXPLICIT_FORMER_PRICES[manifestEntry.key] ?? null;
  }

  const wasPrice =
    formerAmount !== null && currentPrice !== null && formerAmount > currentPrice
      ? formerAmount
      : null;

  const formattedPrice =
    currentPrice !== null ? `$${currentPrice} ${priceUnit}` : "See price at checkout";

  return {
    currentPrice,
    priceUnit,
    wasPrice,
    formattedPrice,
  };
}

/**
 * Resolves full live pricing for an activity detail across all its destinations
 * (chicago, eugene, online) and variants (e.g. Turkish lamp).
 */
export async function getActivityPricing(
  activity: ActivityDetail,
  cachedCatalog?: CatalogClass[] | null,
): Promise<ActivityPricing> {
  let catalog = cachedCatalog;
  if (catalog === undefined) {
    try {
      catalog = await getCatalog();
    } catch {
      catalog = null;
    }
  }

  // Special handling for Turkish Lamp: 3 options (table, hanging, date night for two)
  if (activity.slug === "turkish-lamp") {
    const variants: VariantPricing[] = [];
    for (const opt of TURKISH_LAMP_OPTIONS) {
      const priceInfo = await getLivePrice(opt.id, opt.city, catalog);
      variants.push({
        id: opt.id,
        title: opt.title,
        city: opt.city,
        calendarIds: opt.calendarIds,
        bookingUrl: opt.bookingUrl,
        currentPrice: priceInfo.currentPrice,
        priceUnit: priceInfo.priceUnit,
        wasPrice: priceInfo.wasPrice,
        formattedPrice: priceInfo.formattedPrice,
      });
    }

    const validPrices = variants
      .map((v) => v.currentPrice)
      .filter((p): p is number => typeof p === "number" && Number.isFinite(p) && p >= 0);

    const lowestPrice = validPrices.length > 0 ? Math.min(...validPrices) : null;
    const displayPrice = lowestPrice !== null ? `From $${lowestPrice}` : "See price at checkout";

    const tableOpt = variants.find((v) => v.id === 95416771) ?? variants[0];
    const destinations = {
      chicago: {
        city: "chicago" as const,
        appointmentTypeId: tableOpt.id,
        calendarIds: tableOpt.calendarIds,
        bookingUrl: tableOpt.bookingUrl,
        currentPrice: tableOpt.currentPrice,
        priceUnit: tableOpt.priceUnit,
        wasPrice: tableOpt.wasPrice,
        formattedPrice: tableOpt.formattedPrice,
        verifiedTitle: activity.destinations.chicago?.verifiedTitle,
      },
    };

    return {
      displayPrice,
      wasPrice: null,
      hasSaleBadge: false,
      destinations,
      variants,
    };
  }

  // Standard activities across destinations
  const destinations: ActivityPricing["destinations"] = {};
  const destEntries = Object.entries(activity.destinations) as [
    "chicago" | "eugene" | "online",
    ActivityDetail["destinations"]["chicago"],
  ][];

  for (const [city, dest] of destEntries) {
    if (!dest) continue;
    const priceInfo = await getLivePrice(dest.appointmentTypeId, city, catalog);
    destinations[city] = {
      city,
      appointmentTypeId: dest.appointmentTypeId,
      calendarIds: dest.calendarIds,
      bookingUrl: dest.bookingUrl,
      currentPrice: priceInfo.currentPrice,
      priceUnit: priceInfo.priceUnit,
      wasPrice: priceInfo.wasPrice,
      formattedPrice: priceInfo.formattedPrice,
      verifiedTitle: dest.verifiedTitle,
    };
  }

  const destList = Object.values(destinations).filter(
    (d): d is DestinationPricing => Boolean(d),
  );

  if (destList.length === 0) {
    return {
      displayPrice: "See price at checkout",
      wasPrice: null,
      hasSaleBadge: false,
      destinations,
    };
  }

  // Check if live prices are unavailable
  const pricedDests = destList.filter((d) => d.currentPrice !== null);
  if (pricedDests.length === 0) {
    return {
      displayPrice: "See price at checkout",
      wasPrice: null,
      hasSaleBadge: false,
      destinations,
    };
  }

  // Single destination or only one city has price
  if (destList.length === 1 || pricedDests.length === 1) {
    const single = pricedDests[0];
    return {
      displayPrice: single.formattedPrice,
      wasPrice: single.wasPrice,
      hasSaleBadge: single.wasPrice !== null,
      destinations,
    };
  }

  // Dual destinations (e.g. Chicago and Eugene)
  const chicago = destinations.chicago;
  const eugene = destinations.eugene;

  if (chicago?.currentPrice !== null && eugene?.currentPrice !== null && chicago && eugene) {
    const samePrice = chicago.currentPrice === eugene.currentPrice;
    const sameUnit = chicago.priceUnit === eugene.priceUnit;

    if (samePrice && sameUnit) {
      const wasPrice =
        chicago.wasPrice && eugene.wasPrice && chicago.wasPrice === eugene.wasPrice
          ? chicago.wasPrice
          : chicago.wasPrice ?? eugene.wasPrice ?? null;
      return {
        displayPrice: `$${chicago.currentPrice} ${chicago.priceUnit}`,
        wasPrice,
        hasSaleBadge: wasPrice !== null,
        destinations,
      };
    }

    // Cities differ: show both, labelled, e.g. "$55 Chicago · $50 Eugene for two"
    let displayPrice: string;
    if (sameUnit) {
      displayPrice = `$${chicago.currentPrice} Chicago · $${eugene.currentPrice} Eugene ${chicago.priceUnit}`;
    } else {
      displayPrice = `$${chicago.currentPrice} Chicago ${chicago.priceUnit} · $${eugene.currentPrice} Eugene ${eugene.priceUnit}`;
    }

    const wasPrice =
      chicago.wasPrice && eugene.wasPrice && chicago.wasPrice === eugene.wasPrice
        ? chicago.wasPrice
        : chicago.wasPrice ?? eugene.wasPrice ?? null;

    const hasSaleBadge = Boolean(chicago.wasPrice || eugene.wasPrice);

    return {
      displayPrice,
      wasPrice,
      hasSaleBadge,
      destinations,
    };
  }

  // Fallback if any unhandled state
  const first = pricedDests[0];
  return {
    displayPrice: first.formattedPrice,
    wasPrice: first.wasPrice,
    hasSaleBadge: first.wasPrice !== null,
    destinations,
  };
}
