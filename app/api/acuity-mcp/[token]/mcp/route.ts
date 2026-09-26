export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ACUITY_API = "https://acuityscheduling.com/api/v1";

type JsonRpcRequest = {
  jsonrpc?: string;
  id?: string | number | null;
  method?: string;
  params?: Record<string, any>;
};

type ToolResult = {
  content: Array<{ type: "text"; text: string }>;
  structuredContent?: Record<string, any>;
  isError?: boolean;
};

function jsonRpc(id: JsonRpcRequest["id"], result: unknown, status = 200) {
  return Response.json(
    { jsonrpc: "2.0", id: id ?? null, result },
    { status, headers: { "Cache-Control": "no-store" } }
  );
}

function jsonRpcError(
  id: JsonRpcRequest["id"],
  code: number,
  message: string,
  data?: unknown,
  status = 200
) {
  return Response.json(
    {
      jsonrpc: "2.0",
      id: id ?? null,
      error: { code, message, ...(data === undefined ? {} : { data }) },
    },
    { status, headers: { "Cache-Control": "no-store" } }
  );
}

function toolOk(data: unknown, message?: string): ToolResult {
  return {
    content: [
      {
        type: "text",
        text: message ?? JSON.stringify(data, null, 2),
      },
    ],
    structuredContent: { data },
  };
}

function toolError(message: string, details?: unknown): ToolResult {
  return {
    content: [
      {
        type: "text",
        text: details
          ? `${message}\n${JSON.stringify(details, null, 2)}`
          : message,
      },
    ],
    isError: true,
  };
}

function authorized(token: string) {
  const expected = process.env.CCF_MCP_TOKEN;
  return Boolean(expected && token && token === expected);
}

function acuityAuthHeader() {
  const userId = process.env.ACUITY_USER_ID;
  const apiKey = process.env.ACUITY_API_KEY;
  if (!userId || !apiKey) {
    throw new Error("Acuity credentials are not configured on the server.");
  }
  return `Basic ${Buffer.from(`${userId}:${apiKey}`).toString("base64")}`;
}

function addParam(search: URLSearchParams, key: string, value: unknown) {
  if (value === undefined || value === null || value === "") return;
  search.set(key, String(value));
}

async function acuityGet(path: string, params: Record<string, unknown> = {}) {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) addParam(search, key, value);
  const url = `${ACUITY_API}/${path}${search.size ? `?${search.toString()}` : ""}`;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: acuityAuthHeader(),
    },
    cache: "no-store",
  });

  const text = await response.text();
  let body: any = text;
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    // Keep text body for diagnostics.
  }

  if (!response.ok) {
    const error = new Error(
      `Acuity API error ${response.status}: ${response.statusText}`
    ) as Error & { status?: number; body?: unknown };
    error.status = response.status;
    error.body = body;
    throw error;
  }
  return body;
}

async function acuityWrite(
  method: "POST" | "PUT" | "DELETE",
  path: string,
  body?: unknown,
  params: Record<string, unknown> = {}
) {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) addParam(search, key, value);
  const url = `${ACUITY_API}/${path}${search.size ? `?${search.toString()}` : ""}`;
  const response = await fetch(url, {
    method,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: acuityAuthHeader(),
    },
    body: body === undefined ? undefined : JSON.stringify(body),
    cache: "no-store",
  });

  const text = await response.text();
  let data: any = text;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    // Keep text body for diagnostics.
  }

  if (!response.ok) {
    const error = new Error(
      `Acuity API error ${response.status}: ${response.statusText}`
    ) as Error & { status?: number; body?: unknown };
    error.status = response.status;
    error.body = data;
    throw error;
  }
  return data;
}

function clampMax(value: unknown, fallback = 100) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.max(1, Math.min(100, Math.trunc(parsed)));
}

function writeArgs(
  value: unknown,
  allowed: string[],
  required: string[] = []
): Record<string, any> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error("Tool arguments must be an object.");
  }
  const args = value as Record<string, any>;
  const unknown = Object.keys(args).filter((key) => !allowed.includes(key));
  if (unknown.length) throw new Error(`Unsupported argument(s): ${unknown.join(", ")}`);
  for (const key of required) {
    if (args[key] === undefined || args[key] === null || args[key] === "") {
      throw new Error(`${key} is required.`);
    }
  }
  return args;
}

function positiveId(value: unknown, key: string) {
  if (typeof value !== "number" || !Number.isSafeInteger(value) || value < 1) {
    throw new Error(`${key} must be a positive integer.`);
  }
}

