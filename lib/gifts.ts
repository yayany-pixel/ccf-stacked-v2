import type { CityParam } from "@/lib/config";

export const ACUITY_OWNER_ID = 35932879;
export const ACUITY_CATALOG_BASE_URL = `https://app.acuityscheduling.com/catalog.php?owner=${ACUITY_OWNER_ID}`;
export const ACUITY_GIFT_CARDS_CATALOG_URL = `${ACUITY_CATALOG_BASE_URL}&category=Gift+Cards`;

export function buildAcuityProductPurchaseUrl(productId: number): string {
  return `${ACUITY_CATALOG_BASE_URL}&action=addCart&clear=1&id=${productId}`;
}

export type AcuityRawProduct = {
  id: number;
  name: string;
  description?: string;
  price: string;
  type?: string;
  kind?: string;
  hidden?: boolean;
  active?: boolean;
  status?: string;
  group?: string;
  isGiftCertificate?: boolean;
};

export type GiftCatalogCategory =
  | "Chicago"
  | "Eugene"
  | "Online"
  | "Dollar-value gift cards"
  | "More gifts";

export type GiftCatalogProduct = {
  id: number;
  name: string;
  description: string;
  price: number;
  formattedPrice: string;
  category: GiftCatalogCategory;
  sourceCategory: string;
  purchaseUrl: string;
};

export type GiftCatalogGroup = {
  category: GiftCatalogCategory;
  products: GiftCatalogProduct[];
};

const CATEGORIES: GiftCatalogCategory[] = [
  "Chicago",
  "Eugene",
  "Online",
  "Dollar-value gift cards",
  "More gifts",
];

function productCategory(product: AcuityRawProduct): GiftCatalogCategory {
  const category = typeof product.group === "string" ? product.group : "";
  const label = `${category} ${product.name}`;
  if (
    product.type === "value" &&
    /gift\s*cards?|\$\s*\d|dollar[- ]value/i.test(label)
  ) {
    return "Dollar-value gift cards";
  }
  // The Acuity category takes precedence over a location mentioned in copy.
  for (const text of [category, product.name]) {
    if (/chicago/i.test(text)) return "Chicago";
    if (/eugene/i.test(text)) return "Eugene";
    if (/online|virtual/i.test(text)) return "Online";
  }
  return "More gifts";
}

/** Only products in the supplied live response can become purchasable cards. */
export function resolveGiftCatalog(
  rawProducts: ReadonlyArray<AcuityRawProduct>,
): GiftCatalogGroup[] {
  const groups = new Map<GiftCatalogCategory, GiftCatalogProduct[]>(
    CATEGORIES.map((category) => [category, []]),
  );
  const seen = new Set<number>();
  for (const product of rawProducts) {
    if (
      !product ||
      product.hidden ||
      product.active === false ||
      /^(inactive|disabled|archived)$/i.test(product.status ?? "") ||
      !Number.isSafeInteger(product.id) ||
      product.id <= 0 ||
      typeof product.name !== "string" ||
      !product.name.trim() ||
      typeof product.price !== "string" ||
      !/^\d+(?:\.\d+)?$/.test(product.price.trim()) ||
      seen.has(product.id)
    ) {
      continue;
    }
    const price = Number(product.price);
    if (!Number.isFinite(price)) continue;
    const category = productCategory(product);
    groups.get(category)!.push({
      id: product.id,
      name: product.name,
      description: typeof product.description === "string" ? product.description : "",
      price,
      formattedPrice: new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(price),
      category,
      sourceCategory: typeof product.group === "string" ? product.group : "",
      purchaseUrl: buildAcuityProductPurchaseUrl(product.id),
    });
    seen.add(product.id);
  }
  return CATEGORIES.flatMap((category) => {
    const products = groups.get(category)!;
    return products.length ? [{ category, products }] : [];
  });
}

/** Read-only GET /products. Unavailable or malformed catalogs fail closed. */
export async function fetchLiveAcuityProducts(): Promise<AcuityRawProduct[]> {
  const userId = process.env.ACUITY_USER_ID;
  const apiKey = process.env.ACUITY_API_KEY;
  if (!userId || !apiKey) return [];
  try {
    const response = await fetch("https://acuityscheduling.com/api/v1/products", {
      method: "GET",
      headers: {
        Authorization: `Basic ${Buffer.from(`${userId}:${apiKey}`).toString("base64")}`,
        Accept: "application/json",
      },
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) return [];
    const products: unknown = await response.json();
    return Array.isArray(products) ? products : [];
  } catch {
    return [];
  }
}

export function getClassGiftingContext(
  slug: string,
  preferredCity: CityParam = "chicago",
  availableCities: ReadonlyArray<CityParam> = ["chicago", "eugene"],
) {
  if (["online-cauldron", "private-parties", "gift-cards"].includes(slug)) {
    return null;
  }
  const city = availableCities.includes(preferredCity)
    ? preferredCity
    : availableCities[0] ?? "chicago";
  return {
    href: `/gift-cards?city=${city}`,
    label: "Explore gift cards",
    city,
  };
}

export const GIFT_FAQS: ReadonlyArray<{ q: string; a: string }> = [
  {
    q: "Do I need to choose a class date when buying a gift?",
    a: "Choose an available gift in Acuity and review its terms before buying. The recipient chooses an eligible class date when redeeming their gift.",
  },
  {
    q: "Which studio and classes are covered?",
    a: "Each gift has its own eligible classes and locations. Check the product description and Acuity checkout for current redemption terms before purchasing.",
  },
  {
    q: "Does a dollar-value gift card cover a complete class?",
    a: "A dollar-value card provides credit toward eligible bookings, not a guarantee of a complete class. Review the current class price and certificate terms in Acuity; a balance may be due.",
  },
  {
    q: "Where do I buy and redeem my gift?",
    a: "Buy securely through Acuity using a gift's purchase link. Follow the redemption instructions provided with your certificate when booking an eligible class.",
  },
];
