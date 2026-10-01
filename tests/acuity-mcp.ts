import assert from "node:assert/strict";
import { GET, POST } from "../app/api/acuity-mcp/[token]/mcp/route";

type RpcResponse = {
  result?: {
    tools?: Array<{ name: string; annotations?: { readOnlyHint?: boolean; destructiveHint?: boolean; openWorldHint?: boolean } }>;
    isError?: boolean;
    instructions?: string;
    serverInfo?: { name?: string; version?: string };
  };
  error?: unknown;
};

const token = "offline-test-token";
const originalFetch = globalThis.fetch;
const originalEnv = {
  CCF_MCP_TOKEN: process.env.CCF_MCP_TOKEN,
  ACUITY_USER_ID: process.env.ACUITY_USER_ID,
  ACUITY_API_KEY: process.env.ACUITY_API_KEY,
};

const requests: Array<{ url: URL; init: RequestInit | undefined }> = [];
let mockResponse: unknown = { id: 9876, success: true };
let mockStatus = 200;

function restoreEnv(key: keyof typeof originalEnv) {
  const value = originalEnv[key];
  if (value === undefined) delete process.env[key];
  else process.env[key] = value;
}

async function rpc(method: string, params: Record<string, unknown> = {}): Promise<RpcResponse> {
  const response = await POST(
    new Request("http://localhost/api/acuity-mcp/offline-test-token/mcp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }),
    }),
    { params: { token } }
  );
  assert.equal(response.status, 200, `${method} should return an MCP response`);
  return response.json();
}

async function callTool(name: string, args: unknown) {
  const response = await rpc("tools/call", { name, arguments: args });
  assert.equal(response.error, undefined, `${name} should not produce a JSON-RPC error`);
  assert.equal(response.result?.isError, undefined, `${name} should succeed: ${JSON.stringify(response)}`);
}

async function expectRejected(name: string, args: unknown) {
  requests.length = 0;
  const response = await rpc("tools/call", { name, arguments: args });
  assert.equal(response.result?.isError, true, `${name} should reject ${JSON.stringify(args)}`);
  assert.equal(requests.length, 0, `${name} must reject invalid input before contacting Acuity`);
}

async function expectAcuityRequest(
  name: string,
  args: Record<string, unknown>,
  method: string,
  path: string,
  body?: unknown,
  query: Record<string, string> | Array<[string, string]> = {}
) {
  requests.length = 0;
  await callTool(name, args);
  assert.equal(requests.length, 1, `${name} should make exactly one Acuity request`);
  const request = requests[0];
  assert.equal(request.url.origin, "https://acuityscheduling.com");
  assert.equal(request.url.pathname, `/api/v1/${path}`);
  assert.equal(request.init?.method, method);
  // Keep duplicate query keys: converting to an object would hide lost add-on/ignore IDs.
  assert.deepEqual(
    [...request.url.searchParams].sort(),
    (Array.isArray(query) ? query : Object.entries(query)).sort()
  );
  assert.equal(new Headers(request.init?.headers).get("Authorization"),
    `Basic ${Buffer.from("offline-user:offline-key").toString("base64")}`);
  assert.deepEqual(
    request.init?.body === undefined ? undefined : JSON.parse(String(request.init.body)),
    body
  );
}

