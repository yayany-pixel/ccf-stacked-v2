// Official request shapes:
// https://developers.acuityscheduling.com/reference/post-clients
// https://developers.acuityscheduling.com/reference/put-clients
// https://developers.acuityscheduling.com/reference/delete-clients
// https://developers.acuityscheduling.com/reference/post-certificates
// https://developers.acuityscheduling.com/reference/delete-certificates-id
// https://developers.acuityscheduling.com/page/webhooks-webhooks-webhooks
type Write = (
  method: "POST" | "PUT" | "DELETE",
  path: string,
  body?: unknown,
  params?: Record<string, unknown>
) => Promise<any>;

const nonEmptyText = { type: "string", minLength: 1, pattern: "\\S" };
const idSchema = { type: "integer", minimum: 1, maximum: Number.MAX_SAFE_INTEGER };
// The certificate endpoint does not document an ID type. Preserve the exact
// record ID returned by Acuity rather than assuming every ID is numeric.
const certificateIdSchema = {
  anyOf: [
    idSchema,
    { type: "string", minLength: 1, pattern: "^(?!\\.{1,2}$)(?=.*\\S)[^\\u0000-\\u001F\\u007F-\\u009F]+$" },
  ],
};
const clientIdentity = {
  type: "object",
  properties: {
    firstName: { ...nonEmptyText, description: "Existing client first name, exactly as stored." },
    lastName: { ...nonEmptyText, description: "Existing client last name, exactly as stored." },
    phone: { type: "string", description: "Existing client phone number to distinguish clients with the same name." },
  },
  required: ["firstName", "lastName"],
  additionalProperties: false,
};
const clientDetails = {
  type: "object",
  properties: {
    firstName: nonEmptyText,
    lastName: nonEmptyText,
    phone: { type: "string" },
    email: { type: "string" },
    notes: { type: "string" },
  },
  required: ["firstName", "lastName"],
  additionalProperties: false,
};
const webhookEvents = [
  "appointment.scheduled",
  "appointment.rescheduled",
  "appointment.canceled",
  "appointment.changed",
  "order.completed",
];

function annotations(destructiveHint: boolean, idempotentHint = false) {
  return { readOnlyHint: false, destructiveHint, idempotentHint, openWorldHint: true };
}

export const extraWriteTools = [
  {
    name: "acuity_create_client",
    title: "Create Acuity client",
    description: "Create a client profile in the live Acuity client list. Requires first and last name; an existing matching client produces an API error. Use only for a user-authorized client creation.",
    inputSchema: clientDetails,
    annotations: annotations(false),
  },
  {
    name: "acuity_update_client",
    title: "Update Acuity client",
    description: "Update a live client profile. match identifies the existing client by first name, last name, and optional phone; updates supplies the replacement first and last name plus optional phone, email, and notes. Include the current names in updates when keeping them. Acuity has no client ID parameter for this endpoint. Confirm the intended client and changes before calling.",
    inputSchema: {
      type: "object",
      properties: { match: clientIdentity, updates: clientDetails },
      required: ["match", "updates"],
      additionalProperties: false,
    },
    annotations: annotations(true),
  },
  {
    name: "acuity_delete_client",
    title: "Delete Acuity client",
    description: "Delete a live client profile identified by first name, last name, and optional phone. This removes client data. Confirm the exact client and explicit deletion authorization before calling; clients are not identified by an API client ID here.",
    inputSchema: clientIdentity,
    annotations: annotations(true, true),
  },
  {
    name: "acuity_create_certificate",
    title: "Create Acuity package or coupon code",
    description: "Create a redeemable certificate code for an existing package (productID) or coupon (couponID); supply exactly one. This can grant booking value and requires user authorization. An omitted or empty certificate lets Acuity generate the code. email assigns a package code to that client address. This does not create a package or coupon definition or charge a payment.",
    inputSchema: {
      type: "object",
      properties: {
        productID: { ...idSchema, description: "Existing package/product ID." },
        couponID: { ...idSchema, description: "Existing coupon ID." },
        certificate: { type: "string", description: "Requested code; omit or leave empty for an automatically generated code." },
        email: { ...nonEmptyText, description: "Client email to assign a package certificate to." },
      },
      oneOf: [{ required: ["productID"] }, { required: ["couponID"] }],
      additionalProperties: false,
    },
    annotations: annotations(false),
  },
  {
    name: "acuity_delete_certificate",
    title: "Delete Acuity certificate code",
    description: "Delete a live package or coupon certificate using the exact id returned by Acuity's certificate list or creation response; do not substitute the redeemable certificate code. The public delete endpoint does not specify the ID type, so a positive integer or non-empty opaque string is accepted without coercion. This removes the code and can revoke booking value. Confirm the exact certificate and explicit deletion authorization before calling.",
    inputSchema: {
      type: "object",
      properties: { id: { ...certificateIdSchema, description: "Exact certificate record id returned by Acuity, preserving its string or integer type. Dot segments and control characters are not accepted." } },
      required: ["id"],
      additionalProperties: false,
    },
    annotations: annotations(true, true),
  },
  {
    name: "acuity_create_webhook",
    title: "Create Acuity webhook subscription",
    description: "Create a live webhook subscription that sends Acuity event notifications to an external target URL. Use only an explicitly user-authorized destination and event, after explaining that Acuity will send notifications there. Acuity supports ports 80 and 443 and at most 25 webhooks per account. This enables ongoing external notifications immediately; it is not a harmless connection test.",
    inputSchema: {
      type: "object",
      properties: {
        event: { type: "string", enum: webhookEvents },
        target: { ...nonEmptyText, format: "uri", description: "Explicitly user-authorized absolute HTTP or HTTPS receiver URL on port 80 or 443, without embedded credentials or a fragment." },
      },
      required: ["event", "target"],
      additionalProperties: false,
    },
    annotations: annotations(false),
  },
  {
    name: "acuity_delete_webhook",
    title: "Delete Acuity webhook subscription",
    description: "Delete a live webhook subscription by ID, stopping future notifications to its receiver. Confirm the intended subscription and user authorization before calling because dependent integrations may stop working.",
    inputSchema: {
      type: "object",
      properties: { id: { ...idSchema, description: "Webhook subscription ID returned by Acuity." } },
      required: ["id"],
      additionalProperties: false,
    },
    annotations: annotations(true, true),
  },
];

