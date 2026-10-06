import { ACTIVITY_MANIFEST } from "./homepage/manifest";

/** Exact booking IDs preserve the reviewed class and city assignments. */
export function getClassPhoto(appointmentTypeId: string | number) {
  return ACTIVITY_MANIFEST.find(activity =>
    String(activity.appointmentTypeId) === String(appointmentTypeId)
  )?.image ?? null;
}
