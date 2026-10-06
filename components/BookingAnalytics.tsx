"use client";
import { trackMetaContact } from "@/lib/metaPixel";
import { useEffect } from "react";
import {
  currentCity,
  detectBookingProvider,
  trackBeginCheckout,
  trackEvent,
} from "@/lib/analytics";
/** Covers legacy public booking links; explicitly instrumented links opt out. */
export default function BookingAnalytics() {
  useEffect(() => {
    const click = (event: MouseEvent) => {
      const link = (event.target as Element)?.closest<HTMLAnchorElement>(
        "a[href]",
      );
      if (!link || link.dataset.analyticsBooking === "true") return;
      if (link.protocol === "mailto:" || link.protocol === "tel:") {
        trackMetaContact({
          contact_method: link.protocol === "tel:" ? "phone" : "email",
          city: currentCity(),
          placement: "contact_link",
        });
        return;
      }
      const destination = new URL(link.href);
      if (
        link.dataset.analyticsPrivateParty !== "true" &&
        destination.origin === location.origin &&
        (destination.pathname === "/private-events" ||
          destination.hash === "#private-party")
      ) {
        trackEvent("private_party_cta_click", {
          placement: location.pathname === "/" ? "homepage" : "page_link",
        });
        return;
      }
      const provider = detectBookingProvider(link.href);
      if (provider === "unknown") return;
      const url = new URL(link.href);
      trackBeginCheckout({
        city: link.dataset.city || currentCity(),
        class_name: link.dataset.className || "Workshop calendar",
        class_id: url.searchParams.get("appointmentType") || "calendar",
        link_url: link.href,
        booking_provider: provider,
        click_target: "booking_link",
      });
    };
    document.addEventListener("click", click);
    return () => document.removeEventListener("click", click);
  }, []);
  return null;
}
