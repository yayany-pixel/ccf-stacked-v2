// Request contracts follow the public Acuity reference and Dynamic Webhooks guide.
// Availability validation uses POST but does not create or change a booking.
type Schema = {
  type: "object" | "string" | "integer" | "boolean" | "array";
  description?: string;
  properties?: Record<string, Schema>;
  required?: string[];
  additionalProperties?: false;
  items?: Schema;
  minimum?: number;
  minLength?: number;
  minItems?: number;
  pattern?: string;
};

const id: Schema = { type: "integer", minimum: 1 };
const text: Schema = { type: "string", minLength: 1 };
const day: Schema = { type: "string", pattern: "^\\d{4}-\\d{2}-\\d{2}$", description: "Date in YYYY-MM-DD format." };
const month: Schema = { type: "string", pattern: "^\\d{4}-\\d{2}$", description: "Month in YYYY-MM format." };
const ids: Schema = { type: "array", items: id };
const readAnnotations = {
  readOnlyHint: true,
  destructiveHint: false,
  idempotentHint: true,
  openWorldHint: true,
};

function object(properties: Record<string, Schema> = {}, required: string[] = []): Schema {
  return { type: "object", properties, required, additionalProperties: false };
}

function readTool(name: string, description: string, inputSchema = object()) {
  return { name, description, inputSchema, annotations: readAnnotations };
}

const availabilityProperties = {
  appointmentTypeID: id,
  calendarID: id,
  addonIDs: { ...ids, description: "Add-on IDs associated with this appointment type." },
  timezone: { ...text, description: "IANA timezone, for example America/Chicago." },
};

export const extraReadTools = [
  readTool(
    "acuity_list_available_dates",
    "Find client-bookable dates for an appointment type and month. Omit calendarID to consider all calendars offering the type. Availability can change before booking.",
    object({ month, ...availabilityProperties }, ["month", "appointmentTypeID"])
  ),
  readTool(
    "acuity_list_available_times",
    "Find client-bookable time slots for an appointment type and date. ignoreAppointmentIDs allows rescheduling checks to ignore those existing appointments. Availability can change before booking.",
    object({ date: day, ...availabilityProperties, ignoreAppointmentIDs: ids }, ["date", "appointmentTypeID"])
  ),
  readTool(
    "acuity_check_available_times",
    "Validate one or more proposed appointment slots without booking or reserving them. Supply a slots array, including for a single slot. Cross-calendar checks evaluate shared resource limits per calendar, not as one combined booking.",
    object({
      slots: {
        type: "array",
        minItems: 1,
        items: object({
          datetime: { ...text, description: "Date and time to validate; include a UTC offset to avoid business-timezone ambiguity." },
          appointmentTypeID: id,
          calendarID: id,
        }, ["datetime", "appointmentTypeID"]),
      },
    }, ["slots"])
  ),
  readTool(
    "acuity_list_calendar_blocks",
    "List existing calendar blocks and their IDs. Filter by calendar and date range; Acuity defaults to at most 100 results when max is omitted.",
    object({ max: id, minDate: day, maxDate: day, calendarID: id })
  ),
  readTool(
    "acuity_list_certificates",
    "List package certificate codes, optionally filtered by product, order, appointment type, or client email. Acuity documents these filter IDs as strings. Codes may have monetary value; retrieve them only when relevant to the user's request.",
    object({ productID: text, orderID: text, appointmentTypeID: text, email: text })
  ),
  readTool(
    "acuity_check_certificate",
    "Check whether a certificate or coupon code is valid for an appointment type without redeeming it. An optional email also checks client-specific restrictions.",
    object({ certificate: text, appointmentTypeID: id, email: text }, ["certificate", "appointmentTypeID"])
  ),
  readTool("acuity_list_forms", "List intake form definitions, field IDs, field types, and appointment-type assignments. This returns definitions rather than individual appointment answers."),
  readTool("acuity_list_appointment_addons", "List available appointment add-ons and their IDs for scheduling and availability checks."),
  readTool("acuity_list_labels", "List existing appointment labels and their IDs."),
  readTool("acuity_list_products", "List products and appointment or minute packages. Set deleted to true to retrieve deleted products.", object({ deleted: { type: "boolean" } })),
  readTool("acuity_list_orders", "List store orders, most recent first. Acuity defaults to at most 100 results when max is omitted.", object({ max: id })),
  readTool("acuity_get_order", "Get details of an existing store order by its numeric ID.", object({ id }, ["id"])),
  readTool("acuity_list_webhooks", "List active dynamic webhook subscriptions with IDs, events, status, and target origins. Full target URLs are omitted because they may contain credentials."),
  readTool("acuity_get_account", "Read basic account display information and scheduling preferences. Credential fields and account authentication IDs are omitted."),
  readTool("acuity_get_service_metadata", "Read Acuity service metadata, including IP ranges from which webhook deliveries originate."),
];

