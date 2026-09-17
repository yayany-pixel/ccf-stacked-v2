/**
 * Ask CCF — private-party inquiry submission.
 *
 * Fires only when the customer taps Send on the summary card. The inquiry is
 * saved durably first, then handed to the existing `private-party` Netlify
 * form so the studio's already-configured notifications fire. Receipt is
 * confirmed only when the notification hand-off actually succeeds.
 */
import { NextResponse } from "next/server";
import { aiConfig } from "@/lib/askccf/config";
import { clientIp, formOrigin, payloadError, readPayload } from "@/lib/askccf/security";
import { validDate } from "@/lib/askccf/schedule";
import {
  consumeRateLimit,
  hashId,
  markInquiryNotified,
  saveInquiry,
  type InquiryInput,
} from "@/lib/askccf/store";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const STAFF_EMAIL = "support@colorcocktailfactory.com";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;
const CONTROL_CHARS = /[\u0000-\u0008\u000b-\u001f\u007f]/g;

function field(value: unknown, max: number): string | null {
  if (typeof value !== "string") return null;
  const cleaned = value.replace(CONTROL_CHARS, " ").trim().slice(0, max);
  return cleaned.length > 0 ? cleaned : null;
}

/** Save, claim notification delivery, then confirm only a successful handoff. */
export async function POST(request: Request) {
  let payload: Record<string, unknown>;
  try {
    payload = await readPayload(request);
  } catch (error) {
    const { reason, status } = payloadError(error);
    return NextResponse.json({ status: "error", reason }, { status });
  }
  if (field(payload.website, 200)) return NextResponse.json({ status: "invalid" }, { status: 400 });
  const sessionId = typeof payload.sessionId === "string" ? payload.sessionId.slice(0, 64) : "";
  if (!/^[A-Za-z0-9_-]{8,64}$/.test(sessionId)) {
    return NextResponse.json({ status: "error", reason: "invalid_session" }, { status: 400 });
  }

  const name = field(payload.name, 120);
  const email = field(payload.email, 200);
  const city = field(payload.city, 40);
  const preferredDate = field(payload.preferredDate, 60);
  const groupSize = field(payload.groupSize, 40);
  const activity = field(payload.activity, 160);
  const phone = field(payload.phone, 40);
  const budget = field(payload.budget, 60);
  const notes = field(payload.notes, 800);

  const missing: string[] = [];
  if (!name) missing.push("name");
  if (!email || !EMAIL_RE.test(email)) missing.push("email");
  if (!city || !/^(chicago|eugene)$/i.test(city)) missing.push("city");
  if (!validDate(preferredDate)) missing.push("preferredDate");
  if (!groupSize || !/^\d{1,3}(?:\s*[-–]\s*\d{1,3})?$/.test(groupSize) || Number.parseInt(groupSize) < 1) missing.push("groupSize");
  if (!activity) missing.push("activity");
  if (missing.length > 0) {
    return NextResponse.json({ status: "invalid", missing }, { status: 400 });
  }

  // One customer session can only file a few inquiries per day.
  const day = new Date().toISOString().slice(0, 10);
  const limits = await Promise.all([
    consumeRateLimit(`inq:${hashId(sessionId)}:${day}`, aiConfig.inquiriesPerDay, 86_400_000),
    consumeRateLimit(`inq-email:${hashId(email!.toLowerCase())}:${day}`, 6, 86_400_000),
    consumeRateLimit(`inq-ip:${hashId(clientIp(request))}:${new Date().toISOString().slice(0, 13)}`, 10, 3_600_000),
  ]);
  if (limits.some((limit) => limit.degraded)) {
    return NextResponse.json({ status: "error", message: `The inquiry service is temporarily unavailable. Please email ${STAFF_EMAIL}.` }, { status: 503 });
  }
  if (limits.some((limit) => !limit.allowed)) {
    return NextResponse.json(
      {
        status: "rate_limited",
        message: `You've already sent a few inquiries today. Email ${STAFF_EMAIL} if you need to add anything.`,
      },
      { status: 429 },
    );
  }

  const normalisedCity = /eugene/i.test(city!) ? "Eugene" : "Chicago";
  const input: InquiryInput = {
    sessionId,
    name: name!,
    email: email!,
    phone,
    city: normalisedCity,
    preferredDate,
    groupSize,
    activity,
    budget,
    notes,
  };

  const saved = await saveInquiry(input);
  if (saved.outcome === "duplicate") {
    return NextResponse.json({
      status: "duplicate",
      message: "That inquiry is already with the team — no need to send it twice. They'll be in touch by email.",
    });
  }
  if (saved.outcome === "busy") {
    return NextResponse.json({ status: "pending", message: "Your inquiry is still being delivered. Please wait a moment before trying again." }, { status: 409 });
  }
  if (saved.outcome === "unavailable") {
    return NextResponse.json({ status: "error", message: `I couldn't safely save your inquiry. Please try again or email ${STAFF_EMAIL}.` }, { status: 503 });
  }

  // Hand off to the existing private-party form. The registered form has no
  // phone field, so phone and the assistant's notes are folded into details.
  const detailLines = [
    phone ? `Phone: ${phone}` : null,
    `Submitted via the Ask CCF assistant on ${day}.`,
    notes ? `Notes: ${notes}` : null,
  ].filter(Boolean);

  const formBody = new URLSearchParams({
    "form-name": "private-party",
    "bot-field": "",
    name: name!,
    email: email!,
    city: normalisedCity,
    date: preferredDate!,
    groupSize: groupSize!,
    occasion: activity!,
    budget: budget ?? "",
    preferredProject: activity!,
    details: detailLines.join("\n"),
  });

  let notified = false;
  let notifyError: string | null = null;
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10_000);
    try {
      const response = await fetch(`${formOrigin(request)}/netlify-forms.html`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formBody.toString(),
        signal: controller.signal,
      });
      notified = response.ok;
      if (!response.ok) notifyError = `forms_http_${response.status}`;
    } finally {
      clearTimeout(timeout);
    }
  } catch (error) {
    notifyError = error instanceof Error ? error.message.slice(0, 200) : "forms_unreachable";
  }

  if (saved.outcome === "saved") {
    await markInquiryNotified(saved.id, notified ? "notified" : "notify_failed", notifyError ?? undefined);
  }

  if (!notified) {
    console.error("[AskCCF] inquiry notification failed:", notifyError);
    const persisted = saved.outcome === "saved";
    return NextResponse.json(
      {
        status: "notify_failed",
        persisted,
        message: persisted
          ? `I saved your details, but the notification to the team didn't go through. Please email ${STAFF_EMAIL} so nothing gets missed — sorry about that.`
          : `I couldn't get that through to the team. Please email ${STAFF_EMAIL} with your date and group size and they'll take it from there.`,
      },
      { status: 502 },
    );
  }

  return NextResponse.json({
    status: "received",
    persisted: saved.outcome === "saved",
    message:
      "Sent — the team has your details and will follow up by email with dates, project ideas and a quote.",
  });
}
