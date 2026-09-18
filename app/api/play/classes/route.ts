import { NextResponse } from "next/server";
import { searchClasses, toCardShape } from "@/lib/askccf/catalog";
import { clientIp, payloadError, readPayload } from "@/lib/askccf/security";
import { consumeRateLimit, hashId } from "@/lib/askccf/store";
import { groupPricing, parsePlayFilters } from "@/lib/play";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const headers = { "Cache-Control": "no-store" };

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try { body = await readPayload(request); }
  catch (error) { const { status } = payloadError(error); return NextResponse.json({ error: "We couldn’t read that request. Please refresh and try again." }, { status, headers }); }
  let filters;
  try { filters = parsePlayFilters(body); }
  catch (error) { return NextResponse.json({ error: (error as Error).message }, { status: 400, headers }); }
  const rate = await consumeRateLimit(`play:${hashId(clientIp(request))}`, 30, 60_000);
  if (!rate.allowed) return NextResponse.json({ error: "Give the wheel a moment to rest. Please try again in a minute." }, { status: 429, headers: { ...headers, "Retry-After": String(rate.retryAfterSeconds) } });
  try {
    const classes = await searchClasses({
      location: filters.location, groupSize: filters.groupSize, limit: 6,
      dateFrom: filters.dateFrom, dateTo: filters.dateTo,
      requiredActivity: filters.activity === "any" ? undefined : filters.activity,
      maxPricePerPerson: filters.budget ?? undefined,
      classFilter: (item) => {
        if (filters.budget == null) return true;
        const price = groupPricing(item.pricing.price, item.pricing.covers, filters.groupSize);
        return price !== null && price.perPerson <= filters.budget;
      },
    });
    const results = classes.map((item) => {
      const card = toCardShape(item);
      return { ...card, groupPrice: groupPricing(card.priceUsd, card.ticketCovers, filters.groupSize) };
    }).filter((item) => filters.budget == null || (item.groupPrice !== null && item.groupPrice.perPerson <= filters.budget));
    return NextResponse.json({ classes: results, checkedAt: new Date().toISOString() }, { headers });
  } catch {
    return NextResponse.json({ error: "The class schedule is taking a little breather. Try again, or browse the booking calendar below." }, { status: 503, headers });
  }
}
