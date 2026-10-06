"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { trackMetaViewContent } from "@/lib/metaPixel";
import { contentIdentity, classCategory } from "@/lib/analyticsIdentity";
import { currentCity } from "@/lib/analytics";
/** Server pages provide trusted catalog metadata, never user-entered text. */
export default function MetaActivityView({
  id,
  name,
  city,
  url,
  price,
}: {
  id: string;
  name: string;
  city?: string;
  url?: string;
  price?: number;
}) {
  const path = usePathname();
  useEffect(() => {
    const identity = contentIdentity(id, url);
    const send = () =>
      trackMetaViewContent({
        content_name: name,
        content_ids: [identity.id],
        content_type: identity.type,
        content_category: classCategory(name),
        value: price,
        currency: "USD",
        city: city || currentCity(),
        placement: "activity_page",
        appointment_type_id: identity.appointmentTypeId,
      });
    send();
    window.addEventListener("ccf-meta-consent", send);
    return () => window.removeEventListener("ccf-meta-consent", send);
  }, [path, id, name, city, url, price]);
  return null;
}
