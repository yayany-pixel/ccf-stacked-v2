/**
 * High-intent, city-aware editorial articles for the CCF website.
 * Unlike the workshop tutorials, these are local visitor guides. Each
 * reference must be correct for the relevant Chicago/Eugene storefront.
 */
export type DiscoveryCity = "chicago" | "eugene";

export type DiscoveryLink = {
  label: string;
  href: string;
  note?: string;
};

export type DiscoverySection = {
  heading: string;
  paragraphs: string[];
  /** Practical real-world places, alternatives, or planning options. */
  picks?: Array<{ title: string; description: string; href?: string }>;
  tips?: string[];
  /** Used on the shared 2026 holiday guide to keep cities distinct. */
  city?: DiscoveryCity;
};

export type DiscoveryCTA = {
  city: DiscoveryCity;
  headline: string;
  description: string;
  href: string;
  label: string;
  secondaryHref?: string;
  secondaryLabel?: string;
};

export type DiscoveryGuide = {
  slug: string;
  title: string;
  seoTitle: string;
  description: string;
  category: string;
  city: DiscoveryCity | null;
  keywords: string[];
  intro: string[];
  sections: DiscoverySection[];
  faqs: Array<{ question: string; answer: string }>;
  ctas: DiscoveryCTA[];
  /** Must only contain activities actually available for this article's city. */
  relatedActivitySlugs: string[];
  /** Official source and local venue references for validation / readers. */
  sources: DiscoveryLink[];
  /** Existing original CCF photo; avoid mislabeling Chicago imagery as Eugene. */
  heroActivitySlug?: string;
};
