/** Public events use the same Acuity catalog and availability as checkout. */
import { getCatalog, getPublicClassSchedule } from "@/lib/askccf/catalog";
import { STUDIO_LOCATIONS } from "@/lib/locations";
import { eventBookingUrl } from "@/lib/booking";
import { getClassPhoto } from "@/lib/classPhotos";

export type NormalizedEvent = {
  id: string;
  source: "acuity";
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  city: "Chicago" | "Eugene" | "Virtual";
  venueName: string;
  streetAddress: string;
  addressLocality: string;
  addressRegion: string;
  postalCode: string;
  addressCountry: string;
  imageUrl: string | null;
  price: number | null;
  currency: string;
  bookingUrl: string;
  category: string;
  status: "scheduled" | "cancelled";
  lastUpdated: string;
  slug: string;
};

export function eventCategory(title: string): string {
  const text = title.toLowerCase();
  if (/soap holder|candle holder|lantern|chess set/.test(text)) return "Handbuilding";
  if (/paint pottery/.test(text)) return "Pottery Painting";
  if (/water ?color/.test(text)) return "Watercolor";
  if (/turkish.*lamp/.test(text)) return "Turkish Lamps";
  if (/mosaic/.test(text)) return "Mosaics";
  if (/wine glass.*paint/.test(text)) return "Painting";
  if (/glass/.test(text)) return "Glass Art";
  if (/bonsai/.test(text)) return "Bonsai";
  if (/terrarium/.test(text)) return "Terrariums";
  if (/candle making/.test(text)) return "Candle Making";
  if (/soap|bath bomb/.test(text)) return "Soap & Bath";
  if (/paint|pigment|draw/.test(text) && !/wheel|ceramic|pottery/.test(text)) return "Painting";
  if (/wheel|throwing|spin a spell/.test(text)) return "Wheel Throwing";
  if (/handbuild|clay|ceramic|pottery|porcelain|cauldron|mug|bowl|vase|dildo/.test(text)) return "Handbuilding";
  return "Creative Workshops";
}

export async function getAllEvents(daysAhead = 60): Promise<NormalizedEvent[]> {
  const [catalog, slots] = await Promise.all([getCatalog(), getPublicClassSchedule(daysAhead)]);
  const classes = new Map(catalog.map(item => [item.id, item]));
  const events = new Map<string, NormalizedEvent>();
  const now = new Date();
  const cutoff = now.getTime() + daysAhead * 86400000;
  for (const slot of slots) {
    const item = classes.get(String(slot.appointmentTypeID));
    const start = new Date(slot.time);
    if (!item || !Number.isFinite(start.getTime()) ||
        start <= now || start.getTime() > cutoff || slot.slotsAvailable <= 0) continue;

    // Determine location by slot calendar when in-person, falling back to item location
    let locationKey: "chicago" | "eugene" | "online" | "unknown" = item.location;
    if (item.location !== "online") {
      if (slot.calendarID === 13582962) {
        locationKey = "eugene";
      } else if (slot.calendarID === 12216179) {
        locationKey = "chicago";
      }
    }
    if (locationKey === "unknown") continue;

    const studio = locationKey === "online" ? null : STUDIO_LOCATIONS[locationKey];
    const city = studio?.label ?? "Virtual";
    const slug = `acuity-${item.id}-${start.toISOString().slice(0, 10)}-${slot.time.replace(/\D/g, "").slice(8, 12)}`;
    const id = `${slug}-${slot.calendarID}`;

    let title = item.title;
    if (city === "Eugene") {
      title = title.replace(/\s*-\s*Chicago$/i, "").trim();
    } else if (city === "Chicago") {
      title = title.replace(/\s*-\s*Eugene$/i, "").trim();
    }

    // One public event per class, location and actual start time.
    const key = `${item.id}:${city}:${start.toISOString()}`;
    events.set(key, {
      id, slug, source: "acuity", title, description: item.description,
      startDate: start.toISOString(),
      endDate: new Date(start.getTime() + (Number(slot.duration) || item.durationMinutes || 90) * 60000).toISOString(),
      city, venueName: studio ? `Color Cocktail Factory — ${city}` : "Live online workshop",
      streetAddress: studio?.streetAddress ?? "", addressLocality: studio?.addressLocality ?? "",
      addressRegion: studio?.addressRegion ?? "", postalCode: studio?.postalCode ?? "", addressCountry: studio?.addressCountry ?? "",
      imageUrl: getClassPhoto(item.id)?.path ?? null, price: item.pricing.price, currency: "USD",
      bookingUrl: eventBookingUrl(item.id, slot.time, slot.calendarID),
      category: eventCategory(title), status: "scheduled", lastUpdated: now.toISOString(),
    });
  }
  return [...events.values()].sort((a, b) => Date.parse(a.startDate) - Date.parse(b.startDate));
}

export async function getEventBySlug(slug: string): Promise<NormalizedEvent | null> {
  return (await getAllEvents()).find(event => event.slug === slug) ?? null;
}

export function eventLocationSchema(event: NormalizedEvent) {
  return event.city === "Virtual" ? {
    "@type": "VirtualLocation", url: event.bookingUrl,
  } : {
    "@type": "Place", name: event.venueName,
    address: { "@type": "PostalAddress", streetAddress: event.streetAddress,
      addressLocality: event.addressLocality, addressRegion: event.addressRegion,
      postalCode: event.postalCode, addressCountry: event.addressCountry },
  };
}
