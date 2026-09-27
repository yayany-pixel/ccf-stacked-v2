type EventbriteDeps = {
  acuityGet: (path: string, params?: Record<string, unknown>) => Promise<any>;
};

type ToolPayload = { data: unknown };

const EVENTBRITE_API = "https://www.eventbriteapi.com/v3";

function env(name: string): string | undefined {
  return process.env[name]?.trim() || undefined;
}

function eventbriteToken(): string {
  const token = env("EVENTBRITE_PRIVATE_TOKEN") || env("EVENTBRITE_TOKEN");
  if (!token) throw new Error("Eventbrite credentials are not configured on the server.");
  return token;
}

function organizationId(): string {
  const id = env("EVENTBRITE_ORGANIZATION_ID") || env("EVENTBRITE_ORG_ID");
  if (!id) throw new Error("Eventbrite organization ID is not configured on the server.");
  return id;
}

async function eventbriteRequest(
  method: "GET" | "POST" | "DELETE",
  path: string,
  body?: unknown,
  query: Record<string, unknown> = {}
) {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value === undefined || value === null || value === "") continue;
    search.set(key, String(value));
  }
  const url = `${EVENTBRITE_API}/${path.replace(/^\//, "")}${search.size ? `?${search}` : ""}`;
  const response = await fetch(url, {
    method,
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${eventbriteToken()}`,
      ...(body === undefined ? {} : { "Content-Type": "application/json" }),
    },
    body: body === undefined ? undefined : JSON.stringify(body),
    cache: "no-store",
  });

  const text = await response.text();
  let data: any = text;
  try { data = text ? JSON.parse(text) : null; } catch {}
  if (!response.ok) {
    const error = new Error(`Eventbrite API error ${response.status}: ${response.statusText}`) as Error & { body?: unknown };
    error.body = data;
    throw error;
  }
  return data;
}

function objectArgs(value: unknown): Record<string, any> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error("Tool arguments must be an object.");
  }
  return value as Record<string, any>;
}

function textArg(value: unknown, name: string, required = true): string | undefined {
  if (value === undefined || value === null || value === "") {
    if (required) throw new Error(`${name} is required.`);
    return undefined;
  }
  if (typeof value !== "string") throw new Error(`${name} must be a string.`);
  return value.trim();
}

function boolArg(value: unknown, name: string, fallback = false): boolean {
  if (value === undefined) return fallback;
  if (typeof value !== "boolean") throw new Error(`${name} must be a boolean.`);
  return value;
}

function intArg(value: unknown, name: string, fallback?: number): number {
  if (value === undefined && fallback !== undefined) return fallback;
  if (typeof value !== "number" || !Number.isSafeInteger(value) || value < 0) {
    throw new Error(`${name} must be a non-negative integer.`);
  }
  return value;
}

function iso(value: unknown, name: string): string {
  const raw = textArg(value, name)!;
  const date = new Date(raw);
  if (Number.isNaN(date.getTime())) throw new Error(`${name} must be a valid date/time.`);
  return date.toISOString();
}

function centsFromPrice(value: unknown): number {
  if (typeof value === "number" && Number.isFinite(value)) return Math.max(0, Math.round(value * 100));
  if (typeof value === "string") {
    const n = Number(value.replace(/[^0-9.-]/g, ""));
    if (Number.isFinite(n)) return Math.max(0, Math.round(n * 100));
  }
  return 0;
}

function money(cents: number): string {
  return `USD,${Math.max(0, Math.round(cents))}`;
}

function localKey(value: unknown): string {
  if (typeof value !== "string") return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value.slice(0, 16);
  return d.toISOString().slice(0, 16);
}

function normalizedName(value: unknown): string {
  return String(value || "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function eventName(event: any): string {
  return String(event?.name?.text || event?.name?.html || event?.name || "");
}

function eventStart(event: any): string {
  return String(event?.start?.utc || event?.start?.local || "");
}

function cityForCalendar(calendar: any): "Chicago" | "Eugene" | "Online" | "Unknown" {
  const hay = `${calendar?.name || ""} ${calendar?.location || ""} ${calendar?.description || ""}`.toLowerCase();
  if (hay.includes("chicago")) return "Chicago";
  if (hay.includes("eugene")) return "Eugene";
  if (hay.includes("online") || hay.includes("virtual") || hay.includes("zoom")) return "Online";
  return "Unknown";
}

function classDate(row: any): string | undefined {
  return row?.datetime || row?.time || row?.start || row?.startTime;
}

function classTypeId(row: any): number | undefined {
  const candidate = row?.appointmentTypeID ?? row?.appointmentTypeId ?? row?.typeID ?? row?.typeId;
  const n = Number(candidate);
  return Number.isSafeInteger(n) && n > 0 ? n : undefined;
}

function classCalendarId(row: any): number | undefined {
  const candidate = row?.calendarID ?? row?.calendarId;
  const n = Number(candidate);
  return Number.isSafeInteger(n) && n > 0 ? n : undefined;
}

function remainingSeats(row: any, type: any, fallback: number): number {
  const candidates = [
    row?.slotsAvailable,
    row?.spotsRemaining,
    row?.remaining,
    row?.remainingSeats,
    row?.capacity,
    type?.classSize,
  ];
  for (const item of candidates) {
    const n = Number(item);
    if (Number.isFinite(n) && n >= 0) return Math.floor(n);
  }
  return fallback;
}

async function allOrganizationEvents() {
  const org = organizationId();
  const events: any[] = [];
  let page = 1;
  for (;;) {
    const data = await eventbriteRequest("GET", `organizations/${encodeURIComponent(org)}/events/`, undefined, {
      page,
      order_by: "start_asc",
    });
    if (Array.isArray(data?.events)) events.push(...data.events);
    const pageCount = Number(data?.pagination?.page_count || 1);
    if (page >= pageCount || page >= 20) break;
    page += 1;
  }
  return events;
}

async function createClassEvent(args: Record<string, any>) {
  const title = textArg(args.title, "title")!;
  const description = textArg(args.description, "description")!;
  const timezone = textArg(args.timezone, "timezone")!;
  const startUtc = iso(args.start, "start");
  const endUtc = iso(args.end, "end");
  const organizerID = textArg(args.organizerID, "organizerID")!;
  const venueID = textArg(args.venueID, "venueID", false);
  const quantity = intArg(args.quantity, "quantity", 1);
  const priceCents = intArg(args.priceCents, "priceCents", 0);
  const publish = boolArg(args.publish, "publish", false);
  const source = textArg(args.source, "source", false) || "acuity";

  const eventBody: any = {
    event: {
      name: { html: title },
      description: { html: description },
      start: { timezone, utc: startUtc },
      end: { timezone, utc: endUtc },
      currency: "USD",
      organizer_id: organizerID,
      listed: true,
      shareable: true,
      online_event: false,
      capacity: quantity,
      source,
    },
  };
  if (venueID) eventBody.event.venue_id = venueID;

  const event = await eventbriteRequest(
    "POST",
    `organizations/${encodeURIComponent(organizationId())}/events/`,
    eventBody
  );
  const eventID = String(event?.id || "");
  if (!eventID) throw new Error("Eventbrite created an event without returning an event ID.");

  try {
    const ticketBody = {
      ticket_class: {
        name: "General Admission",
        quantity_total: quantity,
        cost: money(priceCents),
        free: priceCents === 0,
        minimum_quantity: 1,
        maximum_quantity: Math.max(1, Math.min(quantity || 1, 10)),
      },
    };
    const ticket = await eventbriteRequest(
      "POST",
      `events/${encodeURIComponent(eventID)}/ticket_classes/`,
      ticketBody
    );

    let published = false;
    let publishResult: any = null;
    if (publish) {
      publishResult = await eventbriteRequest(
        "POST",
        `events/${encodeURIComponent(eventID)}/publish/`,
        {}
      );
      published = Boolean(publishResult?.published ?? publishResult);
    }
    return { event, ticket, published, publishResult };
  } catch (error) {
    // Keep the draft event for inspection rather than deleting it automatically.
    throw error;
  }
}

export const eventbriteTools = [
  {
    name: "eventbrite_status",
    description: "Verify the Color Cocktail Factory Eventbrite organization connection.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
    annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: true },
  },
  {
    name: "eventbrite_list_events",
    description: "List Eventbrite events for the Color Cocktail Factory organization. Useful for duplicate checks before publishing.",
    inputSchema: {
      type: "object",
      properties: {
        status: { type: "string" },
        timeFilter: { type: "string" },
        orderBy: { type: "string", default: "start_asc" },
      },
      additionalProperties: false,
    },
    annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: true },
  },
  {
    name: "eventbrite_list_venues",
    description: "List venues saved in the Color Cocktail Factory Eventbrite organization.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
    annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: true },
  },
  {
    name: "eventbrite_list_organizers",
    description: "List organizers saved in the Color Cocktail Factory Eventbrite organization.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
    annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: true },
  },
  {
    name: "eventbrite_create_class_event",
    description: "Create one Eventbrite class event and a General Admission ticket. Defaults to draft; set publish=true only when the user has authorized a live listing.",
    inputSchema: {
      type: "object",
      properties: {
        title: { type: "string", minLength: 1 },
        description: { type: "string", minLength: 1 },
        start: { type: "string", minLength: 1 },
        end: { type: "string", minLength: 1 },
        timezone: { type: "string", minLength: 1 },
        organizerID: { type: "string", minLength: 1 },
        venueID: { type: "string", minLength: 1 },
        quantity: { type: "integer", minimum: 0 },
        priceCents: { type: "integer", minimum: 0 },
        publish: { type: "boolean", default: false },
        source: { type: "string" },
      },
      required: ["title", "description", "start", "end", "timezone", "organizerID", "quantity", "priceCents"],
      additionalProperties: false,
    },
    annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: false, openWorldHint: true },
  },
  {
    name: "eventbrite_publish_event",
    description: "Publish an existing Eventbrite draft event after its required details and ticketing are configured.",
    inputSchema: {
      type: "object",
      properties: { eventID: { type: "string", minLength: 1 } },
      required: ["eventID"],
      additionalProperties: false,
    },
    annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: true, openWorldHint: true },
  },
  {
    name: "eventbrite_sync_acuity_classes",
    description: "Create Eventbrite events from scheduled Acuity classes for a bounded date range. Duplicate matching uses normalized class name plus start time. Requires explicit organizerID and venue IDs for Chicago/Eugene. Defaults to drafts.",
    inputSchema: {
      type: "object",
      properties: {
        minDate: { type: "string", minLength: 10 },
        maxDate: { type: "string", minLength: 10 },
        organizerID: { type: "string", minLength: 1 },
        chicagoVenueID: { type: "string", minLength: 1 },
        eugeneVenueID: { type: "string", minLength: 1 },
        publish: { type: "boolean", default: false },
        defaultQuantity: { type: "integer", minimum: 1, default: 12 },
        includeOnline: { type: "boolean", default: false },
      },
      required: ["minDate", "maxDate", "organizerID", "chicagoVenueID", "eugeneVenueID"],
      additionalProperties: false,
    },
    annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: true, openWorldHint: true },
  },
] as const;

export async function runEventbriteTool(
  name: string,
  supplied: Record<string, any>,
  deps: EventbriteDeps
): Promise<ToolPayload | null> {
  const args = objectArgs(supplied);

  switch (name) {
    case "eventbrite_status": {
      const events = await eventbriteRequest(
        "GET",
        `organizations/${encodeURIComponent(organizationId())}/events/`,
        undefined,
        { page: 1, page_size: 1 }
      );
      return { data: { connected: true, organizationID: organizationId(), eventCount: events?.pagination?.object_count ?? null } };
    }
    case "eventbrite_list_events": {
      const data = await eventbriteRequest(
        "GET",
        `organizations/${encodeURIComponent(organizationId())}/events/`,
        undefined,
        {
          status: textArg(args.status, "status", false),
          time_filter: textArg(args.timeFilter, "timeFilter", false),
          order_by: textArg(args.orderBy, "orderBy", false) || "start_asc",
        }
      );
      return { data };
    }
    case "eventbrite_list_venues": {
      const data = await eventbriteRequest("GET", `organizations/${encodeURIComponent(organizationId())}/venues/`);
      return { data };
    }
    case "eventbrite_list_organizers": {
      const data = await eventbriteRequest("GET", `organizations/${encodeURIComponent(organizationId())}/organizers/`);
      return { data };
    }
    case "eventbrite_create_class_event":
      return { data: await createClassEvent(args) };

    case "eventbrite_publish_event": {
      const eventID = textArg(args.eventID, "eventID")!;
      const data = await eventbriteRequest("POST", `events/${encodeURIComponent(eventID)}/publish/`, {});
      return { data };
    }

    case "eventbrite_sync_acuity_classes": {
      const minDate = textArg(args.minDate, "minDate")!;
      const maxDate = textArg(args.maxDate, "maxDate")!;
      const organizerID = textArg(args.organizerID, "organizerID")!;
      const chicagoVenueID = textArg(args.chicagoVenueID, "chicagoVenueID")!;
      const eugeneVenueID = textArg(args.eugeneVenueID, "eugeneVenueID")!;
      const publish = boolArg(args.publish, "publish", false);
      const includeOnline = boolArg(args.includeOnline, "includeOnline", false);
      const defaultQuantity = intArg(args.defaultQuantity, "defaultQuantity", 12);
      if (!/^\d{4}-\d{2}-\d{2}$/.test(minDate) || !/^\d{4}-\d{2}-\d{2}$/.test(maxDate)) {
        throw new Error("minDate and maxDate must use YYYY-MM-DD.");
      }

      const [classes, types, calendars, existing] = await Promise.all([
        deps.acuityGet("availability/classes", {
          minDate,
          maxDate,
          includeUnavailable: false,
          includePrivate: true,
          timezone: "America/Chicago",
        }),
        deps.acuityGet("appointment-types"),
        deps.acuityGet("calendars"),
        allOrganizationEvents(),
      ]);

      const typeMap = new Map<number, any>();
      for (const type of Array.isArray(types) ? types : []) typeMap.set(Number(type.id), type);
      const calendarMap = new Map<number, any>();
      for (const calendar of Array.isArray(calendars) ? calendars : []) calendarMap.set(Number(calendar.id), calendar);

      const existingKeys = new Set(
        existing.map((event: any) => `${normalizedName(eventName(event))}|${localKey(eventStart(event))}`)
      );

      const summary = {
        considered: 0,
        created: [] as any[],
        skippedDuplicates: [] as any[],
        skippedUnknownLocation: [] as any[],
        skippedNoTime: [] as any[],
        errors: [] as any[],
      };

      for (const row of Array.isArray(classes) ? classes : []) {
        summary.considered += 1;
        const startRaw = classDate(row);
        if (!startRaw) {
          summary.skippedNoTime.push({ id: row?.id ?? null });
          continue;
        }
        const typeID = classTypeId(row);
        const type = typeID ? typeMap.get(typeID) : undefined;
        const calendarID = classCalendarId(row);
        const calendar = calendarID ? calendarMap.get(calendarID) : undefined;
        const city = cityForCalendar(calendar);
        if (city === "Unknown" || (city === "Online" && !includeOnline)) {
          summary.skippedUnknownLocation.push({ id: row?.id ?? null, city, calendarID });
          continue;
        }

        const title = String(type?.name || row?.name || row?.type || "Color Cocktail Factory Class");
        const startDate = new Date(startRaw);
        if (Number.isNaN(startDate.getTime())) {
          summary.skippedNoTime.push({ id: row?.id ?? null, time: startRaw });
          continue;
        }
        const duration = Number(type?.duration || row?.duration || 90);
        const endDate = new Date(startDate.getTime() + Math.max(1, duration) * 60_000);
        const timezone = String(calendar?.timezone || (city === "Chicago" ? "America/Chicago" : city === "Eugene" ? "America/Los_Angeles" : "America/Los_Angeles"));
        const venueID = city === "Chicago" ? chicagoVenueID : city === "Eugene" ? eugeneVenueID : undefined;
        const key = `${normalizedName(title)}|${localKey(startDate.toISOString())}`;
        if (existingKeys.has(key)) {
          summary.skippedDuplicates.push({ title, start: startDate.toISOString(), city });
          continue;
        }

        const quantity = remainingSeats(row, type, defaultQuantity);
        if (quantity < 1) {
          summary.skippedDuplicates.push({ title, start: startDate.toISOString(), city, reason: "no remaining Acuity seats" });
          continue;
        }
        const priceCents = centsFromPrice(type?.price ?? row?.price);
        const bookingURL = typeID && env("ACUITY_USER_ID")
          ? `https://app.acuityscheduling.com/schedule.php?owner=${encodeURIComponent(env("ACUITY_USER_ID")!)}&appointmentType=${typeID}`
          : undefined;
        const description = [
          String(type?.description || row?.description || `Hands-on creative class at Color Cocktail Factory in ${city}.`),
          bookingURL ? `Also listed in Acuity: ${bookingURL}` : "",
        ].filter(Boolean).join("\n\n");

        try {
          const created = await createClassEvent({
            title,
            description,
            start: startDate.toISOString(),
            end: endDate.toISOString(),
            timezone,
            organizerID,
            venueID,
            quantity,
            priceCents,
            publish,
            source: typeID ? `acuity:${typeID}` : "acuity",
          });
          summary.created.push({
            acuityClassID: row?.id ?? null,
            appointmentTypeID: typeID ?? null,
            city,
            title,
            start: startDate.toISOString(),
            eventID: created?.event?.id ?? null,
            url: created?.event?.url ?? null,
            published: created?.published ?? false,
            quantity,
            priceCents,
          });
          existingKeys.add(key);
        } catch (error: any) {
          summary.errors.push({
            acuityClassID: row?.id ?? null,
            title,
            start: startDate.toISOString(),
            city,
            error: error?.message || "Eventbrite creation failed",
            details: error?.body,
          });
        }
      }

      return { data: summary };
    }

    default:
      return null;
  }
}
