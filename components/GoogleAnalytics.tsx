"use client";
import Script from "next/script";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { reportWebVitals, trackPageView, safeUrl } from "@/lib/analytics";
import { currentPrivacyPreferences, googleConsentState, PRIVACY_EVENT } from "@/lib/privacy";
let initialized = false;
let vitals = false;
let analyticsConfigured = false;
let adsConfigured = false;
function GoogleAnalyticsInner() {
  const path = usePathname();
  const search = useSearchParams();
  const ga = process.env.NEXT_PUBLIC_GA_ID_1;
  const ads = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID;
  const [load, setLoad] = useState(false);
  const id = ga || ads;
  useEffect(() => {
    if (!id) return;
    window.dataLayer ||= [];
    window.gtag ||= function () {
      window.dataLayer!.push(arguments);
    };
    if (!initialized) {
      initialized = true;
      window.gtag("consent", "default", {
        analytics_storage: "denied",
        ad_storage: "denied",
        ad_user_data: "denied",
        ad_personalization: "denied",
        wait_for_update: 500,
      });
      window.gtag("js", new Date());
    }
    const sync = () => {
      const preferences = currentPrivacyPreferences();
      window.gtag!("consent", "update", googleConsentState(preferences));
      setLoad(Boolean((ga && preferences.analytics) || (ads && preferences.marketing)));
      if (ga && preferences.analytics && !analyticsConfigured) {
        analyticsConfigured = true;
        window.gtag!("config", ga, {
          send_page_view: false,
          page_location: safeUrl(window.location.href, true),
          page_referrer: safeUrl(document.referrer),
          allow_google_signals: false,
        });
      }
      if (ads && preferences.marketing && !adsConfigured) {
        adsConfigured = true;
        window.gtag!("config", ads, { send_page_view: false });
      }
      if (ga && preferences.analytics) trackPageView(window.location.href);
      if (ga && preferences.analytics && !vitals) {
        vitals = true;
        import("web-vitals")
          .then((metrics) => {
            metrics.onCLS(reportWebVitals);
            metrics.onLCP(reportWebVitals);
            metrics.onINP(reportWebVitals);
            metrics.onFCP(reportWebVitals);
            metrics.onTTFB(reportWebVitals);
          })
          .catch(() => {});
      }
    };
    sync();
    window.addEventListener(PRIVACY_EVENT, sync);
    return () => window.removeEventListener(PRIVACY_EVENT, sync);
  }, [id, ga, ads, path, search]);
  return id && load ? (
    <Script
      id="google-tag"
      src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`}
      strategy="afterInteractive"
    />
  ) : null;
}
export default function GoogleAnalytics() {
  return (
    <Suspense fallback={null}>
      <GoogleAnalyticsInner />
    </Suspense>
  );
}
