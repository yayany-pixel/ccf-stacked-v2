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

function clampMax(value: unknown, fallback = 100) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.max(1, Math.min(100, Math.trunc(parsed)));
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
      mode: "read-only",
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
          version: "1.0.0",
        },
        instructions:
          "This server provides read-only access to Color Cocktail Factory's Acuity Scheduling account. Use calendar and appointment-type IDs from the listing tools before applying narrow filters. Intake forms may contain customer data; request them only when relevant.",
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
