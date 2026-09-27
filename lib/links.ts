import { activityBookingUrl, cityBookingUrl } from "@/lib/booking";
import { STUDIO_LOCATIONS } from "@/lib/locations";
import { type City, type CityParam, type SectionConfig } from "@/lib/config";

// Export all cities for use in activity pages
export const cities: City[] = [
  {
    param: "chicago",
    label: "Chicago",
    bookingBase: cityBookingUrl("chicago"),
    address: STUDIO_LOCATIONS.chicago.address,
    locationName: "Color Cocktail Factory (Chicago)"
  },
  {
    param: "eugene",
    label: "Eugene",
    bookingBase: cityBookingUrl("eugene"),
    address: STUDIO_LOCATIONS.eugene.address,
    locationName: "Color Cocktail Factory (Eugene)"
  }
];

export function getCityByParam(param: string): City {
  const p = (param === "eugene" ? "eugene" : "chicago") as CityParam;

  if (p === "eugene") {
    return cities[1];
  }

  return cities[0];
}

export function buildBookingLink(city: City, section: SectionConfig) {
  if (section.booking?.customUrl) return section.booking.customUrl;
  if (section.id === "private") return "/private-events";
  return activityBookingUrl(city.param, section.slug);
}

export function buildHomeBookLink(city: City) {
  return city.bookingBase;
}

export function swapCityInPath(pathname: string, city: CityParam) {
  if (!pathname) return `/${city}`;
  if (pathname.startsWith("/gift-cards")) return pathname;

  const parts = pathname.split("/").filter(Boolean);
  if (parts[0] === "chicago" || parts[0] === "eugene") {
    parts[0] = city;
    return "/" + parts.join("/");
  }
  return `/${city}${pathname.startsWith("/") ? "" : "/"}${pathname}`;
}
