/**
 * Ask CCF — curated knowledge base.
 *
 * HOW TO MAINTAIN THIS FILE (staff):
 *   1. Every entry is a plain object. Edit the `content` text, bump
 *      `verifiedOn` to the date you re-checked it, and keep `source` pointing
 *      at the customer-facing page (or approved project material) it came from.
 *   2. If two sources disagree, do NOT pick one. Put the disagreement in
 *      `conflict` — the assistant then says it needs to confirm with staff
 *      instead of guessing.
 *   3. Live class names, prices, dates and seat counts do NOT belong here.
 *      Those come from Acuity at request time (lib/askccf/catalog.ts).
 *   4. A change takes effect on the next deploy. Nothing else to configure.
 *
 * See docs/ask-ccf.md for the full staff guide.
 */

export type KnowledgeCity = "chicago" | "eugene" | "online" | "all";

export type KnowledgeEntry = {
  id: string;
  title: string;
  /** Retrieval keywords — lowercase, generous. */
  topics: string[];
  cities: KnowledgeCity[];
  content: string;
  /** Customer-facing page or approved project material this came from. */
  source: string;
  /** ISO date this entry was last checked against its source. */
  verifiedOn: string;
  /** Set when sources disagree. The assistant will refuse to state a number. */
  conflict?: string;
};

/** Bumped whenever the set of entries below changes. */
export const KNOWLEDGE_VERSION = "2026-09-12";

