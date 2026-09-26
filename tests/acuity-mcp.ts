import assert from "node:assert/strict";
import { GET, POST } from "../app/api/acuity-mcp/[token]/mcp/route";

type RpcResponse = {
  result?: {
    tools?: Array<{ name: string; annotations?: { readOnlyHint?: boolean } }>;
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

async function callTool(name: string, args: Record<string, unknown>) {
  const response = await rpc("tools/call", { name, arguments: args });
  assert.equal(response.error, undefined, `${name} should not produce a JSON-RPC error`);
  assert.equal(response.result?.isError, undefined, `${name} should succeed`);
}

async function expectAcuityRequest(
  name: string,
  args: Record<string, unknown>,
  method: string,
  path: string,
  body?: Record<string, unknown>,
  query: Record<string, string> = {}
) {
  requests.length = 0;
  await callTool(name, args);
  assert.equal(requests.length, 1, `${name} should make exactly one Acuity request`);
  const request = requests[0];
  assert.equal(request.url.origin, "https://acuityscheduling.com");
  assert.equal(request.url.pathname, `/api/v1/${path}`);
  assert.equal(request.init?.method, method);
  assert.deepEqual(Object.fromEntries(request.url.searchParams), query);
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
    return Response.json({ id: 9876, success: true });
  }) as typeof fetch;

  try {
    const listed = await rpc("tools/list");
    const tools = listed.result?.tools ?? [];
    const readNames = [
      "acuity_status",
      "acuity_list_calendars",
      "acuity_list_appointment_types",
      "acuity_list_classes",
      "acuity_list_appointments",
      "acuity_get_appointment",
      "acuity_search_clients",
      "acuity_get_payments",
    ];
    const writeNames = [
      "acuity_create_appointment",
      "acuity_update_appointment",
      "acuity_reschedule_appointment",
      "acuity_cancel_appointment",
      "acuity_create_calendar_block",
      "acuity_delete_calendar_block",
    ];
    assert.deepEqual(new Set(tools.map((tool) => tool.name)), new Set([...readNames, ...writeNames]));
    for (const tool of tools) {
      assert.equal(
        tool.annotations?.readOnlyHint,
        readNames.includes(tool.name),
        `${tool.name} should advertise the correct read/write capability`
      );
    }

    const status = await GET(new Request("http://localhost/"), { params: { token } });
    assert.equal(status.status, 200);
    assert.notEqual((await status.json()).mode, "read-only");
    const initialized = await rpc("initialize", { protocolVersion: "2025-03-26" });
    assert.match(initialized.result?.instructions ?? "", /read.*write|write.*read/i);
    assert.doesNotMatch(initialized.result?.instructions ?? "", /read-only/i);
    assert.equal(initialized.result?.serverInfo?.name, "ccf-acuity");

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

    for (const name of writeNames) {
      requests.length = 0;
      const result = await rpc("tools/call", { name, arguments: {} });
      assert.equal(result.result?.isError, true, `${name} should reject missing required input`);
      assert.equal(requests.length, 0, `${name} must reject invalid input before contacting Acuity`);
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
    ];
    for (const [name, args] of unsafeInputs) {
      requests.length = 0;
      const result = await rpc("tools/call", { name, arguments: args });
      assert.equal(result.result?.isError, true, `${name} should reject ${JSON.stringify(args)}`);
      assert.equal(requests.length, 0, `${name} must reject invalid input before contacting Acuity`);
    }

    console.log("Acuity MCP offline write tests passed.");
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
