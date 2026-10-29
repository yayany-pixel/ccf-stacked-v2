/** SERVER ONLY: authenticated encryption keeps GA identifiers out of booking URLs. */
import { createCipheriv, createDecipheriv, createHmac, randomBytes } from "node:crypto";

export const REFERENCE_MAX_AGE = 7 * 86400;
const AAD = Buffer.from("ccf:acuity:ga4-reference:v1");
export type BookingReference = {
  clientId: string;
  sessionId: string;
  preferenceId: string;
  marketing: boolean;
  issuedAt: number;
};
export type ReferencePreferences = { analytics: boolean; marketing: boolean };

export function validGoogleIds(clientId: unknown, sessionId: unknown, now: number): boolean {
  return typeof clientId === "string" && /^\d{1,20}\.\d{1,20}$/.test(clientId) &&
    typeof sessionId === "string" && /^\d{1,13}$/.test(sessionId) &&
    Number(sessionId) > 0 && Number(sessionId) <= now + 60;
}

function key(secret: string) {
  return createHmac("sha256", secret).update(AAD).digest();
}

export function sealBookingReference(reference: BookingReference, secret: string): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key(secret), iv);
  cipher.setAAD(AAD);
  const plain = JSON.stringify([reference.clientId, reference.sessionId, reference.preferenceId,
    reference.marketing, reference.issuedAt]);
  const encrypted = Buffer.concat([cipher.update(plain, "utf8"), cipher.final()]);
  return "ccf1." + Buffer.concat([iv, cipher.getAuthTag(), encrypted]).toString("base64url");
}

export function openBookingReference(token: unknown, secret: string, now: number): BookingReference | null {
  if (typeof token !== "string" || !/^ccf1\.[A-Za-z0-9_-]{80,700}$/.test(token)) return null;
  try {
    const bytes = Buffer.from(token.slice(5), "base64url");
    const cipher = createDecipheriv("aes-256-gcm", key(secret), bytes.subarray(0, 12));
    cipher.setAAD(AAD);
    cipher.setAuthTag(bytes.subarray(12, 28));
    const data: unknown = JSON.parse(Buffer.concat([
      cipher.update(bytes.subarray(28)), cipher.final(),
    ]).toString("utf8"));
    if (!Array.isArray(data) || data.length !== 5) return null;
    const [clientId, sessionId, preferenceId, marketing, issuedAt] = data;
    if (!validGoogleIds(clientId, sessionId, now) || typeof preferenceId !== "string" ||
      !/^[a-f0-9]{64}$/.test(preferenceId) || typeof marketing !== "boolean" ||
      !Number.isInteger(issuedAt) || issuedAt > now + 60 || now - issuedAt > REFERENCE_MAX_AGE) return null;
    return { clientId, sessionId, preferenceId, marketing, issuedAt };
  } catch { return null; }
}

export function referencePreferenceId(request: Request): string | null {
  const value = request.headers.get("cookie")?.split(";").map(part => part.trim())
    .find(part => part.startsWith("ccf_privacy="))?.slice("ccf_privacy=".length);
  return value && /^[a-f0-9]{64}$/.test(value) ? value : null;
}

export async function resolveBookingReference(
  token: unknown, secret: string, now: number,
  readPreferences: (id: string) => Promise<ReferencePreferences | null>,
) {
  const reference = openBookingReference(token, secret, now);
  if (!reference) return null;
  try {
    const preferences = await readPreferences(reference.preferenceId);
    if (!preferences?.analytics) return null;
    return { ...reference, marketing: reference.marketing && preferences.marketing };
  } catch { return null; } // A missing/revoked preference never creates an attribution match.
}

export function appointmentReference(appointment: unknown, fieldId: string | undefined): unknown {
  if (!fieldId || !/^\d+$/.test(fieldId) || !appointment || typeof appointment !== "object") return null;
  const forms = (appointment as { forms?: unknown }).forms;
  if (!Array.isArray(forms)) return null;
  const values = forms.flatMap(form => form && Array.isArray(form.values) ? form.values : [])
    .filter(value => value && String(value.fieldID) === fieldId);
  return values.length === 1 ? values[0].value : null;
}

export function purchaseReferenceParams(reference: BookingReference | null, paidAt: number, now: number) {
  // Preserve the original session only for prompt checkout payments. Older payments
  // still use the real client ID for Ads attribution, without inventing a session.
  return reference && paidAt >= reference.issuedAt - 60 && paidAt - reference.issuedAt <= 30 * 60 &&
    paidAt >= Number(reference.sessionId) && now - Number(reference.sessionId) <= 24 * 3600
    ? { session_id: Number(reference.sessionId) } : {};
}

export async function bookingRedirectUrl(
  request: Request, destination: string, secret: string | undefined, fieldId: string | undefined,
  readPreferences: (id: string) => Promise<ReferencePreferences | null>,
): Promise<string> {
  if (!secret || !fieldId || !/^\d+$/.test(fieldId)) return destination;
  const token = new URL(request.url).searchParams.get("ccf_booking_ref");
  const reference = await resolveBookingReference(token, secret, Math.floor(Date.now() / 1000), readPreferences);
  if (!reference) return destination;
  try {
    const url = new URL(destination);
    if (url.protocol !== "https:" || url.hostname !== "colorcocktailfactory.as.me") return destination;
    url.searchParams.set(`field:${fieldId}`, token!);
    return url.toString();
  } catch { return destination; }
}