export const knowledgeBase: KnowledgeEntry[] = [
  {
    id: "about-ccf",
    title: "What Color Cocktail Factory is",
    topics: ["about", "ccf", "who", "studio", "company", "motto", "what is"],
    cities: ["all"],
    content:
      'Color Cocktail Factory (CCF) is an expert-led creative workshop studio with locations in Chicago\'s Pilsen neighborhood and in Eugene, Oregon, plus a small number of live online classes. The motto is "Creativity is shareable." Classes cover pottery and wheel throwing, handbuilding, mosaics and Turkish lamps, glass fusion, painting and watercolor, candles and soap, terrariums and bonsai. CCF is a workshop business — not a pottery-supply store and not an open-access membership studio.',
    source: "https://colorcocktailfactory.com/ (and /public/llms.txt)",
    verifiedOn: "2026-09-04",
  },
  {
    id: "locations",
    title: "Studio locations and address details",
    topics: ["location", "address", "where", "directions", "parking", "pilsen", "chicago", "eugene", "studio"],
    cities: ["all"],
    content:
      "Chicago studio: 1142 W. 18th Street, Chicago, IL 60608 (Pilsen). Eugene studio: 1162 Lorella Ave, Eugene, OR 97401. Chicago and Eugene run different class line-ups, schedules and prices, so always confirm which studio the customer means before recommending anything.",
    source: "https://colorcocktailfactory.com/chicago, /eugene, Acuity calendar records",
    verifiedOn: "2026-09-12",
  },
  {
    id: "hours",
    title: "Studio hours",
    topics: ["hours", "open", "close", "when open", "walk in", "walk-in", "drop in"],
    cities: ["all"],
    content:
      "Published Chicago hours are Wed–Fri 5:30–9pm, Sat 12–9:30pm, Sun 2:30–6:30pm. Eugene hours vary by class. Hours track the class schedule rather than a storefront: CCF is reservation-based, so do not promise walk-in or same-day availability — point people at the booking page for the actual times.",
    source: "https://colorcocktailfactory.com/ location selector",
    verifiedOn: "2026-09-12",
    conflict:
      "Studio hours are published only on the homepage location selector and may lag the live Acuity schedule. If a customer needs an exact time, use live class times or send them to staff.",
  },
  {
    id: "booking-how",
    title: "How booking works",
    topics: ["book", "booking", "reserve", "reservation", "tickets", "checkout", "pay", "payment", "sign up"],
    cities: ["all"],
    content:
      "Classes are booked and paid for on CCF's Acuity Scheduling portal at https://colorcocktailfactory.as.me/ — each class has its own booking page. Advance reservation is generally required. Payment and final confirmation always happen in that checkout, never in this chat. Seats are only held once checkout is completed.",
    source: "https://colorcocktailfactory.as.me/, /public/llms.txt",
    verifiedOn: "2026-09-12",
    conflict:
      "The site header's generic 'Book a Class' button for Chicago still points at a RezClick calendar (lib/links.ts), while llms.txt and the class listings use Acuity. Always use the per-class Acuity link returned by class search, and flag the RezClick link to staff.",
  },
  {
    id: "pricing-units",
    title: "How class prices and tickets work",
    topics: ["price", "prices", "cost", "how much", "ticket", "per person", "per couple", "date night price", "budget"],
    cities: ["all"],
    content:
      "Prices change, and each class sets its own. Never quote a price from memory — quote the live price returned by class search. Most tickets admit one person. Some date-night classes explicitly state that one ticket covers two people (for example listings that say 'ONE TICKET PER COUPLE' or 'two seats per ticket'). Always say which it is, and say how many people a ticket covers when the listing states it. When the listing does not state coverage, say so and let checkout confirm the total.",
    source: "Acuity appointment-type listings (live)",
    verifiedOn: "2026-09-12",
  },
  {
    id: "experience-level",
    title: "Experience level and what to expect",
    topics: ["beginner", "experience", "never", "first time", "skill", "hard", "difficult", "wear", "clothes", "apron"],
    cities: ["all"],
    content:
      "Classes are designed for beginners as well as returning makers — no experience needed, and instructors guide each step. Wear something comfortable you don't mind getting clay or paint on; aprons are provided for wheel classes. Wheel-throwing sessions focus on learning: a finished piece is not guaranteed, and anything you do make starts as unfired greenware (fragile, decorative) until it is fired.",
    source: "Acuity class listings; https://colorcocktailfactory.com/activities",
    verifiedOn: "2026-09-12",
  },
  {
    id: "byob",
    title: "BYOB rules",
    topics: ["byob", "alcohol", "wine", "beer", "drinks", "liquor", "food", "cake", "snacks", "21"],
    cities: ["all"],
    content:
      "CCF is BYOB-friendly for most classes and private events. Published rules: beer, wine and hard liquor are welcome; bring your own cups, ice and mixers; keep drinks off the art-making surfaces; BYOB is for guests 21+ and staff may ask for valid ID; outside food and delivery are welcome (cupcakes preferred over whole cakes); you clear your own bottles and trash. BYOB availability can still depend on the specific class, event and participants — confirm on the class page or with staff for anything unusual.",
    source: "https://colorcocktailfactory.com/birthday-parties, /private-events, /team-building",
    verifiedOn: "2026-09-12",
  },
  {
    id: "ages",
    title: "Age requirements and kids",
    topics: ["age", "ages", "kids", "child", "children", "family", "minor", "how old", "teen"],
    cities: ["all"],
    content:
      "For private events CCF offers age-appropriate activities for kids as young as 6 — handbuilding pottery, painting and simple mosaics are the usual picks — and parent supervision is required for children under 10. Public class listings do not all state a minimum age, so for a specific public class, check that class's page or ask staff rather than assuming. BYOB is 21+ regardless of the class.",
    source: "https://colorcocktailfactory.com/private-events FAQ",
    verifiedOn: "2026-09-12",
    conflict:
      "Only the private-events page states an age floor (6, supervision under 10). No public-class age policy is published, so age questions about a specific public class must go to staff.",
  },
  {
    id: "pickup-general",
    title: "Pottery pickup and firing timelines",
    topics: ["pickup", "pick up", "ready", "firing", "fired", "kiln", "glaze", "greenware", "collect", "my pottery", "when ready"],
    cities: ["all"],
    content:
      "Anything not kiln-fired — terrariums, bonsai, candles, painted glass and painted canvases — goes home the same day. Kiln-fired pottery has to be fired and glazed first, so it is collected later, during studio hours. Published timelines vary by class: the private-events FAQ says pottery is ready for pickup in about 2–3 weeks and glass fusion in about 1 week, while individual class listings say things like 'pieces are ready after 30 days', 'pick up after 3 weeks', or 'ready in a few days'. Treat every timeline as an estimate, quote the specific class listing when there is one, and never tell a customer a specific piece is definitely ready based on elapsed time alone. Fired pieces are held for 60 days after firing.",
    source: "https://colorcocktailfactory.com/private-events FAQ; Acuity class listings",
    verifiedOn: "2026-09-12",
    conflict:
      "Pickup timelines disagree across sources (about 2–3 weeks on the private-events FAQ vs 3 weeks / 30 days / a few days in individual class listings). Give the range as an estimate and offer to check with staff; never confirm a specific piece is ready.",
  },
  {
    id: "pickup-process",
    title: "How to collect finished pottery",
    topics: ["pickup process", "collect", "pick up my", "how do i get", "storage", "60 days", "lost"],
    cities: ["all"],
    content:
      "Pickup happens at the studio where you took the class, during studio hours, and no appointment is needed. Bring the name the class was booked under. Fired pieces are kept for 60 days after firing. If a customer wants to know whether a specific piece is ready, either look it up in the pickup tracker (which needs the email on the booking plus the last name) or hand it to staff at support@colorcocktailfactory.com — do not estimate a single piece's status from the class date.",
    source: "Acuity class listings; studio pickup practice documented in /public/llms.txt",
    verifiedOn: "2026-09-12",
  },
  {
    id: "private-events",
    title: "Private parties, birthdays, bachelorettes and corporate events",
    topics: ["private", "party", "parties", "birthday", "bachelorette", "corporate", "team building", "group", "wedding", "offsite", "quote", "event"],
    cities: ["all"],
    content:
      "CCF hosts private creative events in both cities: birthdays, bachelorettes, weddings and engagement parties, team building and corporate offsites. Published guidance: groups from 8 to 50+ (8–15 feels intimate, 20–50+ can take the whole space), every event includes expert instruction, you can arrive 30 minutes early to decorate, activities can be mixed and matched into custom packages, and the date is secured with a deposit. Book 2–4 weeks ahead for weekends and 1–2 weeks for weekdays; last-minute requests within 3–5 days are sometimes possible. Per-person pricing is quoted per activity, date, location and group size — send an inquiry for an exact quote.",
    source: "https://colorcocktailfactory.com/private-events, /birthday-parties, /team-building, /corporate",
    verifiedOn: "2026-09-12",
    conflict:
      "Published per-person ranges differ by page ($45–$85 on the private-events page, $55–$85 with volume discounts for 20+ on the team-building page). Quote it as a range that depends on activity and group size, and let staff confirm the actual quote.",
  },
  {
    id: "private-events-inquiry",
    title: "How a private event inquiry is handled",
    topics: ["inquiry", "request", "quote", "contact", "form", "reply", "how long", "follow up"],
    cities: ["all"],
    content:
      "Private events are quoted by staff, not booked online. An inquiry needs a name and email, the city, a preferred date, roughly how many people, and what activity they are interested in; a phone number, budget and notes are optional and help. The studio typically replies within 24 hours with dates, project ideas and a quote. The same inquiry can also be sent from https://colorcocktailfactory.com/private-events, and general questions go to support@colorcocktailfactory.com.",
    source: "https://colorcocktailfactory.com/private-events inquiry form",
    verifiedOn: "2026-09-12",
  },
  {
    id: "cancellation",
    title: "Cancellations, reschedules and refunds",
    topics: ["cancel", "cancellation", "refund", "reschedule", "change date", "move", "sick", "no show", "credit"],
    cities: ["all"],
    content:
      "Published policies differ by booking type and page, and some individual classes state 'no refunds or rescheduling' in their own listing. Because of that, never approve, deny or promise a refund, credit, reschedule or policy exception in chat. Explain that the studio handles those case by case, point to the policy on the customer's own booking confirmation, and hand them to support@colorcocktailfactory.com with their booking details.",
    source: "https://colorcocktailfactory.com/private-events FAQ, /team-building, Acuity class listings",
    verifiedOn: "2026-09-12",
    conflict:
      "The private-events FAQ says cancellations 7+ days out get a full refund and within 7 days may get partial credit; the team-building page says cancel up to 48 hours before for a full refund and reschedule with 24 hours' notice; some class listings say no refunds or rescheduling. Do not state a rule — route to staff.",
  },
  {
    id: "online-classes",
    title: "Online classes and what you need",
    topics: ["online", "virtual", "at home", "remote", "zoom", "kit", "shipping", "supplies", "membership"],
    cities: ["online", "all"],
    content:
      "Online offerings are live, taught remotely, and separate from the in-studio classes. The 6-week live online pottery course includes six Saturday sessions, a tabletop wheel and tools to keep, and clay for session one; there is a registration deadline for kit delivery, more air-dry clay is needed before session two, one registration covers one student and one kit, and projects are air-dry — decorative, not food safe or waterproof. The live online watercolor class is supply-your-own: watercolor paints, 140 lb cold-press paper, small and medium round brushes, two water containers, paper towels, pencil, eraser and masking tape; expensive supplies are not required. There is also a 3-month online pottery membership; it needs a sturdy table, a towel, water access and cleanup space, and no kiln. Always confirm the current cohort dates, deadlines and prices from the live booking page.",
    source: "Acuity 'Online Class Series' listings; https://colorcocktailfactory.com/pottery-membership",
    verifiedOn: "2026-09-12",
  },
  {
    id: "gift-cards",
    title: "Gift cards",
    topics: ["gift", "gift card", "certificate", "present", "voucher"],
    cities: ["all"],
    content:
      "Gift cards let the recipient pick their own workshop and are bought at https://colorcocktailfactory.com/gift-cards (the Acuity gift-card catalog). They are redeemable for eligible CCF experiences. For balance, expiry or redemption questions on an existing card, send the customer to support@colorcocktailfactory.com.",
    source: "https://colorcocktailfactory.com/gift-cards",
    verifiedOn: "2026-09-12",
  },
  {
    id: "spin-a-spell",
    title: "Spin a Spell — clay cauldron class",
    topics: ["spin a spell", "spinaspell", "cauldron", "halloween", "witch", "witchy", "spell"],
    cities: ["chicago", "eugene"],
    content:
      "'Spin A Spell — Make your Own Clay Cauldron' is a beginner porcelain cauldron class that works for solo makers, date nights, girls' nights and families. It includes a clear food-safe glaze, and the listing says pieces are picked up 30 days after the class. The Chicago session's own booking link is https://colorcocktailfactory.as.me/spinaspell — verified against the Acuity listing for that class (appointment type 95588506). Eugene runs its own session with a separate booking link, so check the city first.",
    source: "Acuity appointment types 95588506 (Chicago) and 96657402 (Eugene)",
    verifiedOn: "2026-09-12",
  },
  {
    id: "date-night",
    title: "Date night options",
    topics: ["date night", "couple", "couples", "romantic", "anniversary", "valentine", "partner", "two"],
    cities: ["all"],
    content:
      "Date nights are one of CCF's signatures: wheel pottery for two, candlelit mosaic and Turkish lamp sessions, watercolor for two, candle making, terrariums and bonsai, plus VIP formats with one-to-one instruction. Both cities run them and the line-up differs, so check the city, then use live class search for what is actually scheduled. Pay close attention to whether a ticket covers one person or the couple — the listings differ, and that is the most common source of confusion.",
    source: "Acuity class listings; https://colorcocktailfactory.com/activities",
    verifiedOn: "2026-09-12",
  },
  {
    id: "materials-included",
    title: "Materials, tools and what's included",
    topics: ["materials", "included", "tools", "bring", "supplies", "clay", "what do i need"],
    cities: ["all"],
    content:
      "In-studio classes include the materials, tools and instruction described on the class listing — clay, glaze options, mosaic glass and lamp hardware, candle supplies, paints and so on. Some listings include glazing and kiln firing, others charge for firing or finishing separately (for example optional firing and glazing on some pottery classes). Quote the specific class listing rather than generalising, and for online classes see the online-class requirements.",
    source: "Acuity class listings; lib/config.ts activity FAQs",
    verifiedOn: "2026-09-12",
  },
  {
    id: "accessibility-and-staff",
    title: "Anything not published: route to staff",
    topics: ["accessibility", "wheelchair", "allergy", "pregnant", "special", "staff", "human", "email", "phone", "help"],
    cities: ["all"],
    content:
      "Accessibility details, allergies, medical questions, custom requests, existing bookings, attendee lists and anything not published on the site are staff decisions. Say plainly that you'll hand it over, and point to support@colorcocktailfactory.com (or the private-events form for group requests) with the details the customer already gave.",
    source: "https://colorcocktailfactory.com/private-events; support@colorcocktailfactory.com",
    verifiedOn: "2026-09-12",
  },
];

