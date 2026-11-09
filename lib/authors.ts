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
  /** Short description for search and social previews. */
  description?: string;
  /** Owner-confirmed background and teaching approach for the full profile. */
  profileSections?: { title: string; text: string }[];
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
 * Owner-provided background in the November 2026 profile/application work:
 * architecture studies in Tehran, SAIC MFA in 2013, CCF founded in 2014.
 * Do not add unconfirmed awards, exhibitions, or personal social profiles.
 */
export const authors: Author[] = [
  {
    slug: "yahya-moosavi",
    name: "Yahya Moosavi",
    role: "Artist, Potter & Founder, Color Cocktail Factory",
    description:
      "Meet Yahya Moosavi, artist, potter, SAIC MFA graduate and former faculty member, and founder of Color Cocktail Factory in Chicago and Eugene.",
    bio:
      "Yahya Moosavi is an artist, potter, educator, and founder of Color Cocktail Factory. " +
      "After studying architecture in Tehran, he earned his MFA from the School of the Art Institute " +
      "of Chicago in 2013 and later taught there. He founded Color Cocktail Factory in 2014, " +
      "bringing people together through approachable, hands-on art experiences. " +
      "Today, the studio offers creative workshops in Chicago and Eugene.",
    credentials: [
      "MFA, School of the Art Institute of Chicago, 2013",
      "Former faculty, School of the Art Institute of Chicago",
      "Architecture studies in Tehran",
      "Founder, Color Cocktail Factory, established 2014",
    ],
    profileSections: [
      {
        title: "From architecture to clay",
        text: "Yahya's background in architecture and fine art informs his interest in form, color, texture and space. Pottery brings those interests into something you can hold: a vessel shaped by pressure, proportion and the choices of its maker.",
      },
      {
        title: "A place to begin",
        text: "His teaching combines clear demonstrations with individual guidance and time to experiment. In wheel throwing, that means breaking the process into manageable steps, helping students troubleshoot and making room for the unexpected. You do not need previous art experience to start.",
      },
      {
        title: "Creativity is shareable",
        text: "Color Cocktail Factory grew from the idea that making art can bring people together. Its workshops welcome curious beginners, couples, friends and groups to explore pottery and other creative practices in Chicago's Pilsen neighborhood and Eugene, Oregon. Sessions are led by Yahya and the studio's teaching team; check the individual listing for details.",
      },
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
