/**
 * Ask CCF — authoritative class catalog.
 *
 * Wraps the studio's existing Acuity Scheduling account (the same credentials
 * lib/acuity.ts and lib/eventsAPI.ts already use) and normalises it into the
 * shape the assistant's tools return. Everything the assistant states about a
 * class — price, duration, capacity, booking URL, image, ticket coverage —
 * comes from here, so it cannot be invented by the model.
 *
 * Server-only: never import this from a client component.
 */

import { formatClassTime, localDateAndTime, studioTimeZone } from "./schedule";
export type CatalogLocation = "chicago" | "eugene" | "online" | "unknown";

export type PriceUnit = "per_couple" | "per_ticket";

export type PricingInfo = {
  price: number | null;
  currency: "USD";
  unit: PriceUnit;
  /** How many people one ticket admits, when the studio states it. */
  covers: number | null;
  /** Verbatim sentence from the class description that establishes coverage. */
  evidence: string | null;
  /** Plain-language line the assistant can repeat safely. */
  summary: string;
};

export type CatalogClass = {
  id: string;
  title: string;
  description: string;
  shortDescription: string;
  location: CatalogLocation;
  locationLabel: string;
  address: string | null;
  category: string;
  craft: string;
  durationMinutes: number | null;
  maxGroupSize: number | null;
  imageUrl: string | null;
  bookingUrl: string;
  pricing: PricingInfo;
  /** Pickup / firing sentences found in the studio's own description. */
  pickupNotes: string[];
  byob: boolean;
  isPrivateSession: boolean;
  kind: "class" | "series" | "service";
  /** Filled in by searchClasses when live availability was checked. */
  nextStartISO?: string | null;
  nextLocaleTime?: string | null;
  upcomingCount?: number;
  matchingTimes?: ClassTime[];
  enrollmentNotes: string[];
};

export type ClassTime = {
  startISO: string;
  localeTime: string;
  seatsTotal: number | null;
  seatsAvailable: number | null;
};

const ACUITY_API = "https://acuityscheduling.com/api/v1";

/** Authoritative calendar → studio mapping, read from the Acuity account. */
const CALENDAR_CITY: Record<number, CatalogLocation> = {
  12216179: "chicago",
  13582962: "eugene",
};

export const LOCATION_LABELS: Record<CatalogLocation, string> = {
  chicago: "Chicago (Pilsen)",
  eugene: "Eugene, OR",
  online: "Online (live)",
  unknown: "Location varies",
};

export const LOCATION_ADDRESSES: Record<CatalogLocation, string | null> = {
  chicago: "1142 W. 18th Street, Chicago, IL 60608",
  // Eugene listings currently disagree. Do not send every customer to one address.
  eugene: null,
  online: null,
  unknown: null,
};

/**
 * One-off appointment types created for a single customer's booked private
 * event. They live in the same Acuity account as public classes but must never
 * be recommended. Add an ID here to hide a class from the assistant.
 */
const MANUALLY_HIDDEN_IDS = new Set<string>(
  (process.env.CCF_AI_HIDDEN_CLASS_IDS ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean),
);

const CRAFT_KEYWORDS = [
  "pott", "clay", "wheel", "ceramic", "porcelain", "handbuilding", "hand building",
  "mosaic", "lamp", "glass", "fusion", "candle", "soap", "bath bomb", "terrarium",
  "bonsai", "paint", "watercolor", "water color", "pigment", "draw", "art",
  "charcuterie", "date night", "workshop", "class", "kurinuki", "sculpt", "mug",
  "bowl", "vase", "plate", "jar", "cauldron", "dildo", "chess", "matcha", "kiln",
];

