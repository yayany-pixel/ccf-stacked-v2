"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { bookingReferenceHref, referenceRevision, subscribeBookingReference } from "@/lib/bookingReference";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "romanceCta";

export default function ButtonPill({
  href,
  children,
  variant = "secondary",
  className,
  full,
  trackingData
}: {
  href: string;
  children: React.ReactNode;
  variant?: Variant;
  className?: string;
  full?: boolean;
  trackingData?: {
    activityName: string;
    city: string;
  };
}) {
  useSyncExternalStore(subscribeBookingReference, referenceRevision, () => 0);
  const referencedHref = bookingReferenceHref(href);
  const base =
    "btn-interactive inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-white/20";

  const styles: Record<Variant, string> = {
    primary: "border-0 bg-gradient-to-r from-pink-500/80 via-purple-500/80 to-indigo-500/80 text-primary shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50",
    secondary: "border border-white/15 bg-surface-secondary text-primary/85 hover:bg-surface-secondary",
    ghost: "border border-border bg-transparent text-primary/75 hover:bg-surface-secondary",
    romanceCta: "font-serif px-8 py-3 text-base font-light tracking-wider border border-purple-300/30 bg-gradient-to-br from-purple-900/40 via-violet-800/50 to-purple-900/40 text-primary shadow-lg shadow-purple-500/20 backdrop-blur-sm hover:shadow-xl hover:shadow-purple-400/30 hover:-translate-y-0.5 hover:border-purple-200/40 active:translate-y-0 transition-all duration-300 focus:ring-purple-300/40"
  };

  // Check if external link (starts with http)
  const isExternal = href.startsWith('http');
  

  return (
    <Link 
      href={referencedHref} 
      className={cn(base, styles[variant], full ? "w-full" : "", className)}
      data-class-name={trackingData?.activityName}
      data-city={trackingData?.city}
      {...(isExternal && { target: "_blank", rel: "noopener noreferrer" })}
    >
      {children}
    </Link>
  );
}

