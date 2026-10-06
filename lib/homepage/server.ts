import { getCatalog, getPublicClassSchedule } from "@/lib/askccf/catalog";
import { AVAILABILITY_WINDOW_DAYS, buildHomepageData } from "./data";
import type { HomepageData } from "./types";

export async function getHomepageData(): Promise<HomepageData> {
  const [catalog, schedule] = await Promise.allSettled([
    getCatalog(),
    getPublicClassSchedule(AVAILABILITY_WINDOW_DAYS),
  ]);
  return buildHomepageData(
    catalog.status === "fulfilled" ? catalog.value : null,
    schedule.status === "fulfilled" ? schedule.value : null,
  );
}