const PRIVATE_EVENT_PATTERNS: RegExp[] = [
  /\bprivate (event|party)\b/i,
  /['’]s\s+(birthday|bachelorette|bachlorette|party|playtime|dirty|garden|\d)/i,
  /\b(annual|team ?building|outing)\b/i,
];

function isOneOffPrivateEvent(name: string): boolean {
  if (PRIVATE_EVENT_PATTERNS.some((re) => re.test(name))) return true;
  const lower = name.toLowerCase();
  // A real public class always names its craft somewhere in the title.
  return !CRAFT_KEYWORDS.some((k) => lower.includes(k));
}

type AcuityType = {
  id: number;
  name: string;
  active: boolean;
  description?: string;
  duration?: number;
  price?: string;
  category?: string;
  private?: boolean;
  type?: string;
  image?: string;
  classSize?: number | null;
  calendarIDs?: number[];
  schedulingUrl?: string;
};

function authHeader(): string | null {
  const userId = process.env.ACUITY_USER_ID;
  const apiKey = process.env.ACUITY_API_KEY;
  if (!userId || !apiKey) return null;
  return `Basic ${Buffer.from(`${userId}:${apiKey}`).toString("base64")}`;
}

export function catalogConfigured(): boolean {
  return authHeader() !== null;
}

async function acuityFetch(path: string, revalidate: number): Promise<unknown> {
  const auth = authHeader();
  if (!auth) throw new Error("acuity_not_configured");

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);
  try {
    const res = await fetch(`${ACUITY_API}/${path}`, {
      headers: { Authorization: auth, Accept: "application/json" },
      signal: controller.signal,
      next: { revalidate },
    });
    if (!res.ok) throw new Error(`acuity_http_${res.status}`);
    return await res.json();
  } finally {
    clearTimeout(timeout);
  }
}

/* ------------------------------------------------------------------ *
 * Normalisation
 * ------------------------------------------------------------------ */

function sentences(text: string): string[] {
  return text
    .replace(/\s+/g, " ")
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

const COUPLE_PATTERNS: RegExp[] = [
  /one ticket per couple/i,
  /one ticket covers a couple/i,
  /one ticket is good for two people/i,
  /two seats per ticket/i,
  /ticket\s+(?:is\s+)?(?:good\s+)?for two/i,
  /(?:includes|covers)\s+two (?:people|guests|seats)/i,
  /one (?:lamp|kit|project) for two people/i,
];

/**
 * Work out what a ticket actually buys, using only the studio's own words.
 * When the description does not say, we say so rather than guessing.
 */
export function derivePricing(name: string, description: string, price: string | undefined): PricingInfo {
  const value = price != null && price !== "" ? Number.parseFloat(price) : null;
  const numeric = value != null && Number.isFinite(value) ? value : null;
  const all = sentences(description);

  let evidence: string | null = null;
  for (const sentence of all) {
    if (COUPLE_PATTERNS.some((re) => re.test(sentence))) {
      evidence = sentence;
      break;
    }
  }
  // A title like "… for Two" is itself a studio statement about coverage.
  const titleSaysTwo = /\bfor two\b/i.test(name);

  const money = numeric != null ? `$${numeric.toFixed(2).replace(/\.00$/, "")}` : "price not published";

  if (evidence || titleSaysTwo) {
    return {
      price: numeric,
      currency: "USD",
      unit: "per_couple",
      covers: 2,
      evidence: evidence ?? name,
      summary: `${money} per ticket, and one ticket covers 2 people (the studio's listing says: "${
        evidence ?? name
      }").`,
    };
  }

  const singleEvidence = all.find((sentence) => /one (?:ticket|registration) (?:includes|covers|admits) one (?:student|person|participant)|\bper (?:person|participant)\b/i.test(sentence));
  if (singleEvidence) return {
    price: numeric, currency: "USD", unit: "per_ticket", covers: 1,
    evidence: singleEvidence, summary: `${money} per ticket for 1 participant.`,
  };

  return {
    price: numeric,
    currency: "USD",
    unit: "per_ticket",
    covers: null,
    evidence: null,
    summary: `${money} per ticket. Ticket coverage is not specified; checkout confirms the quantity and total for your group.`,
  };
}

function inferCraft(name: string, description: string): string {
  const text = `${name} ${description}`.toLowerCase();
  if (/(wheel|throwing|cauldron)/.test(text) && /pott|clay|ceramic/.test(text)) return "Wheel pottery";
  if (/handbuilding|hand building|kurinuki|sculpt/.test(text)) return "Handbuilding pottery";
  if (/pott|clay|ceramic|porcelain|matcha bowl|mug|vase/.test(text)) return "Pottery";
  if (/turkish|lamp/.test(text)) return "Turkish mosaic lamp";
  if (/mosaic/.test(text)) return "Mosaics";
  if (/glass fusion|fused glass/.test(text)) return "Glass fusion";
  if (/wine glass/.test(text)) return "Wine glass painting";
  if (/candle/.test(text)) return "Candle making";
  if (/soap|bath bomb/.test(text)) return "Soap & bath";
  if (/bonsai/.test(text)) return "Bonsai";
  if (/terrarium/.test(text)) return "Terrariums";
  if (/watercolor|water color/.test(text)) return "Watercolor";
  if (/paint|pigment|draw/.test(text)) return "Painting";
  return "Creative workshop";
}

function pickupNotesFrom(description: string): string[] {
  return sentences(description).filter((s) =>
    /(pick ?up|pick it up|ready (after|in)|kiln|fired|firing|glaze|greenware|keep pieces|weeks|30 days)/i.test(s),
  );
}

function locationFor(type: AcuityType): CatalogLocation {
  const category = (type.category ?? "").toLowerCase();
  if (category.includes("online")) return "online";

  // The studio's own customer-facing wording wins: some Eugene sessions are
  // still filed against the Chicago calendar, and the title is what the
  // customer reads. Only fall back to the calendar when nothing is named.
  const named = `${type.name} ${type.schedulingUrl ?? ""}`.toLowerCase();
  if (/eugene/.test(named) || category.includes("eugene")) return "eugene";
  if (/chicago|pilsen/.test(named) || category.includes("chicago")) return "chicago";

  for (const id of type.calendarIDs ?? []) {
    const city = CALENDAR_CITY[id];
    if (city) return city;
  }
  return "unknown";
}

export function normalize(type: AcuityType): CatalogClass {
  const description = (type.description ?? "").replace(/<br\s*\/?\s*>/gi, "\n").replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/\r\n/g, "\n").trim();
  const location = locationFor(type);
  const isPrivateSession = (type.category ?? "").toLowerCase().includes("private session");

  return {
    id: String(type.id),
    title: type.name.trim(),
    description,
    shortDescription: sentences(description).slice(0, 2).join(" ").slice(0, 320),
    location,
    locationLabel: LOCATION_LABELS[location],
    address: description.match(/\b(?:3295\s+Cross\s+(?:Street|St\.?|St)|1162\s+Lorella\s+(?:Avenue|Ave\.?|Ave))\b/i)?.[0] ?? LOCATION_ADDRESSES[location],
    category: type.category ?? "Uncategorised",
    craft: inferCraft(type.name, description),
    durationMinutes: typeof type.duration === "number" ? type.duration : null,
    maxGroupSize: typeof type.classSize === "number" ? type.classSize : null,
    imageUrl: type.image ?? null,
    bookingUrl:
      type.schedulingUrl ??
      `https://colorcocktailfactory.as.me/?appointmentType=${type.id}`,
    pricing: derivePricing(type.name, description, type.price),
    pickupNotes: pickupNotesFrom(description),
    byob: /byob|bring (a )?(bottle|your (own|favorite) drink)/i.test(description),
    isPrivateSession,
    kind: (type.type as CatalogClass["kind"]) ?? "class",
    enrollmentNotes: description.split(/\n|(?<=[.!?])\s+/).map((s) => s.trim()).filter((s) => /register by|late enroll|kit (?:delivery|arrival)|shipping deadline/i.test(s)).slice(0, 4),
  };
}

