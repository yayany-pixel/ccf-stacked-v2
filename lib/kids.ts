import type { Metadata } from "next";
import type { CityParam } from "./config";
import { STUDIO_LOCATIONS } from "./locations";

export const KIDS_PHOTO = "/images/reusable/ccf-pottery-wheel-clay-vase-hands.webp";
export const KIDS_SCHEDULE = {
  chicago: { day: "Tuesdays", time: "4:30–6:00 PM", zone: "Central", neighborhood: "Pilsen" },
  eugene: { day: "Wednesdays", time: "3:30–5:00 PM", zone: "Pacific", neighborhood: "Eugene" },
} as const;
export const KIDS_FORM_FIELDS = ["form-name", "bot-field", "name", "email", "city", "interest", "ageRange", "details", "consent", "source", "campaign"] as const;
export const KIDS_PARTY_EXTRA_FIELDS = ["phone", "alternateDate", "preferredTime", "ageRange", "adultCount", "referral", "source", "campaign"] as const;
export function isKidsPath(path: string) {
  return path === "/kids" || /^\/(chicago|eugene)\/kids-(birthday-parties|pottery-classes)(\/|$)/.test(path);
}
export function kidsMetadata(city: CityParam, birthday: boolean): Metadata {
  const label = STUDIO_LOCATIONS[city].label;
  const title = birthday ? `Kids Pottery Birthday Parties in ${label}` : `Kids Pottery Classes in ${label}`;
  const description = birthday
    ? `Plan a kids pottery birthday in ${label}. Explore clay creatures and wheel parties, then request a date and a quote for your group.`
    : `Explore kids wheel throwing and creative clay classes in ${label}. See our proposed after-school schedule and sign up for class announcements.`;
  const url = `https://colorcocktailfactory.com/${city}/kids-${birthday ? "birthday-parties" : "pottery-classes"}`;
  return { title, description, alternates: { canonical: url }, openGraph: { title, description, url, type: "website", images: [{ url: KIDS_PHOTO, width: 1536, height: 1024, alt: "Hands working with clay in the Color Cocktail Factory studio" }] }, twitter: { card: "summary_large_image", title, description, images: [KIDS_PHOTO] } };
}
