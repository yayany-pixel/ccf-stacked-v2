import { getVerifiedPromotion, PROMOTION_END_ISO } from "@/lib/promotions";
import type { HomepageActivity } from "./types";

export function resolveSaleDeadline(
  activities: HomepageActivity[],
  now: number,
): number | null {
  const verified = activities.some(activity =>
    activity.offeringState === "active" &&
    getVerifiedPromotion(activity.appointmentTypeId, activity.currentPrice, now),
  );
  return verified ? Date.parse(PROMOTION_END_ISO) : null;
}

export function saleSecondsRemaining(deadline: number, now: number): number {
  return Math.max(0, Math.ceil((deadline - now) / 1000));
}

export type SaleTimeUnit = {
  label: string;
  value: string;
};

export function saleTimeUnits(seconds: number): SaleTimeUnit[] {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (days > 0) {
    return [
      { label: "DAYS", value: String(days).padStart(2, "0") },
      { label: "HOURS", value: String(hours).padStart(2, "0") },
      { label: "MINUTES", value: String(minutes).padStart(2, "0") },
      { label: "SECONDS", value: String(secs).padStart(2, "0") },
    ];
  }

  return [
    { label: "HOURS", value: String(hours).padStart(2, "0") },
    { label: "MINUTES", value: String(minutes).padStart(2, "0") },
    { label: "SECONDS", value: String(secs).padStart(2, "0") },
  ];
}

export function saleTimeParts(seconds: number, hourDigits = 2): string[] {
  return [
    String(Math.floor(seconds / 3600)).padStart(hourDigits, "0"),
    String(Math.floor(seconds / 60) % 60).padStart(2, "0"),
    String(seconds % 60).padStart(2, "0"),
  ];
}
