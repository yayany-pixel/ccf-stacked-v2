/** Shared limits for public assistant endpoints. */
export const MAX_BODY_BYTES = 48_000;

export function clientIp(request: Request): string {
  return (request.headers.get("x-nf-client-connection-ip") ??
    request.headers.get("x-forwarded-for")?.split(",")[0] ?? "unknown").trim();
}

/** Reject cross-site browser submissions; same-origin requests and API clients work. */
export function sameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  const allowed = [
    new URL(request.url).origin,
    process.env.CCF_SITE_ORIGIN,
    process.env.CCF_DEPLOY_ORIGIN,
    process.env.CCF_DEPLOY_PERMALINK,
    process.env.URL,
    process.env.DEPLOY_PRIME_URL,
    process.env.DEPLOY_URL,
  ];
  return allowed.some((url) => {
    try { return Boolean(url) && new URL(url!).origin === origin; } catch { return false; }
  });
}

export async function readPayload(request: Request): Promise<Record<string, unknown>> {
  if (!sameOrigin(request)) throw new Error("forbidden_origin");
  if (!request.headers.get("content-type")?.toLowerCase().includes("application/json")) {
    throw new Error("invalid_content_type");
  }
  if (Number(request.headers.get("content-length") ?? 0) > MAX_BODY_BYTES) throw new Error("body_too_large");
  const reader = request.body?.getReader();
  if (!reader) throw new Error("invalid_json");
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > MAX_BODY_BYTES) { await reader.cancel(); throw new Error("body_too_large"); }
      chunks.push(value);
    }
    const bytes = new Uint8Array(size);
    let offset = 0;
    for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
    const body: unknown = JSON.parse(new TextDecoder().decode(bytes));
    if (!body || typeof body !== "object" || Array.isArray(body)) throw new Error("invalid_json");
    return body as Record<string, unknown>;
  } finally { reader.releaseLock(); }
}

export function payloadError(error: unknown): { reason: string; status: number } {
  const reason = error instanceof Error ? error.message : "invalid_json";
  if (reason === "forbidden_origin") return { reason, status: 403 };
  if (reason === "body_too_large") return { reason, status: 413 };
  if (reason === "invalid_content_type") return { reason, status: 415 };
  return { reason: "invalid_json", status: 400 };
}

/** Only trusted deploy configuration may choose the recipient of form data. */
export function formOrigin(request: Request): string {
  const configured = process.env.CCF_DEPLOY_PERMALINK || process.env.CCF_DEPLOY_ORIGIN ||
    process.env.DEPLOY_URL || process.env.DEPLOY_PRIME_URL || process.env.CCF_SITE_ORIGIN || process.env.URL;
  if (configured) return new URL(configured).origin;
  const url = new URL(request.url);
  if (url.hostname === "localhost" || url.hostname === "127.0.0.1") return url.origin;
  return "https://colorcocktailfactory.com";
}
