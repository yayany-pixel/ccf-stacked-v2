import { NextResponse } from "next/server";
import { getCatalog } from "@/lib/askccf/catalog";
import { catalogBookingUrl, cityBookingUrl } from "@/lib/booking";
import { getBookingDestinations } from "@/lib/activityRegistry";

export async function GET(_request: Request, { params }: { params: { city: string; activity: string } }) {
  const city = ["chicago", "eugene", "online"].includes(params.city)
    ? (params.city as "chicago" | "eugene" | "online")
    : "chicago";

  // Priority: Check centralized activity registry for exact verified destination
  const registryDestinations = getBookingDestinations(params.activity);
  if (registryDestinations && registryDestinations[city]?.bookingUrl) {
    return NextResponse.redirect(registryDestinations[city]!.bookingUrl, 302);
  }

  let destination = cityBookingUrl(city);
  try {
    destination = catalogBookingUrl(await getCatalog(), city, params.activity);
  } catch {
    // Keep booking available in the correct city if the catalog API is temporarily down.
  }
  return NextResponse.redirect(destination, 302);
}
