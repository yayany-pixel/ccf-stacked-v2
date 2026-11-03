"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { capturePartyAttribution } from "@/lib/partyFormAttribution";

export default function PartyAttributionCapture() {
  const pathname = usePathname();
  useEffect(() => { capturePartyAttribution(); }, [pathname]);
  return null;
}
