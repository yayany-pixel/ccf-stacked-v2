import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { analyticsEvents } from "@/db/schema";
import { privacyStore } from "@/lib/privacy.server";

export async function POST(req: Request) {
  try {
    // Determine cookie-based privacy from request
    const cookie = req.headers.get("cookie")?.split(";")
      .map(part => part.trim()).find(part => part.startsWith("ccf_privacy="))
      ?.slice(12);

    let allowAnalytics = false;
    if (cookie && /^[a-f0-9]{64}$/.test(cookie)) {
      const prefs = await privacyStore.read(cookie);
      if (prefs && prefs.analytics) allowAnalytics = true;
    }

    if (!allowAnalytics) {
      return NextResponse.json({ success: true, reason: "opt_out" }, { status: 200 });
    }

    const body = await req.json();
    const { eventName, city, className, classId, placement, clickTarget, ...rest } = body;

    if (!eventName) {
      return NextResponse.json({ error: "Missing eventName" }, { status: 400 });
    }

    const db = getDb();
    await db.insert(analyticsEvents).values({
      eventName: String(eventName).substring(0, 100),
      city: city ? String(city).substring(0, 50) : "unknown",
      className: className ? String(className).substring(0, 200) : null,
      classId: classId ? String(classId).substring(0, 100) : null,
      placement: placement ? String(placement).substring(0, 100) : null,
      clickTarget: clickTarget ? String(clickTarget).substring(0, 100) : null,
      metadata: Object.keys(rest).length > 0 ? JSON.stringify(rest) : null,
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error("[Analytics Event API] Error saving event:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
