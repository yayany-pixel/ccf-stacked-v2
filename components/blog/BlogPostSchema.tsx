import type { BlogPost } from "@/lib/blogPosts";
import { getPostImage, getPostPublishedAt, getPostUpdatedAt } from "@/lib/blogPosts";
import { getAuthorBySlug, getAuthorUrl } from "@/lib/authors";

const BASE = "https://colorcocktailfactory.com";

const ORG_NODE = {
  "@type": "Organization",
  name: "Color Cocktail Factory",
  url: BASE,
  logo: {
    "@type": "ImageObject",
    url: `${BASE}/apple-touch-icon.png`,
  },
} as const;

function absoluteUrl(src: string): string {
  if (!src) return `${BASE}/og-image.jpg`;
  if (src.startsWith("http://") || src.startsWith("https://")) return src;
  return `${BASE}${src.startsWith("/") ? "" : "/"}${src}`;
}

/**
 * Emits both BlogPosting and BreadcrumbList JSON-LD for a blog post.
 * Intentionally does NOT emit FAQPage schema — Google removed FAQ rich
 * results from general search in May 2026.
 */
export default function BlogPostSchema({ post }: { post: BlogPost }) {
  const url = `${BASE}/blog/${post.slug}`;
  const imageUrl = absoluteUrl(getPostImage(post));
  const author = getAuthorBySlug(post.authorSlug);

  const authorNode = author
    ? {
        "@type": "Person" as const,
        name: author.name,
        url: getAuthorUrl(author.slug),
        ...(author.image ? { image: absoluteUrl(author.image) } : {}),
      }
    : {
        "@type": "Organization" as const,
        name: "Color Cocktail Factory",
        url: BASE,
      };

  const blogPosting = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    headline: post.title,
    description: post.description,
    image: [imageUrl],
    datePublished: getPostPublishedAt(post),
    dateModified: getPostUpdatedAt(post),
    author: authorNode,
    publisher: ORG_NODE,
    keywords: post.keywords.join(", "),
    articleSection: post.category,
    inLanguage: "en-US",
    url,
  };

  const breadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: BASE },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${BASE}/blog` },
      { "@type": "ListItem", position: 3, name: post.title, item: url },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPosting) }}
      />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />
    </>
  );
}