/* ------------------------------------------------------------------ *
 * Public API
 * ------------------------------------------------------------------ */

/** All bookable, publicly-offered classes. Cached for 5 minutes. */
export async function getCatalog(): Promise<CatalogClass[]> {
  const types = (await acuityFetch("appointment-types", 300)) as AcuityType[];
  if (!Array.isArray(types)) throw new Error("acuity_unexpected_response");

  return types
    .filter((t) => t.active)
    .filter((t) => !t.private)
    .filter((t) => !MANUALLY_HIDDEN_IDS.has(String(t.id)))
    .filter((t) => !isOneOffPrivateEvent(t.name))
    .map(normalize);
}

export async function getClassById(id: string): Promise<CatalogClass | null> {
  const catalog = await getCatalog();
  return catalog.find((c) => c.id === id) ?? null;
}

export type SearchParams = {
  location?: CatalogLocation | "any";
  /** Free-text interests, e.g. "pottery date night". */
  interests?: string;
  maxPricePerTicket?: number;
  groupSize?: number;
  limit?: number;
  requiredActivity?: Activity;
  dateFrom?: string;
  dateTo?: string;
  startAfter?: string;
  maxPricePerPerson?: number;
  /** Optional server-side constraint applied before the availability shortlist. */
  classFilter?: (item: CatalogClass) => boolean;
};

