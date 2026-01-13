"use client";

import { type ReactNode } from 'react';
import Link from 'next/link';
import { trackBeginCheckout } from '@/lib/analytics';

export interface BookingLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  city: string;
  classNameText: string; // Display name of the class
  classId: string; // slug
  classCategory?: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  target?: string;
  rel?: string;
  ariaLabel?: string;
}

/**
 * BookingLink - Tracks all booking clicks as GA4 begin_checkout events
 * 
 * Usage:
 * <BookingLink
 *   href="https://rezclick.com/..."
 *   city="Chicago"
 *   classNameText="Date Night Pottery"
 *   classId="date-night-wheel"
 *   className="btn btn-primary"
 * >
 *   Book Now
 * </BookingLink>
 */
export default function BookingLink({
  href,
  children,
  className,
  city,
  classNameText,
  classId,
  classCategory,
  onClick,
  target,
  rel,
  ariaLabel,
}: BookingLinkProps) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Track begin_checkout event
    trackBeginCheckout({
      city,
      class_name: classNameText,
      class_id: classId,
      class_category: classCategory,
      link_url: href,
    });

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
      href={href}
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