function textField(value: unknown, key: string, allowEmpty = false) {
  if (typeof value !== "string" || (!allowEmpty && !value.trim())) {
    throw new Error(`${key} must be ${allowEmpty ? "a string" : "a non-empty string"}.`);
  }
}

function booleanField(value: unknown, key: string) {
  if (typeof value !== "boolean") throw new Error(`${key} must be a boolean.`);
}

function validateAppointmentFields(value: unknown) {
  if (!Array.isArray(value) || value.some((field) =>
    !field || typeof field !== "object" || Array.isArray(field) ||
    Object.keys(field).some((key) => !["id", "value"].includes(key)) ||
    !Number.isSafeInteger(field.id) || field.id < 1 || typeof field.value !== "string"
  )) throw new Error("fields must be an array of { id, value } objects.");
}

function validateLabels(value: unknown) {
  if (!Array.isArray(value) || value.length > 1 || value.some((label) =>
    !label || typeof label !== "object" || Array.isArray(label) ||
    Object.keys(label).some((key) => key !== "id") ||
    !Number.isSafeInteger(label.id) || label.id < 1
  )) throw new Error("labels must contain at most one { id } object.");
}

function validateAppointmentDetails(args: Record<string, any>, certificateRequiresAdmin = false) {
  for (const key of ["firstName", "lastName", "email", "phone", "timezone", "certificate", "notes"]) {
    if (args[key] !== undefined) textField(args[key], key, ["phone", "notes"].includes(key));
  }
  if (args.fields !== undefined) validateAppointmentFields(args.fields);
  if (args.labels !== undefined) validateLabels(args.labels);
  if (args.smsOptIn !== undefined) booleanField(args.smsOptIn, "smsOptIn");
  if (args.admin !== undefined) booleanField(args.admin, "admin");
  if ((args.notes !== undefined || (certificateRequiresAdmin && args.certificate !== undefined)) && args.admin !== true) {
    throw new Error("admin=true is required to set notes or update certificate.");
  }
}

function bodyFields(args: Record<string, any>, keys: string[]) {
  return Object.fromEntries(keys.filter((key) => args[key] !== undefined).map((key) => [key, args[key]]));
}

function compactAppointment(a: any, includeForms = false) {
  const base: Record<string, any> = {
    id: a.id,
    firstName: a.firstName,
    lastName: a.lastName,
    email: a.email,
    phone: a.phone,
    type: a.type,
    appointmentTypeID: a.appointmentTypeID,
    calendar: a.calendar,
    calendarID: a.calendarID,
    date: a.date,
    time: a.time,
    datetime: a.datetime,
    duration: a.duration,
    price: a.price,
    paid: a.paid,
    amountPaid: a.amountPaid,
    canceled: a.canceled,
    noShow: a.noShow,
    notes: a.notes,
    certificate: a.certificate,
    labels: a.labels,
  };
  if (includeForms) base.forms = a.forms;
  return base;
}

const formFieldsSchema = {
  type: "array",
  items: {
    type: "object",
    properties: { id: { type: "integer", minimum: 1 }, value: { type: "string" } },
    required: ["id", "value"],
    additionalProperties: false,
  },
};

const labelsSchema = {
  type: "array",
  maxItems: 1,
  items: {
    type: "object",
    properties: { id: { type: "integer", minimum: 1 } },
    required: ["id"],
    additionalProperties: false,
  },
};

const appointmentDetailProperties = {
  firstName: { type: "string", minLength: 1 },
  lastName: { type: "string", minLength: 1 },
  email: { type: "string", minLength: 1 },
  phone: { type: "string" },
  certificate: { type: "string", description: "Package or coupon code; admin=true is required when updating." },
  fields: formFieldsSchema,
  notes: { type: "string", description: "Admin only." },
  labels: labelsSchema,
  smsOptIn: { type: "boolean" },
};

const writeAnnotations = {
  readOnlyHint: false,
  destructiveHint: false,
  idempotentHint: false,
  openWorldHint: true,
};

