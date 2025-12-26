/**
 * Shared animation constants for micro-animations
 * Performance-focused: CSS-first, respects prefers-reduced-motion
 */

export const MOTION = {
  // Durations (ms)
  duration: {
    fast: 150,
    normal: 250,
    slow: 350,
    breathing: 8000, // For subtle gradient animations
  },

  // Easing curves
  easing: {
    default: 'cubic-bezier(0.4, 0, 0.2, 1)', // ease-in-out
    spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)', // gentle bounce
    smooth: 'cubic-bezier(0.45, 0, 0.55, 1)', // smooth sine
  },

  // Transform values
  lift: {
    y: -4, // pixels
    scale: 1.02,
  },

  // Reveal animation
  reveal: {
    y: 20, // Start 20px below
    duration: 350,
  },
} as const;

/**
 * CSS custom property helper for consistent transitions
 */
export const motionProps = {
  '--motion-duration-fast': `${MOTION.duration.fast}ms`,
  '--motion-duration-normal': `${MOTION.duration.normal}ms`,
  '--motion-duration-slow': `${MOTION.duration.slow}ms`,
  '--motion-easing-default': MOTION.easing.default,
  '--motion-easing-spring': MOTION.easing.spring,
} as React.CSSProperties;
