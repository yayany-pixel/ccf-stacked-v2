import { NextResponse } from "next/server";
import { getCatalog } from "@/lib/askccf/catalog";
import { catalogBookingUrl, cityBookingUrl } from "@/lib/booking";
import { getBookingDestinations } from "@/lib/activityRegistry";
import { bookingRedirectUrl } from "@/lib/bookingReference.server";
import { privacyStore } from "@/lib/privacy.server";

async function redirectBooking(request: Request, destination: string) {
  const href = await bookingRedirectUrl(request, destination,
    process.env.ACUITY_API_KEY, process.env.ACUITY_GA4_REFERENCE_FIELD_ID, id => privacyStore.read(id));
  return NextResponse.redirect(href, { status: 302,
    headers: { "Cache-Control": "private, no-store", "Referrer-Policy": "no-referrer" } });
}

export async function GET(request: Request, { params }: { params: { city: string; activity: string } }) {
  const city = ["chicago", "eugene", "online"].includes(params.city)
    ? (params.city as "chicago" | "eugene" | "online")
    : "chicago";

  // Priority: Check centralized activity registry for exact verified destination
  const registryDestinations = getBookingDestinations(params.activity);
  if (registryDestinations && registryDestinations[city]?.bookingUrl) {
    return redirectBooking(request, registryDestinations[city]!.bookingUrl);
  }

  let destination = cityBookingUrl(city);
  try {
    destination = catalogBookingUrl(await getCatalog(), city, params.activity);
  } catch {
    // Keep booking available in the correct city if the catalog API is temporarily down.
  }
  return redirectBooking(request, destination);
}

