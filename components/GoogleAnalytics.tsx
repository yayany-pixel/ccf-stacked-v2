"use client";

import Script from "next/script";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, Suspense } from "react";
import { reportWebVitals } from "@/lib/analytics";

function GoogleAnalyticsInner() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  // Only use NEXT_PUBLIC_GA_ID_1 as specified
  const GA_ID = process.env.NEXT_PUBLIC_GA_ID_1;

  // If GA ID is not configured, don't render anything
  if (!GA_ID) {
    return null;
  }

  // Track route changes for App Router SPA navigation
  useEffect(() => {
    if (!GA_ID) return;

    const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '');
    
    // Fire page_view event on route change
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'page_view', {
        page_path: url,
        page_location: window.location.href,
        page_title: document.title
      });

      if (process.env.NODE_ENV === 'development') {
        console.log('[GA] Page view tracked:', url);
      }
    }
  }, [pathname, searchParams, GA_ID]);

  // Week 2: Report Web Vitals
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Dynamically import web-vitals only on client
    // Note: FID is deprecated in web-vitals v4, replaced by INP
    import('web-vitals').then(({ onCLS, onFCP, onLCP, onTTFB, onINP }) => {
      onCLS(reportWebVitals);
      onFCP(reportWebVitals);
      onLCP(reportWebVitals);
      onTTFB(reportWebVitals);
      onINP(reportWebVitals);
    }).catch((err) => {
      console.error('[Web Vitals] Failed to load:', err);
    });
  }, []);

  return (
    <>
      {/* Load gtag.js script from Google */}
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
      />
      
      {/* Initialize gtag and configure GA4 */}
      <Script
        id="google-analytics-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_ID}', {
              page_path: window.location.pathname + window.location.search
            });
            
            ${process.env.NODE_ENV === 'development' ? `
            console.log('[GA] Initialized with ID: ${GA_ID}');
            ` : ''}
          `,
        }}
      />
    </>
  );
}

export default function GoogleAnalytics() {
  return (
    <Suspense fallback={null}>
      <GoogleAnalyticsInner />
    </Suspense>
  );
}
