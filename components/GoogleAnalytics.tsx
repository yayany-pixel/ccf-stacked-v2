"use client";

import Script from "next/script";

export default function GoogleAnalytics() {
  // Get all GA IDs from environment variables
  const GA_ID_1 = process.env.NEXT_PUBLIC_GA_ID_1;
  const GA_ID_2 = process.env.NEXT_PUBLIC_GA_ID_2;
  const GOOGLE_TAG_ID = process.env.NEXT_PUBLIC_GOOGLE_TAG_ID;
  const GOOGLE_ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID;

  // Collect all valid IDs
  const measurementIds = [GA_ID_1, GA_ID_2, GOOGLE_TAG_ID, GOOGLE_ADS_ID].filter(
    (id): id is string => typeof id === "string" && id.length > 0
  );

  // If no IDs are configured, don't render anything
  if (measurementIds.length === 0) {
    return null;
  }

  // Use the first ID as the primary one for loading gtag.js
  const primaryId = measurementIds[0];

  return (
    <>
      {/* Load gtag.js script from Google */}
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${primaryId}`}
      />
      
      {/* Initialize gtag and configure all measurement IDs */}
      <Script
        id="google-analytics-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            
            ${measurementIds.map((id) => `gtag('config', '${id}');`).join('\n            ')}
            
            ${process.env.NODE_ENV === 'development' ? `
            // Debug logging in development only
            console.log('[GA] Initialized with IDs:', ${JSON.stringify(measurementIds)});
            ` : ''}
          `,
        }}
      />
    </>
  );
}
