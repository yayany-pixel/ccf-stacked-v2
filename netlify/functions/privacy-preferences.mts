import type { Config } from "@netlify/functions";
import { readPrivacyPreferences, savePrivacyPreferences } from "../../lib/privacy.server";

export default async function privacyPreferences(request: Request) {
  if (request.method === "GET") return readPrivacyPreferences(request);
  if (request.method === "POST") return savePrivacyPreferences(request);
  return Response.json({ error: "method_not_allowed" }, {
    status: 405,
    headers: { Allow: "GET, POST", "Cache-Control": "private, no-store" },
  });
}

export const config: Config = { path: "/api/privacy" };
