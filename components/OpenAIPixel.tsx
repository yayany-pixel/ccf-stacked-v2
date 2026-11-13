"use client";
import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { PRIVACY_EVENT } from "@/lib/privacy";
import { OPENAI_READY, syncOpenAIConsent, trackOpenAIPage } from "@/lib/openaiPixel";

export default function OpenAIPixel() {
  const path = usePathname();
  const [load, setLoad] = useState(false);
  const viewed = useRef<string | null>(null);
  useEffect(() => {
    const sync = () => {
      const allowed = syncOpenAIConsent();
      setLoad(allowed);
      if (!allowed) { viewed.current = null; return; }
      if (viewed.current !== path) { trackOpenAIPage(); viewed.current = path; }
    };
    sync();
    window.addEventListener(PRIVACY_EVENT, sync);
    return () => window.removeEventListener(PRIVACY_EVENT, sync);
  }, [path]);
  return load ? <Script id="openai-measurement-pixel"
    src="https://bzrcdn.openai.com/sdk/oaiq.min.js" strategy="afterInteractive"
    onReady={() => { window.dispatchEvent(new Event(OPENAI_READY)); }} /> : null;
}