async function main() {
  process.env.CCF_MCP_TOKEN = token;
  process.env.ACUITY_USER_ID = "offline-user";
  process.env.ACUITY_API_KEY = "offline-key";
  globalThis.fetch = (async (input: string | URL | Request, init?: RequestInit) => {
    requests.push({ url: new URL(String(input)), init });
    return Response.json(mockResponse, { status: mockStatus });
  }) as typeof fetch;

  try {
    const listed = await rpc("tools/list");
    const tools = listed.result?.tools ?? [];
    const readNames = [
      "groupon_connection_status",
      "groupon_find_acuity_bookings",
      "acuity_status",
      "acuity_list_calendars",
      "acuity_list_appointment_types",
      "acuity_list_classes",
      "acuity_list_appointments",
      "acuity_get_appointment",
      "acuity_search_clients",
      "acuity_get_payments",
      "acuity_list_available_dates",
      "acuity_list_available_times",
      "acuity_check_available_times",
      "acuity_list_calendar_blocks",
      "acuity_list_certificates",
      "acuity_check_certificate",
      "acuity_list_forms",
      "acuity_list_appointment_addons",
      "acuity_list_labels",
      "acuity_list_products",
      "acuity_list_orders",
      "acuity_get_order",
      "acuity_list_webhooks",
      "acuity_get_account",
      "acuity_get_service_metadata",
      "printful_list_stores", "printful_list_catalog_products", "printful_get_catalog_product",
      "printful_list_products", "printful_get_product", "printful_list_orders", "printful_get_order",
      "eventbrite_status",
      "eventbrite_list_events",
      "eventbrite_list_venues",
      "eventbrite_list_organizers",
    ];
    const writeNames = [
      "acuity_create_appointment",
      "acuity_update_appointment",
      "acuity_reschedule_appointment",
      "acuity_cancel_appointment",
      "acuity_create_calendar_block",
      "acuity_delete_calendar_block",
      "acuity_create_client",
      "acuity_update_client",
      "acuity_delete_client",
      "acuity_create_certificate",
      "acuity_delete_certificate",
      "acuity_create_webhook",
      "acuity_delete_webhook",
      "printful_create_product", "printful_update_variant", "printful_create_draft_order",
      "printful_update_order", "printful_confirm_order",
      "eventbrite_create_class_event",
      "eventbrite_publish_event",
      "eventbrite_sync_acuity_classes",
    ];
    assert.deepEqual(new Set(tools.map((tool) => tool.name)), new Set([...readNames, ...writeNames]));
    assert.equal(tools.length, readNames.length + writeNames.length, "Tool names must be unique");
    for (const tool of tools) {
      assert.equal(
        tool.annotations?.readOnlyHint,
        readNames.includes(tool.name),
        `${tool.name} should advertise the correct read/write capability`
      );
      assert.equal(tool.annotations?.openWorldHint, tool.name !== "groupon_connection_status", `${tool.name} should advertise its access scope`);
    }

    for (const name of ["acuity_delete_calendar_block", "acuity_delete_client", "acuity_delete_certificate", "acuity_delete_webhook", "acuity_cancel_appointment"]) {
      assert.equal(tools.find((tool) => tool.name === name)?.annotations?.destructiveHint, true,
        `${name} must advertise destructive behavior`);
    }

    const status = await GET(new Request("http://localhost/"), { params: { token } });
    assert.equal(status.status, 200);
    const metadata = await status.json();
    assert.equal(metadata.mode, "read-write");
    assert.equal(metadata.version, "1.5.0");
    assert.equal(metadata.toolCount, 57);
    const initialized = await rpc("initialize", { protocolVersion: "2025-03-26" });
    assert.match(initialized.result?.instructions ?? "", /read.*write|write.*read/i);
    assert.doesNotMatch(initialized.result?.instructions ?? "", /read-only/i);
    assert.equal(initialized.result?.serverInfo?.name, "ccf-acuity");
    assert.equal(initialized.result?.serverInfo?.version, "1.5.0");

    // These concrete transport expectations are independent of tool definitions.
    await expectAcuityRequest(
      "acuity_list_available_dates",
      { month: "2030-01", appointmentTypeID: 123, calendarID: 456, addonIDs: [11, 22], timezone: "America/Chicago" },
      "GET", "availability/dates", undefined,
      [["month", "2030-01"], ["appointmentTypeID", "123"], ["calendarID", "456"],
        ["addonIDs[]", "11"], ["addonIDs[]", "22"], ["timezone", "America/Chicago"]]
    );
    await expectAcuityRequest(
      "acuity_list_available_times",
      { date: "2030-01-20", appointmentTypeID: 123, calendarID: 456, addonIDs: [11, 22], timezone: "America/Chicago", ignoreAppointmentIDs: [987, 988] },
      "GET", "availability/times", undefined,
      [["date", "2030-01-20"], ["appointmentTypeID", "123"], ["calendarID", "456"],
        ["addonIDs[]", "11"], ["addonIDs[]", "22"], ["timezone", "America/Chicago"],
        ["ignoreAppointmentIDs[]", "987"], ["ignoreAppointmentIDs[]", "988"]]
    );
    await expectAcuityRequest(
      "acuity_check_available_times",
      { slots: [
        { datetime: "2030-01-20T09:00:00-06:00", appointmentTypeID: 123, calendarID: 456 },
        { datetime: "2030-01-20T10:00:00-06:00", appointmentTypeID: 123 },
      ] },
      "POST", "availability/check-times",
      [
        { datetime: "2030-01-20T09:00:00-06:00", appointmentTypeID: 123, calendarID: 456 },
        { datetime: "2030-01-20T10:00:00-06:00", appointmentTypeID: 123 },
      ]
    );
    assert.equal(tools.find((tool) => tool.name === "acuity_check_available_times")?.annotations?.destructiveHint, false,
      "Checking availability uses POST but must not be advertised as a mutation");
    await expectAcuityRequest(
      "acuity_list_calendar_blocks",
      { max: 25, minDate: "2030-01-01", maxDate: "2030-01-31", calendarID: 456 },
      "GET", "blocks", undefined,
      { max: "25", minDate: "2030-01-01", maxDate: "2030-01-31", calendarID: "456" }
    );
    await expectAcuityRequest(
      "acuity_list_certificates",
      { productID: "543", orderID: "654", appointmentTypeID: "123", email: "fixture+test@example.invalid" },
      "GET", "certificates", undefined,
      { productID: "543", orderID: "654", appointmentTypeID: "123", email: "fixture+test@example.invalid" }
    );
    await expectAcuityRequest(
      "acuity_check_certificate",
      { certificate: "OFFLINE + / & code", appointmentTypeID: 123, email: "fixture@example.invalid" },
      "GET", "certificates/check", undefined,
      { certificate: "OFFLINE + / & code", appointmentTypeID: "123", email: "fixture@example.invalid" }
    );
    for (const [name, path] of [
      ["acuity_list_forms", "forms"],
      ["acuity_list_appointment_addons", "appointment-addons"],
      ["acuity_list_labels", "labels"],
      ["acuity_list_webhooks", "webhooks"],
      ["acuity_get_account", "me"],
      ["acuity_get_service_metadata", "meta"],
    ]) {
      mockResponse = name === "acuity_list_webhooks" ? [] : { id: 9876, success: true };
      await expectAcuityRequest(name, {}, "GET", path);
    }
    await expectAcuityRequest("acuity_list_products", { deleted: false }, "GET", "products", undefined, { deleted: "false" });
    await expectAcuityRequest("acuity_list_orders", { max: 25 }, "GET", "orders", undefined, { max: "25" });
    await expectAcuityRequest("acuity_get_order", { id: 654 }, "GET", "orders/654");

    await expectAcuityRequest(
      "acuity_create_appointment",
      {
        appointmentTypeID: 123,
        datetime: "2030-01-20T09:00:00-06:00",
        firstName: "Test",
        lastName: "Person",
        email: "test@example.invalid",
        phone: "555-0100",
        calendarID: 456,
        timezone: "America/Chicago",
        notes: "Offline fixture",
        admin: true,
        noEmail: true,
      },
      "POST",
      "appointments",
      {
        appointmentTypeID: 123,
        datetime: "2030-01-20T09:00:00-06:00",
        firstName: "Test",
        lastName: "Person",
        email: "test@example.invalid",
        phone: "555-0100",
        calendarID: 456,
        timezone: "America/Chicago",
        notes: "Offline fixture",
      },
      { admin: "true", noEmail: "true" }
    );

    await expectAcuityRequest(
      "acuity_update_appointment",
      { id: 9876, firstName: "Updated", phone: "555-0101" },
      "PUT",
      "appointments/9876",
      { firstName: "Updated", phone: "555-0101" }
    );

    await expectAcuityRequest(
      "acuity_reschedule_appointment",
      {
        id: 9876,
        datetime: "2030-01-21T10:00:00-06:00",
        calendarID: 456,
        timezone: "America/Chicago",
        admin: true,
        noEmail: true,
      },
      "PUT",
      "appointments/9876/reschedule",
      {
        datetime: "2030-01-21T10:00:00-06:00",
        calendarID: 456,
        timezone: "America/Chicago",
      },
      { admin: "true", noEmail: "true" }
    );

    await expectAcuityRequest(
      "acuity_cancel_appointment",
      { id: 9876, cancelNote: "Offline fixture", noShow: true, admin: true, noEmail: true },
      "PUT",
      "appointments/9876/cancel",
      { cancelNote: "Offline fixture", noShow: true },
      { admin: "true", noEmail: "true" }
    );

    await expectAcuityRequest(
      "acuity_create_calendar_block",
      {
        calendarID: 456,
        start: "2030-01-22T09:00:00-06:00",
        end: "2030-01-22T11:00:00-06:00",
        notes: "Offline fixture",
      },
      "POST",
      "blocks",
      {
        calendarID: 456,
        start: "2030-01-22T09:00:00-06:00",
        end: "2030-01-22T11:00:00-06:00",
        notes: "Offline fixture",
      }
    );

    await expectAcuityRequest(
      "acuity_delete_calendar_block",
      { id: 8765 },
      "DELETE",
      "blocks/8765"
    );

    await expectAcuityRequest(
      "acuity_create_client",
      { firstName: "New", lastName: "Client", phone: "555-0100", email: "new@example.invalid", notes: "Offline fixture" },
      "POST", "clients",
      { firstName: "New", lastName: "Client", phone: "555-0100", email: "new@example.invalid", notes: "Offline fixture" }
    );
    await expectAcuityRequest(
      "acuity_update_client",
      {
        match: { firstName: "Old & original", lastName: "Client", phone: "555-0100" },
        updates: { firstName: "New", lastName: "Name", phone: "555-0101", email: "changed@example.invalid", notes: "" },
      },
      "PUT", "clients",
      { firstName: "New", lastName: "Name", phone: "555-0101", email: "changed@example.invalid", notes: "" },
      { firstName: "Old & original", lastName: "Client", phone: "555-0100" }
    );
    await expectAcuityRequest(
      "acuity_delete_client",
      { firstName: "Delete", lastName: "Client", phone: "555-0102" },
      "DELETE", "clients", undefined,
      { firstName: "Delete", lastName: "Client", phone: "555-0102" }
    );
    await expectAcuityRequest(
      "acuity_create_certificate",
      { productID: 543, certificate: "OFFLINE-ONLY", email: "fixture@example.invalid" },
      "POST", "certificates",
      { productID: 543, certificate: "OFFLINE-ONLY", email: "fixture@example.invalid" }
    );
    await expectAcuityRequest(
      "acuity_create_certificate", { couponID: 654, certificate: "" },
      "POST", "certificates", { couponID: 654, certificate: "" }
    );
    await expectAcuityRequest(
      "acuity_delete_certificate", { id: 765 }, "DELETE", "certificates/765"
    );
    await expectAcuityRequest(
      "acuity_delete_certificate", { id: "pkg/a?b#c" }, "DELETE", "certificates/pkg%2Fa%3Fb%23c"
    );
    await expectAcuityRequest(
      "acuity_create_webhook",
      { event: "appointment.scheduled", target: "https://hooks.example.invalid/acuity?client=offline" },
      "POST", "webhooks",
      { event: "appointment.scheduled", target: "https://hooks.example.invalid/acuity?client=offline" }
    );
    await expectAcuityRequest(
      "acuity_delete_webhook", { id: 876 }, "DELETE", "webhooks/876"
    );

    for (const name of writeNames) {
      await expectRejected(name, {});
      await expectRejected(name, []);
      await expectRejected(name, "not an object");
    }

    const unsafeInputs: Array<[string, Record<string, unknown>]> = [
      ["acuity_create_appointment", {
        datetime: "2030-01-20T09:00:00-06:00", appointmentTypeID: 123,
        firstName: "Test", lastName: "Person",
      }],
      ["acuity_create_appointment", {
        datetime: "2030-01-20T09:00:00-06:00", appointmentTypeID: 123,
        firstName: "Test", lastName: "Person", admin: true,
      }],
      ["acuity_update_appointment", { id: 9876 }],
      ["acuity_update_appointment", { id: 9876, datetime: "2030-01-21T10:00:00-06:00" }],
      ["acuity_reschedule_appointment", { id: 0, datetime: "2030-01-21T10:00:00-06:00" }],
      ["acuity_cancel_appointment", { id: 9876, noShow: true }],
      ["acuity_create_calendar_block", { start: "2030-01-22T09:00:00-06:00", end: "", calendarID: 456 }],
      ["acuity_delete_calendar_block", { id: 0 }],
      ["acuity_create_client", { firstName: "Fixture", lastName: "Client", phone: false }],
      ["acuity_create_client", { firstName: "Fixture", lastName: "Client", appointmentTypeID: 123 }],
      ["acuity_update_client", { match: [], updates: { firstName: "New", lastName: "Client" } }],
      ["acuity_update_client", { match: { firstName: "Old", lastName: "Client" }, updates: [] }],
      ["acuity_update_client", { match: { firstName: "Old", lastName: "Client", id: 123 }, updates: { firstName: "New", lastName: "Client" } }],
      ["acuity_update_client", { match: { firstName: "Old", lastName: "Client" }, updates: { firstName: "New" } }],
      ["acuity_update_client", { match: { firstName: "Old", lastName: "Client" }, updates: { firstName: "New", lastName: "Client", appointments: [] } }],
      ["acuity_delete_client", { firstName: "", lastName: "Client" }],
      ["acuity_delete_client", { firstName: "Delete", lastName: "Client", email: "fixture@example.invalid" }],
      ["acuity_create_certificate", { productID: 543, couponID: 654 }],
      ["acuity_create_certificate", { certificate: "MISSING-DEFINITION" }],
      ["acuity_create_certificate", { productID: true }],
      ["acuity_create_certificate", { couponID: "654" }],
      ["acuity_create_certificate", { productID: 543, email: { address: "fixture@example.invalid" } }],
      ["acuity_create_certificate", { productID: 543, amount: 5 }],
      ["acuity_delete_certificate", { id: false }],
      ["acuity_delete_certificate", { id: 0 }],
      ["acuity_delete_certificate", { id: "." }],
      ["acuity_delete_certificate", { id: ".." }],
      ["acuity_delete_certificate", { id: " " }],
      ["acuity_delete_certificate", { id: "pkg\u0000id" }],
      ["acuity_delete_certificate", { id: "pkg\u007fid" }],
      ["acuity_delete_certificate", { id: "pkg\u0085id" }],
      ["acuity_delete_certificate", { id: "pkg\ud800id" }],
      ["acuity_create_webhook", { event: "appointment.deleted", target: "https://hooks.example.invalid/acuity" }],
      ["acuity_create_webhook", { event: "appointment.scheduled", target: "/relative/path" }],
      ["acuity_create_webhook", { event: "appointment.scheduled", target: "ftp://hooks.example.invalid/acuity" }],
      ["acuity_create_webhook", { event: "appointment.scheduled", target: "https://user:pass@hooks.example.invalid/acuity" }],
      ["acuity_create_webhook", { event: "appointment.scheduled", target: "https://hooks.example.invalid:8443/acuity" }],
      ["acuity_create_webhook", { event: "appointment.scheduled", target: "https://hooks.example.invalid/acuity", secret: "not-a-supported-field" }],
      ["acuity_delete_webhook", { id: 1.5 }],
      ["acuity_delete_webhook", { id: "876" }],
      ["acuity_list_available_dates", { month: "2030-13", appointmentTypeID: 123 }],
      ["acuity_list_available_dates", { month: "2030-01", appointmentTypeID: false }],
      ["acuity_list_available_dates", { month: "2030-01", appointmentTypeID: 123, addonIDs: [1, "2"] }],
      ["acuity_list_available_dates", { month: "2030-01", appointmentTypeID: 123, addonIDs: { id: 1 } }],
      ["acuity_list_available_times", { date: "2030-01-20", appointmentTypeID: 123, ignoreAppointmentIDs: [true] }],
      ["acuity_list_available_times", { date: "2030-01-20", appointmentTypeID: 123, admin: true }],
      ["acuity_check_available_times", { slots: [] }],
      ["acuity_check_available_times", { slots: { datetime: "2030-01-20T09:00:00-06:00", appointmentTypeID: 123 } }],
      ["acuity_check_available_times", { slots: [null] }],
      ["acuity_check_available_times", { slots: [{ datetime: "2030-01-20T09:00:00-06:00", appointmentTypeID: 123, admin: true }] }],
      ["acuity_check_available_times", { slots: [{ datetime: "2030-01-20T09:00:00-06:00", appointmentTypeID: true }] }],
      ["acuity_check_available_times", { slots: [{ datetime: "2030-01-20T09:00:00-06:00", appointmentTypeID: 123 }, { datetime: "", appointmentTypeID: 123 }] }],
      ["acuity_list_calendar_blocks", { max: false }],
      ["acuity_list_certificates", { productID: [] }],
      ["acuity_check_certificate", { certificate: "", appointmentTypeID: 123 }],
      ["acuity_list_forms", { arbitrary: true }],
      ["acuity_list_products", { deleted: "false" }],
      ["acuity_list_orders", { max: -1 }],
      ["acuity_get_order", { id: true }],
    ];
    for (const [name, args] of unsafeInputs) {
      await expectRejected(name, args);
    }
    for (const name of readNames) {
      await expectRejected(name, []);
      await expectRejected(name, null);
    }

    // Acuity errors and records must not reflect authentication values to MCP clients.
    mockResponse = {
      apiKey: "sensitive-api-field",
      nested: [{ access_token: "sensitive-access-field", refreshToken: "sensitive-refresh-field", authorization: "sensitive-auth-field", password: "sensitive-password-field", secret: "sensitive-secret-field" }],
      message: `Echoed ${token} offline-user offline-key`,
      safe: "keep this field",
    };
    const hiddenValues = [token, "offline-user", "offline-key", "sensitive-api-field", "sensitive-access-field", "sensitive-refresh-field", "sensitive-auth-field", "sensitive-password-field", "sensitive-secret-field"];
    for (const status of [200, 400]) {
      mockStatus = status;
      const response = await rpc("tools/call", { name: "acuity_list_forms", arguments: {} });
      const serialized = JSON.stringify(response);
      assert.equal(response.result?.isError, status === 400 ? true : undefined);
      assert.ok(serialized.includes("keep this field"));
      for (const hidden of hiddenValues) {
        assert.ok(!serialized.includes(hidden), `HTTP ${status} must not expose a sensitive value`);
      }
    }
    mockStatus = 200;

    mockResponse = [{
      id: 876, event: "appointment.scheduled", status: "active",
      target: "https://fixture-user:fixture-password@hooks.example.invalid/private-hook-path?token=private-hook-token#private-hook-fragment",
    }];
    const listedWebhooks = await rpc("tools/call", { name: "acuity_list_webhooks", arguments: {} });
    const webhookResult = JSON.stringify(listedWebhooks);
    assert.equal(listedWebhooks.result?.isError, undefined);
    assert.ok(webhookResult.includes("https://hooks.example.invalid"));
    for (const hidden of ["fixture-user", "fixture-password", "private-hook-path", "private-hook-token", "private-hook-fragment"]) {
      assert.ok(!webhookResult.includes(hidden), "Webhook listings must conceal URL credentials, paths, and queries");
    }

    mockResponse = { id: 876, event: "order.completed", target: "https://hooks.example.invalid/private-create-path?token=private-create-token" };
    const createdWebhook = await rpc("tools/call", {
      name: "acuity_create_webhook",
      arguments: { event: "order.completed", target: "https://hooks.example.invalid/private-create-path?token=private-create-token" },
    });
    assert.equal(createdWebhook.result?.isError, undefined);
    assert.ok(!JSON.stringify(createdWebhook).includes("private-create-path"));
    assert.ok(!JSON.stringify(createdWebhook).includes("private-create-token"));

    console.log("Acuity MCP offline API contract and validation tests passed.");
  } finally {
    globalThis.fetch = originalFetch;
    restoreEnv("CCF_MCP_TOKEN");
    restoreEnv("ACUITY_USER_ID");
    restoreEnv("ACUITY_API_KEY");
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