const tools = [
  {
    name: "acuity_status",
    description:
      "Verify the Color Cocktail Factory Acuity connection and return a basic account connectivity check.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
    annotations: {
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: false,
    },
  },
  {
    name: "acuity_list_calendars",
    description:
      "List Acuity calendars, including calendar IDs and names. Use this before filtering appointments by Chicago, Eugene, Online, or instructor calendar.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
    annotations: {
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: false,
    },
  },
  {
    name: "acuity_list_appointment_types",
    description:
      "List Acuity appointment types/classes with IDs, names, duration, price, category, and class size where available.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
    annotations: {
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: false,
    },
  },
  {
    name: "acuity_list_classes",
    description:
      "List scheduled Acuity class offerings and remaining seats. Filter by month, date range, calendar, or appointment type.",
    inputSchema: {
      type: "object",
      properties: {
        month: { type: "string", description: "Month such as 2026-09." },
        minDate: { type: "string", description: "Earliest date, YYYY-MM-DD." },
        maxDate: { type: "string", description: "Latest date, YYYY-MM-DD." },
        calendarID: { type: "integer" },
        appointmentTypeID: { type: "integer" },
        includeUnavailable: { type: "boolean", default: false },
        includePrivate: { type: "boolean", default: true },
        timezone: { type: "string", default: "America/Chicago" },
      },
      additionalProperties: false,
    },
    annotations: {
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: false,
    },
  },
  {
    name: "acuity_list_appointments",
    description:
      "List booked Acuity appointments/registrations. Supports date, calendar, appointment type, customer name, email, and phone filters. Intake-form answers are excluded by default and can be requested when needed.",
    inputSchema: {
      type: "object",
      properties: {
        minDate: { type: "string", description: "Earliest date, YYYY-MM-DD." },
        maxDate: { type: "string", description: "Latest date, YYYY-MM-DD." },
        calendarID: { type: "integer" },
        appointmentTypeID: { type: "integer" },
        firstName: { type: "string" },
        lastName: { type: "string" },
        email: { type: "string" },
        phone: { type: "string" },
        showall: {
          type: "boolean",
          description: "Include canceled appointments as well as scheduled ones.",
          default: false,
        },
        max: { type: "integer", minimum: 1, maximum: 100, default: 100 },
        includeForms: {
          type: "boolean",
          description:
            "Include intake-form responses. Use only when the question depends on a form answer such as glazing.",
          default: false,
        },
        direction: { type: "string", enum: ["ASC", "DESC"], default: "ASC" },
      },
      additionalProperties: false,
    },
    annotations: {
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: false,
    },
  },
  {
    name: "acuity_get_appointment",
    description:
      "Get one Acuity appointment by appointment ID, including registration details and intake-form responses.",
    inputSchema: {
      type: "object",
      properties: {
        id: { type: "integer", minimum: 1 },
      },
      required: ["id"],
      additionalProperties: false,
    },
    annotations: {
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: false,
    },
  },
  {
    name: "acuity_search_clients",
    description:
      "Search Acuity's client list by first name, last name, or phone number.",
    inputSchema: {
      type: "object",
      properties: {
        search: { type: "string", minLength: 1 },
      },
      required: ["search"],
      additionalProperties: false,
    },
    annotations: {
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: false,
    },
  },
  {
    name: "acuity_get_payments",
    description:
      "Retrieve payment transactions for one Acuity appointment by appointment ID.",
    inputSchema: {
      type: "object",
      properties: {
        appointmentID: { type: "integer", minimum: 1 },
      },
      required: ["appointmentID"],
      additionalProperties: false,
    },
    annotations: {
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: false,
    },
  },
  {
    name: "acuity_create_appointment",
    description:
      "Create a live Acuity appointment. Requires customer details and a listed appointment type. By default Acuity checks availability and may send notifications; admin=true bypasses availability checks and requires calendarID. noEmail=true suppresses Acuity confirmation email/SMS but not other side effects.",
    inputSchema: {
      type: "object",
      properties: {
        datetime: { type: "string", minLength: 1, description: "Appointment date and time; include a timezone offset to avoid ambiguity." },
        appointmentTypeID: { type: "integer", minimum: 1 },
        calendarID: { type: "integer", minimum: 1 },
        ...appointmentDetailProperties,
        timezone: { type: "string", minLength: 1 },
        addonIDs: { type: "array", items: { type: "integer", minimum: 1 } },
        admin: { type: "boolean", default: false },
        noEmail: { type: "boolean", default: false },
      },
      required: ["datetime", "appointmentTypeID", "firstName", "lastName"],
      additionalProperties: false,
    },
    annotations: writeAnnotations,
  },
  {
    name: "acuity_update_appointment",
    description:
      "Update only Acuity's editable appointment details. Provide id and at least one field to change. Use the separate tools to reschedule or cancel. notes and certificate require admin=true.",
    inputSchema: {
      type: "object",
      properties: {
        id: { type: "integer", minimum: 1 },
        ...appointmentDetailProperties,
        admin: { type: "boolean", default: false },
      },
      required: ["id"],
      additionalProperties: false,
    },
    annotations: writeAnnotations,
  },
  {
    name: "acuity_reschedule_appointment",
    description:
      "Move an existing Acuity appointment to a new datetime and optionally a calendar. Class series and canceled appointments cannot be rescheduled. admin=true bypasses availability checks; noEmail=true suppresses Acuity reschedule email/SMS.",
    inputSchema: {
      type: "object",
      properties: {
        id: { type: "integer", minimum: 1 },
        datetime: { type: "string", minLength: 1, description: "New date and time; include a timezone offset to avoid ambiguity." },
        calendarID: { anyOf: [{ type: "integer", minimum: 1 }, { type: "null" }], description: "Omit to keep the calendar; null asks Acuity to find one." },
        timezone: { type: "string", minLength: 1 },
        admin: { type: "boolean", default: false },
        noEmail: { type: "boolean", default: false },
      },
      required: ["id", "datetime"],
      additionalProperties: false,
    },
    annotations: { ...writeAnnotations, destructiveHint: true },
  },
  {
    name: "acuity_cancel_appointment",
    description:
      "Cancel an Acuity appointment permanently; cancellation cannot be undone. cancelNote is sent with cancellation notifications. noShow requires admin=true; noEmail=true suppresses Acuity cancellation email/SMS.",
    inputSchema: {
      type: "object",
      properties: {
        id: { type: "integer", minimum: 1 },
        cancelNote: { type: "string" },
        noShow: { type: "boolean" },
        admin: { type: "boolean", default: false },
        noEmail: { type: "boolean", default: false },
      },
      required: ["id"],
      additionalProperties: false,
    },
    annotations: { ...writeAnnotations, destructiveHint: true },
  },
  {
    name: "acuity_create_calendar_block",
    description:
      "Block time on an Acuity calendar. This changes live calendar availability. Supply start and end times with timezone offsets and an existing calendarID.",
    inputSchema: {
      type: "object",
      properties: {
        start: { type: "string", minLength: 1 },
        end: { type: "string", minLength: 1 },
        calendarID: { type: "integer", minimum: 1 },
        notes: { type: "string" },
      },
      required: ["start", "end", "calendarID"],
      additionalProperties: false,
    },
    annotations: writeAnnotations,
  },
  {
    name: "acuity_delete_calendar_block",
    description: "Permanently delete an Acuity calendar block by its block ID, reopening that time to availability.",
    inputSchema: {
      type: "object",
      properties: { id: { type: "integer", minimum: 1 } },
      required: ["id"],
      additionalProperties: false,
    },
    annotations: { ...writeAnnotations, destructiveHint: true },
  },
];

