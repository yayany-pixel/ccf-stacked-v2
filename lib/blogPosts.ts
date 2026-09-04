import { DEFAULT_AUTHOR_SLUG, getAuthorBySlug } from "./authors";

export type BlogCity = "chicago" | "eugene" | null;

export type BlogPost = {
  slug: string;
  title: string;
  /**
   * Optional shorter title for <title> and search snippets. When set,
   * generateMetadata prefers this over `title`; the on-page H1 still
   * uses `title` so display and SEO variants can diverge cleanly.
   */
  seoTitle?: string;
  description: string;

  /** Canonical author identifier — see lib/authors.ts */
  authorSlug: string;

  /** ISO date (YYYY-MM-DD or full ISO) when the post first went live. */
  publishedAt: string;
  /** ISO date of the most recent meaningful update. Defaults to publishedAt. */
  updatedAt: string;

  /**
   * Optional unique post image (path or URL). When absent, callers should
   * fall back to DEFAULT_BLOG_IMAGE via getPostImage().
   */
  image?: string;
  /** Alt text for the unique post image. */
  imageAlt?: string;

  category: string;
  readTime: string;
  keywords: string[];

  /** Which storefront a post is primarily about (null = both / neither). */
  city: BlogCity;

  /** Slugs of related workshops (see lib/config.ts sections). */
  relatedActivitySlugs: string[];
  /** Slugs of related posts in this same registry. */
  relatedPostSlugs: string[];

  // ─── Legacy denormalized fields (kept for back-compat with older callers) ──
  /** @deprecated Use publishedAt. */
  date: string;
  /** @deprecated Use authorSlug + lib/authors.ts. */
  author: string;
};

/** Site-wide fallback used when a post has no unique image yet. */
export const DEFAULT_BLOG_IMAGE = "/og-image.jpg";

export function getPostImage(post: Pick<BlogPost, "image">): string {
  return post.image && post.image.length > 0 ? post.image : DEFAULT_BLOG_IMAGE;
}

export function getPostImageAlt(
  post: Pick<BlogPost, "imageAlt" | "title">
): string {
  return post.imageAlt && post.imageAlt.length > 0
    ? post.imageAlt
    : `${post.title} — Color Cocktail Factory`;
}

export function getPostPublishedAt(post: BlogPost): string {
  return post.publishedAt || post.date || "";
}

export function getPostUpdatedAt(post: BlogPost): string {
  return post.updatedAt || post.publishedAt || post.date || "";
}

/**
 * Blog post registry.
 *
 * Every entry must set authorSlug to an id present in lib/authors.ts.
 * `image` should be left undefined until a unique image is available;
 * getPostImage() will fall back to DEFAULT_BLOG_IMAGE (/og-image.jpg).
 */
