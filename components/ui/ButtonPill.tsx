"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { trackRezClickBooking } from "@/lib/metaPixel";

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
  const base =
    "btn-interactive inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-white/20";

  const styles: Record<Variant, string> = {
    primary: "border-0 bg-gradient-to-r from-pink-500/80 via-purple-500/80 to-indigo-500/80 text-white shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50",
    secondary: "border border-white/15 bg-white/5 text-white/85 hover:bg-white/10",
    ghost: "border border-white/10 bg-transparent text-white/75 hover:bg-white/10",
    romanceCta: "font-serif px-8 py-3 text-base font-light tracking-wider border border-purple-300/30 bg-gradient-to-br from-purple-900/40 via-violet-800/50 to-purple-900/40 text-white shadow-lg shadow-purple-500/20 backdrop-blur-sm hover:shadow-xl hover:shadow-purple-400/30 hover:-translate-y-0.5 hover:border-purple-200/40 active:translate-y-0 transition-all duration-300 focus:ring-purple-300/40"
  };

  // Check if external link (starts with http)
  const isExternal = href.startsWith('http');
  
  // Check if this is a RezClick booking link
  const isRezClickBooking = href.includes('rezclick.com') && trackingData;

  // Handle click for tracking
  const handleClick = () => {
    if (isRezClickBooking && trackingData) {
      trackRezClickBooking(href, trackingData.activityName, trackingData.city);
    }
  };

  return (
    <Link 
      href={href} 
      className={cn(base, styles[variant], full ? "w-full" : "", className)}
      onClick={handleClick}
      {...(isExternal && { target: "_blank", rel: "noopener noreferrer" })}
    >
      {children}
    </Link>
  );
}