/** Cities a customer may be asking about, normalised. */
export function matchesCity(entry: KnowledgeEntry, city: KnowledgeCity | null): boolean {
  if (!city || city === "all") return true;
  return entry.cities.includes("all") || entry.cities.includes(city);
}

const STOP = new Set([
  "the", "and", "for", "with", "what", "when", "where", "how", "does", "did",
  "are", "is", "can", "you", "your", "our", "have", "has", "any", "about",
  "that", "this", "there", "would", "could", "should", "will", "want", "need",
  "please", "much", "many", "tell", "know", "get", "got", "make", "made",
]);

/**
 * Keyword retrieval over the knowledge base. Deliberately simple: a studio
 * staffer can predict exactly what the assistant will see.
 */
export function searchKnowledge(
  query: string,
  city: KnowledgeCity | null = null,
  limit = 4,
): KnowledgeEntry[] {
  const terms = query
    .toLowerCase()
    .split(/[^a-z0-9+]+/)
    .filter((t) => t.length > 2 && !STOP.has(t));

  const scored = knowledgeBase
    .filter((entry) => matchesCity(entry, city))
    .map((entry) => {
      const topicText = entry.topics.join(" ");
      const body = `${entry.title} ${entry.content}`.toLowerCase();
      let score = 0;
      for (const term of terms) {
        if (topicText.includes(term)) score += 3;
        if (body.includes(term)) score += 1;
      }
      // Multi-word topic phrases are strong signals ("date night", "gift card").
      for (const topic of entry.topics) {
        if (topic.includes(" ") && query.toLowerCase().includes(topic)) score += 4;
      }
      return { entry, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, Math.min(Math.max(limit, 1), 6)).map(({ entry }) => entry);
}

/** Tool-facing shape: content plus provenance so the model can cite honestly. */
export function toKnowledgeShape(entry: KnowledgeEntry) {
  return {
    id: entry.id,
    title: entry.title,
    content: entry.content,
    applies_to: entry.cities,
    source: entry.source,
    verified_on: entry.verifiedOn,
    conflict_flag: entry.conflict ?? null,
  };
}