async function runTool(name: string, args: Record<string, any>): Promise<ToolResult> {
  try {
    switch (name) {
      case "acuity_status": {
        const calendars = await acuityGet("calendars");
        return toolOk(
          {
            connected: true,
            calendarCount: Array.isArray(calendars) ? calendars.length : null,
          },
          "Acuity connection is working."
        );
      }
      case "acuity_list_calendars": {
        const rows = await acuityGet("calendars");
        const data = Array.isArray(rows)
          ? rows.map((c: any) => ({
              id: c.id,
              name: c.name,
              description: c.description,
              location: c.location,
              timezone: c.timezone,
            }))
          : rows;
        return toolOk(data);
      }
      case "acuity_list_appointment_types": {
        const rows = await acuityGet("appointment-types");
        const data = Array.isArray(rows)
          ? rows.map((t: any) => ({
              id: t.id,
              name: t.name,
              description: t.description,
              duration: t.duration,
              price: t.price,
              category: t.category,
              classSize: t.classSize,
              calendarIDs: t.calendarIDs,
              active: t.active,
            }))
          : rows;
        return toolOk(data);
      }
      case "acuity_list_classes": {
        const data = await acuityGet("availability/classes", {
          month: args.month,
          minDate: args.minDate,
          maxDate: args.maxDate,
          calendarID: args.calendarID,
          appointmentTypeID: args.appointmentTypeID,
          includeUnavailable: args.includeUnavailable ?? false,
          includePrivate: args.includePrivate ?? true,
          timezone: args.timezone ?? "America/Chicago",
        });
        return toolOk(data);
      }
      case "acuity_list_appointments": {
        const includeForms = Boolean(args.includeForms);
        const rows = await acuityGet("appointments", {
          minDate: args.minDate,
          maxDate: args.maxDate,
          calendarID: args.calendarID,
          appointmentTypeID: args.appointmentTypeID,
          firstName: args.firstName,
          lastName: args.lastName,
          email: args.email,
          phone: args.phone,
          showall: args.showall ?? false,
          max: clampMax(args.max),
          excludeForms: !includeForms,
          direction: args.direction ?? "ASC",
        });
        const data = Array.isArray(rows)
          ? rows.map((a: any) => compactAppointment(a, includeForms))
          : rows;
        return toolOk(data);
      }
      case "acuity_get_appointment": {
        const row = await acuityGet(`appointments/${Number(args.id)}`);
        return toolOk(compactAppointment(row, true));
      }
      case "acuity_search_clients": {
        const data = await acuityGet("clients", { search: String(args.search || "") });
        return toolOk(data);
      }
      case "acuity_get_payments": {
        const data = await acuityGet(
          `appointments/${Number(args.appointmentID)}/payments`
        );
        return toolOk(data);
      }
      case "acuity_create_appointment": {
        const input = writeArgs(args, [
          "datetime", "appointmentTypeID", "calendarID", "firstName", "lastName",
          "email", "phone", "timezone", "certificate", "fields", "notes",
          "addonIDs", "labels", "smsOptIn", "admin", "noEmail",
        ], ["datetime", "appointmentTypeID", "firstName", "lastName"]);
        textField(input.datetime, "datetime");
        positiveId(input.appointmentTypeID, "appointmentTypeID");
        if (input.calendarID !== undefined) positiveId(input.calendarID, "calendarID");
        validateAppointmentDetails(input);
        if (input.admin === true && input.calendarID === undefined) {
          throw new Error("calendarID is required when admin=true.");
        }
        if (input.admin !== true && input.email === undefined) {
          throw new Error("email is required unless admin=true.");
        }
        if (input.noEmail !== undefined) booleanField(input.noEmail, "noEmail");
        if (input.addonIDs !== undefined && (
          !Array.isArray(input.addonIDs) ||
          input.addonIDs.some((id: unknown) => typeof id !== "number" || !Number.isSafeInteger(id) || id < 1)
        )) throw new Error("addonIDs must be an array of positive integers.");
        const data = await acuityWrite("POST", "appointments", bodyFields(input, [
          "datetime", "appointmentTypeID", "calendarID", "firstName", "lastName",
          "email", "phone", "timezone", "certificate", "fields", "notes",
          "addonIDs", "labels", "smsOptIn",
        ]), { admin: input.admin === true ? true : undefined, noEmail: input.noEmail === true ? true : undefined });
        return toolOk(data && typeof data === "object" ? compactAppointment(data, true) : data);
      }
      case "acuity_update_appointment": {
        const input = writeArgs(args, [
          "id", "firstName", "lastName", "email", "phone", "certificate",
          "fields", "notes", "labels", "smsOptIn", "admin",
        ], ["id"]);
        positiveId(input.id, "id");
        validateAppointmentDetails(input, true);
        const body = bodyFields(input, [
          "firstName", "lastName", "email", "phone", "certificate",
          "fields", "notes", "labels", "smsOptIn",
        ]);
        if (!Object.keys(body).length) throw new Error("Provide at least one appointment field to update.");
        const data = await acuityWrite("PUT", `appointments/${input.id}`, body,
          { admin: input.admin === true ? true : undefined });
        return toolOk(data && typeof data === "object" ? compactAppointment(data, true) : data);
      }
      case "acuity_reschedule_appointment": {
        const input = writeArgs(args, [
          "id", "datetime", "calendarID", "timezone", "admin", "noEmail",
        ], ["id", "datetime"]);
        positiveId(input.id, "id");
        textField(input.datetime, "datetime");
        if (input.calendarID !== undefined && input.calendarID !== null) positiveId(input.calendarID, "calendarID");
        if (input.timezone !== undefined) textField(input.timezone, "timezone");
        if (input.admin !== undefined) booleanField(input.admin, "admin");
        if (input.noEmail !== undefined) booleanField(input.noEmail, "noEmail");
        const data = await acuityWrite("PUT", `appointments/${input.id}/reschedule`,
          bodyFields(input, ["datetime", "calendarID", "timezone"]),
          { admin: input.admin === true ? true : undefined, noEmail: input.noEmail === true ? true : undefined });
        return toolOk(data && typeof data === "object" ? compactAppointment(data, true) : data);
      }
      case "acuity_cancel_appointment": {
        const input = writeArgs(args, ["id", "cancelNote", "noShow", "admin", "noEmail"], ["id"]);
        positiveId(input.id, "id");
        if (input.cancelNote !== undefined) textField(input.cancelNote, "cancelNote", true);
        if (input.noShow !== undefined) booleanField(input.noShow, "noShow");
        if (input.admin !== undefined) booleanField(input.admin, "admin");
        if (input.noEmail !== undefined) booleanField(input.noEmail, "noEmail");
        if (input.noShow !== undefined && input.admin !== true) {
          throw new Error("admin=true is required to set noShow.");
        }
        const body = bodyFields(input, ["cancelNote", "noShow"]);
        const data = await acuityWrite("PUT", `appointments/${input.id}/cancel`,
          Object.keys(body).length ? body : undefined,
          { admin: input.admin === true ? true : undefined, noEmail: input.noEmail === true ? true : undefined });
        return toolOk(data && typeof data === "object" ? compactAppointment(data, true) : data);
      }
      case "acuity_create_calendar_block": {
        const input = writeArgs(args, ["start", "end", "calendarID", "notes"],
          ["start", "end", "calendarID"]);
        textField(input.start, "start");
        textField(input.end, "end");
        positiveId(input.calendarID, "calendarID");
        if (input.notes !== undefined) textField(input.notes, "notes", true);
        const data = await acuityWrite("POST", "blocks",
          bodyFields(input, ["start", "end", "calendarID", "notes"]));
        return toolOk(data);
      }
      case "acuity_delete_calendar_block": {
        const input = writeArgs(args, ["id"], ["id"]);
        positiveId(input.id, "id");
        await acuityWrite("DELETE", `blocks/${input.id}`);
        return toolOk({ deleted: true, id: input.id });
      }
      default:
        return toolError(`Unknown tool: ${name}`);
    }
  } catch (error: any) {
    return toolError(error?.message || "Acuity tool failed.", error?.body);
  }
}

