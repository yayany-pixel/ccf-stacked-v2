// Groupon preparation tools. The separately tested API adapter is not activated:
// Groupon's signing contract, scoped credentials, and certification are required.
// A code recorded in Acuity is not evidence of voucher validity or redemption.
type Args = Record<string, unknown>;
type AcuityGet = (path: string, params?: Record<string, unknown>) => Promise<unknown>;

const annotations = {
  readOnlyHint: true,
  destructiveHint: false,
  idempotentHint: true,
  openWorldHint: false,
};

export const grouponTools = [
  {
    name: "groupon_connection_status",
    description: "Report the implemented Groupon capabilities and setup blockers. This is a local readiness report, not a live Groupon API connectivity check.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
    annotations,
  },
  {
    name: "groupon_find_acuity_bookings",
    description: "Find exact voucher-code matches in Acuity appointment certificates and explicitly selected intake-form fields within a maximum 31-day range. Does not contact Groupon, verify voucher validity, prove attendance, or redeem anything. Multiple matches require review; a capped search is not exhaustive.",
    inputSchema: {
      type: "object",
      properties: {
        voucherCode: { type: "string", minLength: 1, maxLength: 160 },
        minDate: { type: "string", pattern: "^\\d{4}-\\d{2}-\\d{2}$" },
        maxDate: { type: "string", pattern: "^\\d{4}-\\d{2}-\\d{2}$" },
        calendarID: { type: "integer", minimum: 1 },
        appointmentTypeID: { type: "integer", minimum: 1 },
        formFieldIDs: {
          type: "array", maxItems: 20, uniqueItems: true,
          items: { type: "integer", minimum: 1 },
          description: "Only search these known Groupon voucher intake-field IDs. Discover IDs with acuity_list_forms. Free-text notes are not searched.",
        },
      },
      required: ["voucherCode", "minDate", "maxDate"],
      additionalProperties: false,
    },
    annotations: { ...annotations, openWorldHint: true },
  },
];

function dateValue(value: unknown, name: string): number {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    throw new Error(`${name} must be a valid YYYY-MM-DD date.`);
  }
  const timestamp = Date.parse(`${value}T00:00:00Z`);
  if (!Number.isFinite(timestamp) || new Date(timestamp).toISOString().slice(0, 10) !== value) {
    throw new Error(`${name} must be a valid YYYY-MM-DD date.`);
  }
  return timestamp;
}

function positiveId(value: unknown): value is number {
  return typeof value === "number" && Number.isSafeInteger(value) && value > 0;
}

