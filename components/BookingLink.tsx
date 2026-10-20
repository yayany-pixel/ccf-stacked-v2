"use client";

import { type ReactNode } from 'react';
import Link from 'next/link';
import { trackBeginCheckout } from '@/lib/analytics';
import { useCTATracking } from '@/lib/analyticsHooks';

export interface BookingLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  city: string;
  classNameText: string; // Display name of the class
  classId: string; // slug
  classCategory?: string;
  appointmentTypeId?: string;
  cardPosition?: number;
  displayedPrice?: number;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  target?: string;
  rel?: string;
  ariaLabel?: string;
  /** Week 2: CTA location context (e.g., "Hero", "Date Night Section") */
  ctaLocation?: string;
  /** Week 2: CTA type (default: "primary") */
  ctaType?: 'primary' | 'secondary' | 'text-link';
}

/**
 * BookingLink - Tracks all booking clicks as GA4 begin_checkout events
 * 
 * Week 2: Enhanced with CTA taxonomy (location, text, type)
 * 
 * Usage:
 * <BookingLink
 *   href="https://rezclick.com/..."
 *   city="Chicago"
 *   classNameText="Date Night Pottery"
 *   classId="date-night-wheel"
 *   ctaLocation="Hero"
 *   ctaType="primary"
 *   className="btn btn-primary"
 * >
 *   Book Now
 * </BookingLink>
 */
function getAttributedHref(rawHref: string): string {
  if (typeof window === "undefined" || !rawHref.startsWith("http")) return rawHref;
  try {
    const url = new URL(rawHref);
    if (!url.hostname.includes("as.me") && !url.hostname.includes("acuityscheduling.com")) {
      return rawHref;
    }
    const currentParams = new URLSearchParams(window.location.search);
    const trackingKeys = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "fbclid"];
    for (const key of trackingKeys) {
      const val = currentParams.get(key);
      if (val && !url.searchParams.has(key) && !/@|%40/i.test(val)) {
        url.searchParams.set(key, val.slice(0, 150));
      }
    }
    return url.toString();
  } catch {
    return rawHref;
  }
}

export default function BookingLink({
  href,
  children,
  className,
  city,
  classNameText,
  classId,
  classCategory,
  appointmentTypeId,
  cardPosition,
  displayedPrice,
  onClick,
  target,
  rel,
  ariaLabel,
  ctaLocation,
  ctaType = 'primary',
}: BookingLinkProps) {
  const trackCTA = useCTATracking();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const destinationUrl = getAttributedHref(href);

    // Track begin_checkout event (existing)
    trackBeginCheckout({
      city,
      class_name: classNameText,
      class_id: classId,
      class_category: classCategory,
      appointment_type_id: appointmentTypeId,
      card_position: cardPosition,
      displayed_price: displayedPrice,
      link_url: destinationUrl,
      placement: ctaLocation || "booking_cta",
    });

    // Week 2: Track CTA click with enhanced taxonomy
    if (ctaLocation) {
      trackCTA({
        location: ctaLocation,
        text: typeof children === 'string' ? children : 'Book Now',
        type: ctaType,
      });
    }

    // Update target href on click if attributed parameters were added
    if (destinationUrl !== href && !e.defaultPrevented) {
      (e.currentTarget as HTMLAnchorElement).href = destinationUrl;
    }

    // Call optional onClick handler
    if (onClick) {
      onClick(e);
    }
  };

  // Auto-detect external links
  const isExternal = href.startsWith('http');
  const linkTarget = target || (isExternal ? '_blank' : undefined);
  const linkRel = rel || (isExternal ? 'noopener noreferrer' : undefined);

  return (
    <Link
      href={href} data-analytics-booking="true"
      className={className}
      onClick={handleClick}
      target={linkTarget}
      rel={linkRel}
      aria-label={ariaLabel}
    >
      {children}
    </Link>
  );
}
