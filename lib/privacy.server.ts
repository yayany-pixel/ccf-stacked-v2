import { getDatabase } from "@netlify/database";
import { randomBytes } from "node:crypto";
import { readPayload, payloadError, sameOrigin } from "./askccf/security";
import { parsePrivacyPreferences, type PrivacyPreferences } from "./privacy";

export const PRIVACY_COOKIE = "ccf_privacy";
export const PRIVACY_MAX_AGE = 180 * 24 * 60 * 60;

type PrivacyStore = {
  read: (id: string) => Promise<PrivacyPreferences | null>;
  save: (id: string, preferences: PrivacyPreferences) => Promise<void>;
};

export const privacyStore: PrivacyStore = {
  async read(id) {
    const database = getDatabase();
    const rows = await database.sql`
      SELECT analytics, marketing FROM privacy_preferences
      WHERE id = ${id} AND expires_at > now() LIMIT 1
    `;
    return parsePrivacyPreferences(rows[0]);
  },
  async save(id, preferences) {
    const database = getDatabase();
    const expiresAt = new Date(Date.now() + PRIVACY_MAX_AGE * 1000).toISOString();
    await database.sql`
      INSERT INTO privacy_preferences (id, analytics, marketing, expires_at)
      VALUES (${id}, ${preferences.analytics}, ${preferences.marketing}, ${expiresAt}::timestamptz)
      ON CONFLICT (id) DO UPDATE SET analytics = excluded.analytics,
        marketing = excluded.marketing, expires_at = excluded.expires_at, updated_at = now()
    `;
  },
};

function preferenceId(request: Request): string | null {
  const value = request.headers.get("cookie")?.split(";")
    .map(part => part.trim()).find(part => part.startsWith(`${PRIVACY_COOKIE}=`))
    ?.slice(PRIVACY_COOKIE.length + 1);
  return value && /^[a-f0-9]{64}$/.test(value) ? value : null;
}

function json(body: unknown, status = 200, cookie?: string): Response {
  const headers = new Headers({ "Cache-Control": "private, no-store", "Vary": "Cookie", "X-Content-Type-Options": "nosniff" });
  if (cookie) headers.set("Set-Cookie", cookie);
  return Response.json(body, { status, headers });
}

export async function readPrivacyPreferences(request: Request, store = privacyStore): Promise<Response> {
  if (!sameOrigin(request)) return json({ error: "forbidden_origin" }, 403);
  const id = preferenceId(request);
  if (!id) return json({ preferences: null });
  try {
    return json({ preferences: await store.read(id) });
  } catch {
    return json({ error: "preferences_unavailable" }, 503, `${PRIVACY_COOKIE}=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax`);
  }
}

export async function savePrivacyPreferences(request: Request, store = privacyStore): Promise<Response> {
  let preferences: PrivacyPreferences | null;
  try {
    preferences = parsePrivacyPreferences(await readPayload(request));
  } catch (error) {
    const failure = payloadError(error);
    return json({ error: failure.reason }, failure.status);
  }
  if (!preferences) return json({ error: "invalid_preferences" }, 400);
  const id = preferenceId(request) ?? randomBytes(32).toString("hex");
  try {
    await store.save(id, preferences);
    const secure = new URL(request.url).protocol === "https:" ? "; Secure" : "";
    const cookie = `${PRIVACY_COOKIE}=${id}; Path=/; Max-Age=${PRIVACY_MAX_AGE}; HttpOnly; SameSite=Lax${secure}`;
    return json({ preferences }, 200, cookie);
  } catch {
    return json({ error: "preferences_unavailable" }, 503, `${PRIVACY_COOKIE}=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax`);
  }
}