function objectArgs(value: unknown, allowed: string[], required: string[], label = "arguments"): Record<string, any> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error(`${label} must be an object.`);
  }
  const args = value as Record<string, any>;
  const unknown = Object.keys(args).filter((key) => !allowed.includes(key));
  if (unknown.length) throw new Error(`Unsupported ${label}: ${unknown.join(", ")}`);
  for (const key of required) {
    if (args[key] === undefined || args[key] === null) throw new Error(`${label}.${key} is required.`);
  }
  return args;
}

function text(value: unknown, key: string, allowEmpty = false) {
  if (typeof value !== "string" || (!allowEmpty && !value.trim())) {
    throw new Error(`${key} must be ${allowEmpty ? "a string" : "a non-empty string"}.`);
  }
}

function positiveId(value: unknown, key: string) {
  if (typeof value !== "number" || !Number.isSafeInteger(value) || value < 1) {
    throw new Error(`${key} must be a positive integer.`);
  }
}

function certificatePathId(value: unknown) {
  if (typeof value === "number") {
    positiveId(value, "id");
    return String(value);
  }
  text(value, "id");
  const id = value as string;
  if (id === "." || id === ".." || /[\u0000-\u001f\u007f-\u009f]/.test(id)) {
    throw new Error("id must not be a dot segment or contain control characters.");
  }
  try {
    return encodeURIComponent(id);
  } catch {
    throw new Error("id must be a valid Unicode string.");
  }
}

function clientArgs(value: unknown, identity = false, label = "arguments") {
  const args = objectArgs(value, identity ? ["firstName", "lastName", "phone"] : ["firstName", "lastName", "phone", "email", "notes"], ["firstName", "lastName"], label);
  for (const key of ["firstName", "lastName"]) text(args[key], `${label}.${key}`);
  for (const key of ["phone", "email", "notes"]) {
    if (args[key] !== undefined) text(args[key], `${label}.${key}`, true);
  }
  return args;
}

function webhookTarget(value: unknown) {
  text(value, "target");
  let parsed: URL;
  try {
    parsed = new URL(value as string);
  } catch {
    throw new Error("target must be an absolute HTTP or HTTPS URL.");
  }
  if (!["http:", "https:"].includes(parsed.protocol) || !parsed.hostname) {
    throw new Error("target must be an absolute HTTP or HTTPS URL.");
  }
  const port = parsed.port || (parsed.protocol === "https:" ? "443" : "80");
  if (!["80", "443"].includes(port)) throw new Error("Acuity webhook targets must use port 80 or 443.");
  if (parsed.username || parsed.password || parsed.hash) {
    throw new Error("target must not contain embedded credentials or a fragment.");
  }
}

export async function runExtraWriteTool(
  name: string,
  args: Record<string, any>,
  write: Write
): Promise<{ data: unknown } | undefined> {
  switch (name) {
    case "acuity_create_client": {
      const body = clientArgs(args);
      return { data: await write("POST", "clients", body) };
    }
    case "acuity_update_client": {
      objectArgs(args, ["match", "updates"], ["match", "updates"]);
      const query = clientArgs(args.match, true, "match");
      const body = clientArgs(args.updates, false, "updates");
      return { data: await write("PUT", "clients", body, query) };
    }
    case "acuity_delete_client": {
      const query = clientArgs(args, true);
      await write("DELETE", "clients", undefined, query);
      return { data: { deleted: true, resource: "client" } };
    }
    case "acuity_create_certificate": {
      objectArgs(args, ["productID", "couponID", "certificate", "email"], []);
      if ((args.productID !== undefined) === (args.couponID !== undefined)) {
        throw new Error("Exactly one of productID or couponID is required.");
      }
      for (const key of ["productID", "couponID"]) {
        if (args[key] !== undefined) positiveId(args[key], key);
      }
      if (args.certificate !== undefined) text(args.certificate, "certificate", true);
      if (args.email !== undefined) text(args.email, "email");
      return { data: await write("POST", "certificates", args) };
    }
    case "acuity_delete_certificate": {
      objectArgs(args, ["id"], ["id"]);
      const pathId = certificatePathId(args.id);
      await write("DELETE", `certificates/${pathId}`);
      return { data: { deleted: true, resource: "certificate", id: args.id } };
    }
    case "acuity_create_webhook": {
      objectArgs(args, ["event", "target"], ["event", "target"]);
      if (typeof args.event !== "string" || !webhookEvents.includes(args.event)) {
        throw new Error(`event must be one of: ${webhookEvents.join(", ")}.`);
      }
      webhookTarget(args.target);
      const result = await write("POST", "webhooks", args);
      return {
        data: {
          id: result?.id,
          event: result?.event ?? args.event,
          status: result?.status,
          targetOrigin: new URL(args.target).origin,
          target: "[redacted]",
        },
      };
    }
    case "acuity_delete_webhook": {
      objectArgs(args, ["id"], ["id"]);
      positiveId(args.id, "id");
      await write("DELETE", `webhooks/${args.id}`);
      return { data: { deleted: true, resource: "webhook", id: args.id } };
    }
    default:
      return undefined;
  }
}
