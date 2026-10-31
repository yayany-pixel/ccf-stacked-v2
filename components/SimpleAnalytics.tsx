"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { currentPrivacyPreferences, PRIVACY_EVENT } from "@/lib/privacy";
import { flushSimpleEvents, resetSimpleAnalytics, simpleAnalyticsAllowed, trackSimplePage } from "@/lib/simpleAnalytics";
import { startBehaviorAnalytics } from "@/lib/behaviorAnalytics";

export default function SimpleAnalytics() {
  const pathname = usePathname();
  const [load, setLoad] = useState(false);

  useEffect(() => {
    const sync = () => {
      if (!currentPrivacyPreferences().analytics) {
        resetSimpleAnalytics();
        return;
      }
      if (!simpleAnalyticsAllowed()) { resetSimpleAnalytics(); return; }
      setLoad(true);
      trackSimplePage();
    };
    sync();
    window.addEventListener(PRIVACY_EVENT, sync);
    return () => window.removeEventListener(PRIVACY_EVENT, sync);
  }, [pathname]);

  useEffect(() => startBehaviorAnalytics(), [pathname]);

  // Manual page views let consent revocation stop collection immediately,
  // including client-side navigation after the script has already loaded.
  // Disable background metrics so they cannot send after consent is withdrawn.
  return load ? (
    <Script
      id="simple-analytics"
      src="https://scripts.simpleanalyticscdn.com/latest.js"
      strategy="afterInteractive"
      data-hostname="colorcocktailfactory.com"
      data-auto-collect="false"
      data-ignore-metrics="timeonpage,scrolled"
      onReady={() => { trackSimplePage(); flushSimpleEvents(); }}
    />
  ) : null;
}