export type Activity = "wheel" | "handbuilding" | "watercolor" | "mosaic" | "candle" | "bonsai" | "terrarium" | "glass";
export function requestedActivity(text: string): Activity | undefined {
  if (/\bwheel\b|\bthrowing\b/i.test(text)) return "wheel";
  if (/hand[ -]?build|kurinuki/i.test(text)) return "handbuilding";
  if (/water[ -]?colou?r/i.test(text)) return "watercolor";
  if (/mosaic|turkish lamp/i.test(text)) return "mosaic";
  if (/candle/i.test(text)) return "candle";
  if (/bonsai/i.test(text)) return "bonsai";
  if (/terrarium/i.test(text)) return "terrarium";
  if (/glass/i.test(text)) return "glass";
  return undefined;
}

export function matchesActivity(c: CatalogClass, activity?: Activity): boolean {
  if (!activity) return true;
  const title = c.title.toLowerCase();
  const patterns: Record<Activity, RegExp> = {
    wheel: /wheel|throwing/, handbuilding: /hand[ -]?build|kurinuki/,
    watercolor: /water[ -]?colou?r/, mosaic: /mosaic|turkish lamp/, candle: /candle/,
    bonsai: /bonsai/, terrarium: /terrarium/, glass: /glass/,
  };
  return patterns[activity].test(title) && !(activity === "wheel" && /hand[ -]?build/.test(title));
}

export function matchingTimes(c: CatalogClass, times: ClassTime[], params: SearchParams): ClassTime[] {
  return times.filter((slot) => {
    const local = localDateAndTime(slot.startISO, c.location);
    if (params.dateFrom && local.date < params.dateFrom) return false;
    if (params.dateTo && local.date > params.dateTo) return false;
    if (params.startAfter && local.time < params.startAfter) return false;
    // Acuity availability is measured in booking slots. Unknown ticket coverage
    // cannot establish whether a whole group fits; leave that to checkout.
    const ticketsNeeded = params.groupSize == null ? 1 : Math.ceil(params.groupSize / (c.pricing.covers ?? 1));
    return slot.seatsAvailable != null && slot.seatsAvailable >= ticketsNeeded;
  });
}

const STOP_WORDS = new Set([
  "a", "an", "and", "the", "for", "with", "class", "classes", "something",
  "looking", "want", "would", "like", "please", "near", "me", "in", "on", "at",
  "to", "my", "our", "we", "i", "of", "or", "any", "some", "thing", "things",
  "do", "does", "is", "are", "best", "good", "fun", "make", "making",
]);

/** Keyword-scored search over the live Acuity catalog. */
export async function searchClasses(params: SearchParams): Promise<CatalogClass[]> {
  const catalog = await getCatalog();
  const limit = Math.min(Math.max(params.limit ?? 3, 1), 6);
  const location = params.location && params.location !== "any" ? params.location : null;

  const terms = (params.interests ?? "")
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((t) => t.length > 2 && !STOP_WORDS.has(t));

  const scored = catalog
    .filter((c) => params.classFilter?.(c) ?? true)
    .filter((c) => (location ? c.location === location : true))
    .filter((c) => matchesActivity(c, params.requiredActivity ?? requestedActivity(params.interests ?? "")))
    .filter((c) =>
      params.maxPricePerTicket != null && c.pricing.price != null
        ? c.pricing.price <= params.maxPricePerTicket
        : params.maxPricePerTicket == null,
    )
    .filter((c) => params.maxPricePerPerson == null || (c.pricing.price != null && c.pricing.price / (c.pricing.covers ?? 1) <= params.maxPricePerPerson))
    .filter((c) =>
      params.groupSize != null && c.maxGroupSize != null
        ? c.maxGroupSize * (c.pricing.covers ?? 1) >= params.groupSize
        : true,
    )
    .map((c) => {
      const haystack = `${c.title} ${c.craft} ${c.description}`.toLowerCase();
      let score = 0;
      for (const term of terms) {
        if (c.title.toLowerCase().includes(term)) score += 3;
        else if (c.craft.toLowerCase().includes(term)) score += 2;
        else if (haystack.includes(term)) score += 1;
      }
      // Nudge general-audience classes ahead of one-to-one private sessions.
      if (c.isPrivateSession) score -= 1;
      return { c, score };
    })
    .filter(({ score }) => (terms.length > 0 ? score > 0 : true))
    .sort((a, b) => b.score - a.score || (a.c.pricing.price ?? 1e9) - (b.c.pricing.price ?? 1e9));

  const candidates = scored.slice(0, 24).map(({ c }) => c);

  // Only recommend classes the booking system is actually running. Seasonal
  // listings stay active in Acuity all year, so score alone would surface a
  // Mother's Day class in September.
  const checked: CatalogClass[] = [];
  let availabilityFailed = false;
  for (let offset = 0; offset < candidates.length; offset += 6) {
    const batch = await Promise.all(candidates.slice(offset, offset + 6).map(async (c) => {
      try {
        const allTimes = await getClassTimes(c.id, 60, c.location);
        const times = matchingTimes(c, allTimes, params);
        return {
          ...c,
          nextStartISO: times[0]?.startISO ?? null,
          nextLocaleTime: times[0]?.localeTime ?? null,
          upcomingCount: times.length,
          matchingTimes: times,
        };
      } catch {
        availabilityFailed = true;
        return null;
      }
    }));
    checked.push(...batch.filter((c): c is NonNullable<typeof c> => c !== null && c.upcomingCount > 0));
    if (checked.length >= limit) break;
  }
  if (checked.length === 0 && availabilityFailed) throw new Error("acuity_availability_unavailable");
  return checked.slice(0, limit);
}

