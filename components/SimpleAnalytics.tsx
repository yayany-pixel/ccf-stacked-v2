"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { currentPrivacyPreferences, PRIVACY_EVENT } from "@/lib/privacy";

declare global {
  interface Window {
    sa_pageview?: (path?: string) => void;
  }
}

export default function SimpleAnalytics() {
  const pathname = usePathname();
  const [load, setLoad] = useState(false);
  const lastPath = useRef<string | null>(null);

  const track = useCallback(() => {
    const production = /^(www\.)?colorcocktailfactory\.com$/.test(window.location.hostname);
    if (!production || !currentPrivacyPreferences().analytics) return;
    const path = window.location.pathname;
    if (!window.sa_pageview || lastPath.current === path) return;
    window.sa_pageview(path);
    lastPath.current = path;
  }, []);

  useEffect(() => {
    const sync = () => {
      if (!currentPrivacyPreferences().analytics) {
        lastPath.current = null;
        return;
      }
      if (!/^(www\.)?colorcocktailfactory\.com$/.test(window.location.hostname)) return;
      setLoad(true);
      track();
    };
    sync();
    window.addEventListener(PRIVACY_EVENT, sync);
    return () => window.removeEventListener(PRIVACY_EVENT, sync);
  }, [pathname, track]);

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
      onReady={track}
    />
  ) : null;
}
