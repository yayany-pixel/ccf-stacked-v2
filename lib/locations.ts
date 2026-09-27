/** Studio addresses confirmed by the owner. Shared by pages and event data. */
export const STUDIO_LOCATIONS = {
  chicago: {
    label: "Chicago", streetAddress: "1142 W. 18th Street", addressLocality: "Chicago",
    addressRegion: "IL", postalCode: "60608", addressCountry: "US",
    address: "1142 W. 18th Street, Chicago, IL 60608", timeZone: "America/Chicago",
  },
  eugene: {
    label: "Eugene", streetAddress: "3295 Cross Street", addressLocality: "Eugene",
    addressRegion: "OR", postalCode: "97402", addressCountry: "US",
    address: "3295 Cross Street, Eugene, OR 97402", timeZone: "America/Los_Angeles",
  },
} as const;

export function eventTimeZone(city: string): string {
  return city.toLowerCase() === "eugene" ? STUDIO_LOCATIONS.eugene.timeZone : STUDIO_LOCATIONS.chicago.timeZone;
}
