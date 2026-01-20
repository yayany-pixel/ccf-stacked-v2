"use client";

import { useEffect, useState } from "react";

/**
 * WEEK 2: CRO IMPROVEMENTS
 * 
 * UrgencyMessage and SocialProof components
 * Feature-flagged by environment variables (default OFF)
 * All messaging must be honest and transparent
 */

interface UrgencyMessageProps {
  /** Optional custom message (default: "Limited spots available") */
  message?: string;
  /** Optional className for styling */
  className?: string;
}

/**
 * Urgency messaging component
 * Controlled by NEXT_PUBLIC_CRO_URGENCY (1 = enabled, 0 = disabled)
 */
export function UrgencyMessage({ message = "Limited spots available", className = "" }: UrgencyMessageProps) {
  const [isEnabled, setIsEnabled] = useState(false);

  useEffect(() => {
    // Check feature flag (default OFF)
    const flag = process.env.NEXT_PUBLIC_CRO_URGENCY === '1';
    setIsEnabled(flag);
  }, []);

  // Don't render if disabled
  if (!isEnabled) return null;

  return (
    <div 
      className={`inline-flex items-center gap-2 rounded-full bg-orange-100 px-3 py-1 text-sm font-medium text-orange-800 ${className}`}
      role="status"
      aria-live="polite"
    >
      <svg 
        className="h-4 w-4" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" 
        />
      </svg>
      <span>{message}</span>
    </div>
  );
}

interface SocialProofProps {
  /** Recent activity count (e.g., "12 people") */
  count?: string;
  /** Time frame (e.g., "in the last 24 hours") */
  timeframe?: string;
  /** Optional className for styling */
  className?: string;
}

/**
 * Social proof component
 * Controlled by NEXT_PUBLIC_CRO_SOCIAL_PROOF (1 = enabled, 0 = disabled)
 * 
 * IMPORTANT: Only display truthful data from actual booking activity
 */
export function SocialProof({ 
  count = "8 people", 
  timeframe = "in the last 24 hours",
  className = "" 
}: SocialProofProps) {
  const [isEnabled, setIsEnabled] = useState(false);

  useEffect(() => {
    // Check feature flag (default OFF)
    const flag = process.env.NEXT_PUBLIC_CRO_SOCIAL_PROOF === '1';
    setIsEnabled(flag);
  }, []);

  // Don't render if disabled
  if (!isEnabled) return null;

  return (
    <div 
      className={`inline-flex items-center gap-2 text-sm text-gray-600 ${className}`}
      role="status"
      aria-live="polite"
    >
      <svg 
        className="h-4 w-4 text-green-600" 
        fill="currentColor" 
        viewBox="0 0 20 20"
        aria-hidden="true"
      >
        <path 
          fillRule="evenodd" 
          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" 
          clipRule="evenodd" 
        />
      </svg>
      <span>
        <strong className="font-semibold text-gray-900">{count}</strong> booked {timeframe}
      </span>
    </div>
  );
}

/**
 * Combined CRO helper - shows both urgency and social proof
 * Useful for high-conversion areas like booking CTAs
 */
interface CROStackProps {
  urgencyMessage?: string;
  socialProofCount?: string;
  socialProofTimeframe?: string;
  className?: string;
}

export function CROStack({ 
  urgencyMessage,
  socialProofCount,
  socialProofTimeframe,
  className = "" 
}: CROStackProps) {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <UrgencyMessage message={urgencyMessage} />
      <SocialProof count={socialProofCount} timeframe={socialProofTimeframe} />
    </div>
  );
}
