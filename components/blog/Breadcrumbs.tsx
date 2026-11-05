import Link from "next/link";

export type Crumb = { name: string; href?: string };

/**
 * Visual breadcrumb trail. Pair with BreadcrumbList JSON-LD for SEO
 * (see BlogPostSchema for post pages).
 */
export default function Breadcrumbs({ items }: { items: Crumb[] }) {
  if (items.length === 0) return null;
  return (
    <nav aria-label="Breadcrumb" className="text-sm text-primary/60">
      <ol className="flex flex-wrap items-center gap-1">
        {items.map((c, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={`${c.name}-${i}`} className="flex items-center gap-1">
              {i > 0 ? (
                <span aria-hidden className="text-primary/30">
                  /
                </span>
              ) : null}
              {c.href && !isLast ? (
                <Link href={c.href} className="hover:text-primary">
                  {c.name}
                </Link>
              ) : (
                <span aria-current={isLast ? "page" : undefined} className="text-primary/80">
                  {c.name}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
