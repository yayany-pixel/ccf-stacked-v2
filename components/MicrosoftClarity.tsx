"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { createClarityController } from "@/lib/clarity";
import { PRIVACY_EVENT } from "@/lib/privacy";

const syncClarity = createClarityController();

export default function MicrosoftClarity() {
  const pathname = usePathname();
  useEffect(() => {
    syncClarity();
    window.addEventListener(PRIVACY_EVENT, syncClarity);
    return () => window.removeEventListener(PRIVACY_EVENT, syncClarity);
  }, [pathname]);
  return null;
}