export const blogPosts: BlogPost[] = [
  {
    slug: "pottery-101-beginners-guide",
    title: "Pottery 101: A Beginner's Guide to Getting Started with Ceramics",
    description:
      "Everything you need to know to start your pottery journey - from choosing clay to mastering the wheel. Perfect for complete beginners!",
    authorSlug: DEFAULT_AUTHOR_SLUG,
    author: "Yahya Moosavi",
    publishedAt: "2025-01-15",
    updatedAt: "2025-01-15",
    date: "2025-01-15",
    category: "Pottery Basics",
    readTime: "8 min read",
    // image: TODO — add /images/blog/pottery-101.jpg when available.
    keywords: [
      "pottery for beginners",
      "how to start pottery",
      "pottery wheel basics",
      "pottery classes chicago",
      "pottery classes eugene",
      "ceramic pottery tutorial",
      "beginner pottery tips",
      "pottery throwing techniques",
    ],
    city: null,
    relatedActivitySlugs: ["beginner-wheel", "date-night-wheel", "handbuilding"],
    relatedPostSlugs: ["chicago-date-night-ideas", "eugene-date-night-ideas"],
  },
  {
    slug: "chicago-date-night-ideas",
    title: "10 Unique Date Night Ideas in Chicago (Beyond Dinner & Movies)",
    description:
      "Discover the best creative date night experiences in Chicago, from pottery classes to glass fusion workshops. Make memories that last!",
    authorSlug: DEFAULT_AUTHOR_SLUG,
    author: "Yahya Moosavi",
    publishedAt: "2025-01-10",
    updatedAt: "2025-01-10",
    date: "2025-01-10",
    category: "Date Night Ideas",
    readTime: "6 min read",
    // image: TODO — /images/blog/date-night-chicago.jpg
    keywords: [
      "date night chicago",
      "unique date ideas chicago",
      "couples activities chicago",
      "romantic things to do chicago",
      "pottery date night",
      "chicago date night workshops",
      "pilsen date night",
      "creative date ideas chicago",
    ],
    city: "chicago",
    relatedActivitySlugs: [
      "date-night-wheel",
      "beginner-wheel",
      "turkish-lamp",
      "glass-fusion",
      "bonsai",
    ],
    relatedPostSlugs: [
      "pilsen-student-guide",
      "pottery-101-beginners-guide",
    ],
  },
  {
    slug: "eugene-date-night-ideas",
    title: "10 Romantic Date Night Ideas in Eugene, Oregon (Creative & Unique)",
    description:
      "Explore the best creative date experiences in Eugene - from pottery workshops to glass art. Perfect for couples seeking unique, hands-on activities!",
    authorSlug: DEFAULT_AUTHOR_SLUG,
    author: "Yahya Moosavi",
    publishedAt: "2025-01-08",
    updatedAt: "2025-01-08",
    date: "2025-01-08",
    category: "Date Night Ideas",
    readTime: "6 min read",
    // image: TODO — /images/blog/date-night-eugene.jpg
    keywords: [
      "date night eugene oregon",
      "unique date ideas eugene",
      "couples activities eugene",
      "romantic things to do eugene",
      "pottery date night eugene",
      "eugene oregon date night",
      "downtown eugene date ideas",
      "creative date ideas eugene",
      "whiteaker date night",
    ],
    city: "eugene",
    relatedActivitySlugs: [
      "date-night-wheel",
      "beginner-wheel",
      "turkish-lamp",
      "glass-fusion",
      "bonsai",
    ],
    relatedPostSlugs: ["pottery-101-beginners-guide"],
  },
  {
    slug: "pilsen-student-guide",
    title:
      "Student Guide to Chicago's Pilsen Neighborhood: What to Do Before & After Class",
    description:
      "Discover the best coffee shops, murals, restaurants, and nightlife in Pilsen. Your complete guide to exploring Chicago's most vibrant artistic neighborhood.",
    authorSlug: DEFAULT_AUTHOR_SLUG,
    author: "Yahya Moosavi",
    publishedAt: "2025-01-02",
    updatedAt: "2025-01-02",
    date: "2025-01-02",
    category: "Neighborhood Guides",
    readTime: "12 min read",
    // image: TODO — /images/blog/pilsen-guide.jpg
    keywords: [
      "pilsen chicago guide",
      "things to do in pilsen",
      "pilsen coffee shops",
      "pilsen murals",
      "pilsen restaurants",
      "pilsen neighborhood chicago",
      "18th street chicago",
      "pilsen student guide",
      "chicago art district",
      "pilsen nightlife",
      "national museum of mexican art",
      "pilsen street art",
    ],
    city: "chicago",
    relatedActivitySlugs: [
      "date-night-wheel",
      "beginner-wheel",
      "handbuilding",
    ],
    relatedPostSlugs: [
      "chicago-date-night-ideas",
      "pottery-101-beginners-guide",
    ],
  },
  {
    slug: "art-classes-near-me",
    title:
      "Art Classes Near Me: Find the Right Class for Adults, Kids, and Date Nights",
    description:
      "Find art classes near you—pottery, mosaics, bonsai, and more. Choose your city, pick a time, and book in minutes. Beginner-friendly.",
    authorSlug: DEFAULT_AUTHOR_SLUG,
    author: "Yahya Moosavi",
    publishedAt: "2026-01-20",
    updatedAt: "2026-01-20",
    date: "2026-01-20",
    category: "Local Guides",
    readTime: "10 min read",
    // image: TODO — /images/blog/art-classes.jpg
    keywords: [
      "art classes near me",
      "art classes near me for adults",
      "art classes near me for kids",
      "art classes for kids near me",
      "local art classes for adults near me",
      "summer art classes near me",
      "drawing classes for kids near me",
      "painting classes near me",
      "drawing classes near me",
      "art classes for adults near me",
    ],
    city: null,
    relatedActivitySlugs: [
      "beginner-wheel",
      "handbuilding",
      "mosaic",
      "turkish-lamp",
      "bonsai",
    ],
    relatedPostSlugs: ["pottery-101-beginners-guide"],
  },
  {
    slug: "pottery-classes-chicago-guide",
    title:
      "Pottery Classes in Chicago: A Beginner's Guide to Trying the Wheel in Pilsen",
    description:
      "A calm, practical guide to starting pottery in Chicago. What wheel throwing actually feels like, how to choose a class, what to wear, and what to expect at your first session in Pilsen.",
    authorSlug: DEFAULT_AUTHOR_SLUG,
    author: "Yahya Moosavi",
    publishedAt: "2026-09-03",
    updatedAt: "2026-09-03",
    date: "2026-09-03",
    category: "Local Guides",
    readTime: "9 min read",
    // image: TODO — /images/blog/pottery-chicago-guide.jpg
    keywords: [
      "pottery classes chicago",
      "pottery class chicago",
      "pottery chicago",
      "wheel throwing chicago",
      "beginner pottery chicago",
      "pottery class pilsen",
      "pottery studio pilsen",
      "date night pottery chicago",
      "learn pottery chicago",
      "chicago pottery for beginners",
    ],
    city: "chicago",
    relatedActivitySlugs: [
      "beginner-wheel",
      "date-night-wheel",
      "handbuilding",
      "private-parties",
    ],
    relatedPostSlugs: [
      "chicago-pottery-classes-beginners-guide",
      "pottery-101-beginners-guide",
      "chicago-date-night-ideas",
      "pilsen-student-guide",
    ],
  },
  {
    slug: "chicago-pottery-classes-beginners-guide",
    title:
      "Pottery Classes in Chicago: A First Timer's Guide to Choosing the Right Class",
    seoTitle: "Pottery Classes in Chicago: A Beginner's Guide",
    description:
      "Compare wheel throwing, handbuilding, and date night pottery classes in Chicago. Learn what to expect, what to wear, and how to choose.",
    authorSlug: DEFAULT_AUTHOR_SLUG,
    author: "Yahya Moosavi",
    publishedAt: "2026-09-03",
    updatedAt: "2026-09-03",
    date: "2026-09-03",
    category: "Chicago Guides",
    readTime: "8 min read",
    // image: TODO — /images/blog/chicago-pottery-classes-beginners-guide.jpg
    // imageAlt (when image is set): "Hands shaping clay on a pottery wheel during a beginner pottery class in Chicago."
    keywords: [
      "pottery classes chicago",
      "beginner pottery classes chicago",
      "wheel throwing classes chicago",
      "date night pottery chicago",
      "handbuilding pottery chicago",
      "first time pottery chicago",
      "pottery for beginners chicago",
      "pottery class pilsen",
      "how to choose a pottery class",
      "chicago pottery studio",
    ],
    city: "chicago",
    relatedActivitySlugs: [
      "beginner-wheel",
      "date-night-wheel",
      "handbuilding",
      "private-parties",
    ],
    relatedPostSlugs: [
      "pottery-classes-chicago-guide",
      "pottery-101-beginners-guide",
      "chicago-date-night-ideas",
      "pilsen-student-guide",
    ],
  },
];

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug);
}

export function getAllBlogPosts(): BlogPost[] {
  return [...blogPosts].sort(
    (a, b) =>
      new Date(getPostPublishedAt(b)).getTime() -
      new Date(getPostPublishedAt(a)).getTime()
  );
}

export function getBlogPostsByAuthor(authorSlug: string): BlogPost[] {
  return getAllBlogPosts().filter((p) => p.authorSlug === authorSlug);
}

export function getRelatedPosts(post: BlogPost): BlogPost[] {
  return post.relatedPostSlugs
    .map((s) => getBlogPostBySlug(s))
    .filter((p): p is BlogPost => Boolean(p));
}

/** Convenience: returns the author record for a post (or undefined). */
export function getPostAuthor(post: BlogPost) {
  return getAuthorBySlug(post.authorSlug);
}
