/**
 * Ask CCF — server-side tools available to the model.
 *
 * Every fact the assistant can state about a class, a policy or a customer's
 * pottery comes back through one of these tools. The model never receives raw
 * credentials, and tool output is fed back as data, not instructions.
 */
import {
  getClassById,
  getClassTimes,
  searchClasses,
  toCardShape,
  toToolShape,
  type CatalogClass,
  type CatalogLocation,
} from "./catalog";
import { searchKnowledge, toKnowledgeShape, type KnowledgeCity } from "./knowledge";
import { consumeRateLimit, lookupPickup } from "./store";
import { aiConfig } from "./config";
import { hashId } from "./store";

export type InquiryDraft = {
  name: string;
  email: string;
  phone: string | null;
  city: string;
  preferredDate: string | null;
  groupSize: string | null;
  activity: string | null;
  budget: string | null;
  notes: string | null;
};

export type ToolContext = {
  sessionId: string;
  /** City the website is currently showing, when there is one. */
  siteCity: CatalogLocation | null;
};

export type ToolOutcome = {
  /** JSON-serialisable payload handed back to the model. */
  result: unknown;
  /** Classes referenced by this call, so the UI can render authoritative cards. */
  classes?: CatalogClass[];
  /** A private-party summary awaiting the customer's explicit confirmation. */
  draft?: InquiryDraft;
};

