import { NextResponse } from "next/server";
import { getCatalog } from "@/lib/askccf/catalog";
import { catalogBookingUrl, cityBookingUrl } from "@/lib/booking";

export async function GET(_request: Request, { params }: { params: { city: string; activity: string } }) {
  const city = ["chicago", "eugene", "online"].includes(params.city) ? params.city : "chicago";
  let destination = cityBookingUrl(city);
  try {
    destination = catalogBookingUrl(await getCatalog(), city, params.activity);
  } catch {
    // Keep booking available in the correct city if the catalog API is temporarily down.
  }
  return NextResponse.redirect(destination, 302);
}