function validate(value: unknown, schema: Schema, path: string): void {
  switch (schema.type) {
    case "object": {
      if (!value || typeof value !== "object" || Array.isArray(value)) {
        throw new Error(`${path} must be an object.`);
      }
      const input = value as Record<string, unknown>;
      const properties = schema.properties ?? {};
      for (const key of Object.keys(input)) {
        if (!Object.hasOwn(properties, key)) throw new Error(`${path} contains an unsupported argument.`);
      }
      for (const key of schema.required ?? []) {
        if (!Object.hasOwn(input, key)) throw new Error(`${path}.${key} is required.`);
      }
      for (const [key, child] of Object.entries(properties)) {
        if (Object.hasOwn(input, key)) validate(input[key], child, `${path}.${key}`);
      }
      return;
    }
    case "string":
      if (typeof value !== "string" || (schema.minLength !== undefined && value.trim().length < schema.minLength)) {
        throw new Error(`${path} must be a non-empty string.`);
      }
      if (schema.pattern && !new RegExp(schema.pattern).test(value)) throw new Error(`${path} has an invalid date format.`);
      return;
    case "integer":
      if (typeof value !== "number" || !Number.isSafeInteger(value) || value < (schema.minimum ?? 0)) {
        throw new Error(`${path} must be a positive integer.`);
      }
      return;
    case "boolean":
      if (typeof value !== "boolean") throw new Error(`${path} must be a boolean.`);
      return;
    case "array":
      if (!Array.isArray(value) || value.length < (schema.minItems ?? 0)) {
        throw new Error(`${path} must be ${schema.minItems ? "a non-empty" : "an"} array.`);
      }
      value.forEach((entry, index) => validate(entry, schema.items!, `${path}[${index}]`));
  }
}

function validateDates(args: Record<string, any>) {
  if (args.month !== undefined) {
    const monthNumber = Number(args.month.slice(5));
    if (monthNumber < 1 || monthNumber > 12) throw new Error("month must be a valid YYYY-MM month.");
  }
  for (const key of ["date", "minDate", "maxDate"]) {
    const value = args[key];
    if (value === undefined) continue;
    const date = new Date(`${value}T00:00:00Z`);
    if (!Number.isFinite(date.getTime()) || date.toISOString().slice(0, 10) !== value) {
      throw new Error(`${key} must be a valid YYYY-MM-DD date.`);
    }
  }
  if (args.minDate !== undefined && args.maxDate !== undefined && args.minDate > args.maxDate) {
    throw new Error("minDate must be on or before maxDate.");
  }
}

function availabilityParams(args: Record<string, any>) {
  const { addonIDs, ignoreAppointmentIDs, ...params } = args;
  return {
    ...params,
    ...(addonIDs === undefined ? {} : { "addonIDs[]": addonIDs }),
    ...(ignoreAppointmentIDs === undefined ? {} : { "ignoreAppointmentIDs[]": ignoreAppointmentIDs }),
  };
}

function accountDisplayFields(value: unknown) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error("Acuity returned an invalid account response.");
  }
  const result: Record<string, unknown> = {};
  for (const key of ["name", "businessName", "email", "timezone", "currency", "firstDayOfWeek", "timeFormat"]) {
    const field = (value as Record<string, unknown>)[key];
    if (field === null || ["string", "number", "boolean"].includes(typeof field)) result[key] = field;
  }
  return result;
}

function webhookDisplayFields(value: unknown) {
  if (!Array.isArray(value)) throw new Error("Acuity returned an invalid webhook list.");
  return value.map((row) => {
    if (!row || typeof row !== "object" || Array.isArray(row)) {
      throw new Error("Acuity returned an invalid webhook record.");
    }
    const result: Record<string, unknown> = { target: "[redacted]", targetRedacted: true };
    for (const key of ["id", "event", "status"]) {
      if (["string", "number"].includes(typeof row[key])) result[key] = row[key];
    }
    if (typeof row.target === "string") {
      try {
        const url = new URL(row.target);
        if (["https:", "http:"].includes(url.protocol)) result.targetOrigin = url.origin;
      } catch {
        // Do not return malformed URLs, which could also contain credentials.
      }
    }
    return result;
  });
}

export async function runExtraReadTool(
  name: string,
  args: Record<string, any>,
  get: (path: string, params?: Record<string, unknown>) => Promise<any>,
  write: (method: "POST" | "PUT" | "DELETE", path: string, body?: unknown, params?: Record<string, unknown>) => Promise<any>
): Promise<{ data: unknown } | undefined> {
  const tool = extraReadTools.find((entry) => entry.name === name);
  if (!tool) return undefined;
  validate(args, tool.inputSchema, "arguments");
  validateDates(args);

  switch (name) {
    case "acuity_list_available_dates":
      return { data: await get("availability/dates", availabilityParams(args)) };
    case "acuity_list_available_times":
      return { data: await get("availability/times", availabilityParams(args)) };
    case "acuity_check_available_times":
      return { data: await write("POST", "availability/check-times", args.slots) };
    case "acuity_list_calendar_blocks":
      return { data: await get("blocks", args) };
    case "acuity_list_certificates":
      return { data: await get("certificates", args) };
    case "acuity_check_certificate":
      return { data: await get("certificates/check", args) };
    case "acuity_list_forms":
      return { data: await get("forms") };
    case "acuity_list_appointment_addons":
      return { data: await get("appointment-addons") };
    case "acuity_list_labels":
      return { data: await get("labels") };
    case "acuity_list_products":
      return { data: await get("products", args) };
    case "acuity_list_orders":
      return { data: await get("orders", args) };
    case "acuity_get_order":
      return { data: await get(`orders/${args.id}`) };
    case "acuity_list_webhooks":
      return { data: webhookDisplayFields(await get("webhooks")) };
    case "acuity_get_account":
      return { data: accountDisplayFields(await get("me")) };
    case "acuity_get_service_metadata":
      return { data: await get("meta") };
  }
}