export const toolDefinitions = [
  {
    type: "function" as const,
    function: {
      name: "search_classes",
      description:
        "Search Color Cocktail Factory's live class catalog (Acuity). Use for any 'find me a class' request. Returns live titles, prices, ticket coverage and booking links. Ask for the city first if it is unknown.",
      parameters: {
        type: "object",
        properties: {
          city: {
            type: "string",
            enum: ["chicago", "eugene", "online", "any"],
            description: "Which studio to search. Use 'any' only if the customer truly has no preference.",
          },
          interests: {
            type: "string",
            description:
              "Free text of what they want, e.g. 'date night pottery wheel' or 'mosaic for a group of 10'.",
          },
          max_price_per_ticket: { type: "number", description: "Optional budget ceiling in USD per ticket." },
          group_size: { type: "number", description: "Optional number of people, used to exclude classes that are too small." },
          limit: { type: "number", description: "How many options to return (1-4). Default 3." },
        },
        required: ["city"],
        additionalProperties: false,
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "get_class_details",
      description:
        "Full live detail for one class: description, duration, max group size, materials/pickup notes from the listing, price and ticket coverage, booking link.",
      parameters: {
        type: "object",
        properties: { class_id: { type: "string", description: "class_id from search_classes." } },
        required: ["class_id"],
        additionalProperties: false,
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "get_class_dates",
      description:
        "Live upcoming dates, times and remaining seats for one class, straight from the booking system. Use this instead of guessing whether something is scheduled or full.",
      parameters: {
        type: "object",
        properties: {
          class_id: { type: "string", description: "class_id from search_classes." },
          days_ahead: { type: "number", description: "How far to look ahead, 1-60 days. Default 45." },
        },
        required: ["class_id"],
        additionalProperties: false,
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "search_ccf_info",
      description:
        "Look up CCF's verified studio information: locations, hours, booking, BYOB, ages, materials, pickup timelines, private events, online-class requirements, gift cards, cancellation handling. Use this before answering any policy question. Respect any conflict_flag in the result.",
      parameters: {
        type: "object",
        properties: {
          question: { type: "string", description: "The customer's question or the topic keywords." },
          city: { type: "string", enum: ["chicago", "eugene", "online", "all"], description: "Optional city filter." },
        },
        required: ["question"],
        additionalProperties: false,
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "lookup_pottery_pickup",
      description:
        "Check the studio's pottery pickup tracker for a customer. Requires BOTH the email used to book AND their last name — ask for both before calling, and never call with only one. Returns verified records, or tells you no verified record exists so you can give a clearly-labelled estimate instead.",
      parameters: {
        type: "object",
        properties: {
          email: { type: "string", description: "Email address used for the booking." },
          last_name: { type: "string", description: "Customer's last name." },
        },
        required: ["email", "last_name"],
        additionalProperties: false,
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "prepare_private_party_inquiry",
      description:
        "Build a private-party inquiry summary for the customer to review. Call this only once you have name, email, city, preferred date, group size and the activity they are interested in. This does NOT send anything — the customer taps Send on the summary card.",
      parameters: {
        type: "object",
        properties: {
          name: { type: "string" },
          email: { type: "string" },
          phone: { type: "string", description: "Optional." },
          city: { type: "string", enum: ["chicago", "eugene"] },
          preferred_date: { type: "string", description: "Preferred date, ideally YYYY-MM-DD." },
          group_size: { type: "string", description: "Approximate group size, e.g. '12' or '15-18'." },
          activity: { type: "string", description: "Activity they are interested in." },
          budget: { type: "string", description: "Optional budget, e.g. '$65 per person'." },
          notes: { type: "string", description: "Optional extra notes." },
        },
        required: ["name", "email", "city", "preferred_date", "group_size", "activity"],
        additionalProperties: false,
      },
    },
  },
];

const BOOKING_PORTAL = "https://colorcocktailfactory.as.me/";
const STAFF_EMAIL = "support@colorcocktailfactory.com";

function str(value: unknown, max = 200): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim().slice(0, max);
  return trimmed.length > 0 ? trimmed : null;
}

function positiveNumber(value: unknown): number | undefined {
  const parsed = typeof value === "number" ? value : Number.parseFloat(String(value ?? ""));
  return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;
}

function asLocation(value: unknown, fallback: CatalogLocation | null): CatalogLocation | "any" {
  const raw = typeof value === "string" ? value.toLowerCase() : "";
  if (raw === "chicago" || raw === "eugene" || raw === "online") return raw;
  if (raw === "any") return "any";
  return fallback ?? "any";
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;

/** Executes one tool call. Never throws: failures come back as data. */
export async function runTool(
  name: string,
  rawArgs: Record<string, unknown>,
  ctx: ToolContext,
): Promise<ToolOutcome> {
  try {
    switch (name) {
      case "search_classes": {
        const location = asLocation(rawArgs.city, ctx.siteCity);
        const classes = await searchClasses({
          location,
          interests: str(rawArgs.interests, 300) ?? undefined,
          maxPricePerTicket: positiveNumber(rawArgs.max_price_per_ticket),
          groupSize: positiveNumber(rawArgs.group_size),
          limit: positiveNumber(rawArgs.limit) ?? 3,
        });

        if (classes.length === 0) {
          return {
            result: {
              searched_location: location,
              matches: [],
              guidance: `No live match in the booking system for that. Say so plainly and offer the full schedule at ${BOOKING_PORTAL} or a private-event inquiry.`,
            },
          };
        }

        return {
          result: {
            searched_location: location,
            data_source: "Acuity Scheduling (live)",
            matches: classes.map(toToolShape),
            reminder:
              "These prices and links are live. Do not add discounts, urgency or seat counts that are not in this payload.",
          },
          classes,
        };
      }

      case "get_class_details": {
        const id = str(rawArgs.class_id, 40);
        const found = id ? await getClassById(id) : null;
        if (!found) {
          return {
            result: {
              error: "class_not_found",
              guidance: `That class is not in the live catalog any more. Offer to search again or link ${BOOKING_PORTAL}.`,
            },
          };
        }
        return {
          result: {
            data_source: "Acuity Scheduling (live)",
            ...toToolShape(found),
            full_description: found.description.slice(0, 1200),
            address: found.address,
          },
          classes: [found],
        };
      }

      case "get_class_dates": {
        const id = str(rawArgs.class_id, 40);
        const found = id ? await getClassById(id) : null;
        if (!found) {
          return { result: { error: "class_not_found", guidance: `Offer ${BOOKING_PORTAL} instead.` } };
        }
        const daysAhead = Math.min(Math.max(positiveNumber(rawArgs.days_ahead) ?? 45, 1), 60);
        const times = await getClassTimes(found.id, daysAhead);
        return {
          result: {
            class_id: found.id,
            title: found.title,
            data_source: "Acuity Scheduling (live)",
            booking_url: found.bookingUrl,
            upcoming: times.slice(0, 8).map((time) => ({
              starts_at: time.startISO,
              local_time: time.localeTime,
              seats_available: time.seatsAvailable,
              seats_total: time.seatsTotal,
            })),
            note:
              times.length === 0
                ? "Nothing currently scheduled in this window. Say that and link the booking page; do not invent dates."
                : "Seat counts are live. State them only as given, with no urgency language.",
          },
          classes: [found],
        };
      }

      case "search_ccf_info": {
        const question = str(rawArgs.question, 400) ?? "";
        const city = (str(rawArgs.city, 20) as KnowledgeCity | null) ?? null;
        const entries = searchKnowledge(question, city, 4);
        return {
          result: {
            data_source: `CCF knowledge base (curated, verified per entry)`,
            entries: entries.map(toKnowledgeShape),
            guidance:
              entries.length === 0
                ? `Nothing verified covers that. Say you don't want to guess and hand it to ${STAFF_EMAIL}.`
                : "If an entry has a conflict_flag, do not state a single number — explain briefly and offer the staff route.",
          },
        };
      }

      case "lookup_pottery_pickup": {
        const email = str(rawArgs.email, 200);
        const lastName = str(rawArgs.last_name, 80);
        if (!email || !EMAIL_RE.test(email) || !lastName) {
          return {
            result: {
              error: "verification_incomplete",
              guidance:
                "Ask for both the email used to book and the last name on the booking before looking anything up.",
            },
          };
        }

        // Enumeration guard: a session gets a small number of lookups per hour.
        const limit = await consumeRateLimit(
          `pickup:${hashId(ctx.sessionId)}:${new Date().toISOString().slice(0, 13)}`,
          aiConfig.pickupLookupsPerHour,
          3_600_000,
        );
        if (!limit.allowed) {
          return {
            result: {
              error: "too_many_lookups",
              guidance: `Too many pickup lookups this hour. Ask them to email ${STAFF_EMAIL} with their booking details.`,
            },
          };
        }

        const result = await lookupPickup(email, lastName);
        if (result.outcome === "found") {
          return {
            result: {
              data_source: "CCF pickup tracker (staff-maintained, verified record)",
              verified: true,
              records: result.records,
              guidance:
                "These are verified records. Report status as written. 'ready' means ready; anything else is still in progress — do not upgrade it.",
            },
          };
        }
        return {
          result: {
            verified: false,
            records: [],
            reason: result.outcome === "no_records" ? "no_matching_record" : "tracker_unavailable",
            guidance:
              `No verified record matched, so do not confirm any piece is ready. Give the general timeline as an estimate (kiln-fired pottery is usually ready a few weeks after class, and individual class listings vary), say elapsed time alone cannot confirm a specific piece, and offer to have staff check: ${STAFF_EMAIL}.`,
          },
        };
      }

      case "prepare_private_party_inquiry": {
        const name = str(rawArgs.name, 120);
        const email = str(rawArgs.email, 200);
        const city = str(rawArgs.city, 40);
        const missing: string[] = [];
        if (!name) missing.push("name");
        if (!email || !EMAIL_RE.test(email)) missing.push("a valid email");
        if (!city) missing.push("city");
        if (!str(rawArgs.preferred_date, 60)) missing.push("preferred date");
        if (!str(rawArgs.group_size, 40)) missing.push("approximate group size");
        if (!str(rawArgs.activity, 160)) missing.push("interested activity");

        if (missing.length > 0) {
          return {
            result: {
              error: "missing_fields",
              missing,
              guidance: `Ask for ${missing.join(", ")} before preparing the summary.`,
            },
          };
        }

        const normalisedCity = /eugene/i.test(city!) ? "Eugene" : "Chicago";
        const draft: InquiryDraft = {
          name: name!,
          email: email!,
          phone: str(rawArgs.phone, 40),
          city: normalisedCity,
          preferredDate: str(rawArgs.preferred_date, 60),
          groupSize: str(rawArgs.group_size, 40),
          activity: str(rawArgs.activity, 160),
          budget: str(rawArgs.budget, 60),
          notes: str(rawArgs.notes, 800),
        };

        return {
          result: {
            status: "draft_ready",
            draft,
            guidance:
              "A summary card is now on screen with a Send button. Tell them to check it and tap Send — do not say the inquiry has been received, because nothing has been submitted yet.",
          },
          draft,
        };
      }

      default:
        return { result: { error: "unknown_tool" } };
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`[AskCCF] tool ${name} failed:`, message);
    return {
      result: {
        error: "tool_unavailable",
        detail: message.startsWith("acuity") ? message : "upstream_error",
        guidance:
          `Live data is unavailable right now. Say so in one short sentence and give the booking page: ${BOOKING_PORTAL}. Do not guess prices, dates or seats.`,
      },
    };
  }
}

export { toCardShape };