export async function GET(
  _request: Request,
  { params }: { params: { token: string } }
) {
  if (!authorized(params.token)) return new Response("Not Found", { status: 404 });
  return Response.json(
    {
      name: "CCF Acuity MCP",
      ok: true,
      mode: "read-write",
    },
    { headers: { "Cache-Control": "no-store" } }
  );
}

export async function POST(
  request: Request,
  { params }: { params: { token: string } }
) {
  if (!authorized(params.token)) return new Response("Not Found", { status: 404 });

  let rpc: JsonRpcRequest;
  try {
    rpc = await request.json();
  } catch {
    return jsonRpcError(null, -32700, "Parse error", undefined, 400);
  }

  const id = rpc.id;

  if (!rpc.id && rpc.method?.startsWith("notifications/")) {
    return new Response(null, { status: 202 });
  }

  switch (rpc.method) {
    case "initialize": {
      const requestedVersion = rpc.params?.protocolVersion;
      return jsonRpc(id, {
        protocolVersion:
          typeof requestedVersion === "string"
            ? requestedVersion
            : "2025-03-26",
        capabilities: {
          tools: { listChanged: false },
        },
        serverInfo: {
          name: "ccf-acuity",
          version: "1.1.0",
        },
        instructions:
          "This server can read and modify Color Cocktail Factory's Acuity Scheduling account. Use calendar and appointment-type IDs from the listing tools before filtering or writing. Write tools change live data and may trigger Acuity notifications or integrations; call them only for changes the user has authorized. Cancellations and block deletions cannot be undone through this API. Intake forms may contain customer data; request them only when relevant.",
      });
    }
    case "ping":
      return jsonRpc(id, {});
    case "tools/list":
      return jsonRpc(id, { tools });
    case "tools/call": {
      const name = String(rpc.params?.name || "");
      const args =
        rpc.params?.arguments && typeof rpc.params.arguments === "object"
          ? rpc.params.arguments
          : {};
      return jsonRpc(id, await runTool(name, args));
    }
    case "resources/list":
      return jsonRpc(id, { resources: [] });
    case "prompts/list":
      return jsonRpc(id, { prompts: [] });
    default:
      return jsonRpcError(id, -32601, `Method not found: ${rpc.method || ""}`);
  }
}
