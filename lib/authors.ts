/**
 * Blog author registry.
 *
 * Facts recorded here must be verifiable from either (a) content already
 * published on colorcocktailfactory.com or (b) sources the site owner has
 * confirmed. Do NOT invent biographical details, credentials, awards,
 * education history, publications, or social profiles.
 *
 * When a field cannot be verified, leave it undefined rather than guessing.
 */

export type Author = {
  /** URL slug used in /author/[slug]. */
  slug: string;
  /** Display name. */
  name: string;
  /** Short one-line role (e.g. "Pottery Instructor"). */
  role?: string;
  /** Longer bio for the author profile page and JSON-LD. */
  bio?: string;
  /** Bullet list of credentials or focus areas. */
  credentials?: string[];
  /** Path or URL of the author's headshot. */
  image?: string;
  /** Alt text for the headshot. */
  imageAlt?: string;
  /** Public contact email, if the author wants one displayed. */
  email?: string;
  /** External profile URLs (LinkedIn, Instagram, portfolio, etc.). */
  sameAs?: string[];
};

const BASE = "https://colorcocktailfactory.com";

/**
 * Yahya Moosavi
 *
 * Verified biographical facts:
 *  - Pottery instructor at Color Cocktail Factory (Chicago & Eugene)
 *    — sourced from app/pottery-membership/page.tsx.
 *  - Has taught pottery to absolute beginners for 10+ years
 *    — sourced from app/pottery-membership/page.tsx.
 *  - Known for a calm, methodical approach to teaching wheel throwing,
 *    troubleshooting common beginner mistakes and helping students build
 *    muscle memory quickly
 *    — sourced from app/pottery-membership/page.tsx.
 *  - Founder of Color Cocktail Factory
 *    — attested by the site owner (2026-09-03).
 *  - Graduate and former faculty member of the School of the Art
 *    Institute of Chicago (SAIC)
 *    — attested by the site owner (2026-09-03).
 *
 * Anything beyond the above (specific degree years, exhibitions, awards,
 * external profile URLs) is intentionally omitted until confirmed.
 */
export const authors: Author[] = [
  {
    slug: "yahya-moosavi",
    name: "Yahya Moosavi",
    role: "Artist, Potter & Founder, Color Cocktail Factory",
    bio:
      "Yahya Moosavi is an artist, potter, educator, and founder of Color Cocktail Factory. " +
      "He is a graduate and former faculty member of the School of the Art Institute of Chicago. " +
      "Through CCF, he has helped make pottery and other creative practices accessible as social, " +
      "beginner-friendly experiences rather than activities reserved for professional artists. " +
      "Yahya has taught wheel throwing to absolute beginners for 10+ years, with a calm, methodical " +
      "approach that focuses on troubleshooting common mistakes and building muscle memory quickly.",
    credentials: [
      "Founder, Color Cocktail Factory (Chicago & Eugene)",
      "Graduate and former faculty, School of the Art Institute of Chicago",
      "10+ years teaching wheel throwing to beginners",
    ],
    // image, imageAlt, email, and sameAs intentionally omitted until verified.
  },
];

export const DEFAULT_AUTHOR_SLUG = "yahya-moosavi";

export function getAuthorBySlug(slug: string): Author | undefined {
  return authors.find((a) => a.slug === slug);
}

export function getAllAuthors(): Author[] {
  return [...authors];
}

export function getAuthorUrl(slug: string): string {
  return `${BASE}/author/${slug}`;
}
