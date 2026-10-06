"use client";
import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  initializeMetaPixel,
  META_PIXEL_ID,
  metaConsent,
  trackMetaPageView,
} from "@/lib/metaPixel";
export default function MetaPixel() {
  const path = usePathname();
  const [load, setLoad] = useState(false);
  useEffect(() => {
    initializeMetaPixel();
    const sync = () => {
      setLoad(metaConsent() === "granted");
      trackMetaPageView();
    };
    sync();
    window.addEventListener("ccf-meta-consent", sync);
    return () => window.removeEventListener("ccf-meta-consent", sync);
  }, [path]);
  if (!load || !META_PIXEL_ID || !/^\d+$/.test(META_PIXEL_ID)) return null;
  return (
    <Script
      id="meta-pixel-library"
      src="https://connect.facebook.net/en_US/fbevents.js"
      strategy="afterInteractive"
      onReady={trackMetaPageView}
    />
  );
}