function object(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

export async function runGrouponTool(
  name: string,
  args: Args,
  acuityGet: AcuityGet,
): Promise<{ data: unknown } | null> {
  const definition = grouponTools.find(tool => tool.name === name);
  if (!definition) return null;
  if (!object(args)) throw new Error("Tool arguments must be an object.");
  const allowed = Object.keys(definition.inputSchema.properties);
  if (Object.keys(args).some(key => !allowed.includes(key))) {
    throw new Error("Unsupported Groupon tool arguments.");
  }

  if (name === "groupon_connection_status") {
    return { data: {
      stage: "api_adapter_awaiting_authentication",
      grouponApiConnected: false,
      grouponApiChecked: false,
      posSpecificationReviewed: true,
      apiAdapterImplemented: true,
      productionAuthenticationImplemented: false,
      capabilities: {
        acuityVoucherCodeMatching: true,
        liveVoucherLookup: false,
        redemption: false,
        attendanceRecording: false,
      },
      nextSteps: [
        "Obtain Groupon POS approval, partner and client IDs, merchant-scoped credentials, and approved deal IDs.",
        "Obtain the separate GrouponConnect Request Signing guide and implement its verified authentication scheme.",
        "Complete durable approval and audit handling, test in Groupon's approved environment, and pass certification before enabling live API tools.",
      ],
      developerSignupUrl: "https://www.groupon.com/developers/signup",
      note: "The documented GET/PATCH adapter exists but is not connected to MCP. Merchant Center browser sign-in does not provide server API credentials. These MCP tools make no Groupon API calls.",
    } };
  }

  if (typeof args.voucherCode !== "string" || !args.voucherCode.trim() ||
      args.voucherCode.length > 160 || /[\u0000-\u001f\u007f]/.test(args.voucherCode)) {
    throw new Error("voucherCode must contain 1–160 characters and no control characters.");
  }
  const start = dateValue(args.minDate, "minDate");
  const end = dateValue(args.maxDate, "maxDate");
  if (end < start || end - start > 30 * 86400000) {
    throw new Error("Use an inclusive date range of at most 31 days, with maxDate on or after minDate.");
  }
  for (const key of ["calendarID", "appointmentTypeID"]) {
    if (args[key] !== undefined && !positiveId(args[key])) throw new Error(`${key} must be a positive integer.`);
  }
  const fieldIDs = args.formFieldIDs ?? [];
  if (!Array.isArray(fieldIDs) || fieldIDs.length > 20 ||
      fieldIDs.some(id => !positiveId(id)) || new Set(fieldIDs).size !== fieldIDs.length) {
    throw new Error("formFieldIDs must contain at most 20 unique positive integers.");
  }

  // Codes stay local to matching: do not put them in query strings or logs.
  const code = args.voucherCode.trim();
  const params: Record<string, unknown> = {
    minDate: args.minDate, maxDate: args.maxDate,
    max: 100, direction: "ASC", showall: true,
    excludeForms: fieldIDs.length === 0,
  };
  for (const key of ["calendarID", "appointmentTypeID"]) {
    if (args[key] !== undefined) params[key] = args[key];
  }
  let rows: unknown;
  try {
    rows = await acuityGet("appointments", params);
  } catch {
    // Do not expose raw upstream bodies, which can contain customer data.
    throw new Error("Acuity booking search failed. Check the Acuity connection and retry a narrower date range.");
  }
  if (!Array.isArray(rows) || rows.some(row => !object(row) || !positiveId(row.id))) {
    throw new Error("Acuity returned an unexpected appointment response; no match conclusion is available.");
  }
  const matches = rows.flatMap(row => {
    const sources: string[] = [];
    if (typeof row.certificate === "string" && row.certificate.trim() === code) sources.push("certificate");
    if (fieldIDs.length && Array.isArray(row.forms)) {
      for (const form of row.forms) {
        if (!object(form) || !Array.isArray(form.values)) continue;
        for (const field of form.values) {
          if (object(field) && fieldIDs.includes(field.fieldID) &&
              typeof field.value === "string" && field.value.trim() === code) {
            sources.push(`formField:${field.fieldID}`);
          }
        }
      }
    }
    if (!sources.length) return [];
    return [{
      appointmentID: row.id,
      firstName: row.firstName, lastName: row.lastName,
      type: row.type, appointmentTypeID: row.appointmentTypeID,
      calendar: row.calendar, calendarID: row.calendarID,
      datetime: row.datetime, date: row.date, time: row.time,
      canceled: typeof row.canceled === "boolean" ? row.canceled : null,
      noShow: typeof row.noShow === "boolean" ? row.noShow : null,
      matchedSources: [...new Set(sources)],
    }];
  });
  const limitReached = rows.length >= 100;
  return { data: {
    source: "acuity",
    searchedRange: { minDate: args.minDate, maxDate: args.maxDate },
    searchedAppointmentCount: rows.length,
    resultLimitReached: limitReached,
    requiresReview: limitReached || matches.length !== 1 || matches.some(m => m.canceled !== false || m.noShow !== false),
    matchCount: matches.length,
    matches,
    grouponVoucherStatus: "not_checked",
    attendanceConfirmed: false,
    redeemedByThisTool: false,
    note: limitReached
      ? "Acuity returned the 100-record limit. Narrow the date range or calendar before drawing a conclusion. Code matches do not establish voucher validity, attendance, or redemption."
      : "Exact, case-sensitive matches after trimming outer whitespace only. Code matches in Acuity do not establish Groupon voucher validity, attendance, or redemption.",
  } };
}
