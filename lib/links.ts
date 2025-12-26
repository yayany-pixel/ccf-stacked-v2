import { type City, type CityParam, type SectionConfig } from "@/lib/config";

// Export all cities for use in activity pages
export const cities: City[] = [
  {
    param: "chicago",
    label: "Chicago",
    rezclickBase: "https://www.rezclick.com/colorcocktailfactory/index.php?page=calendar&term=",
    address: "1142 W. 18th Street, Chicago, IL",
    locationName: "Color Cocktail Factory (Chicago)"
  },
  {
    param: "eugene",
    label: "Eugene",
    rezclickBase: "https://colorcocktailfactoryoregon.rezclick.com/index.php?page=calendar&term=",
    address: "Eugene, OR",
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
  const term = section.booking?.term ?? "";
  return `${city.rezclickBase}${term}`;
}

export function buildHomeBookLink(city: City) {
  return city.rezclickBase;
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
