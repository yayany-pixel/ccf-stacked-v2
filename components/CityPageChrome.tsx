"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

export default function CityPageChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  return /^\/(chicago|eugene)\/?$/.test(pathname ?? "") ? null : <>{children}</>;
}