/**
 * Live upcoming times for a class, including real remaining seats as reported
 * by Acuity. Returns an empty array when Acuity has nothing scheduled.
 */
export async function getClassTimes(id: string, daysAhead = 45, location: CatalogLocation = "chicago"): Promise<ClassTime[]> {
  const start = new Date();
  const end = new Date(start.getTime() + daysAhead * 86_400_000);
  const iso = (d: Date) => d.toISOString().slice(0, 10);

  const raw = (await acuityFetch(
    `availability/classes?appointmentTypeID=${encodeURIComponent(id)}&minDate=${iso(start)}&maxDate=${iso(end)}`,
    120,
  )) as Array<{ time?: string; localeTime?: string; slots?: number; slotsAvailable?: number }>;

  if (!Array.isArray(raw)) return [];

  return raw
    .filter((slot) => typeof slot.time === "string")
    .map((slot) => ({
      startISO: slot.time as string,
      localeTime: formatClassTime(slot.time as string, location),
      seatsTotal: typeof slot.slots === "number" ? slot.slots : null,
      seatsAvailable: typeof slot.slotsAvailable === "number" ? slot.slotsAvailable : null,
    }))
    .filter((slot) => new Date(slot.startISO).getTime() > Date.now())
    .sort((a, b) => a.startISO.localeCompare(b.startISO));
}

/** Compact shape handed to the model — small, factual, no HTML. */
export function toToolShape(c: CatalogClass) {
  return {
    class_id: c.id,
    title: c.title,
    location: c.location,
    location_label: c.locationLabel,
    craft: c.craft,
    duration_minutes: c.durationMinutes,
    schedule_type: c.kind === "series" || /\b\d+[ -]week|\bcourse\b/i.test(c.title) ? "series_lessons_not_separate_start_dates" : "individual_class",
    time_zone: studioTimeZone(c.location),
    enrollment_conditions: c.enrollmentNotes,
    upcoming_matching_times: c.matchingTimes?.slice(0, 8).map((t) => ({ starts_at: t.startISO, display_time: t.localeTime, booking_slots_available: t.seatsAvailable })),
    max_group_size: c.maxGroupSize,
    price_usd: c.pricing.price,
    price_unit: c.pricing.unit,
    ticket_covers_people: c.pricing.covers,
    pricing_statement: c.pricing.summary,
    byob_mentioned_in_listing: c.byob,
    pickup_notes_from_listing: c.pickupNotes.slice(0, 3),
    booking_url: c.bookingUrl,
    summary: c.shortDescription,
    is_private_one_to_one_session: c.isPrivateSession,
    next_date_local:
      c.nextLocaleTime === undefined ? "not checked" : (c.nextLocaleTime ?? "nothing scheduled in the next 60 days"),
    upcoming_dates_in_next_60_days: c.upcomingCount ?? null,
  };
}

/** Card payload for the chat UI — images and links only from live data. */
export function toCardShape(c: CatalogClass) {
  return {
    id: c.id,
    title: c.title,
    location: c.location,
    locationLabel: c.locationLabel,
    craft: c.craft,
    priceUsd: c.pricing.price,
    priceUnit: c.pricing.unit,
    ticketCovers: c.pricing.covers,
    pricingSummary: c.pricing.summary,
    durationMinutes: c.durationMinutes,
    nextLocaleTime: c.nextLocaleTime ?? null,
    enrollmentNotes: c.enrollmentNotes,
    isSeries: c.kind === "series" || /\b\d+[ -]week|\bcourse\b/i.test(c.title),
    imageUrl: c.imageUrl,
    bookingUrl: c.bookingUrl,
  };
}
