"use client";
import Script from "next/script";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import { reportWebVitals, trackPageView, safeUrl } from "@/lib/analytics";
let initialized = false;
let vitals = false;
function GoogleAnalyticsInner() {
  const path = usePathname();
  const search = useSearchParams();
  const ga = process.env.NEXT_PUBLIC_GA_ID_1;
  const ads = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID;
  const id = ga || ads;
  useEffect(() => {
    if (!id) return;
    window.dataLayer ||= [];
    window.gtag ||= function () {
      window.dataLayer!.push(arguments);
    };
    if (!initialized) {
      initialized = true;
      // Fail closed until the site's consent manager explicitly updates these signals.
      window.gtag("consent", "default", {
        analytics_storage: "denied",
        ad_storage: "denied",
        ad_user_data: "denied",
        ad_personalization: "denied",
        wait_for_update: 500,
      });
      window.gtag("js", new Date());
      if (ga)
        window.gtag("config", ga, {
          send_page_view: false,
          page_location: safeUrl(window.location.href, true),
          page_referrer: safeUrl(document.referrer),
          allow_google_signals: false,
        });
      if (ads) window.gtag("config", ads, { send_page_view: false });
    }
    if (ga) trackPageView(window.location.href);
    if (ga && !vitals) {
      vitals = true;
      import("web-vitals")
        .then((v) => {
          v.onCLS(reportWebVitals);
          v.onLCP(reportWebVitals);
          v.onINP(reportWebVitals);
          v.onFCP(reportWebVitals);
          v.onTTFB(reportWebVitals);
        })
        .catch(() => {});
    }
  }, [id, ga, ads, path, search]);
  return id ? (
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
