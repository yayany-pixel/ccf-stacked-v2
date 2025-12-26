"use client";

import { useEffect, useRef, useState } from "react";

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  /**
   * If true, animation only plays once when first entering viewport
   * If false, animation plays every time element enters/exits viewport
   */
  once?: boolean;
  /**
   * Animation variant
   */
  variant?: "fade-up" | "fade-down" | "fade-left" | "fade-right" | "scale" | "rotate";
}

/**
 * Lightweight reveal animation using IntersectionObserver
 * Applies CSS classes when element enters viewport
 * Respects prefers-reduced-motion
 */
export default function Reveal({ 
  children, 
  className = "", 
  delay = 0,
  once = false,
  variant = "fade-up"
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      setIsVisible(true);
      return;
    }

    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) {
            setHasAnimated(true);
          }
        } else if (!once) {
          // Bi-directional: hide when scrolling out
          setIsVisible(false);
        }
        
        if (once && hasAnimated) {
          observer.disconnect();
        }
      },
      {
        threshold: 0.15,
        rootMargin: "0px 0px -80px 0px",
      }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [once, hasAnimated]);

  return (
    <div
      ref={ref}
      className={`motion-reveal ${isVisible ? "motion-reveal-active" : ""} ${className}`}
      style={{
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}
