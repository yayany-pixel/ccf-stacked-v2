import { NextRequest, NextResponse } from "next/server";

/** Keep account spend and visitor reporting private, including server rendering. */
export async function middleware(request: NextRequest) {
  const password = process.env.ANALYTICS_REPORT_PASSWORD;
  const headers = { "Cache-Control": "private, no-store" };
  if (!password) return new NextResponse("Analytics access is not configured", { status: 503, headers });
  const authorization = request.headers.get("authorization") || "";
  let candidate = "";
  try { if (authorization.startsWith("Basic ")) candidate = atob(authorization.slice(6)); } catch {}
  const digest = async (value: string) => new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value)));
  const [actual, expected] = await Promise.all([digest(candidate), digest(`admin:${password}`)]);
  let difference = 0;
  for (let i = 0; i < expected.length; i++) difference |= actual[i] ^ expected[i];
  if (difference) return new NextResponse("Authentication required", { status: 401,
    headers: { ...headers, "WWW-Authenticate": 'Basic realm="CCF analytics", charset="UTF-8"' } });
  const response = NextResponse.next();
  response.headers.set("Cache-Control", "private, no-store");
  return response;
}
export const config = { matcher: ["/analytics/:path*", "/api/analytics/:path*"] };
